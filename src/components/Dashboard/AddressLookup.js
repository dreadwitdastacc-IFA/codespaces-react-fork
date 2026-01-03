import React, { useState } from 'react';

export default function AddressLookup() {
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('bitcoin');

  const getExplorerUrl = (addr, net) => {
    if (net === 'bitcoin') {
      return `https://mempool.space/address/${addr}`;
    } else if (net === 'ethereum') {
      return `https://etherscan.io/address/${addr}`;
    } else if (net === 'polygon') {
      return `https://polygonscan.com/address/${addr}`;
    } else if (net === 'bsc') {
      return `https://bscscan.com/address/${addr}`;
    }
    return `https://blockscan.com/address/${addr}`;
  };

  const handleLookup = () => {
    if (address.trim()) {
      const url = getExplorerUrl(address.trim(), network);
      window.open(url, '_blank');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLookup();
    }
  };

  return (
    <div
      style={{
        padding: 20,
        border: '1px solid #ccc',
        borderRadius: 8,
        margin: 10,
      }}
    >
      <h3>Blockchain Address Lookup</h3>

      <div style={{ marginBottom: 10 }}>
        <label style={{ marginRight: 10 }}>Network:</label>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          style={{ padding: 5, marginRight: 10 }}
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="bsc">BSC</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Enter blockchain address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            width: '100%',
            padding: 8,
            fontFamily: 'monospace',
            fontSize: 14,
          }}
        />
      </div>

      <button
        onClick={handleLookup}
        disabled={!address.trim()}
        style={{
          padding: '8px 16px',
          backgroundColor: address.trim() ? '#007bff' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: address.trim() ? 'pointer' : 'not-allowed',
        }}
      >
        Lookup Address
      </button>

      {address && (
        <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
          URL: {getExplorerUrl(address, network)}
        </div>
      )}
    </div>
  );
}
