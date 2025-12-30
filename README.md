# Elite Codespaces React App

## Cosmos DB Emulator (local development)

You can run the Azure Cosmos DB emulator locally (recommended for development and testing).

Requirements:
- Docker

Start emulator:

```bash
npm run emulator:run
```

Stop emulator:

```bash
npm run emulator:stop
```

Use `.env.example` as a template for your environment variables and copy it to `.env`:

```bash
cp .env.example .env
```

The emulator listens on `https://localhost:8081/` and the example `.env` contains the emulator key.


A state-of-the-art, top-of-the-line React application featuring advanced AI integration with GPT-4o and Claude-4 agentic coding capabilities, elite terminal emulation, self-aware system monitoring, real-time cryptocurrency tracking, task management, portfolio tracking, and Kubernetes-ready deployment.

## 🚀 Features

- **Advanced Agentic AI Capabilities**: 
  - 🤖 Multi-step reasoning with GPT-4o, Claude-3.5-Sonnet, and O1 models
  - 🔧 Function calling and tool execution
  - 📊 Code execution for data analysis (JavaScript/Python)
  - 🔄 Iterative problem-solving with up to 5 reasoning steps
  - 💡 Real-time cryptocurrency data fetching and portfolio analysis

- **Persmix Elite Module**: Cutting-edge modular UI components with ultra-fast rendering and seamless integration.
- **Azure AI Integration**: Advanced AI conversation powered by GitHub Models and Azure AI Foundry with cryptocurrency analysis and trading assistance.
- **Elite Terminal**: Secure backend-executed command-line interface with history and auto-completion.
- **System Status Monitor**: Self-aware component displaying real-time system metrics (uptime, memory, platform).
- **Cryptocurrency Dashboard**: Multi-chain wallet integration for Litecoin, Bitcoin, Ethereum, and more.
- **Kubernetes Deployment**: Production-ready containerization and orchestration manifests.
- **Docker Support**: Multi-service container setup with frontend, backend, and image service.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Chart.js, PropTypes
- **Backend**: Node.js, Express, OpenAI API
- **Deployment**: Docker, Kubernetes, Nginx
- **Testing**: Vitest, React Testing Library
- **Styling**: CSS Modules, Inline Styles

## 📁 Project Structure

```
codespaces-react/
├── src/
│   ├── Persmix/                 # Elite module components
│   │   ├── Persmix.jsx          # Main elite module
│   │   ├── PersmixOpenAIChat.jsx # AI chat component
│   │   ├── EliteTerminal.jsx     # Terminal emulator
│   │   ├── SystemStatus.jsx      # System monitor
│   │   ├── Persmix.css          # Elite styling
│   │   └── index.js             # Module exports
│   ├── data/
│   │   └── transactions.js      # Sample transaction data
│   ├── __tests__/               # Test files
│   ├── App.jsx                  # Main application
│   ├── index.jsx                # React entry point
│   └── *.css                    # Global styles
├── openai.js                    # Backend server
├── Dockerfile                   # Frontend container
├── Dockerfile.backend           # Backend container
├── docker-compose.yml           # Local multi-service setup
├── k8s-deployment.yaml          # Kubernetes manifests
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker (for containerized deployment)
- kubectl (for Kubernetes deployment)

### Local Development

1. **Clone and Install:**

   ```bash (see `.env.example` for reference):

   ```bash
   # Azure AI Configuration (GitHub Models - Free Tier)
   AZURE_ENDPOINT=https://models.inference.ai.azure.com
   AZURE_API_KEY=your_github_token_here
   AZURE_MODEL=gpt-4o
   
   # Advanced Agentic Features
   ENABLE_FUNCTION_CALLING=true
   MAX_ITERATIONS=5
   
   # Azure Cosmos DB (optional, defaults to local emulator)
   COSMOS_ENDPOINT=https://localhost:8081
   COSMOS_KEY=C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==
   
   # Server Configuration
   PORT=3002
   ```

   **Getting Started with GitHub Models:**
   - Visit https://github.com/marketplace/models
   - Create a GitHub Personal Access Token (classic) with `read:packages` scope
   - Use the token as `AZURE_API_KEY`
   - Free tier includes: GPT-4o, GPT-4o-mini, Claude-3.5-Sonnet, O1-preview, and more!

   **Supported Models:**
   - `gpt-4o` - Advanced reasoning and coding (recommended)
   - `gpt-4o-mini` - Fast and efficient
   - `claude-3.5-sonnet` - Anthropic's latest model
   - `o1-preview` - Advanced multi-step reasoning
   - `o1-mini` - Efficient reasoning model

   **Advanced Agentic Features:**
   - Multi-step reasoning for complex tasks
   - Function calling for cryptocurrency data and portfolio analysis
   - Code execution capabilities (JavaScript)
   - Automatic tool selection and chaining
   COSMOS_KEY=your-cosmos-key-here
   ```

3. **Run Locally:**

   ```bash
   # Terminal 1: Start backend
   npm run server

   # Terminal 2: Start frontend
   npm start
   ```

4. **Access:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Kubernetes Deployment

1. **Build and Push Images:**

   ```bash
   docker build -t your-registry/codespaces-react:latest .
   docker build -f Dockerfile.backend -t your-registry/codespaces-react-backend:latest .
   docker push your-registry/codespaces-react:latest
   docker push your-registry/codespaces-react-backend:latest
   ```

2. **Update Secrets:**

   ```bash
   # Encode OpenAI API key
   echo -n 'your-api-key' | base64
   # Update k8s-deployment.yaml with the encoded key
   ```

3. **Deploy:**
   ```bash
   kubectl apply -f k8s-deployment.yaml
   ```

## 📋 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run server` - Start backend server
- `npm run preview` - Preview production build

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY` - Required for AI chat functionality
- `PORT` - Backend server port (default: 3001)
- `REACT_APP_API_URL` - Frontend API endpoint (default: http://localhost:3001)

### Kubernetes Config

- Update `k8s-deployment.yaml` with your registry and domain
- Configure ingress for external access
- Adjust replica counts for scaling

## 🧪 Testing

```bash
npm test
```

Tests include:

- Component rendering
- User interactions
- API integrations
- Terminal functionality

## 📚 API Endpoints

### Backend (Port 3001)

- `POST /api/openai` - Chat with AI
- `POST /api/terminal` - Execute terminal commands
- `GET /api/status` - System status information

## 🔒 Security

- Backend command execution with timeout limits
- API key management via environment variables
- Containerized isolation
- No direct shell access from frontend

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push and create PR

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Vite and React
- Powered by OpenAI GPT-4
- Containerized with Docker
- Orchestrated on Kubernetes

## Available Scripts

In the project directory, you can run:

### `npm start`

We've already run this for you in the `Codespaces: server` terminal window below. If you need to stop the server for any reason you can just run `npm start` again to bring it back online.

Runs the app in the development mode.\
Open [http://localhost:3000/](http://localhost:3000/) in the built-in Simple Browser (`Cmd/Ctrl + Shift + P > Simple Browser: Show`) to view your running application.

The page will reload automatically when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Vite documentation](https://vitejs.dev/guide/).

To learn Vitest, a Vite-native testing framework, go to [Vitest documentation](https://vitest.dev/guide/)

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://sambitsahoo.com/blog/vite-code-splitting-that-works.html](https://sambitsahoo.com/blog/vite-code-splitting-that-works.html)

### Analyzing the Bundle Size

This section has moved here: [https://github.com/btd/rollup-plugin-visualizer#rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer#rollup-plugin-visualizer)

### Making a Progressive Web App

This section has moved here: [https://dev.to/hamdankhan364/simplifying-progressive-web-app-pwa-development-with-vite-a-beginners-guide-38cf][definitionLink]

## Reloading the Codespace UI

If you need to reload the Codespace UI after making changes:

**Option A: Trigger a UI reload**

```sh
echo "Press Ctrl+Shift+P and run 'Developer: Reload Window'"
```

**Option B: Restart the Codespace server (if available)**
There is no single universal command for this; use the Codespaces UI controls to restart the server if needed.

### Deployment

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

## Support

If you need support for this project, contact:

- Support email: dreadwitdastacc@gmail.com
- Website: http://gogominmine.com

- Maintainer: Devon Miller
- Maintainer: Ogun (obaluaye)

You can also see `SUPPORT.md` for full contact details.

[definitionLink]: https://dev.to/hamdankhan364/simplifying-progressive-web-app-pwa-development-with-vite-a-beginners-guide-38cf

echo "See project contributors" > CONTRIBUTORS.txt
git add CONTRIBUTORS.txt && git commit -m "chore: add CONTRIBUTORS.txt"
git push fork Dreadwitdastacc-Ifawole

Notes

- A `.env` placeholder was created for `GITHUB_TOKEN` (replace with your token locally, do not commit secrets).
- The build uses rollup `manualChunks` to split vendor modules into per-package chunks to reduce single large bundles.

## Docker

A simple Dockerfile has been added to this repository. It builds a small production image using Node 18 Alpine.

Build locally:

```bash
docker build -t codespaces-react:latest .
```

Run locally (image expects a `server.js` entrypoint):

```bash
docker run -p 3000:3000 --rm codespaces-react:latest
```

CI: A GitHub Actions workflow `.github/workflows/docker-image.yml` is included that will build the image on pull requests and will push the image to GitHub Container Registry (GHCR) when changes are merged to `main`. The workflow uses the repository's `GITHUB_TOKEN` for authentication; ensure the repository has `packages: write` permissions enabled if you want automatic publishing.

Publishing to another registry (Docker Hub) can be added by setting registry credentials as repository secrets and updating the workflow to log in with those secrets.

Sample patch placeholder
