const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const user = new User({ username, password }); // Make sure to hash the password in your model
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
});

// User login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Authenticate user logic here (validate username and password)
    const user = await User.findOne({ username }); // Example

    if (!user || !user.comparePassword(password)) { // Assuming you have a method to compare passwords
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ token });
});

module.exports = router;
