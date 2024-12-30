import { Router } from "express";
import {
  Signup,
  VerifyUser,
  login,
  logout,
  ResetPasswordAttempt,
  confirmPassword,
} from "../controllers/auth.controller.js";
const router = Router();

router.post("/signup", Signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify", VerifyUser);
router.post("/reset-password", ResetPasswordAttempt);
router.post("/reset-password/:token", confirmPassword);

export default router;
