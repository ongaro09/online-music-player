const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    audioUrl: { type: String, required: true }, // URL of the uploaded audio file
    genre: { type: String },
    duration: { type: Number }, // Duration in seconds
}, {
    timestamps: true,
});

const Track = mongoose.model('Track', trackSchema);

module.exports = Track;
