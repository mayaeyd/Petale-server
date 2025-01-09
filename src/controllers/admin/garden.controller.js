import User from "../../models/user.model.js";

export const getAllGrowingPlants = async (req, res) => {
  try {
    const users = await User.find(
      { "gardenerProfile.garden.plants": { $exists: true, $ne: [] } },
      "firstName lastName email gardenerProfile.garden"
    );

    const allPlants = users.map((user) => ({
      gardenerId: user._id,
      gardenerName: `${user.firstName} ${user.lastName}`,
      gardenerEmail: user.email,
      gardenName: user.gardenerProfile.garden.name,
      location: user.gardenerProfile.garden.location,
      plants: user.gardenerProfile.garden.plants,
    }));

    const totalPlants = users.reduce(
      (total, user) => total + user.gardenerProfile.garden.plants.length,
      0
    );

    res.status(200).send({
      success: true,
      count: totalPlants,
      data: allPlants,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching plants",
      error: error.message,
    });
  }
};
