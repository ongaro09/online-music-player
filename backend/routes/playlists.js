// routes/playlist.js
const express = require("express");
const Playlist = require("../models/Playlist");

const router = express.Router();

// Create a new playlist
router.post("/", async (req, res) => {
    const { name, user, desc, songs } = req.body;

    try {
        const playlist = new Playlist({ name, user, desc, songs });
        await playlist.save();
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ message: "Error creating playlist.", error });
    }
});

// Get all playlists for a user
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const playlists = await Playlist.find({ user: userId }).populate("songs");
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: "Error fetching playlists.", error });
    }
});

module.exports = router;
