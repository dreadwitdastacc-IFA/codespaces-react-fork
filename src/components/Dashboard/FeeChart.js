import React from 'react';

export default function FeeChart({ stats }) {
  if (!stats || !stats.feeHistogram) return <div>No fee data yet.</div>;

  const histogram = stats.feeHistogram;
  const maxVsize = Math.max(...histogram.map(([_, v]) => v));

  return (
    <div>
      <h3>Fee Histogram</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 150 }}>
        {histogram.map(([feeRate, vsize]) => {
          const height = (vsize / maxVsize) * 100;
          return (
            <div
              key={feeRate}
              title={`${feeRate} sat/vB`}
              style={{
                width: 4,
                marginRight: 1,
                background: '#fbbf24',
                height: `${height}%`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
