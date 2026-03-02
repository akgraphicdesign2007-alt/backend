const express = require('express');
const router = express.Router();
const { getAllContent, updateContent } = require('../controllers/pageContentController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .get(getAllContent);

router.route('/:section')
    .post(protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), updateContent);

module.exports = router;
