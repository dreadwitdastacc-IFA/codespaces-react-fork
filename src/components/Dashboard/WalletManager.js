import React, { useState } from 'react';

const WALLETS = {
  primary: '0xYourMainWallet',
  treasury: '0xYourBusinessWallet',
  ritual: '0xYourSymbolicWallet',
  solana: 'YourSolanaAddress',
  btc: 'YourBTCAddress',
};

export default function WalletManager() {
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');

  const getExplorerUrl = (address, network) => {
    switch (network) {
      case 'ethereum':
        return `https://etherscan.io/address/${address}`;
      case 'polygon':
        return `https://polygonscan.com/address/${address}`;
      case 'bsc':
        return `https://bscscan.com/address/${address}`;
      case 'solana':
        return `https://solscan.io/account/${address}`;
      case 'bitcoin':
        return `https://mempool.space/address/${address}`;
      default:
        return `https://blockscan.com/address/${address}`;
    }
  };

  const getNetworkForWallet = (walletKey) => {
    if (walletKey === 'btc') return 'bitcoin';
    if (walletKey === 'solana') return 'solana';
    return 'ethereum'; // Default for EVM addresses
  };

  const handleLookup = (address, network) => {
    const url = getExplorerUrl(address, network);
    window.open(url, '_blank');
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
      <h3>Wallet Manager</h3>

      <div style={{ display: 'grid', gap: 10 }}>
        {Object.entries(WALLETS).map(([key, address]) => {
          const network = getNetworkForWallet(key);
          return (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 10,
                backgroundColor: '#f9f9f9',
                borderRadius: 4,
              }}
            >
              <div>
                <strong style={{ textTransform: 'capitalize' }}>{key}:</strong>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    marginTop: 4,
                    wordBreak: 'break-all',
                  }}
                >
                  {address}
                </div>
              </div>
              <button
                onClick={() => handleLookup(address, network)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                View on{' '}
                {network === 'bitcoin'
                  ? 'Mempool'
                  : network === 'solana'
                    ? 'Solscan'
                    : 'Explorer'}
              </button>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#e9ecef',
          borderRadius: 4,
        }}
      >
        <h4>Quick Network Switch</h4>
        <select
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value)}
          style={{ padding: 5, marginRight: 10 }}
        >
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="bsc">BSC</option>
          <option value="solana">Solana</option>
          <option value="bitcoin">Bitcoin</option>
        </select>
        <button
          onClick={() => {
            const wallet = Object.entries(WALLETS).find(
              ([key]) => getNetworkForWallet(key) === selectedNetwork
            );
            if (wallet) {
              handleLookup(wallet[1], selectedNetwork);
            }
          }}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Open{' '}
          {selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1)}{' '}
          Wallet
        </button>
      </div>
    </div>
  );
}
