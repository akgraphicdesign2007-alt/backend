const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials (Public - Approved only by default, or Admin can see all)
// @route   GET /api/testimonials
exports.getTestimonials = async (req, res) => {
    try {
        const { all } = req.query;
        let query = {};

        // If 'all' is not true, only show approved (for public site)
        if (all !== 'true') {
            query.approved = true;
        }

        const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: testimonials.length,
            data: testimonials,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Create a testimonial (Public submission)
// @route   POST /api/testimonials
exports.createTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.create(req.body);
        res.status(201).json({
            success: true,
            data: testimonial,
            message: 'Testimonial submitted for approval',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update testimonial (Approve/Edit)
// @route   PUT /api/testimonials/:id
exports.updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }

        res.status(200).json({
            success: true,
            data: testimonial,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
exports.deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

        if (!testimonial) {
            return res.status(404).json({ success: false, message: 'Testimonial not found' });
        }

        res.status(200).json({
            success: true,
            data: {},
            message: 'Testimonial deleted',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};
