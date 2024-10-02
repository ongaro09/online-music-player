const express = require('express');
const passport = require('passport');
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

module.exports = router;
