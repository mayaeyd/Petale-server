import User from "../models/user.model.js";

export const getPlants = async (req, res) => {
  try {
    const plantId = req.params.id;
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).send({ message: "User ID is required" });
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

//add unharvested plant
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

export const editPlant = async (req, res) => {
  const { plantType, scientificName, plantedDate } = req.body;
  const userId = req.user._id;
  const plantId = req.params.id;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required" });
  }

  if (!plantId) {
    return res.status(400).send({ message: "Plant ID is required" });
  }

  if (!plantType || !scientificName) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    // Find and update the plant by its id
    const user = await User.findOneAndUpdate(
      { _id: userId, "gardenerProfile.garden.plants._id": plantId },
      {
        $set: {
          "gardenerProfile.garden.plants.$.plantType": plantType,
          "gardenerProfile.garden.plants.$.scientificName": scientificName,
          "gardenerProfile.garden.plants.$.plantedDate": plantedDate,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send({ message: "User or plant not found" });
    }

    const updatedPlant = user.gardenerProfile.garden.plants.find(
      (plant) => plant._id.toString() === plantId
    );

    return res.status(200).send({
      message: "Plant updated successfully",
      updatedPlant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

export const deletePlant = async (req, res) => {
  const userId = req.user._id;
  const plantId = req.params.id;

  if (!userId) {
    return res.status(400).send({ message: "User ID is required" });
  }

  if (!plantId) {
    return res.status(400).send({ message: "Plant ID is required" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: {
          "gardenerProfile.garden.plants": { _id: plantId },
        },
      }
    );

    if (!user) {
      return res.status(404).send({ message: "User or plant not found" });
    }

    const deletedPlant = user.gardenerProfile.garden.plants.find(
      (plant) => plant._id.toString() === plantId
    );

    return res
      .status(200)
      .send({ message: "Plant deleted successfully", deletedPlant });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};

//post plant for sale
export const postPlant = async (req, res) => {
  const plantId = req.params.id;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const {plantName, harvestDate, price, description, quantity, images} = req.body;
    if(!plantName || !harvestDate || !price || !description || !quantity || !images){
      return res.status(400).send({message:"All fields are required"});
    }

    const plant = user.gardenerProfile.garden.plants.find(
      (plant) => plant._id.toString() === plantId
    );
    if (!plant) {
      return res.status(404).send({ message: "Plant not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error" });
  }
};
