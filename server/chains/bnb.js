import fetch from 'node-fetch';

export class BNBSmartChainMonitor {
  constructor(apiKey = process.env.BSCSCAN_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.bscscan.com/api';
  }

  async getTransactions(address, limit = 10) {
    try {
      const url = `${this.baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === '1') {
        return data.result.map(tx => ({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gasPrice: tx.gasPrice,
          gasUsed: tx.gasUsed,
          timestamp: parseInt(tx.timeStamp),
          blockNumber: parseInt(tx.blockNumber),
          chain: 'bsc'
        }));
      }
      return [];
    } catch (error) {
      console.error('BSC API error:', error);
      return [];
    }
  }

  async getBalance(address) {
    try {
      const url = `${this.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === '1') {
        return {
          address,
          balance: data.result,
          chain: 'bsc',
          symbol: 'BNB'
        };
      }
      return null;
    } catch (error) {
      console.error('BSC balance error:', error);
      return null;
    }
  }

  async getGasPrice() {
    try {
      const url = `${this.baseUrl}?module=gastracker&action=gasoracle&apikey=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === '1') {
        return {
          slow: data.result.SafeGasPrice,
          standard: data.result.ProposeGasPrice,
          fast: data.result.FastGasPrice,
          chain: 'bsc'
        };
      }
      return null;
    } catch (error) {
      console.error('BSC gas price error:', error);
      return null;
    }
  }
}

export async function fetchBNB(address) {
  const apiKey = process.env.BSCSCAN_API_KEY;
  const url = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
  const res = await fetch(url);
  return res.json();
}
