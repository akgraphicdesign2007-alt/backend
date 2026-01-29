const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = ['https://www.akdesigns.space', 'http://localhost:3000','https://akdesigns.space','https://api.akdesign.com'];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
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
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error',
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
