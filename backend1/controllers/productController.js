const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Product = require('../models/Product');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all active products (public) - supports ?category=&search=&page=&limit=
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, search, page = 1, limit = 12 } = req.query;
  const query = { isActive: true };

  if (category && category !== 'all') query.category = category;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total, categories] = await Promise.all([
    Product.find(query).sort({ order: 1, createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
    Product.distinct('category', { isActive: true }),
  ]);

  res.json({
    success: true,
    count: products.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    categories,
    products,
  });
});

// @desc    Get all products for admin (includes inactive)
// @route   GET /api/products/admin/all
// @access  Private/Admin
const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, products });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) throw new ApiError(404, 'Product not found');

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  }).limit(4);

  res.json({ success: true, product, related });
});

// @desc    Get single product by id (admin)
// @route   GET /api/products/admin/:id
// @access  Private/Admin
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');
  res.json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, shortDescription, category, features, isFeatured, isActive, metaTitle, metaDescription } = req.body;

  if (!name || !description || !category) {
    throw new ApiError(400, 'Name, description, and category are required');
  }

  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadBufferToCloudinary(file.buffer, 'products', 'image');
      images.push({ url: result.secure_url, publicId: result.public_id });
    }
  }
  if (images.length === 0) {
    throw new ApiError(400, 'At least one product image is required');
  }

  const product = await Product.create({
    name,
    description,
    shortDescription,
    category,
    features: features ? (Array.isArray(features) ? features : JSON.parse(features)) : [],
    images,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isActive: isActive === undefined ? true : isActive === 'true' || isActive === true,
    seo: { metaTitle, metaDescription },
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, message: 'Product created', product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  const { name, description, shortDescription, category, features, isFeatured, isActive, removedImageIds, metaTitle, metaDescription } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (shortDescription !== undefined) product.shortDescription = shortDescription;
  if (category) product.category = category;
  if (features) product.features = Array.isArray(features) ? features : JSON.parse(features);
  if (isFeatured !== undefined) product.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isActive !== undefined) product.isActive = isActive === 'true' || isActive === true;
  if (metaTitle !== undefined || metaDescription !== undefined) {
    product.seo = { metaTitle: metaTitle ?? product.seo?.metaTitle, metaDescription: metaDescription ?? product.seo?.metaDescription };
  }

  // Remove selected images
  if (removedImageIds) {
    const idsToRemove = Array.isArray(removedImageIds) ? removedImageIds : JSON.parse(removedImageIds);
    const toDelete = product.images.filter((img) => idsToRemove.includes(img.publicId));
    for (const img of toDelete) {
      await deleteFromCloudinary(img.publicId);
    }
    product.images = product.images.filter((img) => !idsToRemove.includes(img.publicId));
  }

  // Add new images
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadBufferToCloudinary(file.buffer, 'products', 'image');
      product.images.push({ url: result.secure_url, publicId: result.public_id });
    }
  }

  if (product.images.length === 0) {
    throw new ApiError(400, 'Product must have at least one image');
  }

  await product.save();
  res.json({ success: true, message: 'Product updated', product });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found');

  for (const img of product.images) {
    await deleteFromCloudinary(img.publicId);
  }

  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

module.exports = {
  getProducts,
  getAllProductsAdmin,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
