import React from 'react';

interface InfiniteListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loading: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
  emptyMessage?: string;
  loadingMessage?: string;
}

const InfiniteList = <T,>({
  items,
  renderItem,
  loading,
  hasMore,
  sentinelRef,
  emptyMessage = '暂无数据',
  loadingMessage = '加载中...'
}: InfiniteListProps<T>) => {
  return (
    <div className="infinite-list">
      {items.length === 0 && !loading && (
        <div className="loading-text">{emptyMessage}</div>
      )}
      
      {items.map((item, index) => (
        <div key={index} className="list-item">
          {renderItem(item, index)}
        </div>
      ))}
      
      {loading && (
        <div className="loading-text">{loadingMessage}</div>
      )}
      
      {hasMore && (
        <div ref={sentinelRef} className="sentinel" />
      )}
    </div>
  );
};

export default InfiniteList;
