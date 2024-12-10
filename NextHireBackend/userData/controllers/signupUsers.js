import sns from '../../config/awsSNS.js';
import TemporaryUser from '../models/temporaryModel.js';
import generateOTP from '../../utils/otpGenerator.js';
import User from '../models/model.js';
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
  const { phoneNumber, role, password } = req.body;

  // Validate phone number
  if (!phoneNumber || !/^\+91\d{10}$/.test(phoneNumber)) {
    return res.status(400).json({ message: 'Invalid phone number format. Use +91XXXXXXXXXX.' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ phoneNumber });
  if (existingUser) {
    return res.status(400).json({
      message: 'This phone number is already associated with an account. Please log in or try with another number',
    });
  }

  // Validate role
  if (!role || !['admin', 'employee', 'jobseeker'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be admin, employee, or jobseeker.' });
  }

  // Validate password
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: 'Password is required and must be at least 6 characters long.',
    });
  }

  const otp = generateOTP();

  try {
    // Hash the password for storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Send OTP using AWS SNS
    const params = {
      Message: `${otp} is your one time password (OTP) , It is valid for next 5 minutes , Do not share this with anyother ,  regard Team NextHireLtd `,
      PhoneNumber: phoneNumber,
    };

    await sns.publish(params).promise();

    // Save data to TemporaryUser collection
    const newUser = new TemporaryUser({
      phoneNumber,
      otp,
      role,
      rawPassword: password,  // Save the raw password here
      hashedPassword,         // Save the hashed password here
    });

     // Save the new user instance
     const savedUser = await newUser.save();

     console.log('Saved User:', savedUser);  

    console.log('OTP sent successfully');
    res.status(200).json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to send OTP. Try again later.' });
  }
};