const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const Applicant = require('../models/Applicant');
const Vacancy = require('../models/Vacancy');
const { uploadBufferToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Apply to a vacancy
// @route   POST /api/applicants
// @access  Public
const applyToVacancy = asyncHandler(async (req, res) => {
  const { name, email, phone, message, vacancyId } = req.body;

  if (!name || !email || !phone || !vacancyId) {
    throw new ApiError(400, 'Name, email, phone, and vacancy are required');
  }

  const vacancy = await Vacancy.findById(vacancyId);
  if (!vacancy || !vacancy.isOpen) {
    throw new ApiError(404, 'This job opening is no longer available');
  }

  if (!req.file) {
    throw new ApiError(400, 'Resume file is required');
  }

  const result = await uploadBufferToCloudinary(req.file.buffer, 'resumes', 'raw', req.file.originalname);

  const applicant = await Applicant.create({
    name,
    email,
    phone,
    message,
    resume: result.secure_url,
    resumePublicId: result.public_id,
    vacancy: vacancyId,
  });

  res.status(201).json({ success: true, message: 'Application submitted successfully', applicant });
});

// @desc    Get all applicants (admin) - optional ?vacancy=id
// @route   GET /api/applicants
// @access  Private/Admin
const getApplicants = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.vacancy) query.vacancy = req.query.vacancy;
  if (req.query.status) query.status = req.query.status;

  const applicants = await Applicant.find(query).populate('vacancy', 'title slug').sort({ createdAt: -1 });
  res.json({ success: true, count: applicants.length, applicants });
});

// @desc    Update applicant status
// @route   PUT /api/applicants/:id/status
// @access  Private/Admin
const updateApplicantStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ['new', 'reviewed', 'shortlisted', 'rejected'];
  if (!allowed.includes(status)) {
    throw new ApiError(400, 'Invalid status value');
  }

  const applicant = await Applicant.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!applicant) throw new ApiError(404, 'Applicant not found');

  res.json({ success: true, message: 'Status updated', applicant });
});

// @desc    Delete applicant
// @route   DELETE /api/applicants/:id
// @access  Private/Admin
const deleteApplicant = asyncHandler(async (req, res) => {
  const applicant = await Applicant.findById(req.params.id);
  if (!applicant) throw new ApiError(404, 'Applicant not found');

  await deleteFromCloudinary(applicant.resumePublicId, 'raw');
  await applicant.deleteOne();

  res.json({ success: true, message: 'Applicant record deleted' });
});

module.exports = { applyToVacancy, getApplicants, updateApplicantStatus, deleteApplicant };