import { useState, useEffect, useCallback } from 'react';
import { apiService } from 'services/apiService';

export function usePosts(searchQuery: string = '') {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getPosts(searchQuery);
      setPosts(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refreshPosts = () => {
    fetchPosts();
  };

  return { posts, loading, error, refreshPosts };
}
