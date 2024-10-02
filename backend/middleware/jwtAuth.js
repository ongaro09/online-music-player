const jwt = require('jsonwebtoken');

function jwtAuth(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; //  the token is sent as "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        // If the token is valid, save the decoded information to the request
        req.user = decoded;
        next(); // Proceed to the next middleware/route
    });
}

module.exports = jwtAuth;
