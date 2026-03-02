const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        await sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        await sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        if (!userToDelete) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (userToDelete.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Critical System Protection: Admin profiles cannot be deleted.' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'There is no user with that email' });
        }

        const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOtp = resetOtp;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save();

        const message = `Your password reset OTP is: ${resetOtp}. It expires in 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset OTP',
                message
            });
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error('Reset password email error:', err);
            user.resetPasswordOtp = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { otp, password } = req.body;

        const user = await User.findOne({
            resetPasswordOtp: otp,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        user.password = password;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        await sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Invite admin
// @route   POST /api/auth/invite
// @access  Private/Admin
exports.inviteUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Please provide name and email' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Generate invite token
        const inviteToken = crypto.randomBytes(20).toString('hex');
        const inviteExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        user = await User.create({
            name,
            email,
            role: role || 'admin',
            status: 'pending',
            inviteToken,
            inviteExpires
        });

        // Send invite email
        const client_url = process.env.CLIENT_URL || 'http://localhost:5173';
        const inviteUrl = `${client_url}/admin/accept-invite/${inviteToken}`;
        const message = `You have been invited to join the AK Design admin panel as an administrative partner. Please click the link below to set your secure access key and activate your profile:\n\n${inviteUrl}\n\nThis invitation is valid for 24 hours.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'AK Design Portal Invitation',
                message
            });
            res.status(200).json({ success: true, data: 'Invitation sent successfully' });
        } catch (err) {
            console.error('Invite email error:', err);
            // Delete user if email failed so they can be re-invited
            await User.findByIdAndDelete(user._id);
            return res.status(500).json({ success: false, message: 'Invitation email could not be sent. Check SMTP settings.' });
        }
    } catch (error) {
        console.error('INVITE_VALIDATION_ERROR:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Accept invite and set password
// @route   PUT /api/auth/accept-invite/:token
// @access  Public
exports.setupPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const inviteToken = req.params.token;

        const user = await User.findOne({
            inviteToken,
            inviteExpires: { $gt: Date.now() },
            status: 'pending'
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Your invitation has expired or is invalid.' });
        }

        user.password = password;
        user.status = 'active';
        user.inviteToken = undefined;
        user.inviteExpires = undefined;
        await user.save();

        await sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        if (req.user) {
            req.user.sessionToken = undefined;
            req.user.sessionExpire = undefined;
            await req.user.save({ validateBeforeSave: false });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const sendTokenResponse = async (user, statusCode, res) => {
    const token = user.generateSessionToken();
    await user.save({ validateBeforeSave: false });

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
