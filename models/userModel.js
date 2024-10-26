const mongoose = require('mongoose');

// Define the Track Schema for favorite tracks
const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: String, required: true },
  url: { type: String, required: true },
  mpUrl: { type: String, required: true },
  id: { type: String, required: true },  // If id is expected to be unique for each track
});

// Define the User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: false },
  favtTracks: [trackSchema],  // Array of track objects
});

// Create the User Model
const User = mongoose.model('User', userSchema);

module.exports = User;
