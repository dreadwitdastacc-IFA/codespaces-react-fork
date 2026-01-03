import { describe, it, expect, vi, beforeEach } from 'vitest';

// mock config used by @testing-library/dom
vi.mock('@testing-library/dom/dist/config', () => ({
  getConfig: () => ({
    getElementError: (msg, el) => ({ message: el && el.tagName ? `Error for ${el.tagName}` : String(msg) }),
    throwSuggestions: false,
  }),
}));

import { makeSingleQuery } from '@testing-library/dom/dist/query-helpers';

describe('makeSingleQuery (from @testing-library/dom)', () => {
  const mockAll = vi.fn();
  const mockGetMultiple = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when no elements found', () => {
    mockAll.mockReturnValue([]);
    const q = makeSingleQuery(mockAll, mockGetMultiple);
    expect(q(document.body, 'x')).toBeNull();
  });

  it('returns the single element when one found', () => {
    const el = document.createElement('div');
    mockAll.mockReturnValue([el]);
    const q = makeSingleQuery(mockAll, mockGetMultiple);
    expect(q(document.body, 'x')).toBe(el);
  });

  it('throws an error when multiple elements found', () => {
    const e1 = document.createElement('div');
    const e2 = document.createElement('span');
    mockAll.mockReturnValue([e1, e2]);
    mockGetMultiple.mockReturnValue('Multiple elements');
    const q = makeSingleQuery(mockAll, mockGetMultiple);
    try {
      q(document.body, 'x');
      throw new Error('should have thrown');
    } catch (err) {
      const s = String(err);
      expect(s).toContain('Multiple elements');
      expect(s).toContain('<div');
      expect(s).toContain('<span');
    }
  });
});
