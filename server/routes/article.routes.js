import { Router } from "express";
import {
  AddArticle,
  deleteArticle,
  getAllArticles,
  GetArticle,
} from "../controllers/article.controller.js";
import protectedRoute from "../middlewares/protectedRoute.js";
const router = Router();

router.post("/create", protectedRoute, AddArticle);
router.get("/all-article", getAllArticles);
router.get("/single/:id", GetArticle);
router.delete("/single/:id", protectedRoute, deleteArticle);

export default router;
