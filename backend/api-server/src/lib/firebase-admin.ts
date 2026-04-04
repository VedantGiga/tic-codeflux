import admin from "firebase-admin";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { logger } from "./logger.js";

let initialized = false;

try {
  // Option 1: service-account.json file (preferred for local dev)
  const serviceAccountPath = join(process.cwd(), "service-account.json");

  if (existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    logger.info("Firebase Admin initialized from service-account.json");
    initialized = true;
  } else if (process.env["FIREBASE_SERVICE_ACCOUNT_JSON"]) {
    // Option 2: Full JSON in env var (for CI/production)
    const serviceAccount = JSON.parse(process.env["FIREBASE_SERVICE_ACCOUNT_JSON"]);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    logger.info("Firebase Admin initialized from FIREBASE_SERVICE_ACCOUNT_JSON env var");
    initialized = true;
  } else {
    // Option 3: Individual env vars (project + credentials)
    const projectId = process.env["FIREBASE_PROJECT_ID"];
    const clientEmail = process.env["FIREBASE_CLIENT_EMAIL"];
    const privateKey = process.env["FIREBASE_PRIVATE_KEY"]?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
      });
      logger.info("Firebase Admin initialized from individual env vars");
      initialized = true;
    } else {
      logger.error(
        "Firebase Admin: No credentials found. " +
        "Please provide service-account.json, FIREBASE_SERVICE_ACCOUNT_JSON env var, " +
        "or set FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY"
      );
    }
  }
} catch (error) {
  logger.error({ error }, "Failed to initialize Firebase Admin");
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export default admin;
