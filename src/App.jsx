import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";
import ProfitLossSummary from "./ProfitLossSummary";
import ExpenseBreakdown from "./ExpenseBreakdown";
import ReportGenerator from "./ReportGenerator";

import ExpenseBreakdownChart from "./ExpenseBreakdownChart";

import LitecoinPriceBot from "./LitecoinPriceBot";

import LitecoinMempoolTransactions from "./LitecoinMempoolTransactions";
import LitecoinMempoolDashboard from "./LitecoinMempoolDashboard";
import VideoCard from "./VideoCard";

import defaultTransactions from "./data/transactions";

function App({ initialTransactions = defaultTransactions }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : initialTransactions;
  });
  const [walletType, setWalletType] = useState("litecoin");
  const [walletAddress, setWalletAddress] = useState("");
  const [etherscanKey, setEtherscanKey] = useState("");
  const [customApi, setCustomApi] = useState("");
  const [syncStatus, setSyncStatus] = useState("idle");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cloudError, setCloudError] = useState(null);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    try {
      let url = "";
      let parseTxs = (txs) => [];
      if (customApi) {
        url = customApi.replace(/\{address\}/g, addr);
        parseTxs = (data) => {
          // User must provide compatible JSON structure; fallback: return as-is
          if (Array.isArray(data)) return data;
          if (data.result) return data.result;
          if (data.transactions) return data.transactions;
          return [data];
        };
      } else if (type === "litecoin") {
        url = `https://mempool.space/api/v1/address/${addr}/txs`;
        parseTxs = (data) =>
          data.map((tx) => ({
            type: tx.value < 0 ? "expense" : "income",
            category: "Litecoin Wallet",
            amount: Math.abs(tx.value) / 1e8,
          }));
      } else if (type === "bitcoin") {
        url = `https://mempool.space/api/address/${addr}/txs`;
        parseTxs = (data) =>
          data.map((tx) => ({
            type: tx.value < 0 ? "expense" : "income",
            category: "Bitcoin Wallet",
            amount: Math.abs(tx.value) / 1e8,
          }));
      } else if (type === "ethereum") {
        if (!etherscanKey) throw new Error("Etherscan API key required");
        url = `https://api.etherscan.io/api?module=account&action=txlist&address=${addr}&sort=desc&apikey=${etherscanKey}`;
        parseTxs = (data) =>
          (data.result || []).map((tx) => ({
            type: tx.value.startsWith("-") ? "expense" : "income",
            category: "Ethereum Wallet",
            amount: Math.abs(Number(tx.value)) / 1e18,
          }));
      } else if (type === "dogecoin") {
        url = `https://dogechain.info/api/v1/address/transactions/${addr}`;
        parseTxs = (data) => (data.transactions || []).map((tx) => ({
          type: tx.amount < 0 ? "expense" : "income",
          category: "Dogecoin Wallet",
          amount: Math.abs(Number(tx.amount)),
        }));
      } else if (type === "bnb") {
        url = `https://api.bscscan.com/api?module=account&action=txlist&address=${addr}&sort=desc`;
        parseTxs = (data) => (data.result || []).map((tx) => ({
          type: tx.value.startsWith("-") ? "expense" : "income",
          category: "BNB Wallet",
          amount: Math.abs(Number(tx.value)) / 1e18,
        }));
      } else if (type === "solana") {
        throw new Error("Solana support coming soon");
      } else if (type === "cardano") {
        throw new Error("Cardano support coming soon");
      }
      if (!url) throw new Error("Unsupported wallet type or API");
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Failed to fetch wallet transactions");
      const data = await resp.json();
      const imported = parseTxs(data);
      setTransactions((prev) => [...prev, ...imported]);
      setSyncStatus("idle");
    } catch (e) {
      setCloudError(e.message);
      setSyncStatus("idle");
    }
    <div className="App">
      <div
        style={{
          background: isOnline ? "#e0ffe0" : "#ffe0e0",
          padding: "0.5rem",
          textAlign: "center",
        }}
      >
        {isOnline ? "Online" : "Offline"} | Sync: {syncStatus}
        {cloudError && (
          <span style={{ color: "red", marginLeft: 8 }}>{cloudError}</span>
        )}
      </div>
      <header className="App-header" role="banner">
        <div className="App-brand">
          <img
            src="/logo192.png"
            className="App-logo"
            alt="dreadwitdastacc-IFA logo"
          />
          <div>
            <h1 className="sr-only">dreadwitdastacc-IFA</h1>
            <p aria-hidden="true">dreadwitdastacc-IFA</p>
            <p
              className="tagline"
              style={{
                fontSize: "1.2rem",
                margin: "1rem 0",
                fontWeight: "300",
              }}
            >
              Advanced Cryptocurrency Mining & Farming Platform
            </p>
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="App-nav"
          style={{ marginTop: "0.5rem" }}
        >
          <a href="/" style={{ marginRight: "1rem" }}>
            Web App
          </a>
          <a href="/manifest.json" target="_blank" rel="noopener noreferrer">
            Mobile / PWA
          </a>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: "1rem" }}
          >
            Learn React
          </a>
        </nav>

        <p className="small" style={{ marginTop: "0.75rem" }}>
          Track Litecoin mempool transactions, monitor mining profitability, and
          optimize your crypto farming operations with real-time data and
          powerful analytics.
        </p>
      </header>
      <main style={{ padding: "2rem" }} role="main">
        {/* Elite Wallet Loader UI */}
        <section style={{ marginBottom: "2.5rem", borderRadius: 16, boxShadow: "0 2px 16px #0001", background: "#fff", padding: 24, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, fontWeight: 700, marginBottom: 12 }}>
            <span>🔗</span> Load Transactions from Wallet
            <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 8, color: '#888' }} title="Supports major blockchains and custom APIs">(multi-chain, custom API)</span>
          </h2>
          <form
            onSubmit={e => {
              e.preventDefault();
              loadWalletTransactions(walletAddress, walletType);
            }}
            style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <label htmlFor="wallet-type" style={{ fontWeight: 500, fontSize: 16 }}>Type</label>
              <select
                id="wallet-type"
                value={walletType}
                onChange={e => setWalletType(e.target.value)}
                style={{ fontSize: 16, padding: "4px 8px", borderRadius: 6 }}
                title="Select blockchain type"
              >
                {Object.entries(walletIcons).map(([type, icon]) => (
                  <option key={type} value={type}>{icon} {type.charAt(0).toUpperCase() + type.slice(1)}</option>
                ))}
                <option value="solana">◎ Solana (coming soon)</option>
                <option value="cardano">₳ Cardano (coming soon)</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column" }}>
              <label htmlFor="wallet-address" style={{ fontWeight: 500, fontSize: 16 }}>Address</label>
              <input
                id="wallet-address"
                type="text"
                placeholder="Wallet address"
                value={walletAddress}
                onChange={e => setWalletAddress(e.target.value)}
                style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
                required
                title="Enter your public wallet address"
              />
            </div>
            {walletType === "ethereum" && (
              <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column" }}>
                <label htmlFor="etherscan-key" style={{ fontWeight: 500, fontSize: 16 }}>Etherscan API Key</label>
                <input
                  id="etherscan-key"
                  type="text"
                  placeholder="Etherscan API Key"
                  value={etherscanKey}
                  onChange={e => setEtherscanKey(e.target.value)}
                  style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
                  required
                  title="Required for Ethereum wallet fetches"
                />
                <span style={{ fontSize: 12, color: '#888' }}>Get a free key at <a href="https://etherscan.io/myapikey" target="_blank" rel="noopener noreferrer">etherscan.io</a></span>
              </div>
            )}
            <div style={{ flex: 2, minWidth: 220, display: "flex", flexDirection: "column" }}>
              <label htmlFor="custom-api" style={{ fontWeight: 500, fontSize: 16 }}>Custom API (optional)</label>
              <input
                id="custom-api"
                type="text"
                placeholder="Custom API endpoint (use {address})"
                value={customApi}
                onChange={e => setCustomApi(e.target.value)}
                style={{ fontSize: 16, padding: 6, borderRadius: 6, border: '1px solid #ccc' }}
                title="Provide a custom API endpoint for advanced use"
              />
              <span style={{ fontSize: 12, color: '#888' }}>Example: https://api.example.com/wallet/{'{address}'}</span>
            </div>
            <button type="submit" style={{ fontSize: 18, padding: "8px 18px", borderRadius: 8, background: "#4b8cff", color: "#fff", border: 0, fontWeight: 700, boxShadow: "0 1px 4px #0002" }}>
              Import
            </button>
          </form>
          <div style={{ marginTop: 8, fontSize: 15, color: syncStatus === 'idle' ? '#2a2' : syncStatus === 'loading-wallet' ? '#f90' : '#888', fontWeight: 500 }}>
            {syncStatus === 'loading-wallet' && 'Loading wallet transactions...'}
            {syncStatus === 'syncing' && 'Syncing with cloud...'}
            {syncStatus === 'idle' && !cloudError && 'Ready.'}
            {cloudError && <span style={{ color: '#d00' }}>Error: {cloudError}</span>}
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: '#888' }}>
            <span>Supported: Litecoin, Bitcoin, Ethereum, Dogecoin, BNB, custom API. Solana & Cardano coming soon.</span>
          </div>
        </section>
        {/* Featured video card (state-of-the-art UI preview) */}
        <section aria-labelledby="featured-video">
          <h2
            id="featured-video"
            style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}
          >
            Featured
          </h2>
          <div style={{ marginBottom: "2rem" }}>
            <h3>Mini Short Live Performance Video</h3>
            <video
              controls
              width="100%"
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  loadWalletTransactions(walletAddress, walletType);
                }}
                style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}
              >
                <select
                  value={walletType}
                  onChange={(e) => setWalletType(e.target.value)}
                >
                  <option value="litecoin">Litecoin</option>
                  <option value="bitcoin">Bitcoin</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="dogecoin">Dogecoin</option>
                  <option value="bnb">BNB</option>
                  <option value="solana">Solana (coming soon)</option>
                  <option value="cardano">Cardano (coming soon)</option>
                </select>
                <input
                  type="text"
                  placeholder="Wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  style={{ flex: 1, minWidth: 200 }}
                  required
                />
                {walletType === "ethereum" && (
                  <input
                    type="text"
                    placeholder="Etherscan API Key"
                    value={etherscanKey}
                    onChange={(e) => setEtherscanKey(e.target.value)}
                    style={{ flex: 1, minWidth: 180 }}
                    required
                  />
                )}
                <input
                  type="text"
                  placeholder="Custom API endpoint (optional, use {address})"
                  value={customApi}
                  onChange={e => setCustomApi(e.target.value)}
                  style={{ flex: 2, minWidth: 220 }}
                />
                <button type="submit">Import</button>
              </form>
          I leverage GPT-5 and Claude-4 advanced agentic coding capabilities to
          help you build, debug, and innovate faster.
        </p>
        <p>Edit Files | Commands | Browse | Explore | MCP Tools | Secure</p>
      </footer>
    </div>
  );
}

App.propTypes = {
  initialTransactions: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      category: PropTypes.string,
      amount: PropTypes.number,
    })
  ),
};

export default App;
