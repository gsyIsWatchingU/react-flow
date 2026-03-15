import React, { useState, useEffect, useCallback } from 'react';
import { useThrottleFn } from 'react-use';
import InfiniteList from '../components/InfiniteList/InfiniteList';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const mockDataGenerator = (page: number, pageSize: number = 10) => {
  return Array.from({ length: pageSize }, (_, i) => ({
    id: `item-${page}-${i}`,
    title: `项目 ${(page - 1) * pageSize + i + 1}`,
    description: `这是第 ${page} 页的第 ${i + 1} 个项目的描述信息。`,
    timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toLocaleString()
  }));
};

const DashboardPage: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const loadMoreItems = async (page: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockDataGenerator(page);
  };

  const { items, loading, hasMore, sentinelRef } = useInfiniteScroll({
    loadMore: loadMoreItems,
    hasMore: true
  });

  const throttledScroll = useThrottleFn(
    (e: Event) => {
      if (e && e.target) {
        const target = e.target as HTMLElement;
        setScrollPosition(target.scrollTop);
      }
    },
    200
  );

  const handleScroll = useCallback((e: Event) => {
    throttledScroll.run(e);
  }, [throttledScroll]);

  useEffect(() => {
    const container = document.querySelector('.main-content');
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);

  return (
    <div>
      <h1 className="page-title">数据面板</h1>
      
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h3>滚动位置</h3>
          <p>当前滚动位置: {scrollPosition}px</p>
        </div>
        
        <div className="dashboard-card">
          <h3>已加载项目</h3>
          <p>项目数量: {items.length}</p>
        </div>
        
        <div className="dashboard-card">
          <h3>状态</h3>
          <p>加载中: {loading ? '是' : '否'}</p>
          <p>还有更多: {hasMore ? '是' : '否'}</p>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>无限滚动列表</h2>
        <InfiniteList
          items={items}
          renderItem={(item) => (
            <div>
              <h4>{item.title}</h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{item.description}</p>
              <p style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {item.timestamp}
              </p>
            </div>
          )}
          loading={loading}
          hasMore={hasMore}
          sentinelRef={sentinelRef}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
