const express = require('express');
const jwtAuth = require('../middleware/jwtAuth'); // Import JWT middleware
const Playlist = require('../models/Playlist'); // Assuming you have a Playlist model
const router = express.Router();

// Create a new playlist
router.post('/', jwtAuth, async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id; // Get the user ID from the JWT

    if (!name) {
        return res.status(400).send('Playlist name is required');
    }

    try {
        const playlist = new Playlist({ name, userId });
        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get all playlists for the authenticated user
router.get('/', jwtAuth, async (req, res) => {
    const userId = req.user.id;

    try {
        const playlists = await Playlist.find({ userId });
        res.json(playlists);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
