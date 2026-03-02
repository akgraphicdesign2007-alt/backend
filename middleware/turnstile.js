/**
 * turnstile.js — Cloudflare Turnstile server-side verification middleware
 * ─────────────────────────────────────────────────────────────────────────
 * Validates the cf-turnstile-response token sent from the frontend.
 * Add to any route that needs bot protection:
 *
 *   const { verifyTurnstile } = require('../middleware/turnstile');
 *   router.post('/login', verifyTurnstile, loginController);
 */

const TURNSTILE_SECRET = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * verifyTurnstile — Express middleware
 * Reads captchaToken from req.body, verifies with Cloudflare,
 * and either calls next() or returns 400/403.
 */
exports.verifyTurnstile = async (req, res, next) => {
    // Skip verification in test/development if no secret is set
    if (!TURNSTILE_SECRET) {
        console.warn('[Turnstile] No secret key set — skipping verification (development mode)');
        return next();
    }

    const token = req.body.captchaToken;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Missing security verification token.',
        });
    }

    try {
        const body = new URLSearchParams({
            secret: TURNSTILE_SECRET,
            response: token,
            remoteip: req.ip,
        });

        const response = await fetch(TURNSTILE_VERIFY_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        });

        const data = await response.json();

        if (!data.success) {
            console.warn('[Turnstile] Verification failed:', data['error-codes']);
            return res.status(403).json({
                success: false,
                message: 'Security verification failed. Please try again.',
                codes: data['error-codes'],
            });
        }

        // Attach the verification result to the request for downstream use
        req.turnstile = data;
        next();
    } catch (err) {
        console.error('[Turnstile] Verification error:', err.message);
        // Fail open in case Cloudflare is unreachable — log and proceed
        next();
    }
};
