import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn("Warning: OPENAI_API_KEY not set. Set it in .env before running.");
}

const openai = new OpenAI({ apiKey });

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, model } = req.body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const chatModel = model || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model: chatModel,
      messages,
      temperature: 0.7,
    });

    const choice = completion.choices?.[0];
    return res.json({ reply: choice?.message?.content ?? "", raw: completion });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: "Failed to generate a response" });
  }
});

// Fallback to index.html for root
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});


