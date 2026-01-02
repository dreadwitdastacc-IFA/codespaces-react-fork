import React, { useEffect, useState } from 'react';

// Allow API URL override via environment variable for proxy/firewall workarounds
const TX_API_URL = import.meta.env.VITE_MEMPOOL_API_URL || 'https://mempool.space/api/litecoin/txs/mempool';

// Fallback mock data when API is unreachable (e.g., blocked by firewall)
const FALLBACK_TRANSACTIONS = [
  {
    txid: 'abc123...example1',
    fee: 1000,
    vsize: 225,
    firstSeen: Math.floor(Date.now() / 1000) - 300
  },
  {
    txid: 'def456...example2',
    fee: 1500,
    vsize: 250,
    firstSeen: Math.floor(Date.now() / 1000) - 600
  },
  {
    txid: 'ghi789...example3',
    fee: 2000,
    vsize: 300,
    firstSeen: Math.floor(Date.now() / 1000) - 900
  }
];

const LitecoinMempoolTransactions = () => {
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    fetch(TX_API_URL, { signal: controller.signal })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setTxs(data);
        setLoading(false);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.warn('Failed to fetch mempool transactions from API:', err.message);
        // Use fallback data when API is blocked or unavailable
        setTxs(FALLBACK_TRANSACTIONS);
        setUsedFallback(true);
        setError('Using sample transaction data (API unreachable - may be blocked by firewall)');
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (!txs.length) return <div>No transactions found.</div>;

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #eee', borderRadius: '8px', background: usedFallback ? '#fff3cd' : 'white' }}>
      <h3>Litecoin Mempool Transactions</h3>
      {usedFallback && (
        <p style={{ color: '#856404', fontSize: '0.9rem', marginBottom: '1rem' }}>
          ⚠️ {error}
        </p>
      )}
      <table style={{ width: '100%', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Txid</th>
            <th>Fee (litoshi)</th>
            <th>Size (vbytes)</th>
            <th>First Seen</th>
          </tr>
        </thead>
        <tbody>
          {txs.slice(0, 50).map(tx => (
            <tr key={tx.txid}>
              <td style={{ wordBreak: 'break-all' }}>{tx.txid}</td>
              <td>{tx.fee}</td>
              <td>{tx.vsize}</td>
              <td>{new Date(tx.firstSeen * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Showing up to 50 {usedFallback ? 'sample' : 'latest'} transactions.</p>
    </div>
  );
};

export default LitecoinMempoolTransactions;
