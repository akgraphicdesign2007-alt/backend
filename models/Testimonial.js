const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    role: {
        type: String,
        required: [true, 'Please add a role (e.g., CEO, Designer)'],
        trim: true,
    },
    company: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Please add a message'],
    },
    image: {
        type: String, // URL to image
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
