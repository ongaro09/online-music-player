const axios = require('axios');

const SOUND_CLOUD_CLIENT_ID = process.env.SOUND_CLOUD_CLIENT_ID;

// Function to search for tracks on SoundCloud
async function searchTracks(query) {
    try {
        const response = await axios.get(`https://api.soundcloud.com/tracks?q=${query}&client_id=${SOUND_CLOUD_CLIENT_ID}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching tracks from SoundCloud');
    }
}

module.exports = { searchTracks };
