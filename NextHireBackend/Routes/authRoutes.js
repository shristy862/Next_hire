import express from 'express';
import sns from '../config/aws.js';
import generateOTP from '../utils/otpGenerator.js';

const router = express.Router();

// User signup route
router.post('/signup', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || !/^\+91\d{10}$/.test(phoneNumber)) {
    return res
      .status(400)
      .json({ message: 'Invalid phone number format. Use +91XXXXXXXXXX.' });
  }

  const otp = generateOTP();

  const params = {
    Message: `Your OTP code is: ${otp}`,
    PhoneNumber: phoneNumber,
  };

  try {
    const data = await sns.publish(params).promise();
    console.log('SMS sent successfully:', data);
    res.status(200).json({ message: 'OTP sent successfully!', otp });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ message: 'Failed to send OTP. Try again later.' });
  }
});

export default router;
