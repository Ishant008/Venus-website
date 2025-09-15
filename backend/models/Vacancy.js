const mongoose = require('mongoose');

const vacancySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: Array, required: true },
    requirements: { type: Array, required: true },
});

const Vacancy = mongoose.model('Vacancy', vacancySchema);
module.exports = Vacancy;
