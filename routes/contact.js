const express = require('express');
const router = express.Router();
const {
    submitContact,
    getAllContacts,
} = require('../controllers/contactController');

router.route('/')
    .post(submitContact)
    .get(getAllContacts);

module.exports = router;
