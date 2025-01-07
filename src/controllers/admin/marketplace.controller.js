//getAllPosts
//editPost
//deletePost

import User from "../../models/user.model.js";

export const getPosts = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      const user = await User.findOne(
        { "gardenerProfile.marketplaceListings._id": id },
        "firstName lastName email gardenerProfile.garden.name gardenerProfile.garden.location gardenerProfile.marketplaceListings.$"
      );

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Post not found",
        });
      }

      const post = user.gardenerProfile.marketplaceListings[0];
      return res.status(200).send({
        success: true,
        data: {
          sellerId: user._id,
          sellerName: `${user.firstName} ${user.lastName}`,
          sellerEmail: user.email,
          gardenName: user.gardenerProfile.garden.name,
          gardenLocation: user.gardenerProfile.garden.location,
          post,
        },
      });
    }

    const users = await User.find(
      { "gardenerProfile.marketplaceListings": { $exists: true, $ne: [] } },
      "firstName lastName email gardenerProfile.garden.name gardenerProfile.garden.location gardenerProfile.marketplaceListings"
    );

    const allListings = users.map((user) => ({
      sellerId: user._id,
      sellerName: `${user.firstName} ${user.lastName}`,
      sellerEmail: user.email,
      gardenName: user.gardenerProfile.garden.name,
      gardenLocation: user.gardenerProfile.garden.location,
      listings: user.gardenerProfile.marketplaceListings,
    }));

    res.status(200).send({
      success: true,
      count: allListings.length,
      data: allListings,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

export const editPost = async (req, res) => {
  const postId = req.params.id;
  const updates = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { "gardenerProfile.marketplaceListings._id": postId },
      {
        $set: {
          "gardenerProfile.marketplaceListings.$": {
            ...updates,
            _id: postId,
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }

    const updatedPost = user.gardenerProfile.marketplaceListings.find(
      (listing) => listing._id.toString() === postId
    );

    res.status(200).send({
      success: true,
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error editing post",
      error: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const postId = req.params.id;

  try {
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};
