const express = require('express');
const {
  getVacancies,
  getAllVacanciesAdmin,
  getVacancyBySlug,
  createVacancy,
  updateVacancy,
  deleteVacancy,
} = require('../controllers/vacancyController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.get('/', getVacancies);
router.get('/admin/all', protect, restrictTo('admin'), getAllVacanciesAdmin);
router.post('/', protect, restrictTo('admin'), createVacancy);
router.put('/:id', protect, restrictTo('admin'), updateVacancy);
router.delete('/:id', protect, restrictTo('admin'), deleteVacancy);
router.get('/:slug', getVacancyBySlug);

module.exports = router;
