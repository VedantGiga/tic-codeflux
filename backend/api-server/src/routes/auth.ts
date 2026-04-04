import { Router } from "express";
import { register, login, getMe, sendOtp, verifyOtp, toggleSms } from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);

// SMS Notification Management
router.post("/sms/send-otp", authenticate, sendOtp);
router.post("/sms/verify-otp", authenticate, verifyOtp);
router.post("/sms/toggle", authenticate, toggleSms);

export default router;
