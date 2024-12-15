import { Router } from "express";
import { banUser, getUsers } from "../controllers/users.controller";

const router = new Router();

router.get("/:id?",getUsers);
router.post("/:id",banUser);