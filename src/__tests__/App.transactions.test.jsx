import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from 'vitest';

// Mock components to avoid dependencies
vi.mock('../ExpenseBreakdown', () => {
  const MockExpenseBreakdown = () => React.createElement('div', null, 'Expense Breakdown');
  return { default: MockExpenseBreakdown };
});
vi.mock('../ReportGenerator', () => {
  const MockReportGenerator = () => React.createElement('div', null, 'Report Generator');
  return { default: MockReportGenerator };
});
vi.mock('../LitecoinMempoolTransactions', () => {
  const MockLitecoinMempoolTransactions = () => React.createElement('div', null, 'Litecoin Mempool Transactions');
  return { default: MockLitecoinMempoolTransactions };
});
vi.mock('../LitecoinMempoolDashboard', () => {
  const MockLitecoinMempoolDashboard = () => React.createElement('div', null, 'Litecoin Mempool Dashboard');
  return { default: MockLitecoinMempoolDashboard };
});
vi.mock('../Persmix', () => {
  const MockPersmix = () => React.createElement('div', null, 'Persmix');
  return { default: MockPersmix };
});
vi.mock('../Persmix/PersmixOpenAIChat', () => {
  const MockPersmixOpenAIChat = () => React.createElement('div', null, 'Persmix OpenAI Chat');
  return { default: MockPersmixOpenAIChat };
});
vi.mock('../Persmix/EliteTerminal', () => {
  const MockEliteTerminal = () => React.createElement('div', null, 'Elite Terminal');
  return { default: MockEliteTerminal };
});
vi.mock('../Persmix/SystemStatus', () => {
  const MockSystemStatus = () => React.createElement('div', null, 'System Status');
  return { default: MockSystemStatus };
});

import App from "../App";

describe("App integration", () => {
  test("renders header and featured video", () => {
    render(<App />);
    const brands = screen.getAllByText(/dreadwitdastacc-IFA/i);
    const featured = screen.getByRole("heading", { name: /featured/i });
    const videoTitle = screen.getByText(/Mini Short Live Performance Video/i);

    expect(brands).toHaveLength(2);
    expect(featured).toBeDefined();
    expect(videoTitle).toBeDefined();
  });
});
