import React from "react";

export default function MempoolBlocksTable({ mempoolBlocks }) {
  if (!mempoolBlocks || !mempoolBlocks.length) {
    return <div>No mempool blocks yet.</div>;
  }

  return (
    <div>
      <h3>Virtual Mempool Blocks</h3>
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>Fee Total</th>
            <th>Size</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {mempoolBlocks.map((blk, idx) => (
            <tr key={idx}>
              <td>{idx}</td>
              <td>{blk.fees}</td>
              <td>{blk.size}</td>
              <td>{blk.weight}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
