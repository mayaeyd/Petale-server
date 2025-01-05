import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userOrAdminMiddleware } from "../middlewares/useroradmin.middleware.js";
import { getAllPosts } from "../controllers/marketplace.controller.js";

const router = new Router();

router.get("/", authMiddleware, userOrAdminMiddleware, getAllPosts);

export default router;
