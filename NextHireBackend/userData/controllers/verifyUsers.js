import TemporaryUser from '../models/temporaryModel.js';
import User from '../models/model.js';

export const verify = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Validate required fields
  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required.' });
  }

  try {
    const tempUser = await TemporaryUser.findOne({ phoneNumber });

    if (!tempUser) {
      return res.status(400).json({ message: 'Temporary user not found. Please sign up first.' });
    }

    // Check if OTP is expired (5 minutes)
    const currentTime = Date.now();
    const otpExpirationTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (currentTime - tempUser.createdAt > otpExpirationTime) {
      return res.status(400).json({
        message: 'OTP has expired. Please request a new OTP.',
      });
    }

    // Check if OTP matches
    if (tempUser.otp !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // Make sure 'role' exists before proceeding
    if (!tempUser.role) {
      return res.status(400).json({ message: 'Role is missing in temporary user data.' });
    }

    // Create new user with both rawPassword and hashedPassword
    const newUser = new User({
      phoneNumber,
      rawPassword: tempUser.rawPassword, // Save the raw password (not recommended)
      hashedPassword: tempUser.hashedPassword, // Save the hashed password
      role: tempUser.role,
    });

    await newUser.save();

    // Delete temporary user data
    await TemporaryUser.deleteOne({ phoneNumber });

    res.status(200).json({ message: 'User verified and registered successfully!' });
  } catch (error) {
    console.error('Error:', error);

    // Send back the actual error in the response
    res.status(500).json({
      message: 'An error occurred during verification.',
      error: error.message || 'Unknown error',
    });
  }
};