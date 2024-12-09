export const employeeDashboard = async (req, res) => {
    try {
      const { phoneNumber, role } = req.user;
  
      res.status(200).json({
        message: `Welcome, Employee!`,
        dashboardInfo: {
          phoneNumber,
          role,
          features: [
            "View assigned tasks",
            "Access team updates",
            "Manage employee-specific settings",
          ],
        },
        tips: [
          "Complete your tasks on time.",
          "Collaborate effectively with your team.",
          "Check the announcements section for updates.",
        ],
      });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while loading the Employee Dashboard.', error: error.message });
    }
  };
  