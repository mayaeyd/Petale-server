//getAllUsers
//toggleUserBan

export const getAllUsers = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};
