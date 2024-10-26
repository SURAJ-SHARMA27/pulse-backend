const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://surajrace21:VCD6JP1xl1PTSErK@users.4hdqv.mongodb.net/?retryWrites=true&w=majority&appName=users', {
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Routes
app.use('/api/user', userRoutes);

// Health check
app.get('/api/health-check', (req, res) => {
  res.status(200).json({ message: 'Alright, everything is good!' });
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Alright, everything is good!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
