import { create } from 'zustand';

export const useMempoolStore = create((set, get) => ({
  // State
  blocks: [],
  stats: null,
  alerts: [],
  orisaSignals: [],

  // Actions
  addBlock: (block) =>
    set((state) => ({
      blocks: [...state.blocks.slice(-99), block], // Keep last 100 blocks
    })),

  updateStats: (stats) => set({ stats }),

  addAlert: (alert) =>
    set((state) => ({
      alerts: [...state.alerts.slice(-9), { ...alert, timestamp: Date.now() }], // Keep last 10 alerts
    })),

  addOrisaSignal: (signal) =>
    set((state) => ({
      orisaSignals: [
        ...state.orisaSignals.slice(-49),
        { ...signal, timestamp: Date.now() },
      ], // Keep last 50 signals
    })),

  clearAlerts: () => set({ alerts: [] }),

  // Computed values
  getRecentBlocks: (limit = 10) => {
    const state = get();
    return state.blocks.slice(-limit);
  },

  getActiveAlerts: () => {
    const state = get();
    return state.alerts.filter(
      (alert) => Date.now() - alert.timestamp < 5 * 60 * 1000 // Active within last 5 minutes
    );
  },

  getLatestSignal: () => {
    const state = get();
    return state.orisaSignals[state.orisaSignals.length - 1];
  },
}));
