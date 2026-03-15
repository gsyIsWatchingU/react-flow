import { useState, useCallback, useRef } from 'react';
import { useIntersection } from 'react-use';

interface UseInfiniteScrollOptions<T> {
  loadMore: (page: number) => Promise<T[]>;
  hasMore: boolean;
  initialPage?: number;
}

export const useInfiniteScroll = <T>({
  loadMore,
  hasMore,
  initialPage = 1
}: UseInfiniteScrollOptions<T>) => {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const intersection = useIntersection(sentinelRef, {
    threshold: 0.1
  });

  const loadItems = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      const newItems = await loadMore(page);
      setItems((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loadMore, hasMore, loading, page]);

  if (intersection?.isIntersecting && hasMore && !loading) {
    loadItems();
  }

  return {
    items,
    loading,
    error,
    hasMore,
    sentinelRef,
    reset: () => {
      setItems([]);
      setPage(initialPage);
      setLoading(false);
      setError(null);
    }
  };
};
