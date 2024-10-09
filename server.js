const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS package

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://surajrace21:VCD6JP1xl1PTSErK@users.4hdqv.mongodb.net/?retryWrites=true&w=majority&appName=users', {
})
.then(() => {
  console.log('MongoDB connected successfully'); // Log if connection is successful
})
.catch((error) => {
  console.error('MongoDB connection error:', error); // Log if there's an error
});

// Define a Schema
const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

// Create a Model
const Email = mongoose.model('Email', emailSchema);

// API Endpoint to join the waitlist
app.post('/api/join-waitlist', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is already registered
    const existingEmail = await Email.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Save the new email to the database
    const newEmail = new Email({ email });
    await newEmail.save();

    res.status(200).json({ message: 'Successfully registered for waitlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check API
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ message: 'Alright, everything is good!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
