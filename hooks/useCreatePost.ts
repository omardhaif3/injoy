import { useState } from 'react';
import { apiService } from 'services/apiService';

export function useCreatePost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPost = async (postData: { question: string; options: Array<{ text: string; votes: number }> }) => {
    setLoading(true);
    setError(null);
    try {
      const newPost = await apiService.createPost(postData);
      return newPost;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error };
}
