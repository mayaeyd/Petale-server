import { Router } from "express";
import { banUser, getUsers } from "../controllers/users.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = new Router();

router.get("/:id?", authMiddleware,adminMiddleware, getUsers);
router.post("/:id", adminMiddleware, banUser);

export default router;