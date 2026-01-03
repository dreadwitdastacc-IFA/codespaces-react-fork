import React, { useEffect, useState } from 'react';

const API_URL = 'https://mempool.space/api/litecoin/mempool';

function LitecoinMempoolDashboard() {
  const [mempool, setMempool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = () => {
      setLoading(true);
      fetch(API_URL)
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then((data) => {
          if (!mounted) return;
          setMempool(data);
          setError(null);
          setLoading(false);
        })
        .catch(() => {
          if (!mounted) return;
          setError('Failed to fetch mempool data');
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // refresh every 15s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) return <div>Loading Litecoin mempool...</div>;
  if (error) return <div>{error}</div>;
  if (!mempool) return <div>No mempool data available.</div>;

  return (
    <div
      style={{
        margin: '2rem 0',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    >
      <h2>Litecoin Mempool Dashboard</h2>
      <ul>
        <li>
          <strong>Count:</strong> {mempool.count}
        </li>
        <li>
          <strong>Total Size (vsize):</strong> {mempool.vsize} vbytes
        </li>
        <li>
          <strong>Total Fees:</strong> {mempool.total_fee} litoshi
        </li>
      </ul>
      <p>
        Data from{' '}
        <a
          href="https://mempool.space/litecoin/"
          target="_blank"
          rel="noopener noreferrer"
        >
          mempool.space
        </a>
      </p>
    </div>
  );
}

export default LitecoinMempoolDashboard;
