import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).send({
        message: "Invalid credentials",
      });
    }

    console.log(password, user.password);

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return res.status(400).send({
        message: "Invalid credentials",
      });
    }

    const token = await jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

    return res.status(200).send({ user, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
};

export const register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phoneNumber,
    role, // 'user' or 'gardener'
    gardenName, // Only for gardener
    gardenLocation,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    !phoneNumber ||
    !role
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const userEmail = await User.findOne({ email });
  const phoneNum = await User.findOne({ phoneNumber });

  if (userEmail) {
    return res.status(400).send({
      message: "Email already in use",
    });
  }

  if (phoneNum) {
    return res.status(400).send({
      message: "Phone number already in use",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userData = {
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phoneNumber,
    role,
  };

  if (role === "gardener") {
    if (!gardenName || !gardenLocation) {
      return res.status(400).json({
        message: "Gardener profile requires garden name and location",
      });
    }

    userData.gardenerProfile = {
      garden: {
        name: gardenName,
        location: gardenLocation,
      },
      marketplaceListings: [],
    };
  }

  try {
    const newUser = await User.create(userData);
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const {
      firstName,
      lastName,
      password,
      phoneNumber,
      gardenName,
      gardenLocation,
    } = req.body;

    const phoneNum = await User.findOne({ phoneNumber });

    if (phoneNum) {
      return res.status(400).send({
        message: "Phone number already in use",
      });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.hashedPassword = hashedPassword;
    }

    if (gardenName || gardenLocation) {
      updateData.gardenerProfile = {
        ...updateData.gardenerProfile,
        garden: {
          ...(gardenName && { name: gardenName }),
          ...(gardenLocation && { location: gardenLocation }),
        },
      };
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    return res
      .status(200)
      .send({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server error" });
  }
};

export const adminLogin = async (req,res)=>{
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).send({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).send({
        message: "Invalid credentials",
      });
    }

    if(user.role !=='admin'){
      return res.status(401).send({
        message: "Unauthorized",
      });
    }

    console.log(password , user.password);
    
    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return res.status(400).send({
        message: "Invalid credentials",
      });
    }

    const token = await jwt.sign({ userId: user.id }, process.env.SECRET_KEY);

    return res.status(200).send({user, token});
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
}