import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { userMiddleware } from "../middlewares/user.middleware.js";

import {
  createOrder,
  getGardenerOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/orders.controller.js";
import { gardenerMiddleware } from "../middlewares/gardener.middleware.js";

const router = new Router();

router.post("/", authMiddleware, userMiddleware, createOrder);
router.get("/user", authMiddleware, userMiddleware, getUserOrders);
router.get(
  "/gardener/:gardenerId",
  authMiddleware,
  gardenerMiddleware,
  getGardenerOrders
);
router.patch(
  "/user/:userId/order/:orderId",
  authMiddleware,
  gardenerMiddleware,
  updateOrderStatus
);

export default router;
