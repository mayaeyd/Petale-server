//getAllGrowingPlants

import User from "../../models/user.model.js";

export const getAllGrowingPlants = async (req, res) => {
  try {
    const users = await User.find(
      { "gardenerProfile.garden.plants": { $exists: true, $ne: [] } },
      "firstName lastName email gardenerProfile.garden"
    );
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching plants",
      error: error.message,
    });
  }
};
