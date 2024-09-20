const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// ... (previous routes remain the same)
router.use(auth);

// Create a new playlist
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const playlist = new Playlist({ name, user: req.userId });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(400).json({ message: 'Error creating playlist', error: error.message });
  }
});

// Get all playlists for the authenticated user
router.get('/', async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.userId });
    res.json(playlists);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching playlists', error: error.message });
  }
});
// Add a song to a playlist
router.post('/:playlistId/songs', [
  auth,
  body('songId').isMongoId().withMessage('Invalid song ID')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { playlistId } = req.params;
    const { songId } = req.body;

    const playlist = await Playlist.findOne({ _id: playlistId, user: req.userId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ message: 'Song already in playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    res.status(400).json({ message: 'Error adding song to playlist', error: error.message });
  }
});

// Remove a song from a playlist
router.delete('/:playlistId/songs/:songId', auth, async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await Playlist.findOne({ _id: playlistId, user: req.userId });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const songIndex = playlist.songs.indexOf(songId);
    if (songIndex === -1) {
      return res.status(400).json({ message: 'Song not in playlist' });
    }

    playlist.songs.splice(songIndex, 1);
    await playlist.save();

    res.json(playlist);
  } catch (error) {
    res.status(400).json({ message: 'Error removing song from playlist', error: error.message });
  }
});

module.exports = router;