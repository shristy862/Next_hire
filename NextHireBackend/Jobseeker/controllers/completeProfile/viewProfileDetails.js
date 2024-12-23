import User from '../../../userData/models/model.js';
export const viewProfile = async (req, res) => {
    try {
      const { userId } = req.user; 
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Check if profile is completed
      if (!user.profileCompleted) {
        return res.status(400).json({ message: 'Profile is not completed yet.' });
      }
  
      // Respond with the profile data
      res.status(200).json({
        message: 'Profile retrieved successfully.',
        profile: user.profile,
      });
    } catch (error) {
      console.error('Error retrieving profile:', error);
      res.status(500).json({ message: 'An error occurred while retrieving the profile.', error: error.message });
    }
  };
  