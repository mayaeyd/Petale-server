import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    }
    const users = await User.find();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server error" });
  }
};

export const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "User id was not provided" });
    }

    const bannedUser = await User.findByIdAndUpdate(
      id,
      { isBanned: true },
      { new: true }
    );

    if(!bannedUser){
        return res.status(404).send({message:"User not found"});
    }

    return res.status(200).json({
        success: true,
        message: "User has been banned successfully",
        user: bannedUser,
    });

  } catch (error) {
    console.error("Error banning user:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
