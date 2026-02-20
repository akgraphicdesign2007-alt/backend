const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Branding', 'UI/UX', 'Posters', 'Social Media', 'Motion'],
    },
    imageUrl: {
        type: String,
        required: [true, 'Please add an image URL'],
    },
    cloudinaryId: {
        type: String,
        required: true,
    },
    aboutProject: {
        type: String,
        default: '',
    },
    date: {
        type: String,
        default: '',
    },
    client: {
        type: String,
        default: '',
    },
    brandingImages: [{
        url: String,
        cloudinaryId: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for efficient category filtering
gallerySchema.index({ category: 1 });
gallerySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Gallery', gallerySchema);
