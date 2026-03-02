const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, getUsers, deleteUser, forgotPassword, resetPassword, inviteUser, setupPassword } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);
router.put('/accept-invite/:token', setupPassword);
router.get('/me', protect, getMe);

// Admin Routes
router.get('/users', protect, authorize('admin'), getUsers);
router.post('/invite', protect, authorize('admin'), inviteUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
