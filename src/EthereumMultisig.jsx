import React, { useState } from 'react';

function EthereumMultisig() {
  const [owners, setOwners] = useState(['', '']);
  const [threshold, setThreshold] = useState(2);
  const [network, setNetwork] = useState('mainnet');

  const addOwner = () => {
    setOwners([...owners, '']);
  };

  const updateOwner = (index, value) => {
    const newOwners = [...owners];
    newOwners[index] = value;
    setOwners(newOwners);
  };

  const removeOwner = (index) => {
    if (owners.length > 2) {
      setOwners(owners.filter((_, i) => i !== index));
    }
  };

  const validOwners = owners.filter(addr => addr.match(/^0x[a-fA-F0-9]{40}$/));
  const uniqueOwners = [...new Set(validOwners.map(addr => addr.toLowerCase()))];
  const hasDuplicates = uniqueOwners.length < validOwners.length;

  const getGnosisSafeUrl = () => {
    const networkMap = {
      mainnet: 'eth',
      bnb: 'bnb',
      polygon: 'matic',
      arbitrum: 'arb1',
      optimism: 'oeth',
      goerli: 'gor',
      sepolia: 'sep'
    };
    return `https://gnosis-safe.io/app/${networkMap[network] || 'eth'}/home`;
  };

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Ethereum & BNB Multisig Setup</h2>
      <p>Ethereum and BNB Smart Chain use smart contracts for multisig (unlike Bitcoin&#39;s script-based approach).</p>
      <p><strong>Recommended: Use Gnosis Safe</strong> - The most secure and widely&#39;used Ethereum multisig wallet.</p>

      <div style={{ marginBottom: '1rem' }}>
        <label>Network:</label>
        <select value={network} onChange={(e) => setNetwork(e.target.value)} style={{ marginLeft: '0.5rem' }}>
          <option value="mainnet">Ethereum Mainnet</option>
          <option value="bnb">BNB Smart Chain</option>
          <option value="polygon">Polygon</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="optimism">Optimism</option>
          <option value="goerli">Goerli Testnet</option>
          <option value="sepolia">Sepolia Testnet</option>
        </select>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Threshold (signatures required):</label>
        <input
          type="number"
          min="1"
          max={owners.length}
          value={threshold}
          onChange={(e) => setThreshold(Math.min(parseInt(e.target.value) || 1, owners.length))}
          style={{ marginLeft: '0.5rem', width: '60px' }}
        />
      </div>

      <h3>Owner Addresses</h3>
      {owners.map((owner, index) => (
        <div key={index} style={{ marginBottom: '0.5rem' }}>
          <input
            type="text"
            value={owner}
            onChange={(e) => updateOwner(index, e.target.value)}
            placeholder="0x..."
            style={{ width: '400px', padding: '0.5rem' }}
          />
          {owners.length > 2 && (
            <button onClick={() => removeOwner(index)} style={{ marginLeft: '0.5rem' }}>Remove</button>
          )}
        </div>
      ))}
      <button onClick={addOwner} style={{ marginBottom: '1rem' }}>Add Owner</button>

      <div style={{ marginTop: '1rem' }}>
        <h3>Setup Instructions</h3>
        <ol>
          <li>Go to <a href="https://gnosis-safe.io/" target="_blank" rel="noopener noreferrer">Gnosis Safe</a></li>
          <li>Connect your wallet</li>
          <li>Create a new Safe with the addresses above</li>
          <li>Set threshold to {threshold}</li>
          <li>Deploy the Safe contract</li>
        </ol>
        <p><strong>Valid owners:</strong> {validOwners.length} / {owners.length}</p>
        {hasDuplicates && <p style={{ color: 'orange' }}>Warning: Duplicate addresses detected!</p>}
        {validOwners.length < threshold && <p style={{ color: 'red' }}>Warning: Not enough valid owners for the threshold!</p>}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={() => window.open(getGnosisSafeUrl(), '_blank')}
          style={{ padding: '0.5rem 1rem', background: '#00d4aa', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Open Gnosis Safe for {network}
        </button>
        <p><small>Click to create your multisig safe with the configured owners and threshold.</small></p>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f0f0', borderRadius: '4px' }}>
        <h4>Why Gnosis Safe?</h4>
        <ul>
          <li>Battle-tested smart contract</li>
          <li>Supports up to 10 owners</li>
          <li>Module system for advanced features</li>
          <li>Compatible with hardware wallets</li>
          <li>Active development and audits</li>
        </ul>
      </div>
    </div>
  );
}

export default EthereumMultisig;
