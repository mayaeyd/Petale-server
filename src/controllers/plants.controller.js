import User from "../models/user.model.js";

export const getPlants = async (req, res) => {
  try {
    const plantId = req.params.id;
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).send({ message: "User Id is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (plantId) {
      const plant = user.gardenerProfile.garden.plants.find(
        (plant) => plant._id === plantId
      );
      return res.status(200).send({ success: true, plant });
    }

    return res
      .status(200)
      .send({ success: true, plants: user.gardenerProfile.garden.plants });

  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Server error" });
  }
};

export const addPlant = async (req, res) => {
  try {
    const { plantType, scientificName, plantedDate } = req.body;
    const { id } = req.user;

    if (!plantType || !scientificName) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const newPlant = {
      plantType,
      scientificName,
      plantedDate: plantedDate || new Date(),
      sensorData: {
        currentMoisture: 0,
        currentHumidity: 0,
        currentTemperature: 0,
        lastUpdated: new Date(),
      },
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: { "gardenerProfile.garden.plants": newPlant },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send({
      message: "Plant added successfully",
      garden: updatedUser.gardenerProfile.garden,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};
