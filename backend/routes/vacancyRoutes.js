const express = require('express');
const { addVacancy, getAllVacancies, getVacancyById, updateVacancy, deleteVacancy } = require('../controllers/vacancyController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addVacancy);
router.get('/', getAllVacancies);
router.get('/:id', getVacancyById);
router.put('/:id', protect, updateVacancy);
router.delete('/:id', protect, deleteVacancy);

module.exports = router;
