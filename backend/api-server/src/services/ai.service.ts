import Groq from "groq-sdk";
import { logger } from "../lib/logger.js";

export interface ExtractedMedicineTime {
  hour: number;
  minute: number;
  label: string;
}

export interface ExtractedMedicine {
  name: string;
  dosage: string;
  frequency: "daily" | "alternate_days" | "weekly" | "custom";
  times: ExtractedMedicineTime[];
  startDate: string;
  endDate: string | null;
}

export interface PrescriptionParseResult {
  medicines: ExtractedMedicine[];
  rawText: string;
}

const GROQ_API_KEY = process.env["GROQ_API_KEY"];

function inferTimesFromFrequency(
  frequency: string,
): ExtractedMedicineTime[] {
  const f = frequency?.toLowerCase() ?? "";
  
  // Three times a day (TDS/TID)
  if (f.includes("thrice") || f.includes("3 times") || f.includes("tds") || f.includes("tid")) {
    return [
      { hour: 8, minute: 0, label: "Morning" },
      { hour: 14, minute: 0, label: "Afternoon" },
      { hour: 20, minute: 0, label: "Evening" },
    ];
  }

  // Twice daily (BD/BID)
  if (f.includes("twice") || f.includes("2 times") || f.includes("bd") || f.includes("bid")) {
    return [
      { hour: 8, minute: 0, label: "Morning" },
      { hour: 20, minute: 0, label: "Evening" },
    ];
  }

  // Night/Bedtime (HS)
  if (f.includes("night") || f.includes("bedtime") || f.includes("hs") || f.includes("evening")) {
    const hour = f.includes("night") || f.includes("hs") ? 22 : 18;
    return [{ hour, minute: 0, label: f.includes("night") ? "Night" : "Evening" }];
  }

  // Afternoon
  if (f.includes("afternoon")) {
    return [{ hour: 14, minute: 0, label: "Afternoon" }];
  }

  // Morning (QAM/QD)
  if (f.includes("morning") || f.includes("qam") || f.includes("qd") || f.includes("daily")) {
    return [{ hour: 8, minute: 0, label: "Morning" }];
  }

  // Default: morning
  return [{ hour: 8, minute: 0, label: "Morning" }];
}

export async function parsePrescriptionImage(
  imageBase64: string,
): Promise<PrescriptionParseResult> {
  const today = new Date().toISOString().split("T")[0]!;

  if (!GROQ_API_KEY) {
    logger.warn("GROQ_API_KEY not set, returning smart mock prescription data");
    return {
      medicines: [
        {
          name: "Amlodipine (Demo)",
          dosage: "5mg",
          frequency: "daily",
          times: [{ hour: 8, minute: 0, label: "Morning" }],
          startDate: today,
          endDate: null,
        },
        {
          name: "Metformin (Demo)",
          dosage: "500mg",
          frequency: "daily",
          times: [
            { hour: 8, minute: 0, label: "Morning" },
            { hour: 20, minute: 0, label: "Evening" },
          ],
          startDate: today,
          endDate: null,
        },
      ],
      rawText: "NOTICE: GROQ_API_KEY is not set in .env. Real transcription is disabled, displaying Demo Data for workflow testing.",
    };
  }

  try {
    const groq = new Groq({ apiKey: GROQ_API_KEY });
    
    // Ensure we have a proper data URL for Groq if it's just raw base64
    const dataUrl = imageBase64.startsWith("data:") 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;

    const prompt = `You are a medical prescription parser. Extract ALL medicines from this prescription image.
Return ONLY valid JSON with this exact structure:
{
  "medicines": [
    {
      "name": "Medicine name",
      "dosage": "e.g. 500mg",
      "frequency": "daily | alternate_days | weekly | custom",
      "times": [
        { "hour": 8, "minute": 0, "label": "Morning" },
        { "hour": 20, "minute": 0, "label": "Evening" }
      ],
      "durationDays": null
    }
  ],
  "rawText": "full transcribed prescription text"
}

Rules:
- frequency must be exactly one of: daily, alternate_days, weekly, custom
- times is an array of { hour (0-23), minute (0-59), label } — one entry per dose per day
- For "twice daily" → 8:00 and 20:00. For "three times" → 8:00, 14:00, 20:00.
- If a specific clock time is written (e.g. "Take at 10 AM"), use that hour.
- durationDays: number of days if specified (e.g. "for 1 week" -> 7), otherwise null
- Be extremely precise with names and dosages. If handwriting is illegible, use best guess.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      temperature: 0.1,
      max_tokens: 2048,
      top_p: 1,
      stream: false,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from Groq AI");
    }

    const parsed = JSON.parse(content) as {
      medicines: Array<{
        name: string;
        dosage: string;
        frequency: string;
        times?: ExtractedMedicineTime[];
        durationDays?: number | null;
      }>;
      rawText?: string;
    };

    const medicines: ExtractedMedicine[] = (parsed.medicines ?? []).map((m) => {
      const freq = (["daily", "alternate_days", "weekly", "custom"].includes(m.frequency)
        ? m.frequency
        : "daily") as ExtractedMedicine["frequency"];

      const times =
        m.times && m.times.length > 0
          ? m.times.map((t) => ({
              hour: Number(t.hour),
              minute: Number(t.minute),
              label: t.label ?? "Dose",
            }))
          : inferTimesFromFrequency(m.frequency);

      const endDate =
        m.durationDays
          ? new Date(Date.now() + m.durationDays * 86_400_000).toISOString().split("T")[0]!
          : null;

      return {
        name: m.name,
        dosage: m.dosage,
        frequency: freq,
        times,
        startDate: today,
        endDate,
      };
    });

    return {
      medicines,
      rawText: parsed.rawText ?? "",
    };
  } catch (error: any) {
    const status = error?.status || error?.response?.status;
    const msg = error?.message || "Unknown Groq Error";
    logger.error({ error, status, msg }, "Groq parsing error");
    
    if (status === 401 || status === 403) {
      throw new Error("AI Scan Error: Invalid Groq API key or permission denied.");
    }
    if (status === 413) {
      throw new Error("AI Scan Error: Prescription image is too large for Groq.");
    }
    throw new Error(`AI Scan Error: ${msg}`);
  }
}
