import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'employee', 'jobseeker'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rawPassword: { 
    type: String 
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
