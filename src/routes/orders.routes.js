import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getOrders,
  trackOrder,
} from "../controllers/orders.controller";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = new Router();

router.get("/:id?", authMiddleware, getOrders);
router.post("/", authMiddleware, createOrder);
router.delete("/:id", authMiddleware, cancelOrder);
router.get("/:id", authMiddleware, trackOrder);
