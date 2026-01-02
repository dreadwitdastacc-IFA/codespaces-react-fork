import React from 'react';
import { render } from '@testing-library/react';

// Mock API response utility
export const mockApiResponse = (data, status = 200) => {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
};

// Render with providers utility
export const renderWithProviders = (ui, options = {}) => {
  const { ...renderOptions } = options;

  // Add any providers here if needed (e.g., Router, Theme, etc.)
  const Wrapper = ({ children }) => {
    return (
      <React.Fragment>
        {children}
      </React.Fragment>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};
