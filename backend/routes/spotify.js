const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const jwtAuth = require('../middleware/jwtAuth');
const Album = require('../models/Album'); // Import the Album model
const router = express.Router();

// Function to search for tracks
async function searchTracks(accessToken, query) {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            params: {
                q: query,
                type: 'track',
            },
        });
        return response.data.tracks.items;
    } catch (error) {
        console.error('Error searching tracks:', error);
        throw new Error('Could not search for tracks.');
    }
}

// Function to create a playlist
async function createPlaylist(accessToken, userId, name) {
    try {
        const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            name: name,
            public: true,
        }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating playlist:', error);
        throw new Error('Could not create playlist.');
    }
}

// Endpoint to fetch and store albums
router.post('/store-albums', jwtAuth, async (req, res) => {
    const { ids } = req.body; // Expecting an array of album IDs

    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: 'Please provide an array of album IDs.' });
    }

    try {
        const response = await axios.get(`https://api.spotify.com/v1/albums?ids=${ids.join(',')}`, {
            headers: {
                'Authorization': `Bearer ${req.user.accessToken}`,
            }
        });

        const data = response.data;

        if (!data.albums || data.albums.length === 0) {
            return res.status(404).json({ message: 'No albums found.' });
        }

        const albumsToStore = data.albums.map(album => ({
            id: album.id,
            name: album.name,
            artist: album.artists.map(artist => artist.name).join(', '),
            releaseDate: album.release_date,
            totalTracks: album.total_tracks,
            images: album.images,
        }));

        // Store albums in MongoDB
        await Album.insertMany(albumsToStore, { ordered: false }); // 'ordered: false' allows for partial success

        res.status(201).json({ message: 'Albums stored successfully.', albums: albumsToStore });
    } catch (error) {
        console.error('Error fetching or storing albums:', error);
        res.status(500).json({ message: 'Error fetching or storing albums.', error });
    }
});

// Endpoint to search for tracks
router.get('/search-tracks', jwtAuth, async (req, res) => {
    const { query } = req.query; // Get query from URL parameters

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required.' });
    }

    try {
        const tracks = await searchTracks(req.user.accessToken, query);
        res.status(200).json(tracks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Endpoint to create a playlist
router.post('/create-playlist', jwtAuth, async (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ message: 'Playlist name is required.' });
    }

    try {
        const playlist = await createPlaylist(req.user.accessToken, req.user.id, name);
        res.status(201).json(playlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Export the router
module.exports = router;
