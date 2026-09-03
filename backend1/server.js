const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const Sentry = require('@sentry/node');

dotenv.config();

// Error tracking — only activates when SENTRY_DSN is set in .env, so this
// is a safe no-op for setups that haven't configured Sentry yet.
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 0.2,
  });
}

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiters');

connectDB();

const app = express();

// Behind a proxy (Render/Railway/Heroku/Nginx) — needed for correct client IPs & secure cookies
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS — allow the configured frontend origin(s), with credentials for the JWT cookie.
// Automatically allows both the "www." and bare-domain variant of every origin you
// configure — this fixes the classic "works on some devices, not others" bug where
// FRONTEND_URL only listed one form (e.g. https://venus360.in) but visitors on the
// other form (https://www.venus360.in) got rejected with no CORS header at all.
const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = new Set();
configuredOrigins.forEach((origin) => {
  allowedOrigins.add(origin);
  try {
    const url = new URL(origin);
    const altHost = url.hostname.startsWith('www.') ? url.hostname.slice(4) : `www.${url.hostname}`;
    allowedOrigins.add(`${url.protocol}//${altHost}${url.port ? ':' + url.port : ''}`);
  } catch {
    // ignore malformed entries in FRONTEND_URL
  }
});

app.use(
  cors({
    origin: (origin, callback) => {
      // No origin header = same-origin request, curl, server-to-server, etc. — allow it
      if (!origin || allowedOrigins.has(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} is not allowed by CORS. Add it to FRONTEND_URL in the backend .env.`));
    },
    credentials: true,
    maxAge: 600, // cache preflight for 10 minutes — short enough to avoid stale-cache surprises after redeploys
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Sanitize against NoSQL injection & parameter pollution
app.use(mongoSanitize());
app.use(hpp());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Venus API is running', time: new Date().toISOString() });
});

// SEO feeds — served at the site root so search engines/crawlers find them
// at the conventional /sitemap.xml and /rss.xml paths (see README for the
// reverse-proxy note needed if the frontend is hosted on a different origin).
const { getSitemap, getRssFeed } = require('./controllers/feedController');
app.get('/sitemap.xml', getSitemap);
app.get('/rss.xml', getRssFeed);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/vacancies', require('./routes/vacancyRoutes'));
app.use('/api/applicants', require('./routes/applicantRoutes'));
app.use('/api/news', require('./routes/newsRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.use(notFound);

// Sentry must see errors before our own JSON error handler formats them
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Venus API server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});