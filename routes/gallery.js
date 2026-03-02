const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
    getAllGallery,
    getGalleryById,
    createGallery,
    updateGallery,
    deleteGallery,
} = require('../controllers/galleryController');

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getAllGallery)
    .post(protect, authorize('admin'), upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'brandingImages', maxCount: 10 }
    ]), createGallery);

router.route('/:id')
    .get(getGalleryById)
    .put(protect, authorize('admin'), upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'brandingImages', maxCount: 10 }
    ]), updateGallery)
    .delete(protect, authorize('admin'), deleteGallery);

module.exports = router;
