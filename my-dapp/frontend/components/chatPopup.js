import { useState } from "react";

export default function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Xin chào! Tôi có thể giúp gì cho bạn về Web3?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "Lỗi khi gọi Gemini." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[22rem] max-w-[100vw]">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="connect-wallet-btn px-4 py-2"
        >
          🤖 AI Assistant
        </button>
      ) : (
        <div className="bg-white rounded shadow-lg border flex flex-col w-full h-[28rem]">
          <div className="bg-blue-600 text-white px-4 py-2 relative rounded-t">
            <span className="text-sm">Web3 Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="connect-wallet-btn absolute top-2 right-2 text-sm px-2 py-1"
            >
              {"\u00d7"}
            </button>
          </div>
          <div
            className="flex-1 overflow-y-auto text-sm bg-gray-50 p-2"
            style={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={msg.role === "user" ? "text-blue-600" : "text-green-600"}
                >
                  {msg.content
                  .split(" ")
                  .slice(0, 100)
                  .join(" ") + (msg.content.split(" ").length > 100 ? "..." : "")}
                </span>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex p-2 border-t gap-2">
            <input
              className="flex-1 p-1 border rounded text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi về ví, token..."
            />
            <button
              type="submit"
              disabled={isLoading}
              className="connect-wallet-btn px-3 rounded text-sm disabled:opacity-50"
            >
              {isLoading ? "・・・" : "Gửi"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
  
}