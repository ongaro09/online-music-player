const axios = require('axios');

const API_KEY = process.env.LASTFM_API_KEY;
const BASE_URL = 'http://ws.audioscrobbler.com/2.0/';

async function searchTracks(query, limit = 10) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        method: 'track.search',
        track: query,
        api_key: API_KEY,
        format: 'json',
        limit
      }
    });
    return response.data.results.trackmatches.track;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
}

async function getTrackInfo(artist, track) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        method: 'track.getInfo',
        artist,
        track,
        api_key: API_KEY,
        format: 'json'
      }
    });
    return response.data.track;
  } catch (error) {
    console.error('Error getting track info:', error);
    throw error;
  }
}

module.exports = { searchTracks, getTrackInfo };