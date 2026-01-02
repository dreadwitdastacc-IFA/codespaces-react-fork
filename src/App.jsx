import React, { Suspense, useEffect } from 'react';
import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.setState({
      errorInfo,
      errorId
    });

    // Enhanced error logging
    console.error('ErrorBoundary caught an error:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // In a real app, you might send this to an error reporting service
    // Example: sendErrorToService(error, errorInfo, errorId);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    const reportData = {
      errorId,
      message: error.toString(),
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Copy error details to clipboard
    navigator.clipboard.writeText(JSON.stringify(reportData, null, 2))
      .then(() => alert('Error details copied to clipboard. Please share with support.'))
      .catch(() => alert('Failed to copy error details. Please manually copy from console.'));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state;

      return (
        <div role="alert" style={{
          padding: '2rem',
          margin: '1rem 0',
          border: '1px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5',
          color: '#c92a2a'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#c92a2a' }}>
            🚨 Something went wrong
          </h3>

          <p style={{ margin: '0 0 1rem 0' }}>
            This part of the application encountered an error. You can try reloading or contact support.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ margin: '1rem 0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Error Details (Development Only)
              </summary>
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                <strong>Error ID:</strong> {errorId}<br/>
                <strong>Message:</strong> {error.toString()}<br/>
                <strong>Stack:</strong><br/>
                <pre style={{ whiteSpace: 'pre-wrap', margin: '0.5rem 0' }}>
                  {error.stack}
                </pre>
                {errorInfo?.componentStack && (
                  <>
                    <strong>Component Stack:</strong><br/>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: '0.5rem 0' }}>
                      {errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </div>
            </details>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#51cf66',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔄 Try Again
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#74c0fc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔄 Reload Page
            </button>

            <button
              onClick={this.handleReportError}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ffd43b',
                color: '#212529',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📋 Copy Error Details
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
  useEffect(() => {
    const onPreloadError = () => {
      window.location.reload();
    };

    window.addEventListener('vite:preloadError', onPreloadError);
    return () => window.removeEventListener('vite:preloadError', onPreloadError);
  }, []);

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
        <ErrorBoundary>
          <Suspense fallback={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              margin: '1rem 0'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #e9ecef',
                  borderTop: '4px solid #51cf66',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 1rem'
                }}></div>
                <p style={{ margin: 0, color: '#6c757d' }}>Loading Litecoin tools…</p>
              </div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          }>
            <LitecoinPriceBot />
            <LitecoinMempoolTransactions />
          </Suspense>
        </ErrorBoundary>

        <section aria-labelledby="analytics" style={{ marginTop: '2rem' }}>
          <h2 id="analytics" style={{ fontSize: '1rem' }}>Analytics</h2>
          <ErrorBoundary>
            <Suspense fallback={
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                margin: '1rem 0'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e9ecef',
                    borderTop: '4px solid #74c0fc',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 1rem'
                  }}></div>
                  <p style={{ margin: 0, color: '#6c757d' }}>Loading analytics…</p>
                </div>
              </div>
            }>
              <ProfitLossSummary transactions={transactions} />
              <ExpenseBreakdownChart transactions={transactions} />
              <ExpenseBreakdown transactions={transactions} />
              <ReportGenerator transactions={transactions} />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </div>
  );
}

export default App;

