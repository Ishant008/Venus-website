const express = require('express');
const multer = require('multer');
const { getAllProducts, getProductById, addProduct, deleteProduct, updateProduct } = require('../controllers/productController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Configure Multer (temporary storage before uploading to Cloudinary)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // local folder to store uploaded images temporarily
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // unique file name
    }
});
const upload = multer({ storage });

// Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', protect, upload.single('image'), addProduct); 
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;

