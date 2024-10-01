const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    songs: [{ type: String }], // Store SoundCloud song IDs or URLs
}, {
    timestamps: true,
});

module.exports = mongoose.model('Playlist', playlistSchema);
