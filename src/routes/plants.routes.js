import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { gardenerMiddleware } from "../middlewares/gardener.middleware.js";
import { addPlant } from "../controllers/plants.controller.js";

const router = new Router();

router.post("/addPlant", authMiddleware, gardenerMiddleware, addPlant);

export default router;
