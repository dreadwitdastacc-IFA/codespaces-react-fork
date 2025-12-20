/**
 * @file App.jsx
 * @description Main application component. Renders the dashboard header and all main widgets.
 */



/**
 * @file App.jsx
 * @description Main application component. Renders the dashboard header and all main widgets.
 */import React from 'react';
import './App.css';
import ProfitLossSummary from './ProfitLossSummary';
import ExpenseBreakdown from './ExpenseBreakdown';
import ReportGenerator from './ReportGenerator';

import ExpenseBreakdownChart from './ExpenseBreakdownChart';

import LitecoinMempoolDashboard from './LitecoinMempoolDashboard';
import LitecoinPriceBot from './LitecoinPriceBot';

import LitecoinMempoolTransactions from './LitecoinMempoolTransactions';

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
        <img src="Octocat.png" className="App-logo" alt="logo" />
        <p>
          GitHub Codespaces <span className="heart">♥️</span> React
        </p>
        <p className="small">
          Edit <code>src/App.jsx</code> and save to reload.
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
        <LitecoinPriceBot />
        <LitecoinMempoolDashboard />
        <LitecoinMempoolTransactions />
        <ProfitLossSummary transactions={transactions} />
        <ExpenseBreakdownChart transactions={transactions} />
        <ExpenseBreakdown transactions={transactions} />
        <ReportGenerator transactions={transactions} />
      </main>
    </div>
  );
}

export default App;
