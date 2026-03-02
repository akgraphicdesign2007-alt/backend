const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'AK Design | Premium Portfolio',
    },
    email: {
        type: String,
        default: 'hello@akdesign.space',
    },
    phone: {
        type: String,
        default: '',
    },
    address: {
        type: String,
        default: 'New York, USA',
    },
    socialLinks: {
        instagram: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        behance: { type: String, default: '' },
        facebook: { type: String, default: '' },
        telegram: { type: String, default: '' }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Settings', SettingsSchema);
