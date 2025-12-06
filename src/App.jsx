
import './App.css';
import ProfitLossSummary from './ProfitLossSummary';
import ExpenseBreakdown from './ExpenseBreakdown';
import ReportGenerator from './ReportGenerator';

import ExpenseBreakdownChart from './ExpenseBreakdownChart';

import LitecoinPriceBot from './LitecoinPriceBot';

import LitecoinMempoolTransactions, { LitecoinMempoolDashboard } from './LitecoinMempoolTransactions';

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
        <img src="Octocat.png" className="App-logo" alt="èṣù miners" />
        <p>
          dreadwitdastacc-IFA
        </p>
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
