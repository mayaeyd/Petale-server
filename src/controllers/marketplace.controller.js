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
      { gardenerProfile: 1 }
    );

    if (!gardeners || gardeners.length === 0) {
      return res.status(404).send({ message: "No marketplace listings found" });
    }

    const allListings = gardeners.flatMap(
      (gardener) => gardener.gardenerProfile
    );

    res.status(200).send(allListings);
  } catch (error) {
    console.error("Error fetching marketplace listings:", error);
    res
      .status(500)
      .send({ message: "Failed to retrieve marketplace listings", error });
  }
};
