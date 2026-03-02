const express = require('express');
const router = express.Router();
const { getMediaFiles, deleteMediaFile } = require('../controllers/mediaController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getMediaFiles);
router.post('/delete', protect, authorize('admin'), deleteMediaFile);

module.exports = router;
