// Register Testing Library matchers with Vitest's expect
// See: https://testing-library.com/docs/ecosystem-jest-dom/
import { expect } from 'vitest';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Ensure React is available for JSX transforms that compile to React.createElement
import React from 'react';
globalThis.React = React;
