import React, { useState, useEffect } from "react";
import { fetchMultichain } from "../services/multichainAPI";
import { classifyOrisa } from "../../server/mempool-orisa";

export default function MultiChainOrisa() {
  const [chainData, setChainData] = useState({});
  const [orisaSignals, setOrisaSignals] = useState({});
  const [loading, setLoading] = useState(false);

  const addresses = {
    eth: "0xYourMainWallet",
    sol: "YourSolanaAddress",
    bnb: "0xYourBusinessWallet"
  };

  const analyzeChains = async () => {
    setLoading(true);
    try {
      const data = await fetchMultichain(addresses);
      setChainData(data);

      // Analyze each chain with Orisa
      const signals = {};
      for (const [chain, chainData] of Object.entries(data)) {
        if (chainData.result || chainData.lamports) {
          // Create analysis data for Orisa classification
          const analysisData = {
            gasPrice: chain === 'eth' ? parseInt(chainData.result?.gasPrice || 0) : 0,
            liquidity: chain === 'bnb' ? parseInt(chainData.result || 0) : 0,
            tps: chain === 'sol' ? (chainData.lamports ? 1000 : 0) : 0 // Simplified TPS calculation
          };

          signals[chain] = classifyOrisa(chain, analysisData);
        }
      }

      setOrisaSignals(signals);
    } catch (error) {
      console.error('Multi-chain Orisa analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    analyzeChains();
    const interval = setInterval(analyzeChains, 60000); // Analyze every minute
    return () => clearInterval(interval);
  }, []);

  const getOrisaEmoji = (orisa) => {
    const emojis = {
      "Ṣàngó": "⚡",
      "Ọ̀ṣun": "💰",
      "Ọya": "🌪️",
      "Ogun": "⚔️"
    };
    return emojis[orisa] || "🤔";
  };

  return (
    <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 8, margin: 10 }}>
      <h3>Multi-Chain Orisa Analysis</h3>

      <button
        onClick={analyzeChains}
        disabled={loading}
        style={{
          padding: '8px 16px',
          backgroundColor: loading ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: 15
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Chains'}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 15 }}>

        {Object.entries(orisaSignals).map(([chain, signal]) => (
          <div key={chain} style={{
            border: '1px solid #eee',
            borderRadius: 6,
            padding: 15,
            backgroundColor: signal.orisa ? '#f8fff8' : '#fff'
          }}>
            <h4 style={{ textTransform: 'uppercase', marginBottom: 10 }}>
              {chain === 'eth' ? '🌐 Ethereum' :
               chain === 'sol' ? '☀️ Solana' :
               chain === 'bnb' ? '💎 BNB Chain' : chain}
            </h4>

            {signal.orisa ? (
              <div>
                <div style={{ fontSize: 24, marginBottom: 8 }}>
                  {getOrisaEmoji(signal.orisa)} {signal.orisa}
                </div>
                <div style={{ color: '#666', fontSize: 14 }}>
                  {signal.reason.replace(/_/g, ' ')}
                </div>
              </div>
            ) : (
              <div style={{ color: '#999' }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>🤔</div>
                Baseline conditions
              </div>
            )}

            {chainData[chain] && (
              <div style={{ marginTop: 10, fontSize: 12, color: '#666' }}>
                {chain === 'eth' && chainData[chain].result && (
                  <div>Balance: {(parseInt(chainData[chain].result) / 1e18).toFixed(4)} ETH</div>
                )}
                {chain === 'sol' && chainData[chain].lamports && (
                  <div>Balance: {(chainData[chain].lamports / 1e9).toFixed(4)} SOL</div>
                )}
                {chain === 'bnb' && chainData[chain].result && (
                  <div>Balance: {(parseInt(chainData[chain].result) / 1e18).toFixed(4)} BNB</div>
                )}
              </div>
            )}
          </div>
        ))}

      </div>

      <div style={{ marginTop: 20, padding: 15, backgroundColor: '#f8f9fa', borderRadius: 6 }}>
        <h4>Orisa Guide</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, fontSize: 14 }}>
          <div><strong>Ṣàngó ⚡</strong> - High volatility, energy surges</div>
          <div><strong>Ọ̀ṣun 💰</strong> - Abundance, flowing wealth</div>
          <div><strong>Ọya 🌪️</strong> - Storms, rapid change</div>
          <div><strong>Ogun ⚔️</strong> - Strength, forging ahead</div>
        </div>
      </div>
    </div>
  );
}
