const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { CohereClient } = require('cohere-ai');

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['https://abhimeruga.github.io', 'http://localhost:3000']
}));
app.use(express.json());

const preambles = {
  poems: "You are a poetic assistant who writes beautiful and emotional poems.",
  code: "You are a professional software engineer helping with JavaScript/TypeScript.",
  grammar: "You are a grammar assistant. You correct the user's sentence.",
};

const useCaseConfigs = {
  code: {
    preamble: `
      You are a JavaScript expert assistant.
      Only provide solutions, examples, and explanations in JavaScript.
      Do not refer to or use other programming languages unless explicitly asked.
    `,
    temperature: 0.2,
    max_tokens: 300,
    message : 'Only answer using JavaScript. User asks: '
  },

  poems: {
    preamble: `
      You are a creative poetry assistant.
      Write beautiful, meaningful poems using vivid imagery, rhythm, and emotion.
      You can write in any poetic form (haiku, sonnet, free verse, etc.) based on the prompt.
    `,
    temperature: 0.8,
    max_tokens: 400,
    message : 'Only answer in the context of poetry. User asks: '
  },

  grammar: {
    preamble: `
      You are a grammar correction assistant.
      Correct the user's grammar, punctuation, and sentence structure without changing the intended meaning.
      Provide the corrected version only, and explain the correction briefly if asked.
    `,
    temperature: 0.2,
    max_tokens: 200,
    message : 'Only correct the users grammar, punctuation, and sentence. User asks: '
  },

  RAG: {
    preamble: `
      You are a Retrieval-Augmented Generation (RAG) assistant.
      Answer user questions strictly based on retrieved knowledge.
      If you don't have relevant context, say "I don't have enough information to answer that."
      Do not speculate or fabricate.
    `,
    temperature: 0.3,
    max_tokens: 350,
    message : 'User asks: '
  },

  prompt: {
    preamble: `
      You are a prompt engineering assistant.
      Generate optimized prompts for AI language models like GPT or Cohere based on user needs.
      Consider clarity, context, structure, and intent. Avoid ambiguity.
    `,
    temperature: 0.4,
    max_tokens: 300,
    message : 'Only correct the users promt. User asks: '
  },

  default: {
    preamble: "You are a helpful assistant.",
    temperature: 0.5,
    max_tokens: 250,
  }
};

app.post('/api/chat', async (req, res) => {
  const { message, role = 'default' } = req.body;
  const preamble = useCaseConfigs[role];
  console.log(req.body, preamble);

  try {
    const client = new CohereClient({ token: process.env.COHERE_API_KEY });
    const response = await client.chat(
      {
        message : `${preamble.message}${message}`,
        preamble : preamble.preamble,
        temperature : preamble.temperature,
        maxTokens: preamble.max_tokens,
        conversationId: `${role}20251806`,
        connectors: [
          {
            id: "web-search"
          }
        ]
      }
    );

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
