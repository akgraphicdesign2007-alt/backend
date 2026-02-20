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

router.route('/')
    .get(getAllGallery)
    .post(upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'brandingImages', maxCount: 10 }
    ]), createGallery);

router.route('/:id')
    .get(getGalleryById)
    .put(upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'brandingImages', maxCount: 10 }
    ]), updateGallery)
    .delete(deleteGallery);

module.exports = router;
