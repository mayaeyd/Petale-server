import { Router } from "express";

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
router.get("/plants/:id?", getPlants);
