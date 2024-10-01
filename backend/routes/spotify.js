const express = require('express');
const passport = require('passport');
const router = express.Router();

// Start the authentication process
router.get('/login', passport.authenticate('spotify', {
    scope: ['user-read-private', 'user-read-email', 'playlist-modify-public', 'playlist-modify-private'],
}));

// Callback after Spotify has authenticated the user
router.get('/callback', passport.authenticate('spotify', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication, redirect to home.
    res.redirect('/'); // Redirect to a home page or your frontend
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
