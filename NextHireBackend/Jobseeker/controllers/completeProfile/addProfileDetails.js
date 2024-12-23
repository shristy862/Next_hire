import User from '../../../userData/models/model.js';

export const completeProfile = async (req, res) => {
  const { userId } = req.user; 
  const {
    name,
    email,
    whatsappNumber,
    profilePhoto,
    cv,
    education,
  } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !whatsappNumber || !education || !Array.isArray(education) || education.length === 0) {
      return res.status(400).json({
        message: 'Name, email, WhatsApp number, and education details are required.',
      });
    }

    // Validate education entries
    for (const edu of education) {
      const { qualification, courseName, currentYear, collegeOrSchoolName } = edu;
      if (!qualification || !courseName || !currentYear || !collegeOrSchoolName) {
        return res.status(400).json({
          message: 'All education fields (qualification, course name, current year, college/school name) are required.',
        });
      }
    }

    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if user is a jobseeker
    if (user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Only jobseekers can complete their profiles.' });
    }

    // Update profile
    user.profile = {
      name,
      email,
      whatsappNumber,
      profilePhoto,
      cv,
      education,
    };

    user.profileCompleted = true;

    // Save user
    await user.save();

    res.status(200).json({ message: 'Profile completed successfully!', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while completing the profile.', error: error.message });
  }
};
