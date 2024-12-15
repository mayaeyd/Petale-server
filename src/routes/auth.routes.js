import { Router } from "express";
import { adminLogin, getSelf, login, register, updateProfile } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/register/gardener", register);
router.post("/register/user", register);
router.put("/updateProfile/:id", updateProfile);
router.post("/login/admin", adminLogin);
router.post("/getSelf",getSelf);

export default router;