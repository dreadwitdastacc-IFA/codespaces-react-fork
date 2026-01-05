import fetch from 'node-fetch';

export class EthereumMonitor {
  constructor(apiKey = process.env.ETHERSCAN_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.etherscan.io/api';
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
          chain: 'ethereum'
        }));
      }
      return [];
    } catch (error) {
      console.error('Ethereum API error:', error);
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
          chain: 'ethereum',
          symbol: 'ETH'
        };
      }
      return null;
    } catch (error) {
      console.error('Ethereum balance error:', error);
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
          chain: 'ethereum'
        };
      }
      return null;
    } catch (error) {
      console.error('Ethereum gas price error:', error);
      return null;
    }
  }
}

export async function fetchETH(address) {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
  const res = await fetch(url);
  return res.json();
}
