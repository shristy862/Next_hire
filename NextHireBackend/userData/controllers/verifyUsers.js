import TemporaryUser from '../models/temporaryModel.js';
import User from '../models/model.js';
import bcrypt from 'bcrypt';

export const verify = async (req, res) => {
  const { phoneNumber, otp, password } = req.body;

  // Validate required fields
  if (!phoneNumber || !otp || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const tempUser = await TemporaryUser.findOne({ phoneNumber });

    if (!tempUser) {
      return res.status(400).json({ message: 'Temporary user not found. Please sign up first.' });
    }

    if (tempUser.otp !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Make sure 'role' exists before proceeding
    if (!tempUser.role) {
      return res.status(400).json({ message: 'Role is missing in temporary user data.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user using tempUser.role
    const newUser = new User({
      phoneNumber,
      rawPassword: password,
      hashedPassword,
      role: tempUser.role, // Use role from tempUser
    });

    await newUser.save();

    // Delete tempUser data
    await TemporaryUser.deleteOne({ phoneNumber });

    res.status(200).json({ message: 'User verified and registered successfully!' });
  } catch (error) {
    console.error('Error:', error);

    // Send back the actual error in the response
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', error: error.message });
    }

    res.status(500).json({
      message: 'An error occurred during verification.',
      error: error.message || 'Unknown error',
    });
  }
};

