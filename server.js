const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    'https://www.akdesigns.space',
    'http://localhost:3000',
    'http://localhost:5173', // Vite default development port
    'https://akdesigns.space',
    'https://api.akdesign.space'
];

// Enhanced CORS configuration with preflight handling
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin is in allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        
        // For development, allow localhost with any port
        if (process.env.NODE_ENV !== 'production') {
            if (origin && origin.startsWith('http://localhost:')) {
                return callback(null, true);
            }
        }
        
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.sendStatus(200);
    }
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/testimonials', require('./routes/testimonial'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/pageContent'));

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    // Handle Multer file size errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum file size is 30MB.',
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files uploaded. Only 1 file allowed.',
            });
        }
    }
    
    // Handle other Multer errors
    if (err.message && err.message.includes('File too large')) {
        return res.status(400).json({
            success: false,
            message: 'File too large. Maximum file size is 30MB.',
        });
    }
    
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
