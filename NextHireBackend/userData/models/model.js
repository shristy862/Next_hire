import mongoose from 'mongoose';

// Education Schema (Embedded Document)
const EducationSchema = new mongoose.Schema({
  qualification: { type: String, enum: ['12', 'UG', 'PG'], required: true },
  courseName: { type: String, required: true },
  currentYear: { type: String, required: true },
  collegeOrSchoolName: { type: String, required: true },
});
// Profile Details Schema (Embedded Document)
const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  education: [EducationSchema], // Array of Education details
  profilePhoto: { type: String }, // Store path or URL of the photo
  cv: { type: String }, // Store path or URL of the CV
});


const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  rawPassword: { 
    type: String,
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
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
  profile: ProfileSchema,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;
