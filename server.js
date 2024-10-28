const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const nodemailer = require("nodemailer");
const User = require('./models/userModel');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');          
const JWT_SECRET = 'your_jwt_secret'; 
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

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

const transporter = nodemailer.createTransport({
  service:"gmail",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: "surajofficial2704@gmail.com",
    pass: "pddqjfbqkhyjkcts",
  },
});
app.post("/forgetpassword", async (req, res) => {
  const { email } = req.body;
console.log(email,"here is email")

  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist" });
    }
    const resetToken = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '15m' } // Set a short expiration time
    );
    console.log(resetToken,"here is resetToken")
    const info = await transporter.sendMail({
      from: '"Vibe AI support" <surajofficial2704@gmail.com>', // sender address
      to: email, // receiver address
      subject: "Password Reset", // Subject line
      text: `Click the link to reset your password: http://localhost:3000/forgotpassword/${resetToken}`, // plain text body
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h3>Hello,</h3>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <a href="http://localhost:3000/forgotpassword/${resetToken}" style="color: #3B30C8; text-decoration: none;">
          <strong>Reset Your Password</strong>
        </a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>AI Support Team</p>
      </div>
    `,    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.post("/resetpassword", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId, email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in /resetpassword:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ _id: decoded.userId, email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error in /resetpassword:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Alright, everything is good!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
