import User from "../models/user.model";

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
