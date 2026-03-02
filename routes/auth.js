const express = require('express');
const router = express.Router();
const {
    register, login, logout, getMe, getUsers,
    deleteUser, forgotPassword, resetPassword,
    inviteUser, setupPassword,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { verifyTurnstile } = require('../middleware/turnstile');

// ── Public auth routes — protected by Turnstile CAPTCHA ──────────
router.post('/register', verifyTurnstile, register);
router.post('/login', verifyTurnstile, login);
router.post('/forgotpassword', verifyTurnstile, forgotPassword);
router.put('/resetpassword', verifyTurnstile, resetPassword);
router.put('/accept-invite/:token', verifyTurnstile, setupPassword);

// ── Authenticated routes ──────────────────────────────────────────
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// ── Admin-only routes ─────────────────────────────────────────────
router.get('/users', protect, authorize('admin'), getUsers);
router.post('/invite', protect, authorize('admin'), inviteUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
