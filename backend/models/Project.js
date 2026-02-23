const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // mural, ads, portrait, mosaic
    description: { type: String },
    images: [{ type: String }], // Array of Cloudinary URLs
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);
