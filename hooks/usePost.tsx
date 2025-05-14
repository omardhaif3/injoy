import { useContext, useState, useEffect, useCallback } from 'react';
import { DataContext } from '@/contexts/DataContext';

export const usePost = (postId: string) => {
  const { fetchPost, addVote, addComment } = useContext(DataContext);
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadPost = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPost(postId);
      setPost(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchPost, postId]);
  
  // Function to vote for an option
  const vote = async (optionId: string) => {
    try {
      const success = await addVote(postId, optionId);
      
      if (success) {
        // Update local state
        setPost(prev => ({
          ...prev,
          options: prev.options.map(option => 
            option._id === optionId 
              ? { ...option, votes: option.votes + 1 }
              : option
          )
        }));
      }
      
      return success;
    } catch (err) {
      throw err;
    }
  };
  
  // Function to add a comment
  const postComment = async (text: string) => {
    try {
      const success = await addComment(postId, text);
      
      if (success) {
        // Refresh post data to get updated comments
        await loadPost();
      }
      
      return success;
    } catch (err) {
      throw err;
    }
  };
  
  // Refresh post data
  const refreshPost = useCallback(async () => {
    await loadPost();
  }, [loadPost]);
  
  // Load post on component mount
  useEffect(() => {
    loadPost();
  }, [loadPost]);
  
  return {
    post,
    loading,
    error,
    vote,
    addComment: postComment,
    refreshPost
  };
};