import React, { Suspense } from 'react';
import './App.css';
import PropTypes from 'prop-types';

const ProfitLossSummary = React.lazy(() => import('./ProfitLossSummary'));
const ExpenseBreakdown = React.lazy(() => import('./ExpenseBreakdown'));
const ReportGenerator = React.lazy(() => import('./ReportGenerator'));
const ExpenseBreakdownChart = React.lazy(() => import('./ExpenseBreakdownChart'));
const LitecoinPriceBot = React.lazy(() => import('./LitecoinPriceBot'));
const LitecoinMempoolTransactions = React.lazy(() => import('./LitecoinMempoolTransactions'));

const transactions = [
  { type: 'income', category: 'sales', amount: 1200 },
  { type: 'expense', category: 'marketing', amount: 300 },
  { type: 'expense', category: 'operations', amount: 150 },
  { type: 'income', category: 'services', amount: 800 },
  { type: 'expense', category: 'development', amount: 400 },
];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/Octocat.png" className="App-logo" alt="Octocat logo" />
        <h1> dreadwitdastacc-IFA</h1>
        <p className="tagline" style={{ fontSize: '1.2rem', margin: '1rem 0', fontWeight: '300' }}>
          Advanced Cryptocurrency Mining & Farming Platform
        </p>
        <p className="small">
          Track Litecoin mempool transactions, monitor mining profitability, and optimize your crypto farming operations with real-time data and powerful analytics.
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </p>
      </header>

      <main style={{ padding: '2rem' }}>
        <Suspense fallback={<div>Loading Litecoins tools…</div>}>
          <LitecoinPriceBot />
          <LitecoinMempoolTransactions />
        </Suspense>

        <section aria-labelledby="analytics" style={{ marginTop: '2rem' }}>
          <h2 id="analytics" style={{ fontSize: '1rem' }}>Analytics</h2>
          <Suspense fallback={<div>Loading analytics…</div>}>
            <ProfitLossSummary transactions={transactions} />
            <ExpenseBreakdownChart transactions={transactions} />
            <ExpenseBreakdown transactions={transactions} />
            <ReportGenerator transactions={transactions} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}

App.propTypes = {};

export default App;

