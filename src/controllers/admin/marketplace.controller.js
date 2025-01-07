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
        "firstName lastName email gardenerProfile.marketplaceListings.$"
      );

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Post not found",
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};
