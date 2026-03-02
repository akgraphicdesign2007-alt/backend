const cloudinary = require('../config/cloudinary');

// @desc    Get all media files from Cloudinary storage
// @route   GET /api/media
// @access  Private/Admin
exports.getMediaFiles = async (req, res) => {
    try {
        // Fetch images
        const imagesResult = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'ak_design_uploads/', // Optional prefix if folder is restricted
            max_results: 100,
            resource_type: 'image'
        });

        // Fetch Raw Files (PDF, Docs)
        const rawResult = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'ak_design_uploads/', // Optional prefix if folder is restricted
            max_results: 100,
            resource_type: 'raw' // PDF uploaded natively sometimes ends up here, but let's check both
        });

        const allResources = [...imagesResult.resources, ...rawResult.resources].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        res.status(200).json({ success: true, data: allResources });
    } catch (error) {
        console.error('Error fetching media from Cloudinary:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve files from Cloudinary storage' });
    }
};

// @desc    Delete media file from Cloudinary storage
// @route   POST /api/media/delete
// @access  Private/Admin
exports.deleteMediaFile = async (req, res) => {
    try {
        const { public_id, resource_type } = req.body;

        if (!public_id) {
            return res.status(400).json({ success: false, message: 'public_id is required' });
        }

        await cloudinary.uploader.destroy(public_id, { resource_type: resource_type || 'image' });

        res.status(200).json({ success: true, message: 'Media file successfully deleted' });
    } catch (error) {
        console.error('Error deleting media from Cloudinary:', error);
        res.status(500).json({ success: false, message: 'Failed to delete file from Cloudinary storage' });
    }
};
