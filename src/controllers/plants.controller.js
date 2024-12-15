import User from "../models/user.model.js";

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

    
    return res.status(200).send({
      message: "Plant added successfully",
      garden: updatedUser.gardenerProfile.garden,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};
