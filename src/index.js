const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { CohereClient } = require('cohere-ai');

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const preambles = {
  poems: "You are a poetic assistant who writes beautiful and emotional poems.",
  code: "You are a professional software engineer helping with JavaScript/TypeScript.",
  grammar: "You are a grammar assistant. You correct the user's sentence.",
};

app.post('/api/chat', async (req, res) => {
  const { message, mode = 'default' } = req.body;

  const preamble = preambles[mode] || "You are a helpful assistant.";

  try {
    const client = new CohereClient({ token: "q1VTEEWAiNXCNozIm8Mrmd1YeKUPTTwCBndqi9wb" });
    const response = await client.chat(
      {
        message,
        preamble,
        conversationId: "20251806",
        connectors: [
          {
            id: "web-search"
          }
        ]
      }
    );
    // const response = await axios.post(
    //   'https://api.cohere.ai/v1/chat',
    //   {
    //     model: "command-r-plus",
    //     temperature: 0.5,
    //     messages: [
    //       { role: "system", content: preamble },
    //       { role: "user", content: message }
    //     ]
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
    //       'Content-Type': 'application/json'
    //     }
    //   }
    // );

    const assistantText = response.text || "No response";
    res.json({ reply: assistantText });

  } catch (error) {
    console.error('Error from Cohere:', error?.response?.data || error.message);
    res.status(500).json({ reply: 'Something went wrong.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
