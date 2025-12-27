import React, { useState } from "react";
import { fetchOpenAIChat } from "./index";

export default function PersmixOpenAIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState("gpt-4o");
  const [enableTools, setEnableTools] = useState(true);
  const [iterations, setIterations] = useState(0);

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setIterations(0);
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    try {
      const res = await fetchOpenAIChat(newMessages, model, "default", enableTools);
      const aiMsg = res.choices?.[0]?.message;
      if (aiMsg) {
        setMessages([...newMessages, aiMsg]);
        // Show if tools were used
        if (aiMsg.tool_calls) {
          setIterations(aiMsg.tool_calls.length);
        }
      }
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
        maxWidth: 700,
        margin: "2rem auto",
        background: "#222",
        color: "#fff",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h2>🤖 Elite AI Chat - Advanced Agentic Capabilities</h2>
      
      {/* Model and Settings Controls */}
      <div style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <select 
          value={model} 
          onChange={(e) => setModel(e.target.value)}
          style={{ padding: 8, borderRadius: 8, background: "#333", color: "#fff", border: "1px solid #555" }}
        >
          <option value="gpt-4o">GPT-4o (Advanced)</option>
          <option value="gpt-4o-mini">GPT-4o Mini (Fast)</option>
          <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
          <option value="o1-preview">O1 Preview (Reasoning)</option>
        </select>
        
        <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input 
            type="checkbox" 
            checked={enableTools} 
            onChange={(e) => setEnableTools(e.target.checked)}
          />
          <span style={{ fontSize: 14 }}>Enable Tool Calling</span>
        </label>
        
        {iterations > 0 && (
          <span style={{ fontSize: 12, color: "#4b8cff", marginLeft: "auto" }}>
            🔧 {iterations} tool{iterations > 1 ? 's' : ''} executed
          </span>
        )}
      </div>

      <div style={{ minHeight: 200, marginBottom: 16, maxHeight: 400, overflowY: "auto" }}>
        {messages.length === 0 && (
          <div style={{ color: "#aaa", textAlign: "center", padding: 20 }}>
            Start a conversation with advanced AI capabilities...<br/>
            <small style={{ fontSize: 12, marginTop: 8, display: "block" }}>
              ✨ Multi-step reasoning • 🔧 Function calling • 📊 Data analysis
            </small>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              margin: "12px 0",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <span style={{ 
              fontWeight: msg.role === "user" ? 600 : 400,
              color: msg.role === "user" ? "#4b8cff" : "#0f0"
            }}>
              {msg.role === "user" ? "👤 You" : "🤖 AI"}:
            </span>{" "}
            <span style={{ 
              display: "inline-block",
              background: msg.role === "user" ? "#1a3d5c" : "#1a2a1a",
              padding: "8px 12px",
              borderRadius: 8,
              marginTop: 4
            }}>
              {msg.content || (msg.tool_calls ? "🔧 Executing tools..." : "")}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything... I can analyze data, execute code, and more!"
          style={{ 
            flex: 1, 
            padding: 12, 
            borderRadius: 8, 
            border: "1px solid #555",
            background: "#333",
            color: "#fff"
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input}
          style={{
            padding: "12px 24px",
            borderRadius: 8,
            background: loading ? "#555" : "#4b8cff",
            color: "#fff",
            border: 0,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "⏳ Thinking..." : "🚀 Send"}
        </button>
      </form>
      {error && <div style={{ color: "#f55", marginTop: 8, padding: 8, background: "#330000", borderRadius: 8 }}>
        ❌ {error}
      </div>}
    </div>
  );
}
