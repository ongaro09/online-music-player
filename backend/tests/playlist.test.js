const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server'); // Ensure this exports your Express app
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Song = require('../models/Song');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}, 10000); // Increase timeout to 10 seconds

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Playlist Routes', () => {
  let token;
  let user;
  let playlist;
  let song;

  beforeEach(async () => {
    await User.deleteMany({});
    await Playlist.deleteMany({});
    await Song.deleteMany({});

    user = await User.create({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    token = user.generateAuthToken();
    playlist = await Playlist.create({ name: 'Test Playlist', user: user._id });
    song = await Song.create({ title: 'Test Song', artist: 'Test Artist', url: 'http://example.com/song.mp3' });
  });

  describe('POST /api/playlists', () => {
    it('should create a new playlist', async () => {
      const res = await request(app)
        .post('/api/playlists')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Playlist' });

      expect(res.statusCode).toBe(201);
      expect(res.body.name).toBe('New Playlist');
      expect(res.body.user.toString()).toBe(user._id.toString());
    });
  });

  describe('POST /api/playlists/:playlistId/songs', () => {
    it('should add a song to the playlist', async () => {
      const res = await request(app)
        .post(`/api/playlists/${playlist._id}/songs`)
        .set('Authorization', `Bearer ${token}`)
        .send({ songId: song._id });

      expect(res.statusCode).toBe(200);
      expect(res.body.songs).toContain(song._id.toString());
    });
  });

  // Add more test cases for other routes
});
