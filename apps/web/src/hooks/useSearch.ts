import { useDebounce, useAsync } from 'react-use';
import { useState, useEffect } from 'react';
import { SearchResponse, SearchRequest } from '@react-flow/shared-types';
import { api } from '../services/apiClient';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 5;

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 加载搜索历史
  useEffect(() => {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (history && history !== 'undefined' && history !== 'null') {
      try {
        setSearchHistory(JSON.parse(history));
      } catch (error) {
        console.error('Failed to parse search history from localStorage:', error);
        localStorage.removeItem(SEARCH_HISTORY_KEY);
      }
    }
  }, []);

  // 保存搜索历史
  const saveSearchHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setSearchHistory(prev => {
      const newHistory = [searchQuery, ...prev.filter(item => item !== searchQuery)].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // 清除搜索历史
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  useDebounce(
    () => {
      setDebouncedQuery(query);
    },
    300,
    [query]
  );

  const searchAsync = useAsync(async (): Promise<SearchResponse> => {
    if (!debouncedQuery) {
      return { results: [], total: 0, page: 1, limit: 10 };
    }

    // 保存搜索历史
    saveSearchHistory(debouncedQuery);

    const params: SearchRequest = {
      query: debouncedQuery,
      page: 1,
      limit: 10
    };

    const response = await api.get<SearchResponse>('/api/search', { params });
    return response as unknown as SearchResponse;
  }, [debouncedQuery]);

  // 热门搜索词
  const popularSearches = ['react', 'typescript', 'node.js', 'docker', 'graphql'];

  return {
    query,
    setQuery,
    debouncedQuery,
    searchAsync,
    searchHistory,
    clearSearchHistory,
    popularSearches
  };
};
