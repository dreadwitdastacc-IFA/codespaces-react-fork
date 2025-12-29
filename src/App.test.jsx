import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock components to avoid dependencies
vi.mock('./ExpenseBreakdown', () => {
  const MockExpenseBreakdown = () => React.createElement('div', null, 'Expense Breakdown');
  return { default: MockExpenseBreakdown };
});
vi.mock('./ReportGenerator', () => {
  const MockReportGenerator = () => React.createElement('div', null, 'Report Generator');
  return { default: MockReportGenerator };
});
vi.mock('./LitecoinMempoolTransactions', () => {
  const MockLitecoinMempoolTransactions = () => React.createElement('div', null, 'Litecoin Mempool Transactions');
  return { default: MockLitecoinMempoolTransactions };
});
vi.mock('./LitecoinMempoolDashboard', () => {
  const MockLitecoinMempoolDashboard = () => React.createElement('div', null, 'Litecoin Mempool Dashboard');
  return { default: MockLitecoinMempoolDashboard };
});
vi.mock('./Persmix', () => {
  const MockPersmix = () => React.createElement('div', null, 'Persmix');
  return { default: MockPersmix };
});
vi.mock('./Persmix/PersmixOpenAIChat', () => {
  const MockPersmixOpenAIChat = () => React.createElement('div', null, 'Persmix OpenAI Chat');
  return { default: MockPersmixOpenAIChat };
});
vi.mock('./Persmix/EliteTerminal', () => {
  const MockEliteTerminal = () => React.createElement('div', null, 'Elite Terminal');
  return { default: MockEliteTerminal };
});
vi.mock('./Persmix/SystemStatus', () => {
  const MockSystemStatus = () => React.createElement('div', null, 'System Status');
  return { default: MockSystemStatus };
});

import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeDefined();
});
