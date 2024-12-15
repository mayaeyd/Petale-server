import jwt from "jsonwebtoken";
import User from "../models/users.model.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  const splitted = authHeader.split(" ");

  if (splitted.length !== 2 || splitted[0] !== "Bearer") {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  const token = splitted[1];

  try {
    const payload = await jwt.verify(token, process.env.SECRET_KEY);

    const id = payload.userId;
    const user = await User.findById(id);

    req.user = user;

    console.log("Auth middleware passed ", token);
    next();
  } catch (error) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
};
