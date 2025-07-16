import { apiUrl } from "../../apiConfig.js";
export default async function handler(req, res) {
    const { from, to, value, timestamp } = req.body;
  
    const prompt = `
  Diễn giải đơn giản, ngắn gọn bằng tiếng Việt: Người dùng đã chuyển ${value} token từ địa chỉ ${from} đến ${to} vào lúc ${timestamp}. Đừng lặp lại địa chỉ nếu không cần. Không giải thích kỹ thuật.
    `;
  
    const body = {
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    };
  
    try {
      const result = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );
  
      const data = await result.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Không có phản hồi.";
      console.log("data: ", data?.candidates)
      res.status(200).json({ reply });
    } catch (e) {
      res.status(500).json({ reply: "Lỗi diễn giải từ Gemini." });
    }
  }
  