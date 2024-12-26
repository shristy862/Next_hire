import mongoose from 'mongoose';

const EducationSchema = new mongoose.Schema({
  qualification: { 
    type: String, 
    enum: ['12', 'UG', 'PG'], 
    required: true 
  },
  courseName: { 
    type: String, 
    required: true 
  },
  currentYear: { 
    type: String, 
    required: true 
  },
  collegeOrSchoolName: { 
    type: String, 
    required: true 
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

const Education = mongoose.model('Education', EducationSchema);

export default Education;
