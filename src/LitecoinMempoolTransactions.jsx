import React, { useEffect, useState } from 'react';

const TX_API_URL = 'https://mempool.space/api/litecoin/txs/mempool';

const LitecoinMempoolTransactions = () => {
  const [txs, setTxs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(TX_API_URL)
      .then(res => res.json())
      .then(data => {
        setTxs(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch transactions');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>{error}</div>;
  if (!txs.length) return <div>No transactions found.</div>;

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
      <h3>Litecoin Mempool Transactions</h3>
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
      <p>Showing up to 50 latest transactions.</p>
    </div>
  );
};

export { LitecoinMempoolTransactions };
export default LitecoinMempoolTransactions;

const API_URL = 'https://mempool.space/api/litecoin/mempool';
const LitecoinMempoolDashboard = () => {
  const [mempool, setMempool] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setMempool(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch mempool data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Litecoin mempool...</div>;
  if (error) return <div>{error}</div>;
  if (!mempool) return <div>No mempool data available.</div>;

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Litecoin Mempool Dashboard</h2>
      <ul>
        <li><strong>Count:</strong> {mempool.count}</li>
        <li><strong>Total Size (vsize):</strong> {mempool.vsize} vbytes</li>
        <li><strong>Total Fees:</strong> {mempool.total_fee} litoshi</li>
      </ul>
      <p>Data from <a href="https://mempool.space/litecoin/" target="_blank" rel="noopener noreferrer">mempool.space</a></p>
    </div>
  );
};

export { LitecoinMempoolDashboard };

