import { Router } from "express";
import { banUser, getUsers } from "../controllers/users.controller";

const router = new Router();

router.get("/:id?", adminMiddleware, getUsers);
router.post("/:id", adminMiddleware, banUser);
