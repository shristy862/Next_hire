import sns from '../../config/aws.js';
import TemporaryUser from '../models/temporaryModel.js';
import generateOTP from '../../utils/otpGenerator.js';
import User from '../models/model.js';

export const signup = async (req, res) => {
  const { phoneNumber, role } = req.body;

  if (!phoneNumber || !/^\+91\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format. Use +91XXXXXXXXXX.' });
  }

  const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({
        message: 'This phone number is already associated with an account. Please log in.',
      });
    }

  if (!role || !['admin', 'employee', 'jobseeker'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be admin, employee, or jobseeker.' });
  }

  const otp = generateOTP();

  try {
    const params = {
      Message: `Your OTP code is: ${otp}`,
      PhoneNumber: phoneNumber,
    };

    await sns.publish(params).promise();

    // Save phoneNumber, OTP, and role to TemporaryUser collection
    await TemporaryUser.findOneAndUpdate(
      { phoneNumber },
      { otp, role },
      { upsert: true, new: true }
    );

    console.log('OTP sent successfully');
    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Try again later.' });
  }
};
