import fetch from 'node-fetch';

export class L2Monitor {
  constructor() {
    this.chains = {
      polygon: {
        name: 'Polygon',
        apiUrl: 'https://api.polygonscan.com/api',
        apiKey: process.env.POLYGONSCAN_API_KEY
      },
      arbitrum: {
        name: 'Arbitrum',
        apiUrl: 'https://api.arbiscan.io/api',
        apiKey: process.env.ARBISCAN_API_KEY
      },
      optimism: {
        name: 'Optimism',
        apiUrl: 'https://api-optimistic.etherscan.io/api',
        apiKey: process.env.OPTIMISM_API_KEY
      }
    };
  }

  async getTransactions(chain, address, limit = 10) {
    const chainConfig = this.chains[chain];
    if (!chainConfig) {
      console.error(`Unsupported L2 chain: ${chain}`);
      return [];
    }

    try {
      const url = `${chainConfig.apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${chainConfig.apiKey}`;
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
          chain: chain,
          l1Fee: tx.l1Fee || null // L2 specific fee
        }));
      }
      return [];
    } catch (error) {
      console.error(`${chain} API error:`, error);
      return [];
    }
  }

  async getBalance(chain, address) {
    const chainConfig = this.chains[chain];
    if (!chainConfig) {
      console.error(`Unsupported L2 chain: ${chain}`);
      return null;
    }

    try {
      const url = `${chainConfig.apiUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${chainConfig.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === '1') {
        return {
          address,
          balance: data.result,
          chain: chain,
          symbol: chainConfig.name === 'Polygon' ? 'MATIC' : 'ETH'
        };
      }
      return null;
    } catch (error) {
      console.error(`${chain} balance error:`, error);
      return null;
    }
  }

  async getGasPrice(chain) {
    const chainConfig = this.chains[chain];
    if (!chainConfig) {
      console.error(`Unsupported L2 chain: ${chain}`);
      return null;
    }

    try {
      const url = `${chainConfig.apiUrl}?module=gastracker&action=gasoracle&apikey=${chainConfig.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === '1') {
        return {
          slow: data.result.SafeGasPrice,
          standard: data.result.ProposeGasPrice,
          fast: data.result.FastGasPrice,
          chain: chain
        };
      }
      return null;
    } catch (error) {
      console.error(`${chain} gas price error:`, error);
      return null;
    }
  }

  getSupportedChains() {
    return Object.keys(this.chains);
  }
}
