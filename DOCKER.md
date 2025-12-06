# Docker Support

This repository includes Docker support for building and deploying the dreadwitdastacc-IFA cryptocurrency mining platform.

## Quick Start

### Build Locally

```bash
docker build -t dreadwitdastacc-ifa .
```

### Run Locally

```bash
docker run -p 8080:80 dreadwitdastacc-ifa
```

Then visit `http://localhost:8080` in your browser.

## GitHub Actions

This repository is configured with GitHub Actions to automatically build and push Docker images to GitHub Container Registry (ghcr.io).

### Automatic Builds

Docker images are automatically built and pushed when:
- Code is pushed to the `main` branch
- Code is pushed to any `copilot/**` branch
- A version tag is created (e.g., `v1.0.0`)
- Manually triggered via workflow_dispatch

### Image Tags

Images are tagged with:
- `latest` - Latest build from the main branch
- `<branch-name>` - Latest build from a specific branch
- `v<version>` - Semantic version tags (e.g., `v1.0.0`, `v1.0`, `v1`)
- `<branch>-<sha>` - Specific commit SHA

### Pull an Image

```bash
# Pull the latest image
docker pull ghcr.io/dreadwitdastacc-ifa/codespaces-react:latest

# Pull a specific version
docker pull ghcr.io/dreadwitdastacc-ifa/codespaces-react:v1.0.0

# Run the pulled image
docker run -p 8080:80 ghcr.io/dreadwitdastacc-ifa/codespaces-react:latest
```

## Multi-Platform Support

The GitHub Actions workflow builds images for multiple platforms:
- linux/amd64 (x86_64)
- linux/arm64 (ARM 64-bit, including Apple Silicon)

## Dockerfile Details

The Dockerfile uses a multi-stage build:

1. **Builder Stage**: Uses Node.js 18 Alpine to install dependencies and build the React application
2. **Production Stage**: Uses Nginx Alpine to serve the built static files

### Health Check

The container includes a health check that verifies nginx is running every 30 seconds.

## Environment Variables

Currently, no environment variables are required. The app uses the homepage URL configured in `package.json`.

## Custom Configuration

To customize the nginx configuration, uncomment the nginx.conf copy line in the Dockerfile and create a custom `nginx.conf` file.

## Troubleshooting

If the container fails to start:

```bash
# Check container logs
docker logs <container-id>

# Check health status
docker inspect --format='{{.State.Health.Status}}' <container-id>
```
