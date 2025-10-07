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
      const response = await fetch(
        apiUrl,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
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
  