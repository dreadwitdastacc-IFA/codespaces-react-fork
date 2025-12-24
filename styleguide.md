# Style Guide

This document outlines the coding standards and best practices for the codespaces-react project.

## Table of Contents

- [General Principles](#general-principles)
- [JavaScript/React](#javascriptreact)
- [File Structure](#file-structure)
- [Naming Conventions](#naming-conventions)
- [Component Guidelines](#component-guidelines)
- [Testing](#testing)
- [Git Workflow](#git-workflow)

## General Principles

- Write clean, readable, and maintainable code
- Follow DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single responsibility

## JavaScript/React

- Use ES6+ features (arrow functions, destructuring, template literals, etc.)
- Prefer `const` over `let` when possible
- Use functional components with hooks instead of class components
- Use PropTypes for type checking
- Avoid inline styles; use CSS modules or styled-components
- Use meaningful default props

## File Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── constants/          # Constants and configuration
├── styles/             # Global styles and CSS modules
├── assets/             # Images, fonts, etc.
├── __tests__/          # Test files
└── index.jsx           # App entry point
```

## Naming Conventions

- **Files**: PascalCase for components (e.g., `UserProfile.jsx`), camelCase for utilities (e.g., `apiHelpers.js`)
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions/Variables**: camelCase (e.g., `handleSubmit`, `userData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Hooks**: Start with `use` (e.g., `useAuth`)

## Component Guidelines

- Keep components small and focused
- Use destructuring for props
- Avoid deep nesting; break into smaller components
- Use custom hooks for shared logic
- Handle loading and error states appropriately

## Testing

- Write tests for all components and utilities
- Use descriptive test names
- Test both success and error scenarios
- Aim for good test coverage (>80%)
- Use React Testing Library for component tests

## Git Workflow

- Use descriptive commit messages
- Create feature branches for new work
- Write clear pull request descriptions
- Review code before merging
- Keep commits atomic and focused

## Code Quality

- Run ESLint before committing
- Fix all linting errors and warnings
- Use Prettier for code formatting
- Run tests before pushing changes

## Performance

- Use React.memo for expensive components
- Optimize re-renders with useMemo and useCallback
- Lazy load components when appropriate
- Minimize bundle size

## Security

- Never commit sensitive data (API keys, passwords)
- Use environment variables for configuration
- Validate user input
- Follow OWASP guidelines for web security
