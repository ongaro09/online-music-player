const express = require('express');
const { searchTracks } = require('../services/soundcloud');
const router = express.Router();

// Search for songs route
router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).send('Query parameter is required');
    }
    
    try {
        const tracks = await searchTracks(query);
        res.json(tracks);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
