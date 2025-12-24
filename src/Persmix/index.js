import Persmix from "./Persmix";
import "./Persmix.css";
import PersmixOpenAIChat from "./PersmixOpenAIChat";
import EliteTerminal from "./EliteTerminal";
import SystemStatus from "./SystemStatus";

export default Persmix;

// Add OpenAI API call helper
export async function fetchOpenAIChat(messages, model = "gpt-4") {
  const response = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model }),
  });
  if (!response.ok) throw new Error("OpenAI API error");
  return response.json();
}

export { fetchOpenAIChat, PersmixOpenAIChat, EliteTerminal, SystemStatus };
