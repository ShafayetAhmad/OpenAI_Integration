import express, { RequestHandler } from "express";

import session from "express-session";
import OpenAI from "openai";
import cors from "cors";
const port = 5000;
const app = express();
require("dotenv").config();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
declare module "express-session" {
  interface SessionData {
    conversation: [{ prompt: string; response: string }];
  }
}
app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.post("/getResponse", async (req, res) => {
  const prompt: string = req?.body?.prompt as string;
  console.log(prompt);
  if (!prompt) {
    return res.status(400).send("prompt is required");
  }
  const openAi = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const response = await openAi.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          process.env.OPENAI_SYSTEM_MESSAGE || "You are a helpful assistant.",
      },
      { role: "user", content: `${prompt}` },
    ],
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
    max_tokens: 1500,
    n: 1,
    stop: "none",
    temperature: 1,
  });
  const aiResponse = response.choices[0].message.content;

  if (!req.session.conversation) {
    req.session.conversation = [];
  }
  req.session.conversation.push({ prompt: prompt, response: aiResponse });
  return res.status(200).send(req.session.conversation);
});
