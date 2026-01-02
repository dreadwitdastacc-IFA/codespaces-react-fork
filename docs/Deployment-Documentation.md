# Deployment Documentation

## Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

1. Install dependencies: `npm install`
2. Create `.env` file with OpenAI API key
3. Start backend: `npm run server`
4. Start frontend: `npm start`

## Docker Deployment

### Single Service (Frontend Only)

```bash
docker build -t codespaces-react .
docker run -p 3000:80 codespaces-react
```

### Multi-Service (Frontend + Backend)

```bash
docker-compose up --build
```

Services:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Image Service: http://localhost:5000

## Kubernetes Deployment

### Prerequisites

- kubectl configured
- Docker registry access
- Kubernetes cluster

### Steps

1. **Build Images:**

   ```bash
   docker build -t your-registry/codespaces-react:latest .
   docker build -f Dockerfile.backend -t your-registry/codespaces-react-backend:latest .
   ```

2. **Push Images:**

   ```bash
   docker push your-registry/codespaces-react:latest
   docker push your-registry/codespaces-react-backend:latest
   ```

3. **Update Manifests:**

   - Replace image references in `k8s-deployment.yaml`
   - Update OpenAI API key in secret
   - Configure ingress domain

4. **Deploy:**

   ```bash
   kubectl apply -f k8s-deployment.yaml
   ```

5. **Verify:**
   ```bash
   kubectl get pods
   kubectl get services
   kubectl get ingress
   ```

### Kubernetes Resources

- **Deployments:** react-frontend, openai-backend
- **Services:** frontend-service (LoadBalancer), backend-service (ClusterIP)
- **Secret:** openai-secret for API key
- **Ingress:** react-app-ingress for external access

## Production Considerations

### Security

- Use secrets for API keys
- Enable HTTPS with cert-manager
- Configure network policies
- Regular security updates

### Scaling

- Adjust replica counts based on load
- Use horizontal pod autoscaling
- Configure resource limits

### Monitoring

- Implement health checks
- Set up logging (ELK stack)
- Configure metrics (Prometheus)
- Enable tracing

### Backup & Recovery

- Persistent volumes for data
- Regular backups
- Disaster recovery plan

## Troubleshooting

### Common Issues

1. **Port Conflicts:** Check for running services on ports 3000/3001
2. **API Key Errors:** Verify OpenAI API key in environment
3. **Image Pull Errors:** Ensure registry access and correct image tags
4. **Ingress Issues:** Check ingress controller installation

### Logs

```bash
# Frontend logs
kubectl logs -l app=react-frontend

# Backend logs
kubectl logs -l app=openai-backend

# All pods
kubectl get pods -o wide
```

### Debugging

```bash
# Exec into pod
kubectl exec -it <pod-name> -- /bin/sh

# Port forwarding
kubectl port-forward svc/frontend-service 3000:80
```
