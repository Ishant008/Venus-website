const express = require('express');
const { getAdminDetails } = require('../controllers/adminController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Route for getting admin details (protected)
router.get('/', protect, getAdminDetails);

module.exports = router;
