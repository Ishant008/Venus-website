const express = require('express');
const {
  getNewsFeed,
  getNewsList,
  getNewsBySlug,
  getAllNewsAdmin,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');
const { protect, restrictTo } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

const router = express.Router();

// Public
router.get('/feed', getNewsFeed);
router.get('/', getNewsList);

// Admin (before /:slug)
router.get('/admin/all', protect, restrictTo('admin'), getAllNewsAdmin);
router.get('/admin/:id', protect, restrictTo('admin'), getNewsById);
router.post('/', protect, restrictTo('admin'), uploadImage.single('coverImage'), createNews);
router.put('/:id', protect, restrictTo('admin'), uploadImage.single('coverImage'), updateNews);
router.delete('/:id', protect, restrictTo('admin'), deleteNews);

// Public single (last)
router.get('/:slug', getNewsBySlug);

module.exports = router;
