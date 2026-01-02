import React from 'react';

export default function AlertsPanel({ alerts }) {
  if (!alerts || !alerts.length) return <div>No alerts yet.</div>;

  return (
    <div>
      <h3>Orisa Alerts</h3>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            <strong>{alert.ts}</strong> — {alert.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
