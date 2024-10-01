const express = require('express');
const { searchTracks, createPlaylist } = require('../services/spotify');
const router = express.Router();

// Search for songs route
router.get('/search', async (req, res) => {
    const { query } = req.query;
    const accessToken = req.user?.accessToken; // Assuming you stored the access token in the user session
    if (!query || !accessToken) {
        return res.status(400).send('Query parameter is required or not authenticated');
    }

    try {
        const tracks = await searchTracks(accessToken, query);
        res.json(tracks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Create a new playlist route
router.post('/playlists', async (req, res) => {
    const { name } = req.body;
    const accessToken = req.user?.accessToken; // Get the user's access token
    const userId = req.user?.id; // Assuming you stored the user ID in the user session

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
