Multi-container setup for Codespaces React with an adaptive image-processing service

Services:
- `web`: the React app built and served by nginx (built from repository root `Dockerfile`).
- `image-service`: a Python Flask service that performs adaptive image processing and exposes `/health` and `/metrics`.

Quick start (requires Docker):

```bash
# build and run both services
docker-compose up --build

# web is at http://localhost:3000
# image service is at http://localhost:5000
```

Example usage of image service:

```bash
curl -X POST "http://localhost:5000/process" -H "Content-Type: application/json" \
  -d '{"image_url":"https://example.com/pic.jpg","width":800,"webp":true}' --output adaptive.webp
```

Security notes: do not expose the image-service publicly without rate-limiting and input validation.
