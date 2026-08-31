const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const News = require('../models/News');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const startEndOfDay = (dateStr) => {
  const d = dateStr ? new Date(dateStr) : new Date();
  if (isNaN(d)) throw new ApiError(400, 'Invalid date');
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return { start, end };
};

// @desc    Homepage news feed for a given date (defaults to today).
//          Falls back to "default" evergreen items when nothing is
//          published for that specific date.
// @route   GET /api/news/feed?date=YYYY-MM-DD
// @access  Public
const getNewsFeed = asyncHandler(async (req, res) => {
  const { start, end } = startEndOfDay(req.query.date);

  let items = await News.find({
    isPublished: true,
    publishDate: { $gte: start, $lte: end },
  }).sort({ publishDate: -1 });

  let usedFallback = false;
  if (items.length === 0) {
    items = await News.find({ isPublished: true, isDefault: true }).sort({ publishDate: -1 }).limit(6);
    usedFallback = true;
  }

  res.json({ success: true, date: start.toISOString().slice(0, 10), usedFallback, count: items.length, items });
});

// @desc    Paginated news archive for a "news website" style page
// @route   GET /api/news?page=&limit=&category=&search=
// @access  Public
const getNewsList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 9, category, search } = req.query;
  const query = { isPublished: true };
  if (category && category !== 'all') query.category = category;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total, categories] = await Promise.all([
    News.find(query).sort({ publishDate: -1 }).skip(skip).limit(Number(limit)),
    News.countDocuments(query),
    News.distinct('category'),
  ]);

  res.json({
    success: true,
    count: items.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    categories,
    items,
  });
});

// @desc    Get a single news article by slug (public) — increments views
// @route   GET /api/news/:slug
// @access  Public
const getNewsBySlug = asyncHandler(async (req, res) => {
  const item = await News.findOneAndUpdate(
    { slug: req.params.slug, isPublished: true },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!item) throw new ApiError(404, 'News article not found');

  const related = await News.find({
    _id: { $ne: item._id },
    category: item.category,
    isPublished: true,
  })
    .sort({ publishDate: -1 })
    .limit(3);

  res.json({ success: true, item, related });
});

// @desc    Get all news for admin (published + drafts)
// @route   GET /api/news/admin/all
// @access  Private/Admin
const getAllNewsAdmin = asyncHandler(async (req, res) => {
  const items = await News.find().sort({ publishDate: -1 });
  res.json({ success: true, count: items.length, items });
});

// @desc    Get single news item by id (admin)
// @route   GET /api/news/admin/:id
// @access  Private/Admin
const getNewsById = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) throw new ApiError(404, 'News article not found');
  res.json({ success: true, item });
});

// @desc    Create news/update article
// @route   POST /api/news
// @access  Private/Admin
const createNews = asyncHandler(async (req, res) => {
  const { title, summary, body, category, tags, publishDate, isPublished, isDefault, metaTitle, metaDescription, metaKeywords, imageAlts } = req.body;

  if (!title || !summary || !body) {
    throw new ApiError(400, 'Title, summary, and body are required');
  }

  let coverImage;
  const coverFile = req.files?.coverImage?.[0];
  if (coverFile) {
    const result = await uploadBufferToCloudinary(coverFile.buffer, 'news', 'image');
    coverImage = { url: result.secure_url, publicId: result.public_id };
  }

  const alts = imageAlts ? JSON.parse(imageAlts) : [];
  const galleryFiles = req.files?.images || [];
  const images = [];
  for (let i = 0; i < galleryFiles.length; i++) {
    const result = await uploadBufferToCloudinary(galleryFiles[i].buffer, 'news', 'image');
    images.push({ url: result.secure_url, publicId: result.public_id, alt: alts[i] || '' });
  }

  const item = await News.create({
    title,
    summary,
    body,
    category,
    coverImage,
    images,
    tags: Array.isArray(tags) ? tags : tags ? JSON.parse(tags) : [],
    publishDate: publishDate ? new Date(publishDate) : new Date(),
    isPublished: isPublished === undefined ? true : isPublished === 'true' || isPublished === true,
    isDefault: isDefault === 'true' || isDefault === true,
    seo: { metaTitle, metaDescription, metaKeywords, ogImage: coverImage?.url },
    author: req.user._id,
  });

  res.status(201).json({ success: true, message: 'News article published', item });
});

// @desc    Update news/update article
// @route   PUT /api/news/:id
// @access  Private/Admin
const updateNews = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) throw new ApiError(404, 'News article not found');

  const {
    title,
    summary,
    body,
    category,
    tags,
    publishDate,
    isPublished,
    isDefault,
    metaTitle,
    metaDescription,
    metaKeywords,
    removedImageIds,
    imageAlts,
  } = req.body;

  if (title) item.title = title;
  if (summary) item.summary = summary;
  if (body) item.body = body;
  if (category) item.category = category;
  if (tags) item.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
  if (publishDate) item.publishDate = new Date(publishDate);
  if (isPublished !== undefined) item.isPublished = isPublished === 'true' || isPublished === true;
  if (isDefault !== undefined) item.isDefault = isDefault === 'true' || isDefault === true;
  if (metaTitle !== undefined || metaDescription !== undefined || metaKeywords !== undefined) {
    item.seo = {
      ...item.seo,
      metaTitle: metaTitle ?? item.seo?.metaTitle,
      metaDescription: metaDescription ?? item.seo?.metaDescription,
      metaKeywords: metaKeywords ?? item.seo?.metaKeywords,
    };
  }

  const coverFile = req.files?.coverImage?.[0];
  if (coverFile) {
    if (item.coverImage?.publicId) await deleteFromCloudinary(item.coverImage.publicId);
    const result = await uploadBufferToCloudinary(coverFile.buffer, 'news', 'image');
    item.coverImage = { url: result.secure_url, publicId: result.public_id };
    item.seo.ogImage = result.secure_url;
  }

  // Remove selected gallery images
  if (removedImageIds) {
    const idsToRemove = Array.isArray(removedImageIds) ? removedImageIds : JSON.parse(removedImageIds);
    const toDelete = item.images.filter((img) => idsToRemove.includes(img.publicId));
    for (const img of toDelete) {
      await deleteFromCloudinary(img.publicId);
    }
    item.images = item.images.filter((img) => !idsToRemove.includes(img.publicId));
  }

  // Add new gallery images
  const galleryFiles = req.files?.images || [];
  if (galleryFiles.length > 0) {
    const alts = imageAlts ? JSON.parse(imageAlts) : [];
    for (let i = 0; i < galleryFiles.length; i++) {
      const result = await uploadBufferToCloudinary(galleryFiles[i].buffer, 'news', 'image');
      item.images.push({ url: result.secure_url, publicId: result.public_id, alt: alts[i] || '' });
    }
  }

  await item.save();
  res.json({ success: true, message: 'News article updated', item });
});

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private/Admin
const deleteNews = asyncHandler(async (req, res) => {
  const item = await News.findById(req.params.id);
  if (!item) throw new ApiError(404, 'News article not found');

  if (item.coverImage?.publicId) await deleteFromCloudinary(item.coverImage.publicId);
  for (const img of item.images || []) {
    await deleteFromCloudinary(img.publicId);
  }
  await item.deleteOne();

  res.json({ success: true, message: 'News article deleted' });
});

module.exports = {
  getNewsFeed,
  getNewsList,
  getNewsBySlug,
  getAllNewsAdmin,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};