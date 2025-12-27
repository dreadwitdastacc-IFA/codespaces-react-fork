export async function fetchOpenAIChat(messages, model = "gpt-4o", userId = "default", enableTools = true) {
  const response = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, model, userId, enableTools }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(`AI API error: ${response.status} - ${errorData.message || response.statusText}`);
  }
  return response.json();
}
