const express = require('express');
const { getAllApplicants, getApplicantById, addApplicant,deleteApplicant } = require('../controllers/applicantController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Route for fetching all applicants
router.get('/', protect, getAllApplicants);

// Route for fetching a single applicant by ID
router.get('/:id', protect, getApplicantById);

// Route for adding a new applicant (can be used by users to apply for vacancies)
router.post('/', protect, addApplicant);

// Route for deleting an applicant by ID
router.delete('/:id', protect, deleteApplicant);

module.exports = router;
