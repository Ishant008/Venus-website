const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');
const Vacancy = require('../models/Vacancy');
const News = require('../models/News');

const SITE_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].replace(/\/$/, '');

const escapeXml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.7' },
  { path: '/products', changefreq: 'daily', priority: '0.9' },
  { path: '/services', changefreq: 'monthly', priority: '0.7' },
  { path: '/career', changefreq: 'daily', priority: '0.8' },
  { path: '/news', changefreq: 'daily', priority: '0.9' },
  { path: '/contact', changefreq: 'monthly', priority: '0.6' },
];

// @desc    Dynamic XML sitemap — static pages + every live product, job, and news article
// @route   GET /sitemap.xml
// @access  Public
const getSitemap = asyncHandler(async (req, res) => {
  const [products, vacancies, news] = await Promise.all([
    Product.find({ isActive: true }).select('slug updatedAt'),
    Vacancy.find({ isOpen: true }).select('slug updatedAt'),
    News.find({ isPublished: true }).select('slug updatedAt'),
  ]);

  const urlEntries = [
    ...staticRoutes.map(
      (r) => `  <url>
    <loc>${escapeXml(SITE_URL + r.path)}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    ),
    ...products.map(
      (p) => `  <url>
    <loc>${escapeXml(`${SITE_URL}/products/${p.slug}`)}</loc>
    <lastmod>${p.updatedAt.toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
    ...vacancies.map(
      (v) => `  <url>
    <loc>${escapeXml(`${SITE_URL}/career/${v.slug}`)}</loc>
    <lastmod>${v.updatedAt.toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    ),
    ...news.map(
      (n) => `  <url>
    <loc>${escapeXml(`${SITE_URL}/news/${n.slug}`)}</loc>
    <lastmod>${n.updatedAt.toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

// @desc    RSS 2.0 feed of the latest published news articles
// @route   GET /rss.xml
// @access  Public
const getRssFeed = asyncHandler(async (req, res) => {
  const items = await News.find({ isPublished: true }).sort({ publishDate: -1 }).limit(30);

  const itemEntries = items
    .map(
      (n) => `  <item>
    <title>${escapeXml(n.title)}</title>
    <link>${escapeXml(`${SITE_URL}/news/${n.slug}`)}</link>
    <guid isPermaLink="true">${escapeXml(`${SITE_URL}/news/${n.slug}`)}</guid>
    <pubDate>${new Date(n.publishDate).toUTCString()}</pubDate>
    <category>${escapeXml(n.category)}</category>
    <description>${escapeXml(n.summary)}</description>
    ${n.coverImage?.url ? `<enclosure url="${escapeXml(n.coverImage.url)}" type="image/jpeg" />` : ''}
  </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Venus Global Enterprises — News &amp; Updates</title>
  <link>${escapeXml(`${SITE_URL}/news`)}</link>
  <atom:link href="${escapeXml(`${SITE_URL}/rss.xml`)}" rel="self" type="application/rss+xml" />
  <description>Latest news, product updates, and announcements from Venus Global Enterprises.</description>
  <language>en-in</language>
${itemEntries}
</channel>
</rss>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});

module.exports = { getSitemap, getRssFeed };