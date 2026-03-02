const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    role: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Please add testimonial content'],
    },
    rating: {
        type: Number,
        default: 5,
        min: 1,
        max: 5
    },
    image: {
        type: String, // URL to image
        default: '',
    },
    cloudinaryId: {
        type: String,
        default: '',
    },
    approved: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);
