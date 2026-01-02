// src/CommandCenter.jsx
// GoGetumminmine Multichain Command Center frontend
// Assumes backend at ws://localhost:3001/ws/stream

import React, { useEffect, useState } from "react";

// =========================
// Hook: multichain event stream
// =========================

function useMultichainStream() {
  const [snapshot, setSnapshot] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001/ws/stream");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "init") {
        if (msg.snapshot) setSnapshot(msg.snapshot);
        if (msg.alerts) setAlerts(msg.alerts);
      }

      if (msg.type === "multichain:update") {
        setSnapshot(msg.snapshot);
      }

      if (msg.type === "alerts:new") {
        setAlerts((prev) => [msg.alert, ...prev].slice(0, 100));
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => ws.close();
  }, []);

  return { snapshot, alerts };
}

// =========================
// Orisa badge (symbolic UI)
// =========================

const ORISA_COLORS = {
  "Ṣàngó": "#ef4444", // red
  "Ọ̀ṣun": "#fbbf24", // yellow-gold
  "Ọya": "#7c3aed",  // purple
  Ogun: "#16a34a",   // green (placeholder if you extend)
  default: "#6b7280",
};

function OrisaBadge({ orisa, reason }) {
  if (!orisa) {
    return (
      <span
        style={{
          padding: "2px 6px",
          borderRadius: 999,
          background: ORISA_COLORS.default,
          color: "white",
          fontSize: 12,
        }}
        title={reason || "baseline"}
      >
        baseline
      </span>
    );
  }

  return (
    <span
      title={reason}
      style={{
        padding: "2px 6px",
        borderRadius: 999,
        background: ORISA_COLORS[orisa] || ORISA_COLORS.default,
        color: "white",
        fontSize: 12,
      }}
    >
      {orisa}
    </span>
  );
}

// =========================
// Alerts panel
// =========================

function AlertsPanel({ alerts }) {
  if (!alerts || !alerts.length) {
    return <div>No alerts yet.</div>;
  }

  return (
    <div>
      <h3>Orisa Alerts</h3>
      <ul style={{ listStyle: "none", padding: 0, maxHeight: 300, overflowY: "auto" }}>
        {alerts.map((a) => (
          <li key={a.id} style={{ marginBottom: 8 }}>
            <strong>{new Date(a.ts).toLocaleTimeString()}</strong>{" "}
            <OrisaBadge orisa={a.orisa} reason={a.reason} />{" "}
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              [{a.walletKey} / {a.chain}]
            </span>{" "}
            — {a.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

// =========================
// Wallet grid (per wallet, per chain)
// =========================

function WalletGrid({ snapshot }) {
  if (!snapshot || !snapshot.wallets) return <div>No data yet.</div>;

  const signals = snapshot.signals || {};

  return (
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      }}
    >
      {Object.entries(snapshot.wallets).map(([walletKey, chains]) => (
        <div
          key={walletKey}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h3 style={{ marginBottom: 8 }}>{walletKey}</h3>
          {Object.entries(chains).map(([chain, state]) => {
            const sig =
              signals?.[walletKey]?.[chain] || {
                orisa: null,
                reason: "baseline",
              };

            return (
              <div
                key={chain}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <div>
                  <strong>{chain.toUpperCase()}</strong>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    {state?.address || "no address"}
                  </div>
                </div>
                <OrisaBadge orisa={sig.orisa} reason={sig.reason} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// =========================
// Top-level Command Center component
// =========================

export default function CommandCenter() {
  const { snapshot, alerts } = useMultichainStream();

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <h1>GoGetumminmine Multichain Command Center</h1>

      <div style={{ marginBottom: 16, fontSize: 12, color: "#6b7280" }}>
        {snapshot
          ? `Last update: ${new Date(snapshot.ts).toLocaleTimeString()}`
          : "Waiting for data..."}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24,
        }}
      >
        <div>
          <h2>Wallets & Orisa Signals</h2>
          <WalletGrid snapshot={snapshot} />
        </div>
        <div>
          <AlertsPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
