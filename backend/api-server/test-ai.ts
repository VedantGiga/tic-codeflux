import Groq from "groq-sdk";
import "dotenv/config";

async function test() {
  const key = process.env.GROQ_API_KEY;
  console.log("Testing with key:", key ? key.substring(0, 10) + "..." : "MISSING");
  
  if (!key) return;

  try {
    const groq = new Groq({ apiKey: key });
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Hello, can you hear me? Respond with 'Yes, Groq is working!'"
        }
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
    });

    console.log("Response:", chatCompletion.choices[0]?.message?.content);
  } catch (err: any) {
    console.error("Error Status:", err.status);
    console.error("Error Message:", err.message);
    if (err.response) {
      console.error("Response Body:", JSON.stringify(err.response, null, 2));
    }
  }
}

test();
