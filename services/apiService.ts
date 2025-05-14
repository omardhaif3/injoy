import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: 'https://injoy.onrender.com/api',
  // In a real app, we'd use secure configuration from env variables
  // baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// For MongoDB direct connection
const MONGODB_URI = 'mongodb+srv://omardhaif3:Dh_77021061r@cluster0.wnpyz1y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Create Posts API service
export const apiService = {
  // Get all posts
  getPosts: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  // Get a single post by ID
  getPost: async (id: string) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  },

  // Create a new post
  createPost: async (postData: any) => {
    try {
      const response = await api.post('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Vote for an option
  voteForOption: async (postId: string, optionId: string) => {
    try {
      const response = await api.post(`/posts/${postId}/vote/${optionId}`);
      return response.data.success;
    } catch (error) {
      console.error(`Error voting for option ${optionId}:`, error);
      throw error;
    }
  },

  // Add a comment to a post
  addComment: async (postId: string, text: string) => {
    try {
      const response = await api.post(`/posts/${postId}/comment`, { text });
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error);
      throw error;
    }
  }
};