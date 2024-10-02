const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken'); // Ensure jwt is imported
const fetch = require('node-fetch'); // Import node-fetch for API requests
const jwtAuth = require('../middleware/jwtAuth'); // Import JWT middleware
const router = express.Router();

// Start Spotify authentication
router.get('/login', passport.authenticate('spotify', {
    scope: ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private'],
}));

// Callback after Spotify has authenticated the user
router.get('/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication, create a JWT token and redirect to the frontend
    const token = jwt.sign({ id: req.user.id, accessToken: req.user.accessToken }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    
    res.redirect(`http://localhost:3000?token=${token}`); // frontend is served on port 3000
});

// Logout route
router.get('/logout', jwtAuth, (req, res) => {
    req.logout();
    res.redirect('/');
});

// Search for songs or albums
router.get('/search', jwtAuth, async (req, res) => {
    const { query, type } = req.query; // Get the query and type parameters

    // Ensure type is either 'track' or 'album'
    if (!['track', 'album'].includes(type)) {
        return res.status(400).json({ message: 'Invalid search type. Use "track" or "album".' });
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}`, {
            headers: {
                'Authorization': `Bearer ${req.user.accessToken}`, // Use the user's access token
            }
        });

        const data = await response.json();

        if (type === 'track' && data.tracks && data.tracks.items) {
            const songs = data.tracks.items.map(track => ({
                id: track.id, // Spotify song ID
                name: track.name,
                artist: track.artists.map(artist => artist.name).join(', '),
                album: track.album.name,
            }));
            return res.json(songs);
        }

        if (type === 'album' && data.albums && data.albums.items) {
            const albums = data.albums.items.map(album => ({
                id: album.id, // Spotify album ID
                name: album.name,
                artist: album.artists.map(artist => artist.name).join(', '),
                releaseDate: album.release_date,
                totalTracks: album.total_tracks,
            }));
            return res.json(albums);
        }

        res.status(404).json({ message: 'No results found' });
    } catch (error) {
        res.status(500).json({ message: 'Error searching for items', error });
    }
});

module.exports = router;
