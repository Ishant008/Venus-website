const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, maxlength: 1000 },
    resume: { type: String, required: true }, // Cloudinary URL
    resumePublicId: { type: String, required: true },
    vacancy: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy', required: true },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'shortlisted', 'rejected'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Applicant', applicantSchema);
