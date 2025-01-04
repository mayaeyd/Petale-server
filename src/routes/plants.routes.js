import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { gardenerMiddleware } from "../middlewares/gardener.middleware.js";
import {
  addPlant,
  getPlants,
  editPlant,
  deletePlant,
  postPlant,
  getPostedPlants,
  getSoldPlants,
  harvestPlant,
} from "../controllers/plants.controller.js";
import upload from "../utils/multerConfig.js";

const router = new Router();

router.get("/post/:id?", authMiddleware, gardenerMiddleware, getPostedPlants);
router.post(
  "/post/:id?",
  authMiddleware,
  gardenerMiddleware,
  upload,
  postPlant
);
router.get("/sold/:id?", authMiddleware, gardenerMiddleware, getSoldPlants);

router.get("/:id?", authMiddleware, gardenerMiddleware, getPlants);
router.post("/", authMiddleware, gardenerMiddleware, addPlant);
router.put("/:id", authMiddleware, gardenerMiddleware, editPlant);
router.put("/harvest/:id", authMiddleware, gardenerMiddleware, harvestPlant);
router.delete("/:id", authMiddleware, gardenerMiddleware, deletePlant);

export default router;
