# Style Guide

This document outlines the coding standards and best practices for the codespaces-react project.

## Table of Contents

- [General Principles](#general-principles)
- [JavaScript/React](#javascriptreact)
- [File Structure](#file-structure)
- [Naming Conventions](#naming-conventions)
- [Component Guidelines](#component-guidelines)
- [Styling](#styling)
- [Testing](#testing)
- [Configurations](#configurations)
- [Git Workflow](#git-workflow)
- [Code Quality](#code-quality)
- [Performance](#performance)
- [Security](#security)

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

## Styling

### CSS Methodology

- Use CSS modules for component-scoped styles
- Follow BEM (Block Element Modifier) naming convention
- Prefer utility-first approach with Tailwind CSS for rapid development
- Maintain design system consistency with CSS custom properties

### Modern CSS Features

- Use CSS Grid and Flexbox for layouts
- Implement CSS custom properties (variables) for theming
- Leverage CSS-in-JS libraries like styled-components for dynamic styling
- Utilize modern selectors and pseudo-classes

### Responsive Design

- Mobile-first approach with media queries
- Use relative units (rem, em, %) over fixed pixels
- Implement fluid typography with clamp() function
- Test across multiple devices and screen sizes

### Performance

- Minimize CSS bundle size with purging unused styles
- Use CSS containment for better rendering performance
- Optimize images and fonts for web
- Implement critical CSS for above-the-fold content

### Accessibility

- Ensure sufficient color contrast ratios
- Use semantic HTML with appropriate ARIA attributes
- Support keyboard navigation and focus management
- Test with screen readers and accessibility tools

## Testing

- Write tests for all components and utilities
- Use descriptive test names
- Test both success and error scenarios
- Aim for good test coverage (>80%)
- Use React Testing Library for component tests

## Configurations

### Vite Configuration

- Use `vite.config.js` for build and development settings
- Configure aliases for clean imports: `@/components`, `@/utils`
- Set up environment variables with `VITE_` prefix for client-side access
- Enable source maps in development, disable in production

### ESLint Configuration

- Extend from `react-app` and `react-app/jest`
- Add custom rules for React hooks and prop validation
- Configure import sorting and unused variable detection
- Use `.eslintrc.json` for project-wide settings

### Environment Variables

- Store sensitive data in `.env` files (not committed to git)
- Use `process.env` for server-side, `import.meta.env` for client-side
- Document required environment variables in README
- Provide `.env.example` for team setup

### Package.json Scripts

- `start`: Development server
- `build`: Production build
- `test`: Run test suite
- `lint`: Code linting
- `format`: Code formatting with Prettier

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
