import sns from '../../config/awsSNS.js';
import TemporaryUser from '../models/temporaryModel.js';
import generateOTP from '../../utils/otpGenerator.js';
import bcryptjs from 'bcryptjs';

export const resendOtp = async (req, res) => {
  const { phoneNumber, role, password } = req.body;

  // Validate input
  if (!phoneNumber || !/^\+91\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format. Use +91XXXXXXXXXX.' });
  }
  if (!role || !['admin', 'employee', 'jobseeker'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be admin, employee, or jobseeker.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: 'Password is required and must be at least 6 characters long.',
    });
  }

  try {
    // Check if the user exists in TemporaryUser
    let tempUser = await TemporaryUser.findOne({ phoneNumber });

    if (!tempUser) {
      // If user doesn't exist, create a new TemporaryUser entry
      const hashedPassword = await bcryptjs.hash(password, 10);
      const otp = generateOTP();

      tempUser = new TemporaryUser({
        phoneNumber,
        role,
        otp,
        rawPassword: password,
        hashedPassword,
        createdAt: Date.now(),
      });

      await tempUser.save();
    } else {
      // If user exists, update OTP and timestamp
      tempUser.otp = generateOTP();
      tempUser.createdAt = Date.now();
      await tempUser.save();
    }

    // Send OTP using AWS SNS
    const params = {
      Message: `${tempUser.otp} is your one-time password (OTP). It is valid for the next 5 minutes. Do not share this with anyone. Regards, Team NextHireLtd.`,
      PhoneNumber: phoneNumber,
    };

    await sns.publish(params).promise();

    console.log(`OTP sent successfully to ${phoneNumber}: ${tempUser.otp}`);
    res.status(200).json({
      message: 'OTP has been sent successfully!',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'An error occurred while processing your request.',
      error: error.message || 'Unknown error',
    });
  }
};
