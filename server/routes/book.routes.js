import { Router } from "express";
import { createBook } from "../controllers/book.controller.js";
import protectedRoute from "../middlewares/protectedRoute.js";
const router = Router();

// create
router.post("/create", protectedRoute, createBook);
// read
// update
// delete
router.get("/");

export default router;
