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
    .post(upload.single('image'), createGallery);

router.route('/:id')
    .get(getGalleryById)
    .put(upload.single('image'), updateGallery)
    .delete(deleteGallery);

module.exports = router;
