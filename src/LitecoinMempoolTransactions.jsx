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

export default LitecoinMempoolTransactions;

