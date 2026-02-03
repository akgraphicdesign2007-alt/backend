const Gallery = require('../models/Gallery');
const cloudinary = require('../config/cloudinary');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
exports.getAllGallery = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};

        const galleryItems = await Gallery.find(filter).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: galleryItems.length,
            data: galleryItems,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
exports.getGalleryById = async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found',
            });
        }

        res.status(200).json({
            success: true,
            data: galleryItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Create gallery item
// @route   POST /api/gallery
// @access  Private (for now public for demo)
exports.createGallery = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        console.log('Received file:', req.file);
        
        const { title, description, category } = req.body;

        if (!req.file) {
            console.log('No file received');
            return res.status(400).json({
                success: false,
                message: 'Please upload an image',
            });
        }

        console.log('File details:', {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            path: req.file.path,
            size: req.file.size,
            filename: req.file.filename
        });

        // Validate file type
        if (!req.file.mimetype.startsWith('image/')) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a valid image file',
            });
        }

        // Since we're using Cloudinary storage, the file is already uploaded
        // and req.file.path contains the Cloudinary URL
        const imageUrl = req.file.path;
        
        // Extract the Cloudinary public ID from the filename
        // The filename is in format: "ak_design_uploads/actual_public_id"
        const cloudinaryId = req.file.filename.startsWith('ak_design_uploads/') 
            ? req.file.filename.replace('ak_design_uploads/', '')
            : req.file.filename;

        console.log('Creating gallery item in database with:', {
            title,
            description,
            category,
            imageUrl,
            cloudinaryId
        });

        const galleryItem = await Gallery.create({
            title,
            description,
            category,
            imageUrl: imageUrl,
            cloudinaryId: cloudinaryId,
        });

        console.log('Gallery item created successfully:', galleryItem._id);
        res.status(201).json({
            success: true,
            data: galleryItem,
        });
    } catch (error) {
        console.error('Gallery creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private (for now public for demo)
exports.updateGallery = async (req, res) => {
    try {
        let galleryItem = await Gallery.findById(req.params.id);

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found',
            });
        }

        // If new image is uploaded, delete old one and upload new
        if (req.file) {
            // Delete old image from Cloudinary
            await cloudinary.uploader.destroy(galleryItem.cloudinaryId);

            // Upload new image
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'portfolio/gallery',
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

        galleryItem = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: galleryItem,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private (for now public for demo)
exports.deleteGallery = async (req, res) => {
    try {
        const galleryItem = await Gallery.findById(req.params.id);

        if (!galleryItem) {
            return res.status(404).json({
                success: false,
                message: 'Gallery item not found',
            });
        }

        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(galleryItem.cloudinaryId);

        // Delete from database
        await Gallery.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Gallery item deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
