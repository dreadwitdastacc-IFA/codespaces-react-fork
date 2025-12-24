# Backend API Documentation

## Overview

The backend server (`openai.js`) provides RESTful APIs for AI chat, terminal execution, and system monitoring.

## Endpoints

### POST /api/openai

Chat with OpenAI GPT-4.

**Request:**

```json
{
  "messages": [{ "role": "user", "content": "Hello" }],
  "model": "gpt-4"
}
```

**Response:**

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! How can I help you?"
      }
    }
  ]
}
```

**Headers:**

- Content-Type: application/json

### POST /api/terminal

Execute terminal commands securely.

**Request:**

```json
{
  "command": "ls -la"
}
```

**Response:**

```json
{
  "output": "total 123\n-rw-r--r-- 1 user user 1234 Dec 24 12:00 file.txt\n"
}
```

**Security:**

- Commands executed with 10-second timeout
- Limited to safe operations
- No interactive commands

### GET /api/status

Retrieve system status information.

**Response:**

```json
{
  "uptime": 3600,
  "memory": {
    "heapUsed": 10485760,
    "heapTotal": 20971520
  },
  "version": "v18.17.0",
  "platform": "linux",
  "features": ["OpenAI Integration", "Elite Terminal"],
  "status": "Elite Operational"
}
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Required for AI functionality
- `PORT`: Server port (default: 3001)

### Process Reporting

The server includes commented process.report configuration for advanced monitoring (requires Node.js support).

## Security

- API key management via environment variables
- Command execution timeouts
- CORS enabled for frontend integration
- No persistent data storage

## Deployment

- Containerized with `Dockerfile.backend`
- Kubernetes deployment in `k8s-deployment.yaml`
- Health checks via status endpoint

## Error Handling

All endpoints return appropriate HTTP status codes:

- 200: Success
- 400: Bad Request
- 500: Internal Server Error

Error responses include descriptive messages for debugging.
