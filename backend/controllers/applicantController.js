const Applicant = require('../models/Applicant');
const multer = require('multer');
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('resume');

// Fetch all applicants
const getAllApplicants = async (req, res) => {
    try {
        const applicants = await Applicant.find().populate('vacancy');
        res.json(applicants);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch single applicant by ID
const getApplicantById = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.id).populate('vacancy');
        if (!applicant) return res.status(404).json({ message: 'Applicant not found' });
        res.json(applicant);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Add new applicant
const addApplicant = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ message: 'File upload failed' });

        const { name, email, phone, reason, vacancyId } = req.body;

        if (!req.file) return res.status(400).json({ message: 'Resume PDF is required' });
        if (req.file.mimetype !== "application/pdf") return res.status(400).json({ message: 'Only PDF files are allowed' });

        try {
            // Upload to ImageKit
            const uploaded = await imagekit.upload({
                file: req.file.buffer,
                fileName: `${Date.now()}_${req.file.originalname}`,
                folder: "/resumes",
                useUniqueFileName: true
            });

            const applicant = new Applicant({
                name,
                email,
                phone,
                reason: reason || undefined,
                resume: uploaded.url,
                resumeFileId: uploaded.fileId,
                vacancy: vacancyId
            });

            await applicant.save();
            res.status(201).json(applicant);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    });
};

// Delete applicant and resume from ImageKit
const deleteApplicant = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.id);
        if (!applicant) return res.status(404).json({ message: 'Applicant not found' });

        // Delete resume from ImageKit if exists
        if (applicant.resumeFileId) {
            await imagekit.deleteFile(applicant.resumeFileId);
        }

        await applicant.deleteOne();
        res.json({ message: 'Applicant deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllApplicants, getApplicantById, addApplicant, deleteApplicant, upload };
