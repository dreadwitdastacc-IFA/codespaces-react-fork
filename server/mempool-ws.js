import WebSocket from "ws";
import { classifyOrisaEvent } from "./mempool-orisa.js";
import { recordMempoolEvent } from "./mempool-store.js";

export function startMempoolRelay(server) {
  const wss = new WebSocket.Server({ server, path: "/mempool" });

  const upstream = new WebSocket("wss://mempool.space/api/v1/ws");

  upstream.onopen = () => {
    upstream.send(JSON.stringify({
      track: ["mempool-blocks", "stats"]
    }));
    console.log("Connected to mempool.space");
  };

  upstream.onmessage = (event) => {
    const data = JSON.parse(event.data);

    const orisaSignal = classifyOrisaEvent(data);
    const enriched = { ...data, orisaSignal, ts: Date.now() };

    recordMempoolEvent(enriched);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(enriched));
      }
    });
  };

  upstream.onerror = (err) => console.error("Upstream error:", err);
  upstream.onclose = () => console.log("Upstream closed");

  wss.on("connection", () => {
    console.log("Frontend connected to relay");
  });
}
