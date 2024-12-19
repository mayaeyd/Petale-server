import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getOrders,
  trackOrder,
} from "../controllers/orders.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = new Router();

router.get("/:id?", authMiddleware, getOrders);
router.post("/", authMiddleware, createOrder);
router.delete("/:id", authMiddleware, cancelOrder);
router.get("/:id", authMiddleware, trackOrder);

export default router;
