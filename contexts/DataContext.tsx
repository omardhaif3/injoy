import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/apiService';

type Post = {
  _id: string;
  question: string;
  options: Array<{
    _id: string;
    text: string;
    votes: number;
  }>;
  comments: Array<{
    _id: string;
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
};

type DataContextType = {
  posts: Post[];
  loading: boolean;
  error: Error | null;
  fetchPosts: () => Promise<void>;
  fetchPost: (id: string) => Promise<Post | null>;
  createPost: (post: Partial<Post>) => Promise<Post | null>;
  addVote: (postId: string, optionId: string) => Promise<boolean>;
  addComment: (postId: string, text: string) => Promise<boolean>;
};

export const DataContext = createContext<DataContextType>({
  posts: [],
  loading: false,
  error: null,
  fetchPosts: async () => {},
  fetchPost: async () => null,
  createPost: async () => null,
  addVote: async () => false,
  addComment: async () => false,
});

type DataProviderProps = {
  children: ReactNode;
};

export function DataProvider({ children }: DataProviderProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all posts
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single post by ID
  const fetchPost = async (id: string) => {
    try {
      const post = await apiService.getPost(id);
      return post;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch post'));
      return null;
    }
  };

  // Create a new post
  const createPost = async (postData: Partial<Post>) => {
    try {
      const newPost = await apiService.createPost(postData);
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return newPost;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create post'));
      return null;
    }
  };

  // Add a vote to a post option
  const addVote = async (postId: string, optionId: string) => {
    try {
      const updated = await apiService.voteForOption(postId, optionId);
      
      // Update local state if successful
      if (updated) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? {
                  ...post,
                  options: post.options.map(option => 
                    option._id === optionId 
                      ? { ...option, votes: option.votes + 1 }
                      : option
                  )
                }
              : post
          )
        );
      }
      
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to vote'));
      return false;
    }
  };

  // Add a comment to a post
  const addComment = async (postId: string, text: string) => {
    try {
      const comment = await apiService.addComment(postId, text);
      
      // Update local state if successful
      if (comment) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? {
                  ...post,
                  comments: [...post.comments, comment]
                }
              : post
          )
        );
      }
      
      return !!comment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add comment'));
      return false;
    }
  };

  // Load posts on initial render
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <DataContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        fetchPost,
        createPost,
        addVote,
        addComment,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}