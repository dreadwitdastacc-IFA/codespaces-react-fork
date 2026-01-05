import fetch from 'node-fetch';

export class BitcoinMonitor {
  constructor() {
    this.baseUrl = 'https://blockstream.info/api';
  }

  async getTransactions(address, limit = 10) {
    try {
      // Get transaction history for an address
      const url = `${this.baseUrl}/address/${address}/txs`;
      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        return data.slice(0, limit).map(tx => ({
          hash: tx.txid,
          from: tx.vin.map(vin => vin.prevout?.scriptpubkey_address).filter(Boolean),
          to: tx.vout.map(vout => vout.scriptpubkey_address).filter(Boolean),
          value: tx.vout.reduce((sum, vout) => sum + vout.value, 0),
          fee: tx.fee,
          timestamp: tx.status?.block_time || Date.now() / 1000,
          blockNumber: tx.status?.block_height || null,
          chain: 'bitcoin'
        }));
      }
      return [];
    } catch (error) {
      console.error('Bitcoin API error:', error);
      return [];
    }
  }

  async getBalance(address) {
    try {
      const url = `${this.baseUrl}/address/${address}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && typeof data.chain_stats !== 'undefined') {
        // Calculate balance from UTXOs
        const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
        return {
          address,
          balance: balance.toString(),
          chain: 'bitcoin',
          symbol: 'BTC'
        };
      }
      return null;
    } catch (error) {
      console.error('Bitcoin balance API error:', error);
      return null;
    }
  }

  async getBlockHeight() {
    try {
      const url = `${this.baseUrl}/blocks/tip/height`;
      const response = await fetch(url);
      const height = await response.text();
      return parseInt(height);
    } catch (error) {
      console.error('Bitcoin block height API error:', error);
      return null;
    }
  }

  async getMempoolInfo() {
    try {
      const url = `${this.baseUrl}/mempool`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && typeof data.count !== 'undefined') {
        return {
          count: data.count,
          vsize: data.vsize,
          total_fee: data.total_fee,
          chain: 'bitcoin'
        };
      }
      return null;
    } catch (error) {
      console.error('Bitcoin mempool API error:', error);
      return null;
    }
  }
}
