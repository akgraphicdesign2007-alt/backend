const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
exports.getAllBlogs = async (req, res) => {
    try {
        const { category, featured, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (category) filter.category = category;
        if (featured) filter.featured = featured === 'true';

        const blogs = await Blog.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Blog.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: blogs.length,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            data: blogs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found',
            });
        }

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Create blog post
// @route   POST /api/blog
// @access  Private (for now public for demo)
exports.createBlog = async (req, res) => {
    try {
        const { title, content, excerpt, category, featured } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image',
            });
        }

        // Upload image to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'portfolio/blog',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const blog = await Blog.create({
            title,
            content,
            excerpt,
            category,
            featured: featured || false,
            imageUrl: result.secure_url,
            cloudinaryId: result.public_id,
        });

        res.status(201).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private (for now public for demo)
exports.updateBlog = async (req, res) => {
    try {
        let blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found',
            });
        }

        // If new image is uploaded, delete old one and upload new
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(blog.cloudinaryId);

            // Upload new image
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'portfolio/blog',
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });

            req.body.imageUrl = result.secure_url;
            req.body.cloudinaryId = result.public_id;
        }

        blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: blog,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private (for now public for demo)
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog post not found',
            });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(blog.cloudinaryId);

        // Delete from database
        await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Blog post deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
