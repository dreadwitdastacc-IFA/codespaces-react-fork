import React from "react";
import { useMempool } from "../../hooks/useMempool";
import FeeChart from "./FeeChart";
import MempoolBlocksTable from "./MempoolBlocksTable";
import AlertsPanel from "./AlertsPanel";
import AddressLookup from "./AddressLookup";
import WalletManager from "./WalletManager";
import MultiChainDashboard from "./MultiChainDashboard";
import MultiChainOrisa from "./MultiChainOrisa";

export default function Dashboard() {
  const { mempoolBlocks, stats, orisaSignal, alerts } = useMempool();

  return (
    <div style={{ padding: 20 }}>
      <h1>GoGetumminmine Mempool Monitor</h1>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <AddressLookup />
        <WalletManager />
      </div>

      <MultiChainDashboard />
      <MultiChainOrisa />

      <div>
        <h2>Current Orisa Signal</h2>
        {orisaSignal && orisaSignal.orisa ? (
          <p>
            {orisaSignal.orisa} — {orisaSignal.reason}
          </p>
        ) : (
          <p>Baseline.</p>
        )}
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 2 }}>
          <FeeChart stats={stats} />
          <MempoolBlocksTable mempoolBlocks={mempoolBlocks} />
        </div>
        <div style={{ flex: 1 }}>
          <AlertsPanel alerts={alerts} />
        </div>
      </div>
    </div>
  );
}
