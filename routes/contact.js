const express = require('express');
const router = express.Router();
const {
    submitContact,
    getAllContacts,
    deleteContact,
} = require('../controllers/contactController');

const { protect } = require('../middleware/auth');

router.route('/')
    .post(submitContact)
    .get(protect, getAllContacts);

router.route('/:id')
    .delete(protect, deleteContact);

module.exports = router;
