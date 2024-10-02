const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    artist: { type: String, required: true },
    releaseDate: { type: String },
    totalTracks: { type: Number },
    images: [
        {
            url: { type: String },
            height: { type: Number },
            width: { type: Number }
        }
    ]
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
