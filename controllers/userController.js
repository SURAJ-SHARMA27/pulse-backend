const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

          
const JWT_SECRET = 'your_jwt_secret';  
// Signup controller
const signup = async (req, res) => {
  const { email, password ,firstName,lastName } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {``
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create a new user
    const newUser = new User({ email, password: hashedPassword, favtTracks: [],firstName,lastName });
    await newUser.save();

    res.status(200).json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if the user exists and if the password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      JWT_SECRET,
      { expiresIn: '30d' } 
    );
    
    res.status(200).json({ 
      message: 'Login successful', 
      token, 
      firstName: user.firstName // Include firstName in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Save favorite track controller (protected route)
const saveTrack = async (req, res) => {
  const { title, description, year, url, mpUrl, id } = req.body;
  console.log(req.body, "here is body");
  
  const userId = req.user.userId; // Extracted from JWT in auth middleware

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if track with the given id already exists in favtTracks
    const trackIndex = user.favtTracks.findIndex(track => track.id === id);

    if (trackIndex !== -1) {
      // Track exists, remove it
      user.favtTracks.splice(trackIndex, 1);
      await user.save();
      return res.status(200).json({ message: 'Track removed from favorites successfully', favtTracks: user.favtTracks });
    } else {
      // Track does not exist, add it
      user.favtTracks.push({ title, description, year, url, mpUrl, id });
      await user.save();
      return res.status(200).json({ message: 'Track added to favorites successfully', favtTracks: user.favtTracks });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getFavoriteTracks = async (req, res) => {
  const userId = req.user.userId;  // Extracted from JWT in auth middleware

  try {
    // Find the user by ID
    const user = await User.findById(userId); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user's favorite tracks
    res.status(200).json({ favtTracks: user.favtTracks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports = {
  signup,
  login,
  saveTrack,
  getFavoriteTracks
};
