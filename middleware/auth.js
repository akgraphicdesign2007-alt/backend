const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const user = await User.findOne({
            sessionToken: token,
            sessionExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid or expired session' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error during authentication' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
