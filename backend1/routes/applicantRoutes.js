const express = require('express');
const { applyToVacancy, getApplicants, updateApplicantStatus, deleteApplicant } = require('../controllers/applicantController');
const { protect, restrictTo } = require('../middleware/auth');
const { uploadResume } = require('../middleware/upload');
const { publicWriteLimiter } = require('../middleware/rateLimiters');
const { verifyRecaptcha } = require('../middleware/recaptcha');

const router = express.Router();

// multer runs first so multipart fields (including recaptchaToken) are parsed
// onto req.body before the reCAPTCHA check reads it
router.post('/', publicWriteLimiter, uploadResume.single('resume'), verifyRecaptcha, applyToVacancy);
router.get('/', protect, restrictTo('admin'), getApplicants);
router.put('/:id/status', protect, restrictTo('admin'), updateApplicantStatus);
router.delete('/:id', protect, restrictTo('admin'), deleteApplicant);

module.exports = router;