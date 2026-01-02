import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { renderWithProviders, mockApiResponse } from './test-utils.jsx';
import App from './App';

// Mock lazy-loaded components
vi.mock('./ProfitLossSummary', () => ({
  default: () => (
    <div data-testid="profit-loss-summary">Profit Loss Summary</div>
  ),
}));

vi.mock('./ExpenseBreakdown', () => ({
  default: () => <div data-testid="expense-breakdown">Expense Breakdown</div>,
}));

vi.mock('./ReportGenerator', () => ({
  default: () => <div data-testid="report-generator">Report Generator</div>,
}));

vi.mock('./ExpenseBreakdownChart', () => ({
  default: () => (
    <div data-testid="expense-breakdown-chart">Expense Breakdown Chart</div>
  ),
}));

vi.mock('./LitecoinPriceBot', () => ({
  default: () => <div data-testid="litecoin-price-bot">Litecoin Price Bot</div>,
}));

vi.mock('./LitecoinMempoolTransactions', () => ({
  default: () => (
    <div data-testid="litecoin-mempool">Litecoin Mempool Transactions</div>
  ),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main app structure', async () => {
    render(<App />);

    expect(screen.getByText('dreadwitdastacc-IFA')).toBeInTheDocument();
    expect(
      screen.getByText(/Advanced Cryptocurrency Mining/)
    ).toBeInTheDocument();
  });

  it('renders loading states for lazy components', async () => {
    render(<App />);

    expect(screen.getByText(/Loading Litecoins tools/)).toBeInTheDocument();
    expect(screen.getByText(/Loading analytics/)).toBeInTheDocument();
  });

  it('renders lazy-loaded components after loading', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('litecoin-price-bot')).toBeInTheDocument();
      expect(screen.getByTestId('litecoin-mempool')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('profit-loss-summary')).toBeInTheDocument();
      expect(screen.getByTestId('expense-breakdown-chart')).toBeInTheDocument();
    });
  });

  it('displays analytics section', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Analytics')).toBeInTheDocument();
    });
  });

  it('handles vite:preloadError events', () => {
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    });

    render(<App />);

    // Simulate preload error
    window.dispatchEvent(new Event('vite:preloadError'));

    expect(mockReload).toHaveBeenCalled();
  });

  it('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeDefined();
  });
});
