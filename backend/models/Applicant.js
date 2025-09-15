const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone:{ type: Number, required: true },
    reason:{ type: String },
    resume:{ type: String, required: true }, // URL
    resumeFileId: { type: String }, // ImageKit file ID
    vacancy: { type: mongoose.Schema.Types.ObjectId, ref: 'Vacancy' },
    applicationDate: { type: Date, default: Date.now },
});

const Applicant = mongoose.model('Applicant', applicantSchema);
module.exports = Applicant;
