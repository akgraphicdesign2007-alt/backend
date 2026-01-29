const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Re-using existing upload middleware if needed for images
const {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} = require('../controllers/testimonialController');

router.route('/')
    .get(getTestimonials)
    .post(upload.single('image'), createTestimonial);

router.route('/:id')
    .put(updateTestimonial)
    .delete(deleteTestimonial);

module.exports = router;
