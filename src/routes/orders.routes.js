import { Router } from "express";
import { cancelOrder, createOrder, getOrders, trackOrder } from "../controllers/orders.controller";

const router = new Router();

router.get("/:id?", getOrders);
router.post("/",createOrder);
router.delete("/:id", cancelOrder);
router.get("/:id", trackOrder);