const multer = require('multer');
const path = require('path');

const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ak_design_uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, crop: "limit" }],
    },
});

// File filter (redundant with allowed_formats but good safety)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 30 * 1024 * 1024, // 30MB limit (increased from 10MB)
        files: 20, // Allow multiple files (Cover + Branding Images)
    },
    fileFilter: fileFilter,
});

module.exports = upload;
