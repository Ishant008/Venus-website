const express = require('express');
const { getClarityInsights } = require('../controllers/analyticsController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/clarity', protect, restrictTo('admin'), getClarityInsights);

module.exports = router;