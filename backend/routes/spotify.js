const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const jwtAuth = require('../middleware/jwtAuth');
const router = express.Router();

// Start Spotify authentication
router.get('/login', passport.authenticate('spotify', {
    scope: ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private'],
}));

// Callback after Spotify has authenticated the user
router.get('/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
    const token = jwt.sign({ id: req.user.id, accessToken: req.user.accessToken }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    res.redirect(`http://localhost:3000?token=${token}`);
});

// Logout route
router.get('/logout', jwtAuth, (req, res) => {
    req.logout();
    res.redirect('/');
});

// Search for songs or albums
router.get('/search', jwtAuth, async (req, res) => {
    const { query, type } = req.query;

    if (!['track', 'album'].includes(type)) {
        return res.status(400).json({ message: 'Invalid search type. Use "track" or "album".' });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}`, {
            headers: {
                'Authorization': `Bearer ${req.user.accessToken}`,
            }
        });

        const data = await response.json();
        console.log(data); // Log the response for debugging

        if (type === 'track' && data.tracks && data.tracks.items) {
            const songs = data.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                album: track.album.name,
            }));
            return res.json(songs);
        }

        if (type === 'album' && data.albums && data.albums.items) {
            const albums = data.albums.items.map(album => ({
                id: album.id,
                name: album.name,
                artist: album.artists.map(artist => artist.name).join(', '),
                releaseDate: album.release_date,
                totalTracks: album.total_tracks,
            }));
            return res.json(albums);
        }

        res.status(404).json({ message: 'No results found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching for items', error });
    }
});

// Get album details by IDs
router.get('/albums', jwtAuth, async (req, res) => {
    const { ids } = req.query; // Get the comma-separated album IDs

    if (!ids) {
        return res.status(400).json({ message: 'Album IDs are required.' });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/albums?ids=${encodeURIComponent(ids)}`, {
            headers: {
                'Authorization': `Bearer ${req.user.accessToken}`,
            }
        });

        const data = await response.json();
        console.log(data); // Log the response for debugging

        if (data.albums) {
            return res.json(data.albums);
        }

        res.status(404).json({ message: 'No albums found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching album details', error });
    }
});

module.exports = router;
