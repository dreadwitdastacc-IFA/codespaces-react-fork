import React, { useEffect, useState } from 'react';

const TX_API_URL = 'https://mempool.space/api/txs/mempool';

const BitcoinMempoolTransactions = () => {
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchTxs = () => {
      setLoading(true);
      fetch(TX_API_URL)
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          if (!mounted) return;
          setTxs(data);
          setError(null);
          setLoading(false);
        })
        .catch(() => {
          if (!mounted) return;
          setError('Failed to fetch transactions');
          setLoading(false);
        });
    };

    fetchTxs();
    const interval = setInterval(fetchTxs, 10000); // refresh every 10s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>{error}</div>;
  if (!txs || !txs.length) return <div>No transactions found.</div>;

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>Bitcoin Mempool Transactions</h3>
      <table style={{ width: '100%', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Txid</th>
            <th>Fee (satoshi)</th>
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
              <td>{tx.firstSeen ? new Date(tx.firstSeen * 1000).toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Showing up to 50 latest transactions (auto-refreshes every 10s).</p>
    </div>
  );
};

export default BitcoinMempoolTransactions;
