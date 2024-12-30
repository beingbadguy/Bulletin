import { Router } from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
const router = Router();

// single profile
router.get("/me", protectedRoute, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User retrieved successfully",
    user: req.user,
  });
});


// profile update
router.put("/profileUpdate", updateUser);

// all users
router.get("/users", getAllUsers);

// profile by ID
router.get("/profile/:id", getUser);

// delete profile

router.delete("/profile/:id", deleteUser);

export default router;
