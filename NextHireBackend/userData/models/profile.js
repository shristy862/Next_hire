import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  whatsappNumber: { 
    type: String, 
    required: true 
  },
  profilePhoto: { 
    type: String 
  },
  cv: { 
    type: String 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

const Profile = mongoose.model('Profile', ProfileSchema);

export default Profile;
