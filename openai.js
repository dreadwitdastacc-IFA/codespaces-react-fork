// openai.js - Node.js backend for OpenAI API integration and process.report configuration
import "dotenv/config";
import express from "express";
import fetch from "node-fetch";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const app = express();
app.use(express.json());

// --- process.report configuration ---
// Note: process.report is read-only in Node.js, so these settings are commented out
// process.report = process.report || {};
// process.report.reportOnFatalError = false;
// process.report.reportOnSignal = false;
// process.report.reportOnUncaughtException = true;
// process.report.reportOnFatalError = true;
// process.report.reportOnSignal = true;
// process.report.reportOnUncaughtException = false;
// process.report.reportOnFatalError = false;
// process.report.reportOnUncaughtException = false;
// process.report.reportOnSignal = true;
// process.report.signal = "SIGQUIT";
// process.report.excludeNetwork = true;
// process.report.excludeNetwork = true;

// --- OpenAI API integration ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

app.post("/api/openai", async (req, res) => {
  const { messages, model = "gpt-4" } = req.body;
  if (!OPENAI_API_KEY)
    return res.status(500).json({ error: "Missing OpenAI API key" });
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({ model, messages }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Elite Terminal Command Execution ---
app.post("/api/terminal", async (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ error: "No command provided" });

  try {
    const { stdout, stderr } = await execAsync(command, { timeout: 10000 });
    res.json({ output: stdout || stderr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Self-Aware System Status ---
app.get("/api/status", (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    platform: process.platform,
    features: [
      "OpenAI Integration",
      "Elite Terminal",
      "Persmix Module",
      "Adaptive UI",
    ],
    status: "Elite Operational",
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(
    `Elite Backend Server running on port ${PORT} - State of the Art, Adaptive, Self-Aware`
  );
});
