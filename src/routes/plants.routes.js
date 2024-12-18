import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { gardenerMiddleware } from "../middlewares/gardener.middleware.js";
import {
  addPlant,
  getPlants,
  editPlant,
  deletePlant,
  postPlant,
} from "../controllers/plants.controller.js";

const router = new Router();

router.get("/:id?", authMiddleware, gardenerMiddleware, getPlants);
router.post("/", authMiddleware, gardenerMiddleware, addPlant);
router.post(":id", authMiddleware, gardenerMiddleware, postPlant);
router.put("/:id", authMiddleware, gardenerMiddleware, editPlant);
router.delete("/:id", authMiddleware, gardenerMiddleware, deletePlant);

export default router;
