const express = require('express');
const { searchTracks, createPlaylist } = require('../services/spotify');
const jwtAuth = require('../middleware/jwtAuth'); // Import JWT middleware
const router = express.Router();

// Search for songs
router.get('/search', jwtAuth, async (req, res) => {
    const { query } = req.query;
    const accessToken = req.user.accessToken; // Assuming accessToken is stored in the JWT

    if (!query) {
        return res.status(400).send('Query parameter is required');
    }

    try {
        const tracks = await searchTracks(accessToken, query);
        res.json(tracks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Create a new playlist on Spotify
router.post('/playlists', jwtAuth, async (req, res) => {
    const { name } = req.body;
    const accessToken = req.user.accessToken; // Get the user's access token
    const userId = req.user.id; // Get the user ID

    if (!name || !accessToken || !userId) {
        return res.status(400).send('Missing required fields or not authenticated');
    }

    try {
        const playlist = await createPlaylist(accessToken, userId, name);
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
