const express = require('express');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const router = express.Router();

// Create a new playlist
router.post('/', async (req, res) => {
    const { name, user, desc, songs } = req.body;
    const playlist = new Playlist({ name, user, desc, songs });
    await playlist.save();
    res.status(201).json(playlist);
});

// Get all playlists for a user
router.get('/:userId', async (req, res) => {
    const playlists = await Playlist.find({ user: req.params.userId }).populate('songs');
    res.json(playlists);
});

module.exports = router;
