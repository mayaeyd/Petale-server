import User from "../models/user.model.js";

export const getAllPosts = async (req, res) => {
  try {
    const gardeners = await User.find(
      {
        role: "gardener",
        "gardenerProfile.marketplaceListings": {
          $exists: true,
          $not: { $size: 0 },
        },
      },
      {
        firstName: 1,
        lastName: 1,
        "gardenerProfile.garden.name": 1,
        "gardenerProfile.garden.location": 1,
        "gardenerProfile.marketplaceListings": 1,
      }
    );

    const formattedListings = gardeners.map((gardener) => ({
      gardenerId: gardener._id,
      gardenerName: `${gardener.firstName} ${gardener.lastName}`,
      gardenName: gardener.gardenerProfile.garden.name,
      gardenLocation: gardener.gardenerProfile.garden.location,
      listings: gardener.gardenerProfile.marketplaceListings,
    }));

    res.status(200).send(formattedListings);
  } catch (error) {
    console.error("Error fetching marketplace listings:", error);
    res
      .status(500)
      .send({ message: "Failed to retrieve marketplace listings", error });
  }
};
