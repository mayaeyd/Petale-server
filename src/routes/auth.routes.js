import { Router } from "express";
import { login, register, updateProfile } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register/gardener", register);
router.post("/register/user", register);
router.put("/updateProfile/:id", updateProfile);

export default router;
