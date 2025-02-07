const jwt = require('jsonwebtoken');

const protect = (roles) => {
  return (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.headers['authorization']?.split(' ')[1];

    // If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      // Verify the token and decode it
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // Check if the user's role is included in the allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      // Continue to the next middleware or route handler
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token is invalid or expired' });
    }
  };
};

module.exports = protect;
