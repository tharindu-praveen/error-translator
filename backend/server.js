const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk').default ?? require('@anthropic-ai/sdk');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors());
app.use(express.json());

// Health check — visit this to confirm server is running
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main endpoint — receives error text, returns explanation
app.post('/translate', async (req, res) => {
  const { error } = req.body;

  if (!error || !error.trim()) {
    return res.status(400).json({ message: 'No error message provided' });
  }

  const prompt = `You are an expert developer helping people understand confusing error messages.
Analyze the error below and respond ONLY with a valid JSON object.
No markdown, no backticks, no text outside the JSON.

ERROR:
${error}

Respond with exactly this JSON structure:
{
  "language": "the language or tool that produced this (e.g. Python, JavaScript, Docker, Git, React)",
  "severity": "one of: warning / error / fatal",
  "summary": "one clear sentence explaining what went wrong in plain English, no jargon",
  "cause": "one or two sentences explaining why this happened",
  "steps": [
    "first thing to try",
    "second thing to try",
    "third thing to try"
  ],
  "tip": "one short pro tip to avoid this error in future"
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    res.json(parsed);

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({
      message: 'Failed to translate error message',
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📡 POST http://localhost:${PORT}/translate`);
});