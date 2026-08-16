const mongoose = require('mongoose');
const slugify = require('slugify');

const vacancySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Job title is required'], trim: true },
    slug: { type: String, unique: true, index: true },
    department: { type: String, trim: true },
    location: { type: String, trim: true, default: 'India' },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    description: { type: String, required: [true, 'Description is required'] },
    tags: [{ type: String, trim: true }],
    requirements: [{ type: String, trim: true }],
    experience: { type: String, default: 'Not specified' },
    isOpen: { type: Boolean, default: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

vacancySchema.pre('validate', function (next) {
  if (this.title && (this.isNew || this.isModified('title') || !this.slug)) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(2, 7);
  }
  next();
});

module.exports = mongoose.model('Vacancy', vacancySchema);
