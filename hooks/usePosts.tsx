import { useContext, useCallback } from 'react';
import { DataContext } from '@/contexts/DataContext';

export const usePosts = () => {
  const { posts, loading, error, fetchPosts } = useContext(DataContext);
  
  const refreshPosts = useCallback(async () => {
    await fetchPosts();
  }, [fetchPosts]);
  
  return {
    posts,
    loading,
    error,
    refreshPosts
  };
};