import express from 'express';
import sns from '../../config/aws.js';
import generateOTP from '../../utils/otpGenerator.js';
import TemporaryUser from '../models/temporaryModel.js';
import User from '../models/model.js';
import bcrypt from 'bcrypt';

const router = express.Router();

// User signup route
router.post('/signup', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || !/^\+91\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format. Use +91XXXXXXXXXX.' });
  }

  const otp = generateOTP();

  try {
    const params = {
      Message: `Your OTP code is: ${otp}`,
      PhoneNumber: phoneNumber,
    };

    await sns.publish(params).promise();

    // Save phoneNumber and OTP to temporaryUserData collection
    await TemporaryUser.findOneAndUpdate(
      { phoneNumber },
      { otp },
      { upsert: true, new: true } // Insert if not exist
    );

    console.log('OTP sent successfully');
    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Try again later.' });
  }
});

router.post('/verify', async (req, res) => {
  const { phoneNumber, otp, password } = req.body;

  if (!phoneNumber || !otp || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const tempUser = await TemporaryUser.findOne({ phoneNumber });

    if (!tempUser || tempUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP or phone number.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the Users collection
    await User.create({
      phoneNumber,
      rawPassword: password, // Save raw password
      hashedPassword,        // Save hashed password
    });

    // Delete tempUser data
    await TemporaryUser.deleteOne({ phoneNumber });

    res.status(200).json({ message: 'User verified and registered successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Verification failed. Try again later.' });
  }
});


export default router;
