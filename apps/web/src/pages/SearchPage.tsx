import React from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import { useSearch } from '../hooks/useSearch';

const SearchPage: React.FC = () => {
  const { query, setQuery, searchAsync } = useSearch();

  return (
    <div>
      <h1 className="page-title">搜索页面</h1>
      
      <SearchBar value={query} onChange={setQuery} placeholder="输入搜索关键词..." />
      
      {searchAsync.loading && (
        <div className="loading-text">搜索中...</div>
      )}
      
      {searchAsync.error && (
        <div className="error-text">
          搜索出错: {searchAsync.error.message}
        </div>
      )}
      
      {searchAsync.value && !searchAsync.loading && (
        <div>
          {searchAsync.value.results.length > 0 ? (
            <div className="search-results">
              {searchAsync.value.results.map((result) => (
                <div key={result.id} className="search-result-item">
                  <h3>{result.title}</h3>
                  <p>{result.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="loading-text">
              {query ? '未找到相关结果' : '请输入关键词开始搜索'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
