import React, { useEffect, useState } from 'react';

const API_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd';

const LitecoinPriceBot = () => {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setPrice(data.litecoin.usd);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch Litecoin price');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading Litecoin price...</div>;
  if (error) return <div>{error}</div>;
  if (price === null) return <div>No price data available.</div>;

  return (
    <div
      style={{
        margin: '1rem 0',
        padding: '1rem',
        border: '1px solid #b0b0b0',
        borderRadius: '8px',
        background: '#f8f8f8',
      }}
    >
      <h2>Litecoin Price Bot</h2>
      <p>
        1 Litecoin (LTC) ={' '}
        <strong>
          $
          {price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}{' '}
          USD
        </strong>
      </p>
      <small>Powered by CoinGecko</small>
    </div>
  );
};

export default LitecoinPriceBot;
