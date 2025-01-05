export const userOrAdminMiddleware = async (req, res, next) => {
  if (!req.user || (req.user.role !== "user" && req.user.role !== "admin")) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  return next();
};
