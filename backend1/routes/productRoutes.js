const express = require('express');
const {
  getProducts,
  getAllProductsAdmin,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, restrictTo } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');

const router = express.Router();

// Public
router.get('/', getProducts);

// Admin (must come before /:slug to avoid collision)
router.get('/admin/all', protect, restrictTo('admin'), getAllProductsAdmin);
router.get('/admin/:id', protect, restrictTo('admin'), getProductById);
router.post('/', protect, restrictTo('admin'), uploadImage.array('images', 6), createProduct);
router.put('/:id', protect, restrictTo('admin'), uploadImage.array('images', 6), updateProduct);
router.delete('/:id', protect, restrictTo('admin'), deleteProduct);

// Public single (kept last so it doesn't shadow admin/* routes)
router.get('/:slug', getProductBySlug);

module.exports = router;
