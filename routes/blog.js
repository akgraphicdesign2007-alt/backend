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

router.route('/')
    .get(getAllBlogs)
    .post(upload.single('image'), createBlog);

router.route('/:slug')
    .get(getBlogBySlug);

router.route('/id/:id')
    .put(upload.single('image'), updateBlog)
    .delete(deleteBlog);

module.exports = router;
