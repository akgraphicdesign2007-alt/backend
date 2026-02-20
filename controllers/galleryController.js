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
        console.log('Received files:', req.files);

        const { title, description, category, aboutProject, date, client } = req.body;

        if (!req.files || !req.files.image || req.files.image.length === 0) {
            console.log('No image received');
            return res.status(400).json({
                success: false,
                message: 'Please upload a cover image',
            });
        }

        const imageFile = req.files.image[0];

        // Validate file type
        if (!imageFile.mimetype.startsWith('image/')) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a valid image file',
            });
        }

        const imageUrl = imageFile.path;

        const cloudinaryId = imageFile.filename.startsWith('ak_design_uploads/')
            ? imageFile.filename.replace('ak_design_uploads/', '')
            : imageFile.filename;

        // Process branding images
        const brandingImages = [];
        if (req.files.brandingImages && req.files.brandingImages.length > 0) {
            req.files.brandingImages.forEach(file => {
                const bImageUrl = file.path;
                const bCloudinaryId = file.filename.startsWith('ak_design_uploads/')
                    ? file.filename.replace('ak_design_uploads/', '')
                    : file.filename;

                brandingImages.push({
                    url: bImageUrl,
                    cloudinaryId: bCloudinaryId
                });
            });
        }

        console.log('Creating gallery item in database...');

        const galleryItem = await Gallery.create({
            title,
            description,
            category,
            aboutProject,
            date,
            client,
            imageUrl: imageUrl,
            cloudinaryId: cloudinaryId,
            brandingImages: brandingImages
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

        // FIX FOR UPDATE: Since multer-storage-cloudinary handles upload directly, we can just grab from req.files
        if (req.files && req.files.image && req.files.image.length > 0) {
            const imageFile = req.files.image[0];

            // Delete old empty cover image logic
            if (galleryItem.cloudinaryId) {
                await cloudinary.uploader.destroy(galleryItem.cloudinaryId);
            }

            req.body.imageUrl = imageFile.path;
            const newCloudinaryId = imageFile.filename.startsWith('ak_design_uploads/')
                ? imageFile.filename.replace('ak_design_uploads/', '')
                : imageFile.filename;
            req.body.cloudinaryId = newCloudinaryId;
        }

        // Handle branding images - append to existing
        if (req.files && req.files.brandingImages && req.files.brandingImages.length > 0) {
            const newBrandingImages = [];
            req.files.brandingImages.forEach(file => {
                const bImageUrl = file.path;
                const bCloudinaryId = file.filename.startsWith('ak_design_uploads/')
                    ? file.filename.replace('ak_design_uploads/', '')
                    : file.filename;

                newBrandingImages.push({
                    url: bImageUrl,
                    cloudinaryId: bCloudinaryId
                });
            });

            req.body.brandingImages = [...(galleryItem.brandingImages || []), ...newBrandingImages];
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
