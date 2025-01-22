import { Router } from "express";
import { saveArticle } from "../controllers/save.controller.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const router = Router();

router.post("/save/:id", protectedRoute, saveArticle);
router.post("/unsave/:id", protectedRoute, saveArticle);

export default router;
