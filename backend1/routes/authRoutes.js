const express = require('express');
const { body } = require('express-validator');
const { login, logout, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiters');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  [body('username').trim().notEmpty().withMessage('Username is required'), body('password').notEmpty().withMessage('Password is required')],
  validate,
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put(
  '/change-password',
  protect,
  [body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')],
  validate,
  changePassword
);

module.exports = router;
