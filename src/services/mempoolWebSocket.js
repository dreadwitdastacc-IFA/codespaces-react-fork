const ws = new WebSocket("wss://mempool.space/api/v1/ws");

ws.onopen = () => {
  ws.send(JSON.stringify({
    track: ["mempool-blocks", "stats"]
  }));
  console.log("Connected and subscribed.");
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  if (data["mempool-blocks"]) {
    console.log("Mempool Blocks:", data["mempool-blocks"]);
  }

  if (data["stats"]) {
    console.log("Stats:", data["stats"]);
  }
};

ws.onerror = (err) => {
  console.error("WebSocket error:", err);
};

ws.onclose = () => {
  console.log("WebSocket closed.");
};

export default ws;
