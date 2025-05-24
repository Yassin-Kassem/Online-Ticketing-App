const jwt = require('jsonwebtoken');


// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt; // Get token from cookie
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user ID to request
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};