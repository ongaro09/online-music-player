const express = require('express');
const Track = require('../models/Track');
const router = express.Router();

// Create a new track
router.post('/', async (req, res) => {
    const { title, artist, album, genre, audioUrl } = req.body;
    const track = new Track({ title, artist, album, genre, audioUrl });
    await track.save();
    res.status(201).json(track);
});

// Get all tracks
router.get('/', async (req, res) => {
    const tracks = await Track.find();
    res.json(tracks);
});

module.exports = router;
