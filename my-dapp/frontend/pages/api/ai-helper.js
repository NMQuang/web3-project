export default async function handler(req, res) {
  const { messages } = req.body;

  const contents = messages.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
        })
      }
    );

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi từ Gemini";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ reply: "Lỗi gọi Gemini API" });
  }
}