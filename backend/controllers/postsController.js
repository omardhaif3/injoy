const Post = require('../models/Post');

// Get all posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error getting posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single post by ID
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ error: 'Invalid post data' });
    }
    const post = new Post({
      question,
      options: options,
    });
    await post.save();
    // Return the saved post with populated options and comments
    const savedPost = await Post.findById(post._id).lean();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Vote for an option
exports.voteForOption = async (req, res) => {
  try {
    const { postId, optionId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const option = post.options.id(optionId);
    if (!option) return res.status(404).json({ error: 'Option not found' });

    option.votes += 1;
    await post.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Error voting for option:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a comment to a post
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text is required' });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = { text };
    post.comments.push(comment);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
