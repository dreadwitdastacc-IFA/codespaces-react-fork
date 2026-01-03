# Project File Explorer

## Root Directory

- `README.md` - Main project documentation
- `package.json` - Node.js dependencies and scripts
- `package-lock.json` - Dependency lock file
- `vite.config.js` - Vite build configuration
- `jsconfig.json` - JavaScript project configuration
- `docker-compose.yml` - Multi-service Docker setup
- `Dockerfile` - Frontend container definition
- `Dockerfile.backend` - Backend container definition
- `k8s-deployment.yaml` - Kubernetes deployment manifests
- `openai.js` - Backend server implementation
- `.env` - Environment variables (API keys)
- `.gitignore` - Git ignore patterns
- `index.html` - Main HTML template
- `index.htm` - Alternative HTML file
- `vite.pid` - Vite process ID
- `cosign.key` - Code signing key
- `vscode-profile-2025-12-23-11-46-02.cpuprofile` - VS Code performance profile

## src/ Directory

- `src/App.jsx` - Main React application component
- `src/App.css` - Global application styles
- `src/App.test.jsx` - Application tests
- `src/index.jsx` - React application entry point
- `src/index.css` - Global CSS styles
- `src/reportWebVitals.js` - Performance monitoring
- `src/setupTests.js` - Test configuration

### src/Persmix/ Directory (Elite Module)

- `src/Persmix/Persmix.jsx` - Main elite module component
- `src/Persmix/Persmix.css` - Elite module styling
- `src/Persmix/PersmixOpenAIChat.jsx` - AI chat component
- `src/Persmix/EliteTerminal.jsx` - Terminal emulator
- `src/Persmix/SystemStatus.jsx` - System monitoring component
- `src/Persmix/index.js` - Module exports

### src/data/ Directory

- `src/data/transactions.js` - Sample transaction data

### src/**tests**/ Directory

- `src/__tests__/App.transactions.test.jsx` - Transaction-related tests
- `src/__tests__/VideoCard.test.jsx` - VideoCard component tests

### src/stories/ Directory

- `src/stories/VideoCard.stories.jsx` - Storybook stories for VideoCard

## public/ Directory

- `public/manifest.json` - PWA manifest
- `public/robots.txt` - Search engine crawling rules

### public/media/ Directory

- (Empty - placeholder for media assets)

## scripts/ Directory

- `scripts/prepare_unsigned_tx_template.sh` - Transaction preparation script

## docker/ Directory

- `docker/README.md` - Docker setup documentation

### docker/image-service/ Directory

- `docker/image-service/app.py` - Python image service
- `docker/image-service/requirements.txt` - Python dependencies
- `docker/image-service/Dockerfile` - Image service container

## docs/ Directory

- `docs/Persmix-Documentation.md` - Elite module documentation
- `docs/API-Documentation.md` - Backend API documentation
- `docs/Deployment-Documentation.md` - Deployment guides

## .github/ Directory

- `.github/copilot-instructions.md` - GitHub Copilot configuration

## Additional Files

- `CONTRIBUTORS.txt` - Project contributors
- `LICENSE` - Project license
- `DOCKER.md` - Docker documentation
- `SECURE_TRANSFER.md` - Security transfer documentation
- `SUPPORT.md` - Support information
- `Settings` - Application settings (directory)
- `SSH` - SSH configuration (directory)

## File Categories

### Configuration Files

- `package.json`, `vite.config.js`, `jsconfig.json`
- `docker-compose.yml`, `Dockerfile*`, `k8s-deployment.yaml`
- `.env`, `.gitignore`

### Source Code

- React components: `src/**/*.jsx`
- Styles: `src/**/*.css`
- Backend: `openai.js`
- Scripts: `scripts/*.sh`

### Documentation

- `README.md`, `docs/*.md`
- `DOCKER.md`, `SECURE_TRANSFER.md`, `SUPPORT.md`

### Tests

- `src/**/*.test.jsx`
- `src/**/*.stories.jsx`

### Assets

- `public/**/*`
- `src/**/*.css`

### Infrastructure

- Docker: `Dockerfile*`, `docker-compose.yml`
- Kubernetes: `k8s-deployment.yaml`
- Scripts: `scripts/**/*`

This comprehensive file structure supports a full-stack React application with AI integration, containerization, and cloud deployment capabilities.
