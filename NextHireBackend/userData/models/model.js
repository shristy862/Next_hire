import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  rawPassword: { type: String, required: true }, // Save raw password
  hashedPassword: { type: String, required: true }, // Save hashed password
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
