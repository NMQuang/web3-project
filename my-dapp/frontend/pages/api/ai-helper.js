import { apiUrl } from "../../apiConfig.js";
export default async function handler(req, res) {
  const { messages } = req.body;

  const contents = messages.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));

  try {
    const response = await fetch(
      apiUrl,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
        })
      }
    );

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Chi tiết lỗi từ API:", errorDetails);
      throw new Error(`Yêu cầu API thất bại với mã trạng thái ${response.status}`);
    }

    const result = await response.json();
    console.log("Kết quả từ Gemini:", JSON.stringify(result, null, 2));
    res.status(200).json({ reply: JSON.stringify(result, null, 2) });
  } catch (e) {
    res.status(500).json({ reply: "Lỗi diễn giải từ Gemini." });
  }
}