// /pages/api/ai-helper.js
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { messages } = req.body;

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    const reply = chat.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Lỗi hệ thống AI." });
  }
}
