import React from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import { useSearch } from '../hooks/useSearch';

const SearchPage: React.FC = () => {
  const { query, setQuery, searchAsync, searchHistory, clearSearchHistory, popularSearches } = useSearch();

  const handleHistoryClick = (term: string) => {
    setQuery(term);
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div>
      <h1 className="page-title">搜索页面</h1>
      
      <SearchBar value={query} onChange={setQuery} placeholder="输入搜索关键词..." />
      
      {/* 搜索历史和热门搜索 */}
      {!query && !searchAsync.loading && (
        <div className="search-suggestions">
          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <div className="search-history">
              <div className="search-history-header">
                <h3>搜索历史</h3>
                <button className="clear-history-btn" onClick={clearSearchHistory}>
                  清除
                </button>
              </div>
              <div className="search-history-list">
                {searchHistory.map((term, index) => (
                  <div key={index} className="search-history-item" onClick={() => handleHistoryClick(term)}>
                    {term}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 热门搜索 */}
          <div className="popular-searches">
            <h3>热门搜索</h3>
            <div className="popular-searches-list">
              {popularSearches.map((term, index) => (
                <div key={index} className="popular-search-item" onClick={() => handlePopularClick(term)}>
                  {term}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
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
              {searchAsync.value.results.map((result: any) => (
                <div key={result.id} className="search-result-item">
                  <h3>{result.title}</h3>
                  <p>{result.description}</p>
                  {result.tags && result.tags.length > 0 && (
                    <div className="search-result-tags">
                      {result.tags.map((tag: string, index: number) => (
                        <span key={index} className="search-result-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {result.category && (
                    <div className="search-result-category">
                      分类: {result.category}
                    </div>
                  )}
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
