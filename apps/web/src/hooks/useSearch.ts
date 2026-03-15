import { useDebounce, useAsync } from 'react-use';
import { useState } from 'react';
import { SearchResponse, SearchRequest } from '@react-flow/shared-types';
import { api } from '../services/apiClient';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

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

    const params: SearchRequest = {
      query: debouncedQuery,
      page: 1,
      limit: 10
    };

    const response = await api.get<SearchResponse>('/search', { params });
    return response.data;
  }, [debouncedQuery]);

  return {
    query,
    setQuery,
    debouncedQuery,
    searchAsync
  };
};
