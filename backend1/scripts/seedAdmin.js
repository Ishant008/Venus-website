// Run with: npm run seed:admin
// Creates the single admin account (from .env) if it doesn't exist yet,
// and a few "default" evergreen News items used as a fallback when no
// news has been published for a given date.
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const User = require('../models/User');
const News = require('../models/News');

const run = async () => {
  await connectDB();

  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('Set ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD in your .env before seeding.');
    process.exit(1);
  }

  const existing = await User.findOne({ $or: [{ username: ADMIN_USERNAME.toLowerCase() }, { email: ADMIN_EMAIL.toLowerCase() }] });
  if (existing) {
    console.log('Admin user already exists — skipping user creation.');
  } else {
    await User.create({ username: ADMIN_USERNAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: 'admin' });
    console.log(`Admin user created: ${ADMIN_USERNAME}`);
  }

  const defaultCount = await News.countDocuments({ isDefault: true });
  if (defaultCount === 0) {
    await News.insertMany([
      {
        title: 'Welcome to Venus — Building Reliable Field & Law Enforcement Systems',
        summary: 'Venus designs and builds mission-critical software for police duty management, field operations, and public safety.',
        body: '<p>Venus builds dependable, secure software for law enforcement and field operations teams — from duty management to real-time field tracking. Check back here for the latest company news, product updates, and announcements.</p>',
        category: 'General',
        isDefault: true,
        isPublished: true,
        publishDate: new Date(),
      },
      {
        title: 'Our Commitment to Secure, Reliable Public-Sector Software',
        summary: 'Security and reliability guide every product we ship — because the teams who depend on us can\'t afford downtime.',
        body: '<p>Every system we build undergoes rigorous security review before it reaches the field. We believe public safety software should be held to the highest standard of reliability.</p>',
        category: 'Company News',
        isDefault: true,
        isPublished: true,
        publishDate: new Date(),
      },
    ]);
    console.log('Seeded default fallback news items.');
  } else {
    console.log('Default news items already exist — skipping.');
  }

  console.log('Seed complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
