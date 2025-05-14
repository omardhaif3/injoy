import { useContext, useState } from 'react';
import { DataContext } from '@/contexts/DataContext';

export const useCreatePost = () => {
  const { createPost } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleCreatePost = async (postData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newPost = await createPost(postData);
      return newPost;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    createPost: handleCreatePost,
    loading,
    error
  };
};