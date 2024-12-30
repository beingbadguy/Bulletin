import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import {
  addToWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
const router = Router();

// get wishlist
router.get("/wishlist/:bookId", protectedRoute, addToWishlist);
// delete wishlist
router.delete("/wishlist/bookId", protectedRoute, removeFromWishlist);
// add to wishlist
router.post("/wishlist/:bookId", protectedRoute, addToWishlist);

export default router;
