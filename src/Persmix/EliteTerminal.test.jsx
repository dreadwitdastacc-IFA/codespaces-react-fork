import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EliteTerminal from './EliteTerminal';

vi.mock('./Persmix.css', () => ({}));

describe('EliteTerminal', () => {
  const mockOnCommand = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header and input', () => {
    render(<EliteTerminal onCommand={mockOnCommand} />);
    expect(screen.getByText('Elite Terminal - Auto-Complete Enabled')).toBeTruthy();
    expect(screen.getByPlaceholderText('Type a command... (Tab for suggestions, ↑/↓ for history)')).toBeTruthy();
  });

  it('shows suggestions on typing and executes command on Enter', async () => {
    const user = userEvent.setup();
    render(<EliteTerminal onCommand={mockOnCommand} />);
    const input = screen.getByPlaceholderText('Type a command... (Tab for suggestions, ↑/↓ for history)');
    await user.type(input, 'ls');
    expect(input.value).toBe('ls');
    // suggestion list should contain 'ls'
    expect(screen.getByText('ls')).toBeTruthy();
    await user.keyboard('{Enter}');
    expect(mockOnCommand).toHaveBeenCalledWith('ls');
  });
});
