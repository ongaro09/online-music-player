const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const spotifyRoutes = require('./routes/spotify');
const userRoutes = require('./routes/users'); // Add users route
const playlistRoutes = require('./routes/playlists'); // Add playlists route
const songRoutes = require('./routes/songs'); // Add songs route
const jwtAuth = require('./middleware/jwtAuth'); // Import JWT middleware
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // Set up the port

app.use(express.json());
app.use(session({ secret: 'your_session_secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Set up your routes
app.use('/api/spotify', spotifyRoutes);
app.use('/api/users', userRoutes); // Add user routes
app.use('/api/playlists', jwtAuth, playlistRoutes); // Add playlists routes with JWT protection
app.use('/api/songs', jwtAuth, songRoutes); // Add songs routes with JWT protection

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Spotify authentication strategy
passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: process.env.SPOTIFY_REDIRECT_URI,
}, async (accessToken, refreshToken, expires_in, profile, done) => {
    // You can store the user in your database here
    done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
