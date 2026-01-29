const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
    },
    excerpt: {
        type: String,
        required: [true, 'Please add an excerpt'],
        maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add an image URL'],
    },
    cloudinaryId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Generate slug from title before saving
blogSchema.pre('save', async function () {
    // Generate slug if it doesn't exist or if title is modified
    if (!this.slug || this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }
});

// Indexes for efficient querying
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ featured: 1 });
blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
