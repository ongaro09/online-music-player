const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    desc: { type: String },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
    img: { type: String }, // Optional: URL to the playlist image
}, {
    timestamps: true,
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
