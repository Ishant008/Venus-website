const mongoose = require('mongoose');
const slugify = require('slugify');

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 200 },
    slug: { type: String, unique: true, index: true },
    summary: { type: String, required: [true, 'Short summary is required'], maxlength: 300 },
    body: { type: String, required: [true, 'Body content is required'] }, // rich HTML/markdown
    coverImage: {
      url: { type: String },
      publicId: { type: String },
    },
    category: {
      type: String,
      enum: ['Company News', 'Product Update', 'Press Release', 'Event', 'General'],
      default: 'General',
    },
    tags: [{ type: String, trim: true }],
    publishDate: { type: Date, required: true, default: Date.now, index: true },
    isPublished: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false }, // fallback "evergreen" fact/news item
    views: { type: Number, default: 0 },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      ogImage: { type: String },
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

newsSchema.index({ title: 'text', summary: 'text', body: 'text', tags: 'text' });
newsSchema.index({ publishDate: -1, isPublished: 1 });

newsSchema.pre('validate', function (next) {
  if (this.title && (this.isNew || this.isModified('title') || !this.slug)) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(2, 7);
  }
  next();
});

module.exports = mongoose.model('News', newsSchema);
