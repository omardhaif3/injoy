const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// GET /api/posts - get all posts
router.get('/', postsController.getPosts);

// GET /api/posts/:id - get a single post by ID
router.get('/:id', postsController.getPost);

// POST /api/posts - create a new post
router.post('/', postsController.createPost);

// POST /api/posts/:postId/vote/:optionId - vote for an option
router.post('/:postId/vote/:optionId', postsController.voteForOption);

// POST /api/posts/:postId/comment - add a comment
router.post('/:postId/comment', postsController.addComment);

module.exports = router;
