// blog-api/routes/blogRoutes.js

import express from 'express';
import { getAllBlogs, getBlogById, getUserBlogs, createNewBlog, updateExistingBlog, deleteBlogById } from '../controllers/blogController.js';
import { checkAuth } from '../middleware/authMiddleware.js';
import { upload } from '../utils/multerConfig.js';

const router = express.Router();

// Public routes (Read operations)

/**
 * @route GET /api/blogs/
 * @desc Get all blogs with pagination
 * @access Public
 */
router.get('/', getAllBlogs);

/**
 * @route GET /api/blogs/:id
 * @desc Get a single blog post by ID
 * @access Public
 */
router.get('/user', checkAuth, getUserBlogs);

router.get('/:id', getBlogById);


// Protected routes (CRUD operations for authenticated users)

/**
 * @route GET /api/blogs/user
 * @desc Get all blogs by the currently authenticated user
 * @access Private (requires checkAuth)
 */

/**
 * @route POST /api/blogs
 * @desc Create a new blog post. Requires image upload middleware.
 * @access Private (requires checkAuth)
 */
router.post('/', checkAuth, upload.single('image'), createNewBlog);

/**
 * @route PUT /api/blogs/:id
 * @desc Update a specific blog post. Requires image upload middleware.
 * @access Private (requires checkAuth)
 */
router.put('/:id', checkAuth, upload.single('image'), updateExistingBlog);

/**
 * @route DELETE /api/blogs/:id
 * @desc Delete a specific blog post.
 * @access Private (requires checkAuth)
 */
router.delete('/:id', checkAuth, deleteBlogById);

export default router;
