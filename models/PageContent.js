const mongoose = require('mongoose');

const PageContentSchema = new mongoose.Schema({
    section: {
        type: String, // e.g., 'home_hero', 'about_intro', 'contact_info'
        required: true,
        unique: true,
    },
    title: {
        type: String,
        default: '',
    },
    subtitle: {
        type: String,
        default: '',
    },
    content: {
        type: String, // Rich text or long description
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    meta: {
        type: Map, // Flexible field for extra data like 'buttonText', 'videoUrl'
        of: String,
        default: {},
    }
}, { timestamps: true });

module.exports = mongoose.model('PageContent', PageContentSchema);
