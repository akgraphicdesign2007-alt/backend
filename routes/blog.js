const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    getAllBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
} = require('../controllers/blogController');

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getAllBlogs)
    .post(protect, authorize('admin'), upload.single('image'), createBlog);

router.route('/:slug')
    .get(getBlogBySlug);

router.route('/id/:id')
    .put(protect, authorize('admin'), upload.single('image'), updateBlog)
    .delete(protect, authorize('admin'), deleteBlog);

module.exports = router;
