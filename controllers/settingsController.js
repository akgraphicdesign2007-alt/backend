const Settings = require('../models/Settings');

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            // Create default settings if they don't exist
            settings = await Settings.create({});
        }

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (settings) {
            settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
                new: true,
                runValidators: true
            });
        } else {
            settings = await Settings.create(req.body);
        }

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
