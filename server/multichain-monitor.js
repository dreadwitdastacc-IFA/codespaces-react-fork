import WebSocket from 'ws';
import { EthereumMonitor } from './chains/eth.js';
import { BNBSmartChainMonitor } from './chains/bnb.js';
import { SolanaMonitor } from './chains/sol.js';
import { L2Monitor } from './chains/l2.js';
import { BitcoinMonitor } from './chains/btc.js';

export function startMultichainMonitor(server) {
  const wss = new WebSocket.Server({ server, path: "/multichain" });

  // Initialize chain monitors
  const monitors = {
    ethereum: new EthereumMonitor(),
    bsc: new BNBSmartChainMonitor(),
    solana: new SolanaMonitor(),
    l2: new L2Monitor(),
    bitcoin: new BitcoinMonitor()
  };

  // Monitor wallets from environment or config
  const wallets = {
    primary: process.env.PRIMARY_WALLET || "0xYourMainWallet",
    treasury: process.env.TREASURY_WALLET || "0xYourBusinessWallet",
    ritual: process.env.RITUAL_WALLET || "0xYourSymbolicWallet",
    solana: process.env.SOLANA_WALLET || "YourSolanaAddress",
    btc: process.env.BTC_WALLET || "YourBTCAddress"
  };

  // Periodic monitoring function
  const monitorWallets = async () => {
    const results = {};

    try {
      // Monitor all wallets
      for (const [key, address] of Object.entries(wallets)) {
        try {
          let balance, transactions, gasPrice;

          if (key === 'solana') {
            balance = await monitors.solana.getBalance(address);
            transactions = await monitors.solana.getTransactions(address, 5);
          } else if (key === 'btc') {
            balance = await monitors.bitcoin.getBalance(address);
            transactions = await monitors.bitcoin.getTransactions(address, 5);
          } else {
            // Ethereum and BSC wallets
            balance = await monitors.ethereum.getBalance(address);
            transactions = await monitors.ethereum.getTransactions(address, 5);
            gasPrice = await monitors.ethereum.getGasPrice();
          }

          results[key] = {
            address,
            balance,
            recentTransactions: transactions,
            gasPrice,
            lastUpdated: Date.now()
          };
        } catch (error) {
          console.error(`Error monitoring ${key} wallet:`, error);
          results[key] = { address, error: error.message };
        }
      }

      // Broadcast to all connected clients
      const message = JSON.stringify({
        type: 'wallet_update',
        data: results,
        timestamp: Date.now()
      });

      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });

    } catch (error) {
      console.error('Multichain monitoring error:', error);
    }
  };

  // Start monitoring interval (every 30 seconds)
  const monitorInterval = setInterval(monitorWallets, 30000);

  // Initial monitoring
  monitorWallets();

  wss.on('connection', (ws) => {
    console.log('Multichain client connected');

    // Send supported chains info
    ws.send(JSON.stringify({
      type: 'chains_info',
      data: {
        supportedChains: ['ethereum', 'bsc', 'solana', 'polygon', 'arbitrum', 'optimism'],
        wallets: Object.keys(wallets)
      }
    }));

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.action === 'get_balance') {
          const { chain, address } = data;
          let balance;

          switch (chain) {
            case 'ethereum':
              balance = await monitors.ethereum.getBalance(address);
              break;
            case 'bsc':
              balance = await monitors.bsc.getBalance(address);
              break;
            case 'solana':
              balance = await monitors.solana.getBalance(address);
              break;
            case 'polygon':
            case 'arbitrum':
            case 'optimism':
              balance = await monitors.l2.getBalance(chain, address);
              break;
          }

          ws.send(JSON.stringify({
            type: 'balance_response',
            data: balance,
            requestId: data.requestId
          }));
        }

        if (data.action === 'get_transactions') {
          const { chain, address, limit = 10 } = data;
          let transactions;

          switch (chain) {
            case 'ethereum':
              transactions = await monitors.ethereum.getTransactions(address, limit);
              break;
            case 'bsc':
              transactions = await monitors.bsc.getTransactions(address, limit);
              break;
            case 'solana':
              transactions = await monitors.solana.getTransactions(address, limit);
              break;
            case 'polygon':
            case 'arbitrum':
            case 'optimism':
              transactions = await monitors.l2.getTransactions(chain, address, limit);
              break;
          }

          ws.send(JSON.stringify({
            type: 'transactions_response',
            data: transactions,
            requestId: data.requestId
          }));
        }

      } catch (error) {
        console.error('Multichain message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: error.message
        }));
      }
    });
  });

  console.log('Multichain monitor started');

  // Cleanup function
  return () => {
    clearInterval(monitorInterval);
    wss.close();
  };
}
