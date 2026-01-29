const PageContent = require('../models/PageContent');

// @desc    Get all page content
// @route   GET /api/content
exports.getAllContent = async (req, res) => {
    try {
        const content = await PageContent.find();
        // Convert array to object keyed by section for easier frontend consumption
        const contentMap = {};
        content.forEach(item => {
            contentMap[item.section] = item;
        });

        res.status(200).json({
            success: true,
            data: contentMap,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update or Create content for a section
// @route   POST /api/content/:section
exports.updateContent = async (req, res) => {
    try {
        const { section } = req.params;

        let content = await PageContent.findOne({ section });

        if (content) {
            // Update
            const updateData = { ...req.body };
            if (req.file) {
                updateData.image = req.file.path; // Cloudinary URL
            }

            content = await PageContent.findOneAndUpdate({ section }, updateData, {
                new: true,
                runValidators: true,
            });
        } else {
            // Create
            const createData = {
                section,
                ...req.body
            };
            if (req.file) {
                createData.image = req.file.path;
            }

            content = await PageContent.create(createData);
        }

        res.status(200).json({
            success: true,
            data: content,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
