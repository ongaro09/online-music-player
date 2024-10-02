// routes/track.js
const express = require("express");
const Track = require("../models/Track");
const upload = require("../middleware/upload");

const router = express.Router();

// Create a new track
router.post("/", upload.single("audio"), async (req, res) => {
    const { title, artist, album, genre } = req.body;
    const audioUrl = req.file.path; // Path to the uploaded file

    try {
        const track = new Track({ title, artist, album, genre, audioUrl });
        await track.save();
        res.status(201).json(track);
    } catch (error) {
        res.status(500).json({ message: "Error creating track.", error });
    }
});

// Get all tracks
router.get("/", async (req, res) => {
    try {
        const tracks = await Track.find();
        res.status(200).json(tracks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tracks.", error });
    }
});

module.exports = router;
