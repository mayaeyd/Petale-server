import { Router } from "express";
import {
  getUsers,
  toggleUserBan,
} from "../controllers/admin/users.controller.js";
import {
  getPosts,
  editPost,
  deletePost,
} from "../controllers/admin/marketplace.controller.js";
import {
  getOrders,
  getAllSales,
} from "../controllers/admin/orders.controller.js";
import { getAllGrowingPlants } from "../controllers/admin/garden.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = Router();

// User routes
router.get("/users/:id?", authMiddleware, adminMiddleware, getUsers);
router.patch("/users/:id", authMiddleware, adminMiddleware, toggleUserBan);

// Marketplace routes
router.get("/posts/:id?", authMiddleware, adminMiddleware, getPosts);
router.put("/posts/:id", authMiddleware, adminMiddleware, editPost);
router.delete("/posts/:id", authMiddleware, adminMiddleware, deletePost);

// Order routes
router.get("/orders/:id?", authMiddleware, adminMiddleware, getOrders);
router.get("/sales", authMiddleware, adminMiddleware, getAllSales);

// Garden routes
router.get(
  "/plants/:id?",
  authMiddleware,
  adminMiddleware,
  getAllGrowingPlants
);

export default router;
