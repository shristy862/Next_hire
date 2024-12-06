import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  rawPassword: {
    type: String,
    required: true,
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
});

const User = mongoose.model('User', UserSchema);

export default User;
