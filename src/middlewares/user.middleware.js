export const userMiddleware = async (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(401).send({ message: "Unauthorized" });
  }
  return next();
};
