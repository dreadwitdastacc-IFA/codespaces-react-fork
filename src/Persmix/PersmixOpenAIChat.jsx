import React, { useState } from "react";
import { fetchOpenAIChat } from "./index";

export default function PersmixOpenAIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    try {
      const res = await fetchOpenAIChat(newMessages);
      const aiMsg = res.choices?.[0]?.message;
      if (aiMsg) setMessages([...newMessages, aiMsg]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="persmix-openai-chat"
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        background: "#222",
        color: "#fff",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h2>Persmix OpenAI Chat</h2>
      <div style={{ minHeight: 120, marginBottom: 16 }}>
        {messages.length === 0 && (
          <div style={{ color: "#aaa" }}>Start a conversation...</div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: "8px 0",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <span style={{ fontWeight: msg.role === "user" ? 600 : 400 }}>
              {msg.role === "user" ? "You" : "AI"}:
            </span>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 8, borderRadius: 8, border: "none" }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            background: "#4b8cff",
            color: "#fff",
            border: 0,
            fontWeight: 700,
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
      {error && <div style={{ color: "#f55", marginTop: 8 }}>{error}</div>}
    </div>
  );
}
