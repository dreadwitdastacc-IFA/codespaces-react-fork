import fetch from 'node-fetch';

export class SolanaMonitor {
  constructor() {
    this.baseUrl = 'https://public-api.solscan.io';
  }

  async getTransactions(address, limit = 10) {
    try {
      const url = `${this.baseUrl}/account/transactions?account=${address}&limit=${limit}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && Array.isArray(data)) {
        return data.map(tx => ({
          signature: tx.txHash,
          from: tx.signer && tx.signer[0],
          to: tx.parsedInstruction && tx.parsedInstruction[0] && tx.parsedInstruction[0].programId,
          value: tx.lamport || 0,
          fee: tx.fee || 0,
          timestamp: tx.blockTime,
          slot: tx.slot,
          chain: 'solana'
        }));
      }
      return [];
    } catch (error) {
      console.error('Solana API error:', error);
      return [];
    }
  }

  async getBalance(address) {
    try {
      const url = `${this.baseUrl}/account/${address}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.lamports) {
        return {
          address,
          balance: data.lamports.toString(),
          chain: 'solana',
          symbol: 'SOL'
        };
      }
      return null;
    } catch (error) {
      console.error('Solana balance error:', error);
      return null;
    }
  }

  async getRecentBlockhash() {
    try {
      const url = 'https://api.mainnet-beta.solana.com';
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getRecentBlockhash',
          params: [{ commitment: 'finalized' }]
        })
      });
      const data = await response.json();

      if (data.result) {
        return {
          blockhash: data.result.value.blockhash,
          feeCalculator: data.result.value.feeCalculator,
          chain: 'solana'
        };
      }
      return null;
    } catch (error) {
      console.error('Solana blockhash error:', error);
      return null;
    }
  }
}

export async function fetchSOL(address) {
  const url = `https://public-api.solscan.io/account/${address}`;
  const res = await fetch(url);
  return res.json();
}
