const axios = require('axios');

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

module.exports = { searchTracks, createPlaylist };
