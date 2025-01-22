import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllPosts } from "../controllers/marketplace.controller.js";
import { userMiddleware } from "../middlewares/user.middleware.js";

const router = new Router();

router.get("/", authMiddleware, userMiddleware, getAllPosts);

export default router;
