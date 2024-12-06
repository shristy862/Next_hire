import mongoose from 'mongoose';

const tempUserSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  role: { type: String, required: true },  
  createdAt: { type: Date, default: Date.now, expires: 300 }, 
});

const TemporaryUser = mongoose.model('TemporaryUser', tempUserSchema);

export default TemporaryUser;
