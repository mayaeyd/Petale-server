import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({
        message: "Credentials are required",
      });
    }

    const userEmail = await User.findOne({ email });
    const userName = await User.findOne({ username });
    
    if (userEmail) {
      return res.status(400).send({
        message: "Email already in use",
      });
    }
    if (userName) {
      return res.status(400).send({
        message: "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword, password);
    

    const user = await User.create({
      username,
      email,
      password:hashedPassword,
    });

    return res.status(201).send({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).send({
      message: "Server error",
    });
  }
};