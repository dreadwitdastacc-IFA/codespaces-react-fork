import React from "react";
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
  const transactions = initialTransactions;

  return (
    <div className="App">
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
              height="auto"
              style={{ maxWidth: "600px" }}
              aria-label="Short live performance video"
            >
              <source src="/media/performance.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p>AUTHORITIES: This video demonstrates live mining performance.</p>
          </div>
          <VideoCard
            video={{
              title: "Mining Performance Overview",
              description:
                "Short demo showing live mining performance metrics and mempool integration.",
              url: "https://example.com/video/mining-overview",
              thumbnail: "/logo192.png",
              liked: false,
            }}
          />
        </section>

        <LitecoinPriceBot />
        <LitecoinMempoolDashboard />
        <LitecoinMempoolTransactions />
        <ProfitLossSummary transactions={transactions} />
        <ExpenseBreakdownChart transactions={transactions} />
        <ExpenseBreakdown transactions={transactions} />
        <ReportGenerator transactions={transactions} />
      </main>
      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#f0f0f0",
          marginTop: "2rem",
        }}
      >
        <p>POWERED BY SOTA LLMs</p>
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
