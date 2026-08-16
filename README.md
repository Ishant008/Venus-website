# Venus Global Enterprises — Website

Full rebuild of the Venus website:
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Express + MongoDB (Mongoose)
- **Images:** Cloudinary
- **Admin:** Single admin account, JWT auth (httpOnly cookie)

```
venus-app/
├── backend/     Express API
└── frontend/    React (Vite) site + admin dashboard
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier is fine) or a local `mongod`
- A [Cloudinary](https://cloudinary.com) account (free tier is fine) — for product images and news cover images

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string (e.g. run `openssl rand -hex 32`)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard
- `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` — the admin login you want to seed

Create the admin account + default news fallback items:

```bash
npm run seed:admin
```

Start the API:

```bash
npm run dev      # http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env   # defaults already point to http://localhost:5000/api
npm run dev             # http://localhost:5173
```

The dev server proxies `/api` to `http://localhost:5000` (see `vite.config.js`), so you can also leave
`VITE_API_URL` unset locally if you prefer.

Admin dashboard: `http://localhost:5173/admin/login` — log in with the credentials you set in `ADMIN_USERNAME`/`ADMIN_PASSWORD`.

## 4. What's included

**Public site:** Home, About, Products (list + detail), Services, Career (job list + detail + apply with resume
upload), News & Updates (dated articles, SEO meta tags, Open Graph, JSON-LD structured data, social share
buttons), Contact.

**News/Updates behavior:** the homepage and news feed show whatever is published for *today's* date. If the
admin hasn't published anything for that specific day, the site automatically falls back to articles marked
"default" in the admin panel — so the news section is never empty.

**Admin dashboard:** login, dashboard overview, Products CRUD (multi-image upload via Cloudinary), Job Openings
CRUD, Applicants (view/download resumes, update status, delete), News/Updates CRUD (cover image, rich HTML body,
publish date, category, tags, default/fallback flag), account settings (change password).

**Security:** JWT in httpOnly cookies, bcrypt password hashing, helmet security headers, rate limiting on login
and public submissions, MongoDB injection sanitization, HTTP parameter pollution protection, role-based route
guards on every admin endpoint (both frontend route guards and backend middleware), file-type/size validation
on all uploads, Cloudinary credentials never exposed to the client.

## 5. Deployment notes

- **Backend:** deploy to any Node host (Render, Railway, Fly.io, a VPS, etc). Set all `.env` values as
  environment variables in your host's dashboard. Set `NODE_ENV=production` and `FRONTEND_URL` to your deployed
  frontend's exact origin (comma-separate multiple origins if needed).
- **Frontend:** `npm run build` produces a static `dist/` folder — deploy it to Vercel, Netlify, Cloudflare
  Pages, or any static host. Set `VITE_API_URL` to your deployed backend's `/api` URL and `VITE_SITE_URL` to
  your production domain (used for canonical URLs and Open Graph tags).
- Add a real `sitemap.xml` once your content is live (can be generated from the `/api/products`, `/api/news`,
  and `/api/vacancies` endpoints).

## 6. Notes on this rebuild

- Products no longer show a price — they're enquiry-only, per your requirements ("Enquire Now" links to Contact).
- News/Updates supports rich content: a cover image plus an HTML body (the admin form accepts basic HTML tags
  like `<p>`, `<b>`, `<a href="">`).
- Single admin account only — no multi-role/editor system.
- All original site assets (images, favicon) were carried over into `frontend/public/assets`.
