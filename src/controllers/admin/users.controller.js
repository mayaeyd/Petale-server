//getAllUsers
//toggleUserBan

import User from "../../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password")
      .select("-gardenerProfile.garden.plants")
      .select("-gardenerProfile.marketplaceListings");

    res.status(200).send({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

export const toggleUserBan = async (req, res) => {
  const userId = req.user._id;
  const { isBanned } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isBanned } },
      { new: true, runValidators: true }
    );
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating user status",
      error: error.message,
    });
  }
};
