import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'employee', 'jobseeker'],
  },
  rawPassword: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the OTP generation time
  },
});

const TemporaryUser = mongoose.model('TemporaryUser', tempUserSchema);

export default TemporaryUser;
