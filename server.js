import "dotenv/config";
import express from "express";
import cors from "cors";
import { runAgent } from "./agent.js";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cyber Login Agent is running",
  });
});

app.post("/api/analyze-login", async (req, res) => {
  try {
    console.log("POST /api/analyze-login received");
    console.log("Body:", req.body);

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "A message is required.",
      });
    }

    console.log("Calling runAgent...");

    const response = await runAgent(message);

    console.log("runAgent finished");

    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error("Agent error:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Cyber Login Agent running on http://localhost:${PORT}`);
});
