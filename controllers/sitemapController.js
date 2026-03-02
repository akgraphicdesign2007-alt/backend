const Blog = require('../models/Blog');
const Gallery = require('../models/Gallery');

const SITE_URL = 'https://www.akdesigns.space';
const TODAY = new Date().toISOString().split('T')[0];

/**
 * GET /api/sitemap
 * Returns a complete XML sitemap including all static and dynamic URLs.
 * Used by the sitemap generator script and can be pinged by search engines.
 */
exports.getFullSitemap = async (req, res) => {
    try {
        const [blogs, projects] = await Promise.all([
            Blog.find({}, 'slug createdAt').sort({ createdAt: -1 }),
            Gallery.find({}, 'slug createdAt').sort({ createdAt: -1 }),
        ]);

        const staticPages = [
            { loc: `${SITE_URL}/`, lastmod: TODAY, changefreq: 'weekly', priority: '1.0' },
            { loc: `${SITE_URL}/about`, lastmod: TODAY, changefreq: 'monthly', priority: '0.8' },
            { loc: `${SITE_URL}/projects`, lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
            { loc: `${SITE_URL}/blog`, lastmod: TODAY, changefreq: 'weekly', priority: '0.9' },
            { loc: `${SITE_URL}/contact`, lastmod: TODAY, changefreq: 'monthly', priority: '0.7' },
        ];

        const blogUrls = blogs.map(b => ({
            loc: `${SITE_URL}/blog/${b.slug}`,
            lastmod: b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : TODAY,
            changefreq: 'monthly',
            priority: '0.6',
        }));

        const projectUrls = projects.map(p => ({
            loc: `${SITE_URL}/projects/${p.slug}`,
            lastmod: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : TODAY,
            changefreq: 'monthly',
            priority: '0.7',
        }));

        const allUrls = [...staticPages, ...blogUrls, ...projectUrls];

        const urlsXml = allUrls.map(u => `
  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlsXml}
</urlset>`;

        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'public, max-age=3600'); // cache 1 hour
        res.status(200).send(xml);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate sitemap', error: error.message });
    }
};

/**
 * GET /api/sitemap/blog
 * Returns XML sitemap for blog posts only.
 */
exports.getBlogSitemap = async (req, res) => {
    try {
        const blogs = await Blog.find({}, 'slug createdAt').sort({ createdAt: -1 });

        const urlsXml = blogs.map(b => `
  <url>
    <loc>${SITE_URL}/blog/${b.slug}</loc>
    <lastmod>${b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'public, max-age=3600');
        res.status(200).send(xml);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate blog sitemap', error: error.message });
    }
};

/**
 * GET /api/sitemap/projects
 * Returns XML sitemap for projects only.
 */
exports.getProjectsSitemap = async (req, res) => {
    try {
        const projects = await Gallery.find({}, 'slug createdAt').sort({ createdAt: -1 });

        const urlsXml = projects.map(p => `
  <url>
    <loc>${SITE_URL}/projects/${p.slug}</loc>
    <lastmod>${p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : TODAY}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'public, max-age=3600');
        res.status(200).send(xml);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to generate projects sitemap', error: error.message });
    }
};
