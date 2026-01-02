import { useEffect, useState } from "react";
import { useMempoolStore } from "../state/mempoolStore";

export function useMempool() {
  const [mempoolBlocks, setMempoolBlocks] = useState(null);
  const [stats, setStats] = useState(null);
  const [orisaSignal, setOrisaSignal] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const store = useMempoolStore();

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/mempool");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data["mempool-blocks"]) {
        setMempoolBlocks(data["mempool-blocks"]);

        // Store blocks in Zustand store
        data["mempool-blocks"].forEach(block => {
          store.addBlock(block);
        });
      }
      if (data.stats) {
        setStats(data.stats);
        store.updateStats(data.stats);
      }
      if (data.orisaSignal) {
        setOrisaSignal(data.orisaSignal);
        store.addOrisaSignal(data.orisaSignal);

        const newAlert = buildAlertFromOrisa(data.orisaSignal, data.stats);
        if (newAlert) {
          setAlerts((prev) => [newAlert, ...prev].slice(0, 20));
          store.addAlert(newAlert);
        }
      }
    };

    return () => ws.close();
  }, [store]);

  return {
    mempoolBlocks,
    stats,
    orisaSignal,
    alerts,
    // Additional store methods
    getRecentBlocks: store.getRecentBlocks,
    getActiveAlerts: store.getActiveAlerts,
    getLatestSignal: store.getLatestSignal,
    clearAlerts: store.clearAlerts
  };
}

function buildAlertFromOrisa(orisaSignal, stats) {
  if (!orisaSignal || !orisaSignal.orisa) return null;

  const base = `[${orisaSignal.orisa}] ${orisaSignal.reason}`;
  const ts = new Date().toLocaleTimeString();

  return {
    id: `${Date.now()}-${Math.random()}`,
    ts,
    message: base,
    statsSnapshot: stats || null,
  };
}
