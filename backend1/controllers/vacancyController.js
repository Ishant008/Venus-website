const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Vacancy = require('../models/Vacancy');
const Applicant = require('../models/Applicant');

// @desc    Get all open vacancies (public)
// @route   GET /api/vacancies
// @access  Public
const getVacancies = asyncHandler(async (req, res) => {
  const vacancies = await Vacancy.find({ isOpen: true }).sort({ createdAt: -1 });
  res.json({ success: true, count: vacancies.length, vacancies });
});

// @desc    Get all vacancies for admin (includes closed)
// @route   GET /api/vacancies/admin/all
// @access  Private/Admin
const getAllVacanciesAdmin = asyncHandler(async (req, res) => {
  const vacancies = await Vacancy.find().sort({ createdAt: -1 });
  res.json({ success: true, count: vacancies.length, vacancies });
});

// @desc    Get single vacancy by slug
// @route   GET /api/vacancies/:slug
// @access  Public
const getVacancyBySlug = asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findOne({ slug: req.params.slug });
  if (!vacancy) throw new ApiError(404, 'Job opening not found');
  res.json({ success: true, vacancy });
});

// @desc    Create vacancy
// @route   POST /api/vacancies
// @access  Private/Admin
const createVacancy = asyncHandler(async (req, res) => {
  const { title, department, location, employmentType, description, tags, requirements, experience } = req.body;

  if (!title || !description) {
    throw new ApiError(400, 'Title and description are required');
  }

  const vacancy = await Vacancy.create({
    title,
    department,
    location,
    employmentType,
    description,
    experience,
    tags: Array.isArray(tags) ? tags : tags ? JSON.parse(tags) : [],
    requirements: Array.isArray(requirements) ? requirements : requirements ? JSON.parse(requirements) : [],
    postedBy: req.user._id,
  });

  res.status(201).json({ success: true, message: 'Job opening created', vacancy });
});

// @desc    Update vacancy
// @route   PUT /api/vacancies/:id
// @access  Private/Admin
const updateVacancy = asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findById(req.params.id);
  if (!vacancy) throw new ApiError(404, 'Job opening not found');

  const { title, department, location, employmentType, description, tags, requirements, experience, isOpen } = req.body;

  if (title) vacancy.title = title;
  if (department !== undefined) vacancy.department = department;
  if (location !== undefined) vacancy.location = location;
  if (employmentType) vacancy.employmentType = employmentType;
  if (description) vacancy.description = description;
  if (experience !== undefined) vacancy.experience = experience;
  if (tags) vacancy.tags = Array.isArray(tags) ? tags : JSON.parse(tags);
  if (requirements) vacancy.requirements = Array.isArray(requirements) ? requirements : JSON.parse(requirements);
  if (isOpen !== undefined) vacancy.isOpen = isOpen === 'true' || isOpen === true;

  await vacancy.save();
  res.json({ success: true, message: 'Job opening updated', vacancy });
});

// @desc    Delete vacancy
// @route   DELETE /api/vacancies/:id
// @access  Private/Admin
const deleteVacancy = asyncHandler(async (req, res) => {
  const vacancy = await Vacancy.findById(req.params.id);
  if (!vacancy) throw new ApiError(404, 'Job opening not found');

  await Applicant.deleteMany({ vacancy: vacancy._id });
  await vacancy.deleteOne();

  res.json({ success: true, message: 'Job opening and its applicants deleted' });
});

module.exports = {
  getVacancies,
  getAllVacanciesAdmin,
  getVacancyBySlug,
  createVacancy,
  updateVacancy,
  deleteVacancy,
};
