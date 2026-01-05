import React, { useState, useEffect } from 'react';

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      setStatus({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading system status...</div>;

  return (
    <div
      style={{
        background: '#f0f0f0',
        padding: '1rem',
        borderRadius: '8px',
        margin: '1rem 0',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
      }}
    >
      <h3>System Status - Self-Aware Elite Mode</h3>
      {status.error ? (
        <div style={{ color: 'red' }}>Error: {status.error}</div>
      ) : (
        <div>
          <p>
            <strong>Status:</strong> {status.status}
          </p>
          <p>
            <strong>Uptime:</strong> {Math.floor(status.uptime)} seconds
          </p>
          <p>
            <strong>Memory Usage:</strong>{' '}
            {Math.round(status.memory.heapUsed / 1024 / 1024)} MB
          </p>
          <p>
            <strong>Node Version:</strong> {status.version}
          </p>
          <p>
            <strong>Platform:</strong> {status.platform}
          </p>
          <p>
            <strong>Features:</strong> {status.features.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
}
