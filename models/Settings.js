const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    seoTitle: {
        type: String,
        default: 'AK Design | Premium Portfolio',
    },
    seoDescription: {
        type: String,
        default: 'Discover AK Design, premium portfolio featuring UI/UX, Branding, and Motion design.',
    },
    seoKeywords: {
        type: String,
        default: 'design, portfolio, UI, UX, branding, motion',
    },
    contactEmail: {
        type: String,
        default: 'hello@akdesign.space',
    },
    contactPhone: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: 'New York, USA',
    },
    socialLinks: {
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        dribbble: { type: String, default: '' },
        behance: { type: String, default: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Settings', SettingsSchema);
