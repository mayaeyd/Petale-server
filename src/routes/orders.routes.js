import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import {
  createOrder,
  getGardenerOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orders.controller.js";

const router = new Router();

router.post("/", authMiddleware, createOrder);
router.get("/user", authMiddleware, getUserOrders);
router.get("/gardener/:gardenerId", authMiddleware, getGardenerOrders);
router.patch("/user/:userId/order/:orderId", authMiddleware, updateOrderStatus);

export default router;
