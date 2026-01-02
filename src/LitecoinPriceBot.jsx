import React, { useEffect, useState } from 'react';

// Allow API URL override via environment variable for proxy/firewall workarounds
const API_URL = import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd';

// Fallback mock data when API is unreachable (e.g., blocked by firewall)
const FALLBACK_PRICE = 105.50; // Approximate LTC price as fallback

const LitecoinPriceBot = () => {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    fetch(API_URL, { signal: controller.signal })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setPrice(data.litecoin.usd);
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        console.warn('Failed to fetch Litecoin price from API:', err.message);
        // Use fallback data when API is blocked or unavailable
        setPrice(FALLBACK_PRICE);
        setUsedFallback(true);
        setError('Using cached price data (API unreachable - may be blocked by firewall)');
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  if (loading) return <div>Loading Litecoin price...</div>;
  if (price === null || price === undefined) return <div>No price data available.</div>;

  return (
    <div style={{ margin: '1rem 0', padding: '1rem', border: '1px solid #b0b0b0', borderRadius: '8px', background: usedFallback ? '#fff3cd' : '#f8f8f8' }}>
      <h2>Litecoin Price Bot</h2>
      <p>1 Litecoin (LTC) = <strong>${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</strong></p>
      {usedFallback && (
        <p style={{ color: '#856404', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          ⚠️ {error}
        </p>
      )}
      <small>Powered by CoinGecko{usedFallback ? ' (Fallback Data)' : ''}</small>
    </div>
  );
};

export default LitecoinPriceBot;
