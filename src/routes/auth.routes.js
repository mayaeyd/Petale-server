import { Router } from "express";
import {
  adminLogin,
  getSelf,
  login,
  register,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.put("/updateProfile/:id", authMiddleware, updateProfile);
router.post("/login/admin", adminLogin);
router.post("/getSelf", getSelf);

export default router;
