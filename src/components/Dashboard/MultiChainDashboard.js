import React, { useState, useEffect } from 'react';
import {
  fetchETH,
  fetchTransactionsETH,
  fetchGasPriceETH,
  fetchSOL,
  fetchTransactionsSOL,
  fetchBTC,
  fetchBlockscan,
} from '../services/blockchainAPI';

export default function MultiChainDashboard() {
  const [ethData, setEthData] = useState(null);
  const [solData, setSolData] = useState(null);
  const [btcData, setBtcData] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const wallets = {
    primary: '0xYourMainWallet',
    treasury: '0xYourBusinessWallet',
    ritual: '0xYourSymbolicWallet',
    solana: 'YourSolanaAddress',
    btc: 'YourBTCAddress',
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      // Load Ethereum data
      const [ethBalance, ethTx, gas] = await Promise.all([
        fetchETH(wallets.primary),
        fetchTransactionsETH(wallets.primary, 5),
        fetchGasPriceETH(),
      ]);

      setEthData({ balance: ethBalance, transactions: ethTx });
      setGasPrice(gas);

      // Load Solana data
      const [solBalance, solTx] = await Promise.all([
        fetchSOL(wallets.solana),
        fetchTransactionsSOL(wallets.solana, 5),
      ]);

      setSolData({ balance: solBalance, transactions: solTx });

      // Load Bitcoin data
      const btcBalance = await fetchBTC(wallets.btc);
      setBtcData(btcBalance);
    } catch (error) {
      console.error('Error loading multi-chain data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
    // Refresh every 30 seconds
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatBalance = (balance, decimals = 18) => {
    if (!balance) return '0';
    const value = parseInt(balance) / Math.pow(10, decimals);
    return value.toFixed(4);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Multi-Chain Portfolio</h2>

      <button
        onClick={loadAllData}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 20,
        }}
      >
        {loading ? 'Loading...' : 'Refresh Data'}
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        {/* Ethereum Section */}
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 15 }}>
          <h3>🌐 Ethereum</h3>
          {ethData?.balance && (
            <div>
              <strong>Balance:</strong> {formatBalance(ethData.balance.result)}{' '}
              ETH
            </div>
          )}
          {gasPrice?.result && (
            <div style={{ marginTop: 10 }}>
              <strong>Gas Prices:</strong>
              <div>Slow: {gasPrice.result.SafeGasPrice} gwei</div>
              <div>Standard: {gasPrice.result.ProposeGasPrice} gwei</div>
              <div>Fast: {gasPrice.result.FastGasPrice} gwei</div>
            </div>
          )}
          {ethData?.transactions?.result && (
            <div style={{ marginTop: 10 }}>
              <strong>Recent Transactions:</strong>
              <div style={{ maxHeight: 150, overflowY: 'auto', marginTop: 5 }}>
                {ethData.transactions.result.slice(0, 3).map((tx, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      padding: 5,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 3,
                    }}
                  >
                    {formatTimestamp(tx.timeStamp)} - {formatBalance(tx.value)}{' '}
                    ETH
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Solana Section */}
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 15 }}>
          <h3>☀️ Solana</h3>
          {solData?.balance && (
            <div>
              <strong>Balance:</strong>{' '}
              {(solData.balance.lamports / 1000000000).toFixed(4)} SOL
            </div>
          )}
          {solData?.transactions && Array.isArray(solData.transactions) && (
            <div style={{ marginTop: 10 }}>
              <strong>Recent Transactions:</strong>
              <div style={{ maxHeight: 150, overflowY: 'auto', marginTop: 5 }}>
                {solData.transactions.slice(0, 3).map((tx, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: 12,
                      marginBottom: 5,
                      padding: 5,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 3,
                    }}
                  >
                    {new Date(tx.blockTime * 1000).toLocaleString()} -{' '}
                    {tx.txHash?.slice(0, 8)}...
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bitcoin Section */}
        <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 15 }}>
          <h3>₿ Bitcoin</h3>
          {btcData && (
            <div>
              <div>
                <strong>Balance:</strong>{' '}
                {btcData.chain_stats?.funded_txo_sum
                  ? (btcData.chain_stats.funded_txo_sum / 100000000).toFixed(8)
                  : '0'}{' '}
                BTC
              </div>
              <div>
                <strong>Transactions:</strong>{' '}
                {btcData.chain_stats?.tx_count || 0}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
