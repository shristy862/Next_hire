dotenv.config();
import dotenv from 'dotenv';

import User from '../models/model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const login = async (req, res) => {
  const { phoneNumber, password } = req.body;

  // Validate required fields
  if (!phoneNumber || !password) {
    return res.status(400).json({ message: 'Phone number and password are required.' });
  }

  try {
    // Find the user by phone number
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ message: 'User not found. Please sign up first.' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password. Please try again.' });
    }

    const token = jwt.sign(
      {
        phoneNumber: user.phoneNumber,
        role: user.role,
        source: 'login', 
        userId: user._id, 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
    
    // Send response with user role and welcome message
    res.status(200).json({
      message: `Welcome, ${user.role}!`,
      userId: user._id,  
      token: token, 
    });

  } catch (error) {
    console.error('Error:', error);

    // Send back the actual error in the response
    res.status(500).json({
      message: 'An error occurred during login.',
      error: error.message || 'Unknown error',
    });
  }
};
