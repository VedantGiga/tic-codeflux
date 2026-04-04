import { Request, Response } from "express";
import { adminDb } from "../lib/firebase-admin.js";
import { getCallInfo, removeCallInfo, sendSms } from "../services/twilio.service.js";
import { logger } from "../lib/logger.js";

const LOGS_COLLECTION = "activity_logs";
const PATIENTS_COLLECTION = "patients";
const USERS_COLLECTION = "users";

export async function handleVoiceWebhook(req: Request, res: Response): Promise<void> {
  try {
    const { CallSid, Digits } = req.body as { CallSid?: string; Digits?: string };

    logger.info({ CallSid, Digits }, "Twilio voice webhook received");

    const callInfo = CallSid ? getCallInfo(CallSid) : null;

    if (callInfo && Digits) {
      const isTaken = Digits === "1";
      
      const logRef = adminDb.collection(LOGS_COLLECTION).doc(callInfo.logId);
      const logDoc = await logRef.get();
      const logData = logDoc.data();
      const retryCount = logData?.retryCount ?? 0;

      if (isTaken) {
        await logRef.update({
          status: "taken",
          source: "call",
          respondedAt: new Date().toISOString(),
        });
        logger.info({ logId: callInfo.logId }, "Medicine status updated to taken");
      } else {
        if (retryCount === 0) {
          await logRef.update({
            status: "pending_retry",
            retryCount: 1,
            retryAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            source: "call",
            respondedAt: new Date().toISOString(),
          });
          logger.info({ logId: callInfo.logId }, "Call missed (1st try) - slated for retry");
        } else {
          await logRef.update({
            status: "missed",
            source: "call",
            respondedAt: new Date().toISOString(),
          });
          logger.info({ logId: callInfo.logId }, "Call missed (2nd try) - marking missed entirely");
          await triggerEmergencySms(callInfo.patientId, logData?.medicineName || "Unknown Medicine");
        }
      }

      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">${isTaken ? "Thank you. Your medicine has been marked as taken. Stay healthy!" : "Understood. Please take your medicine as soon as possible. Goodbye."}</Say>
  <Hangup/>
</Response>`;

      res.set("Content-Type", "text/xml");
      res.send(twiml);
    } else {
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">We did not receive your response. Please take your medicine. Goodbye.</Say>
  <Hangup/>
</Response>`;
      res.set("Content-Type", "text/xml");
      res.send(twiml);
    }
  } catch (error) {
    logger.error({ error }, "Error in handleVoiceWebhook");
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">We encountered an internal error processing your response. Please check your CareDose dashboard.</Say>
  <Hangup/>
</Response>`;
    res.set("Content-Type", "text/xml");
    res.status(500).send(errorTwiml);
  }
}

export async function handleStatusWebhook(req: Request, res: Response): Promise<void> {
  try {
    const { CallSid, CallStatus } = req.body as { CallSid?: string; CallStatus?: string };

    logger.info({ CallSid, CallStatus }, "Twilio status webhook received");

    if (CallSid && (CallStatus === "completed" || CallStatus === "failed" || CallStatus === "no-answer")) {
      const callInfo = getCallInfo(CallSid);
      if (callInfo && (CallStatus === "no-answer" || CallStatus === "failed")) {
        const logRef = adminDb.collection(LOGS_COLLECTION).doc(callInfo.logId);
        const logDoc = await logRef.get();
        const logData = logDoc.data();
        const retryCount = logData?.retryCount ?? 0;

        if (retryCount === 0) {
          await logRef.update({
            status: "pending_retry",
            retryCount: 1,
            retryAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            source: "call",
            respondedAt: new Date().toISOString(),
          });
        } else {
          await logRef.update({
            status: "no_response",
            source: "call",
            respondedAt: new Date().toISOString(),
          });
          await triggerEmergencySms(callInfo.patientId, logData?.medicineName || "Unknown Medicine");
        }
      }
      if (CallSid) removeCallInfo(CallSid);
    }

    res.status(200).send("OK");
  } catch (error) {
    logger.error({ error }, "Error in handleStatusWebhook");
    res.status(500).send("Internal Server Error");
  }
}

async function triggerEmergencySms(patientId: string, medicineName: string): Promise<void> {
  try {
    const patientDoc = await adminDb.collection(PATIENTS_COLLECTION).doc(patientId).get();
    if (!patientDoc.exists) return;
    const patient = patientDoc.data()!;

    const userDoc = await adminDb.collection(USERS_COLLECTION).doc(patient.userId).get();
    if (!userDoc.exists) return;
    const user = userDoc.data()!;

    if (user.smsEnabled && user.smsNumber) {
      const msg = `URGENT: CareDose AI Alert - ${patient.name} did not confirm taking their ${medicineName} dose after 2 reminders. Please check on them.`;
      await sendSms(user.smsNumber, msg);
      logger.info({ userId: patient.userId, smsNumber: user.smsNumber, patient: patient.name }, "Emergency SMS sent to caregiver");
    }
  } catch (err) {
    logger.error({ err, patientId }, "Failed to trigger emergency SMS");
  }
}
