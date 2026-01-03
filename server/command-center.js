// server/command-center.js
// GoGetumminmine Multichain Command Center backend
// Run with: node server/command-center.js
// Make sure to: npm install express cors ws node-fetch

import express from "express";
import http from "http";
import cors from "cors";
import WebSocket, { Server as WebSocketServer } from "ws";
import fetch from "node-fetch";
import { EventEmitter } from "events";

// =========================
// Wallet registry
// =========================

const wallets = {
  primary: {
    label: "Primary Personal",
    eth: "0xYOUR_PRIMARY_ETH",
    bnb: "0xYOUR_PRIMARY_BNB",
    sol: "YOUR_SOLANA_ADDRESS",
  },
  treasury: {
    label: "GoGetumminmine Treasury",
    eth: "0xYOUR_TREASURY_ETH",
    bnb: "0xYOUR_TREASURY_BNB",
    sol: "YOUR_SOLANA_TREASURY_ADDRESS",
  },
  ritual: {
    label: "Ritual / Symbolic",
    eth: "0xYOUR_RITUAL_ETH",
    bnb: "0xYOUR_RITUAL_BNB",
    sol: "YOUR_SOLANA_RITUAL_ADDRESS",
  },
};

// =========================
// Event bus
// =========================

const eventBus = new EventEmitter();
// Emits:
//  - "multichain:update" -> { snapshot, signals }
//  - "alerts:new" -> { alert }

// =========================
// Chain adapters
// =========================

// NOTE: You need valid API keys for Ethereum and BSC where required.
// Set in env: ETHERSCAN_KEY, BSCSCAN_KEY

const ETHERSCAN_API = "https://api.etherscan.io/api";
const BSCSCAN_API = "https://api.bscscan.com/api";
const SOLSCAN_API = "https://public-api.solscan.io/account";

async function fetchETHState(address) {
  if (!address) return null;

  const balanceUrl =
    `${ETHERSCAN_API}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.ETHERSCAN_KEY || ""}`;

  const txUrl =
    `${ETHERSCAN_API}?module=account&action=txlist&address=${address}` +
    `&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${process.env.ETHERSCAN_KEY || ""}`;

  try {
    const [balRes, txRes] = await Promise.all([
      fetch(balanceUrl),
      fetch(txUrl),
    ]);

    const balanceJson = await balRes.json();
    const txJson = await txRes.json();

    return {
      chain: "eth",
      address,
      balanceWei: balanceJson.result,
      recentTxs: Array.isArray(txJson.result) ? txJson.result : [],
    };
  } catch (e) {
    console.error("fetchETHState error:", e);
    return {
      chain: "eth",
      address,
      error: true,
    };
  }
}

async function fetchBNBState(address) {
  if (!address) return null;

  const balanceUrl =
    `${BSCSCAN_API}?module=account&action=balance&address=${address}&tag=latest&apikey=${process.env.BSCSCAN_KEY || ""}`;

  try {
    const balRes = await fetch(balanceUrl);
    const balanceJson = await balRes.json();

    return {
      chain: "bnb",
      address,
      balanceWei: balanceJson.result,
      recentTxs: [],
    };
  } catch (e) {
    console.error("fetchBNBState error:", e);
    return {
      chain: "bnb",
      address,
      error: true,
    };
  }
}

async function fetchSOLState(address) {
  if (!address) return null;

  try {
    const res = await fetch(`${SOLSCAN_API}/${address}`);
    const json = await res.json();

    return {
      chain: "sol",
      address,
      lamports: json.lamports,
      tokens: json.tokens || [],
      txs: json.txTransactions || [],
    };
  } catch (e) {
    console.error("fetchSOLState error:", e);
    return {
      chain: "sol",
      address,
      error: true,
    };
  }
}

// =========================
// Orisa classifier
// =========================

function classifyChainOrisa(chain, state) {
  if (!state || state.error) return { orisa: null, reason: "no_state_or_error" };

  if (chain === "eth") {
    const txCount = (state.recentTxs || []).length;
    if (txCount > 10) {
      return { orisa: "Ṣàngó", reason: "active_eth_transactions" };
    }
  }

  if (chain === "bnb") {
    let balanceWei = 0n;
    try {
      balanceWei = BigInt(state.balanceWei || "0");
    } catch (_) {
      balanceWei = 0n;
    }
    if (balanceWei > 0n) {
      return { orisa: "Ọ̀ṣun", reason: "bnb_balance_present" };
    }
  }

  if (chain === "sol") {
    const lamports = state.lamports || 0;
    if (lamports > 0) {
      return { orisa: "Ọya", reason: "solana_energy_flowing" };
    }
  }

  return { orisa: null, reason: "baseline" };
}

function classifyMultichain(snapshot) {
  const signals = {};

  if (!snapshot || !snapshot.wallets) return signals;

  for (const [walletKey, chains] of Object.entries(snapshot.wallets)) {
    signals[walletKey] = {};
    for (const [chain, state] of Object.entries(chains)) {
      signals[walletKey][chain] = classifyChainOrisa(chain, state);
    }
  }

  return signals;
}

// =========================
// Alerts system
// =========================

let alerts = [];
const MAX_ALERTS = 200;

function processSignalsToAlerts(signals) {
  const newAlerts = [];

  for (const [walletKey, chains] of Object.entries(signals)) {
    for (const [chain, sig] of Object.entries(chains)) {
      if (sig.orisa) {
        const alert = {
          id: `${Date.now()}-${walletKey}-${chain}-${sig.orisa}-${Math.random()}`,
          ts: Date.now(),
          walletKey,
          chain,
          orisa: sig.orisa,
          reason: sig.reason,
        };
        alerts.push(alert);
        newAlerts.push(alert);
      }
    }
  }

  if (alerts.length > MAX_ALERTS) {
    alerts = alerts.slice(-MAX_ALERTS);
  }

  for (const alert of newAlerts) {
    eventBus.emit("alerts:new", alert);
  }
}

function getRecentAlerts() {
  return alerts.slice().reverse();
}

// =========================
// Multichain monitor
// =========================

let lastSnapshot = null;

async function pollMultichain() {
  const snapshot = { ts: Date.now(), wallets: {} };

  for (const [key, entry] of Object.entries(wallets)) {
    const ethState = await fetchETHState(entry.eth);
    const bnbState = await fetchBNBState(entry.bnb);
    const solState = await fetchSOLState(entry.sol);

    snapshot.wallets[key] = {
      eth: ethState,
      bnb: bnbState,
      sol: solState,
    };
  }

  const signals = classifyMultichain(snapshot);

  snapshot.signals = signals;
  lastSnapshot = snapshot;

  eventBus.emit("multichain:update", { snapshot, signals });
  processSignalsToAlerts(signals);
}

function getLastSnapshot() {
  return lastSnapshot;
}

function startMultichainMonitor(intervalMs = 30000) {
  pollMultichain().catch(console.error);
  setInterval(() => {
    pollMultichain().catch(console.error);
  }, intervalMs);
}

// =========================
// HTTP + WebSocket server
// =========================

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

app.get("/api/multichain/snapshot", (req, res) => {
  res.json(getLastSnapshot() || { ts: Date.now(), wallets: {} });
});

app.get("/api/multichain/alerts", (req, res) => {
  res.json(getRecentAlerts());
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/stream" });

wss.on("connection", (ws) => {
  // Initial payload
  ws.send(
    JSON.stringify({
      type: "init",
      snapshot: getLastSnapshot(),
      alerts: getRecentAlerts(),
    })
  );

  const onUpdate = (payload) => {
    ws.send(JSON.stringify({ type: "multichain:update", ...payload }));
  };

  const onAlert = (alert) => {
    ws.send(JSON.stringify({ type: "alerts:new", alert }));
  };

  eventBus.on("multichain:update", onUpdate);
  eventBus.on("alerts:new", onAlert);

  ws.on("close", () => {
    eventBus.off("multichain:update", onUpdate);
    eventBus.off("alerts:new", onAlert);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`GoGetumminmine backend running on ${PORT}`);
  startMultichainMonitor(30000);
});
