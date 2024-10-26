const express = require('express');
const { signup, login, saveTrack, getFavoriteTracks } = require('../controllers/userController');
const authMiddleware = require('../middleware/authmiddleware');  // Import the auth middleware

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route (user must be logged in)
router.post('/save-track', authMiddleware, saveTrack);
router.get('/favtList', authMiddleware, getFavoriteTracks);


module.exports = router;
