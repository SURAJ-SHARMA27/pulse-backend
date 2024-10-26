const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';  // Ensure this matches the secret used for signing tokens

// Middleware to check if the user is authenticated
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log(authHeader, "here is the full Authorization header");

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Extract the token by removing 'Bearer ' from the header
  const token = authHeader.split(' ')[1];
  console.log(token, "here is the extracted token");

  try {
    // Verify the token using the secret
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded, "here is the decoded token");  // Log the decoded token for debugging

    // Attach user info (email, userId) to the request object
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error, "Error verifying token");  // Log the error for debugging
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
