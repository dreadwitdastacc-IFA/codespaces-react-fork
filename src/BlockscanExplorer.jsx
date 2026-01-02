import React, { useState } from 'react';

function BlockscanExplorer() {
  const [chain, setChain] = useState('bitcoin');
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setBalance(null);
    setTransactions([]);

    try {
      let balanceData, txData;

      if (chain === 'bitcoin') {
        // Use Blockstream API for Bitcoin
        const balanceResponse = await fetch(`https://blockstream.info/api/address/${address}`);
        const balanceJson = await balanceResponse.json();

        const txResponse = await fetch(`https://blockstream.info/api/address/${address}/txs`);
        const txJson = await txResponse.json();

        balanceData = {
          address,
          balance: (balanceJson.chain_stats.funded_txo_sum - balanceJson.chain_stats.spent_txo_sum).toString(),
          chain: 'bitcoin',
          symbol: 'BTC'
        };

        txData = txJson.slice(0, 20).map(tx => ({
          hash: tx.txid,
          from: tx.vin.map(vin => vin.prevout?.scriptpubkey_address).filter(Boolean),
          to: tx.vout.map(vout => vout.scriptpubkey_address).filter(Boolean),
          value: tx.vout.reduce((sum, vout) => sum + vout.value, 0),
          timestamp: tx.status?.block_time || Date.now() / 1000,
          chain: 'bitcoin'
        }));
      } else if (chain === 'ethereum') {
        // Use Etherscan API for Ethereum (requires API key)
        const apiKey = 'YourEtherscanAPIKey'; // This should be configurable
        const balanceResponse = await fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`);
        const balanceJson = await balanceResponse.json();

        const txResponse = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=20&sort=desc&apikey=${apiKey}`);
        const txJson = await txResponse.json();

        if (balanceJson.status === '1') {
          balanceData = {
            address,
            balance: balanceJson.result,
            chain: 'ethereum',
            symbol: 'ETH'
          };
        }

        if (txJson.status === '1') {
          txData = txJson.result.map(tx => ({
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            timestamp: parseInt(tx.timeStamp),
            chain: 'ethereum'
          }));
        }
      }

      setBalance(balanceData);
      setTransactions(txData || []);
    } catch (err) {
      setError('Failed to fetch data from Blockscan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value, symbol) => {
    if (symbol === 'BTC') {
      return `${(parseInt(value) / 100000000).toFixed(8)} BTC`;
    } else if (symbol === 'ETH') {
      return `${(parseInt(value) / 1e18).toFixed(6)} ETH`;
    }
    return `${value} ${symbol}`;
  };

  return (
    <div style={{ margin: '2rem 0', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Blockscan Multichain Explorer</h2>

      <div style={{ marginBottom: '1rem' }}>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value)}
          style={{ marginRight: '1rem', padding: '0.5rem' }}
        >
          <option value="bitcoin">Bitcoin</option>
          <option value="ethereum">Ethereum</option>
        </select>

        <input
          type="text"
          placeholder="Enter wallet address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
        />

        <button
          onClick={handleSearch}
          disabled={loading || !address.trim()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {balance && (
        <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>Balance</h3>
          <p><strong>Address:</strong> {balance.address}</p>
          <p><strong>Balance:</strong> {formatValue(balance.balance, balance.symbol)}</p>
          <p>
            <a 
              href={`https://blockscan.com/address/${balance.address}`} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#007bff', textDecoration: 'none' }}
            >
              🔗 View on Blockscan
            </a>
          </p>
        </div>
      )}

      {transactions.length > 0 && (
        <div>
          <h3>Recent Transactions</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Hash</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>From</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>To</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Value</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      <a 
                        href={`https://blockscan.com/tx/${tx.hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'none' }}
                        title={tx.hash}
                      >
                        {tx.hash.substring(0, 16)}...
                      </a>
                    </td>
                    <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {Array.isArray(tx.from) ? (
                        tx.from[0] ? (
                          <a 
                            href={`https://blockscan.com/address/${tx.from[0]}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'none' }}
                            title={tx.from[0]}
                          >
                            {tx.from[0].substring(0, 12)}...
                          </a>
                        ) : '—'
                      ) : (
                        tx.from ? (
                          <a 
                            href={`https://blockscan.com/address/${tx.from}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'none' }}
                            title={tx.from}
                          >
                            {tx.from.substring(0, 12)}...
                          </a>
                        ) : '—'
                      )}
                    </td>
                    <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {Array.isArray(tx.to) ? (
                        tx.to[0] ? (
                          <a 
                            href={`https://blockscan.com/address/${tx.to[0]}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'none' }}
                            title={tx.to[0]}
                          >
                            {tx.to[0].substring(0, 12)}...
                          </a>
                        ) : '—'
                      ) : (
                        tx.to ? (
                          <a 
                            href={`https://blockscan.com/address/${tx.to}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#007bff', textDecoration: 'none' }}
                            title={tx.to}
                          >
                            {tx.to.substring(0, 12)}...
                          </a>
                        ) : '—'
                      )}
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                      {formatValue(tx.value, balance?.symbol || 'BTC')}
                    </td>
                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                      {new Date(tx.timestamp * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlockscanExplorer;
