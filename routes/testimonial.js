const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Re-using existing upload middleware if needed for images
const {
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} = require('../controllers/testimonialController');

// Route for text-only testimonials (from frontend forms)
router.route('/')
    .get(getTestimonials)
    .post(createTestimonial); // No upload middleware for simple text testimonials

// Route for testimonials with images (admin uploads)
router.route('/upload')
    .post(upload.single('image'), createTestimonial);

router.route('/:id')
    .put(updateTestimonial)
    .delete(deleteTestimonial);

module.exports = router;
