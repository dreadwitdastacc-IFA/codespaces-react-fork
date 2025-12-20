# codespaces-react

A minimal React app scaffolded for a Codespace. This project uses Vite, React, Vitest and ESLint.

Quick start

Install dependencies:

```bash
npm install
```

Run the dev server (binds to all interfaces):

```bash
npm start
```

Open in browser: http://localhost:3000 (Vite may pick another port if 3000 is in use)

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

Lint source:

```bash
npx eslint "src/**/*.{js,jsx}"
```

Notes

- A `.env` placeholder was created for `GITHUB_TOKEN` (replace with your token locally, do not commit secrets).
- The build uses rollup `manualChunks` to split vendor modules into per-package chunks to reduce single large bundles.
