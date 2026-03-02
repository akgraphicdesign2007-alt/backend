const express = require('express');
const router = express.Router();
const {
    getFullSitemap,
    getBlogSitemap,
    getProjectsSitemap,
} = require('../controllers/sitemapController');

// GET /api/sitemap          — full sitemap (all pages + dynamic content)
router.get('/', getFullSitemap);

// GET /api/sitemap/blog     — blog posts only
router.get('/blog', getBlogSitemap);

// GET /api/sitemap/projects — projects only
router.get('/projects', getProjectsSitemap);

module.exports = router;
