import sns from '../../config/aws.js';
import generateOTP from '../../utils/otpGenerator.js';
import TemporaryUser from '../models/temporaryModel.js';
import User from '../models/model.js'; 
import bcrypt from 'bcrypt';
// Send OTP for password reset
export const sendForgotPasswordOTP = async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || !/^\+91\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format. Use +91XXXXXXXXXX.' });
  }

  const otp = generateOTP();

  try {
    const params = {
      Message: `Your OTP for password reset is: ${otp}`,
      PhoneNumber: phoneNumber,
    };

    await sns.publish(params).promise();

    // Save phoneNumber and OTP to TemporaryUser collection
    await TemporaryUser.findOneAndUpdate(
      { phoneNumber },
      { otp },
      { upsert: true, new: true }
    );

    console.log('OTP sent successfully for password reset');
    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Try again later.' });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { phoneNumber, otp, password } = req.body;

  if (!phoneNumber || !otp || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const tempUser = await TemporaryUser.findOne({ phoneNumber });

    // Check if the OTP matches the one stored in TemporaryUser collection
    if (!tempUser || tempUser.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP or phone number.' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the hashed password to the User collection
    const updateResult = await User.updateOne(
      { phoneNumber },
      { rawPassword: password, hashedPassword }
    );

    // If no document is modified, return an error
    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ message: 'Failed to update password. User not found.' });
    }

    // Delete temporary user data
    await TemporaryUser.deleteOne({ phoneNumber });

    res.status(200).json({ message: 'Password reset successfully!' });
  } catch (error) {
    console.error('Error:', error); // Log the full error for debugging
    res.status(500).json({ message: `Password reset failed. Try again later. Error: ${error.message}` });
  }
};

export default { sendForgotPasswordOTP, resetPassword };