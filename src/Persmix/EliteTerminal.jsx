import React, { useState, useRef, useEffect } from "react";

export default function EliteTerminal() {
  const [output, setOutput] = useState([
    "Welcome to Elite Terminal v1.0 - State of the Art, Adaptive, Self-Aware",
    "Type 'help' for commands. Commands are executed on the backend for security.",
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newOutput = [...output, `> ${input}`];
    setHistory([...history, input]);
    setHistoryIndex(-1);
    setOutput(newOutput);
    setLoading(true);

    try {
      const response = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: input.trim() }),
      });
      const data = await response.json();
      newOutput.push(data.output || data.error);
    } catch (err) {
      newOutput.push(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }

    setOutput(newOutput);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div
      className="elite-terminal"
      style={{
        background: "#000",
        color: "#0f0",
        fontFamily: "monospace",
        padding: "1rem",
        borderRadius: "8px",
        height: "400px",
        overflow: "auto",
        border: "2px solid #0f0",
        boxShadow: "0 0 20px rgba(0, 255, 0, 0.5)",
      }}
    >
      <div ref={terminalRef} style={{ height: "320px", overflowY: "auto" }}>
        {output.map((line, i) => (
          <div key={i} style={{ marginBottom: "0.25rem" }}>
            {line}
          </div>
        ))}
        {loading && <div style={{ color: "#ff0" }}>Executing...</div>}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", marginTop: "0.5rem" }}
      >
        <span style={{ marginRight: "0.5rem" }}>$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            color: "#0f0",
            outline: "none",
            fontFamily: "monospace",
          }}
          autoFocus
          disabled={loading}
        />
      </form>
    </div>
  );
}
