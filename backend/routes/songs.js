const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// Create a new song
router.post('/', async (req, res) => {
  try {
    const { title, artist, album, duration, url } = req.body;
    const song = new Song({ title, artist, album, duration, url });
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ message: 'Error creating song', error: error.message });
  }
});

// Get all songs
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching songs', error: error.message });
  }
});

// Get a specific song
router.get('/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching song', error: error.message });
  }
});

// Update a song
router.put('/:id', async (req, res) => {
  try {
    const { title, artist, album, duration, url } = req.body;
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      { title, artist, album, duration, url },
      { new: true }
    );
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(400).json({ message: 'Error updating song', error: error.message });
  }
});

// Delete a song
router.delete('/:id', async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting song', error: error.message });
  }
});

module.exports = router;