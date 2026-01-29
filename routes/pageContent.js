const express = require('express');
const router = express.Router();
const { getAllContent, updateContent } = require('../controllers/pageContentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
    .get(getAllContent);

router.route('/:section')
    .post(protect, upload.single('image'), updateContent); // POST used for create/update upsert

module.exports = router;
