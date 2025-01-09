import mongoose from "mongoose";
import User from "../models/user.model.js";
import imagekit from "../utils/imagekit.js";

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
        (plant) => plant._id.toString() === plantId
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

export const getPostedPlants = async (req, res) => {
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
      const plant = user.gardenerProfile.marketplaceListings.find(
        (plant) => plant._id.toString() === plantId
      );
      if (!plant) {
        return res
          .status(404)
          .send({ success: false, message: "Plant not found" });
      }
      if (plant.status !== "available") {
        return res
          .status(403)
          .send({ success: false, message: "Plant is not available" });
      }
      return res.status(200).send({ success: true, plant });
    }

    const availablePlants = user.gardenerProfile.marketplaceListings.filter(
      (plant) => plant.status === "available"
    );

    return res.status(200).send({
      success: true,
      plants: availablePlants,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Server error" });
  }
};

export const getSoldPlants = async (req, res) => {
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
      const plant = user.gardenerProfile.marketplaceListings.find(
        (plant) => plant._id.toString() === plantId
      );

      if (!plant) {
        return res
          .status(404)
          .send({ success: false, message: "Plant not found" });
      }
      if (plant.status !== "sold") {
        return res
          .status(403)
          .send({ success: false, message: "Plant is not sold" });
      }

      return res.status(200).send({ success: true, plant });
    }

    const soldPlants = user.gardenerProfile.marketplaceListings.filter(
      (plant) => plant.status === "sold"
    );

    return res.status(200).send({
      success: true,
      plants: soldPlants,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: "Server error" });
  }
};

// Add unharvested plant
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

// Post plant for sale
export const postPlant = async (req, res) => {
  const plantId = req.params.id;
  const userId = req.user._id;
  const uploadedImages = [];
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  const { plantName, harvestDate, price, description, quantity, plantType } =
    req.body;
  const images = req.files; // Image files from Multer
  console.log(req.body, images);

  if (
    !price ||
    !description ||
    !quantity ||
    !plantType ||
    !images ||
    images.length === 0 ||
    images.length > 3
  ) {
    return res.status(400).send({ message: "All fields are required" });
  }

  // Upload images to ImageKit
  for (const image of images) {
    try {
      const uploadResponse = await imagekit.upload({
        file: image.buffer,
        fileName: `${plantName || plant.scientificName}-${Date.now()}`,
      });
      uploadedImages.push(uploadResponse.url);
    } catch (error) {
      console.error("Image upload failed:", error);
      return res.status(500).send({ message: "Image upload failed" });
    }
  }

  if (!plantId) {
    try {
      const newPlant = {
        _id: new mongoose.Types.ObjectId(),
        plantName,
        plantType,
        harvestDate: harvestDate || Date.now(),
        price,
        description,
        quantity,
        images: uploadedImages,
        listingDate: new Date(),
        status: "available",
      };

      await User.updateOne(
        { _id: userId },
        {
          $push: { "gardenerProfile.marketplaceListings": newPlant },
        }
      );

      res
        .status(201)
        .send({ message: "New plant successfully added", newPlant });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error" });
    }
  } else {
    try {
      const plant = user.gardenerProfile.garden.plants.find(
        (plant) => plant._id.toString() === plantId
      );

      if (!plant) {
        return res.status(404).send({ message: "Plant not found" });
      }

      const postPlant = {
        plantName: plantName || plant.scientificName,
        harvestDate: harvestDate || Date.now(),
        price,
        plantType,
        description,
        quantity,
        images: uploadedImages,
        listingDate: new Date(),
        status: "available",
      };

      await User.updateOne(
        { _id: userId },
        {
          $pull: { "gardenerProfile.garden.plants": { _id: plantId } },
          $push: { "gardenerProfile.marketplaceListings": postPlant },
        }
      );

      res.status(201).send({ message: "Plant successfully posted", postPlant });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Server error" });
    }
  }
};

export const harvestPlant = async (req, res) => {
  const plantId = req.params.id;
  const userId = req.user._id;

  try {
    const updatedProfile = await User.findOneAndUpdate(
      {
        _id: userId,
        "gardenerProfile.garden.plants._id": plantId,
      },
      {
        $set: {
          "gardenerProfile.garden.plants.$[plant].isHarvested": true,
        },
      },
      {
        arrayFilters: [{ "plant._id": plantId }],
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Plant not found or user not authorized",
      });
    }

    const updatedPlant = updatedProfile.gardenerProfile.garden.plants.find(
      (plant) => plant._id.toString() === plantId
    );

    return res.status(200).json({
      success: true,
      message: "Plant harvested successfully",
      plant: updatedPlant,
    });
  } catch (error) {
    console.error("Error harvesting plant:", error);
    return res.status(500).json({
      success: false,
      message: "Error harvesting plant",
      error: error.message,
    });
  }
};
