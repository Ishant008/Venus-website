const Vacancy = require('../models/Vacancy');

// Add a new vacancy
const addVacancy = async (req, res) => {
    const { title, description, tags, requirements } = req.body;

    const vacancy = new Vacancy({ title, description, tags, requirements });
    await vacancy.save();
    res.status(201).json(vacancy);
};

// Fetch all vacancies
const getAllVacancies = async (req, res) => {
    try {
        const vacancies = await Vacancy.find();
        res.json(vacancies);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Fetch a single vacancy by ID
const getVacancyById = async (req, res) => {
    try {
        const vacancy = await Vacancy.findById(req.params.id);
        if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' });
        res.json(vacancy);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a vacancy
const updateVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' });
        res.json(vacancy);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a vacancy
const deleteVacancy = async (req, res) => {
    try {
        const vacancy = await Vacancy.findByIdAndDelete(req.params.id);
        if (!vacancy) return res.status(404).json({ message: 'Vacancy not found' });
        res.json({ message: 'Vacancy deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addVacancy, getAllVacancies, getVacancyById, updateVacancy, deleteVacancy };
