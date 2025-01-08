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

const router = Router();

// User routes
router.get("/users/:id?", getUsers);
router.patch("/users/:id/ban", toggleUserBan);

// Marketplace routes
router.get("/posts/:id?", getPosts);
router.put("/posts/:id", editPost);
router.delete("/posts/:id", deletePost);

// Order routes
router.get("/orders/:id?", getOrders);
router.get("/sales", getAllSales);

// Garden routes
router.get("/plants/:id?", getAllGrowingPlants);
