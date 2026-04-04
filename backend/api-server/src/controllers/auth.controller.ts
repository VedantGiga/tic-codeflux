import { Request, Response } from "express";
import { z } from "zod";
import { adminAuth, adminDb } from "../lib/firebase-admin";
import { AuthRequest } from "../middlewares/authenticate.js";
import { sendSms } from "../services/twilio.service.js";
import { logger } from "../lib/logger.js";

const USERS_COLLECTION = "users";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["caregiver", "patient"]).default("caregiver"),
});

export async function register(req: Request, res: Response): Promise<void> {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "ValidationError", message: parseResult.error.message });
    return;
  }

  const { name, email, password, role } = parseResult.data;

  try {
    // 1. Create User in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Create User Profile in Firestore
    const userData = {
      id: userRecord.uid,
      name,
      email,
      role,
      smsEnabled: false,
      smsNumber: null,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    await adminDb.collection(USERS_COLLECTION).doc(userRecord.uid).set(userData);

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });
  } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      res.status(409).json({ error: "Conflict", message: "User already exists" });
    } else {
      res.status(500).json({ error: "InternalError", message: error.message });
    }
  }
}

/**
 * Since Firebase Client SDK handles login on the mobile app, 
 * this endpoint is used to sync/fetch the Firestore profile 
 * once the user is authenticated.
 */
export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized", message: "User ID not found in request" });
    return;
  }

  try {
    let userDoc = await adminDb.collection(USERS_COLLECTION).doc(req.userId).get();

    if (!userDoc.exists) {
      // Auto-create missing profile (e.g. from Google login)
      const userRecord = await adminAuth.getUser(req.userId);
      const userData = {
        id: req.userId,
        name: userRecord.displayName || "User",
        email: userRecord.email || "",
        email: userRecord.email || "",
        role: "caregiver",
        smsEnabled: false,
        smsNumber: null,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      
      await adminDb.collection(USERS_COLLECTION).doc(req.userId).set(userData);
      userDoc = await adminDb.collection(USERS_COLLECTION).doc(req.userId).get();
    } else {
      // Update last login
      await adminDb.collection(USERS_COLLECTION).doc(req.userId).update({
        lastLoginAt: new Date().toISOString()
      });
    }

    res.json(userDoc.data());
  } catch (error: any) {
    res.status(500).json({ error: "InternalError", message: error.message });
  }
}

// Login is typically handled on the client via Firebase SDK
// and then the token is passed to these endpoints.
export async function login(req: Request, res: Response): Promise<void> {
  res.status(501).json({ 
    message: "Login should be handled on the client via Firebase SDK. Use the ID token to authenticate with API endpoints." 
  });
}

// Simple in-memory OTP storage for hackathon purposes
const otpMap = new Map<string, { otp: string; expiresAt: number; userId: string }>();

const phoneSchema = z.object({ phone: z.string().min(10) });

export async function sendOtp(req: AuthRequest, res: Response): Promise<void> {
  const parseResult = phoneSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "ValidationError", message: "Invalid phone number" });
    return;
  }

  const { phone } = parseResult.data;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Expiry in 5 mins
  otpMap.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000, userId: req.userId! });

  const message = `Your CareDose AI verification code is: ${otp}`;
  const success = await sendSms(phone, message);

  if (success) {
    res.json({ message: "OTP sent successfully" });
  } else {
    otpMap.delete(phone);
    res.status(500).json({ error: "TwilioError", message: "Failed to send SMS" });
  }
}

const verifyOtpSchema = z.object({ phone: z.string(), otp: z.string() });

export async function verifyOtp(req: AuthRequest, res: Response): Promise<void> {
  const parseResult = verifyOtpSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "ValidationError", message: "Invalid input" });
    return;
  }

  const { phone, otp } = parseResult.data;
  const record = otpMap.get(phone);

  if (!record) {
    res.status(400).json({ error: "InvalidOTP", message: "No OTP request found for this number" });
    return;
  }

  if (record.userId !== req.userId) {
    res.status(403).json({ error: "Forbidden", message: "OTP was requested by another user" });
    return;
  }

  if (Date.now() > record.expiresAt) {
    otpMap.delete(phone);
    res.status(400).json({ error: "ExpiredOTP", message: "OTP has expired" });
    return;
  }

  if (record.otp !== otp) {
    res.status(400).json({ error: "InvalidOTP", message: "Incorrect OTP" });
    return;
  }

  try {
    // Valid OTP, update user
    await adminDb.collection(USERS_COLLECTION).doc(req.userId!).update({
      smsEnabled: true,
      smsNumber: phone,
    });
    
    otpMap.delete(phone);
    res.json({ message: "SMS alerts verified and enabled successfully" });
  } catch (error: any) {
    logger.error({ error }, "Failed to verify OTP and save user");
    res.status(500).json({ error: "InternalError", message: "Failed to update settings" });
  }
}

export async function toggleSms(req: AuthRequest, res: Response): Promise<void> {
  const { enabled } = req.body;
  if (typeof enabled !== "boolean") {
    res.status(400).json({ error: "ValidationError", message: "enabled must be a boolean" });
    return;
  }

  try {
    const userDoc = await adminDb.collection(USERS_COLLECTION).doc(req.userId!).get();
    if (!userDoc.exists || !userDoc.data()?.smsNumber) {
      res.status(400).json({ error: "ValidationError", message: "You must verify a phone number first" });
      return;
    }

    await adminDb.collection(USERS_COLLECTION).doc(req.userId!).update({
      smsEnabled: enabled,
    });

    res.json({ message: `SMS alerts ${enabled ? 'enabled' : 'disabled'} successfully` });
  } catch (error: any) {
    res.status(500).json({ error: "InternalError", message: "Failed to update settings" });
  }
}
