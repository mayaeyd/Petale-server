export const gardenerMiddleware = async (req, res, next) => {
  if (!req.user || req.user.role !== "gardener") {
    return res.status(401).send({ message: "Unauthorized" });
  }
  return next();
};
