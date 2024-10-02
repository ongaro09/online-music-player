const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const jwtAuth = require('../middleware/jwtAuth');
const Album = require('../models/Album'); // Import the Album model
const router = express.Router();

// Function to search for tracks
async function searchTracks(accessToken, query) {
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
}

// Function to create a playlist
async function createPlaylist(accessToken, userId, name) {
    const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        name: name,
        public: true,
    }, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    return response.data;
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
            images: album.images
        }));

        // Store albums in MongoDB
        await Album.insertMany(albumsToStore, { ordered: false }); // 'ordered: false' allows for partial success

        res.status(201).json({ message: 'Albums stored successfully.', albums: albumsToStore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching or storing albums.', error });
    }
});

// Export functions and router
module.exports = { searchTracks, createPlaylist, router };
