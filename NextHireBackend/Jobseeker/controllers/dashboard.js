export const jobseekerDashboard = async (req, res) => {
    try {
      const { phoneNumber, role , userId, } = req.user;
  
      res.status(200).json({
        message: `Welcome, Jobseeker!`,
        dashboardInfo: {
          phoneNumber,
          role,
          userId,
          features: [
            "View job recommendations",
            "Track your applications",
            "Update your resume and profile",
          ],
        },
        tips: [
          "Apply for jobs that match your skills.",
          "Keep your resume updated for better opportunities.",
          "Check your application status regularly.",
        ],
      });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while loading the Jobseeker Dashboard.', error: error.message });
    }
  };
  