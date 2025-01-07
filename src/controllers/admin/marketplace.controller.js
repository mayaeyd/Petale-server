//getAllPosts
//editPost
//deletePost

import User from "../../models/user.model.js";

export const getAllPosts = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};
