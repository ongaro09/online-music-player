const express = require('express');
const Playlist = require('../models/Playlist');
const router = express.Router();

// Create a new playlist
router.post('/', async (req, res) => {
    const { userId, name, songs } = req.body;

    const playlist = new Playlist({
        userId,
        name,
        songs,
    });

    try {
        const savedPlaylist = await playlist.save();
        res.status(201).json(savedPlaylist);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get playlists by userId
router.get('/:userId', async (req, res) => {
    try {
        const playlists = await Playlist.find({ userId: req.params.userId });
        res.json(playlists);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Add songs to a playlist
router.put('/:id', async (req, res) => {
    try {
        const updatedPlaylist = await Playlist.findByIdAndUpdate(req.params.id, {
            $addToSet: { songs: req.body.songId },
        }, { new: true });
        res.json(updatedPlaylist);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a playlist
router.delete('/:id', async (req, res) => {
    try {
        await Playlist.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
