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
import Persmix, {
  PersmixOpenAIChat,
  EliteTerminal,
  SystemStatus,
} from "./Persmix";
import cosmosService from "./services/cosmosService";

function App({ initialTransactions = defaultTransactions }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [walletType, setWalletType] = useState("litecoin");
  const [walletAddress, setWalletAddress] = useState("");
  const [etherscanKey, setEtherscanKey] = useState("");
  const [customApi, setCustomApi] = useState("");
  const [syncStatus, setSyncStatus] = useState("idle");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cloudError, setCloudError] = useState(null);

  // Initialize Cosmos DB and load transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        await cosmosService.init();
        const cosmosTransactions = await cosmosService.getTransactions();
        if (cosmosTransactions.length > 0) {
          setTransactions(cosmosTransactions);
        }
      } catch (error) {
        console.error('Failed to load from Cosmos DB:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem("transactions");
        if (saved) {
          setTransactions(JSON.parse(saved));
        }
      }
    };
    loadTransactions();
  }, []);

  // Sync to Cosmos DB and localStorage
  useEffect(() => {
    const syncTransactions = async () => {
      try {
        setSyncStatus("syncing");
        // For simplicity, replace all; in real app, diff
        // But since small, delete all and add new
        const existing = await cosmosService.getTransactions();
        for (const tx of existing) {
          await cosmosService.deleteTransaction(tx.id, tx.type);
        }
        for (const tx of transactions) {
          await cosmosService.addTransaction(tx);
        }
        setSyncStatus("synced");
        setCloudError(null);
      } catch (error) {
        setSyncStatus("error");
        setCloudError(error.message);
      }
    };
    if (transactions !== initialTransactions) {
      syncTransactions();
    }
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
  }, []);

  return (
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
        <section
          style={{
            marginBottom: "2.5rem",
            borderRadius: 16,
            boxShadow: "0 2px 16px #0001",
            background: "#fff",
            padding: 24,
            maxWidth: 700,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            <span>🔗</span> Load Transactions from Wallet
            <span
              style={{
                fontSize: 14,
                fontWeight: 400,
                marginLeft: 8,
                color: "#888",
              }}
              title="Supports major blockchains and custom APIs"
            >
              (multi-chain, custom API)
            </span>
          </h2>
          {/* ...existing wallet loader form code... */}
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
            <video controls width="100%" />
          </div>
        </section>
        {/* Persmix Elite Module */}
        <Persmix
          title="Persmix Elite Module"
          description="Experience the next level of modular excellence."
          features={[
            "Ultra-fast rendering",
            "Elite customization",
            "Seamless integration",
            "Cutting-edge design",
          ]}
        />
        <PersmixOpenAIChat />
        <EliteTerminal />
        <SystemStatus />
      </main>
      <footer>
        <p>
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
