# Docker Setup Guide for Enterprise AI

This project is now fully Docker-ready with multi-stage builds and Docker Compose orchestration.

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose v3.8+

### 1. Set Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and update:
- `SECRET_KEY` - Generate a strong secret key for JWT
- `DATABASE_URL` - Database connection string (pre-configured for postgres service)
- `GOOGLE_API_KEY` - Your Google API key (if needed)
- `FRONTEND_URL` - Frontend URL for CORS

### 2. Start All Services

```bash
docker-compose up -d
```

This will start:
- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **PostgreSQL Database**: postgres:5432

### 3. Verify Services

Check health status:

```bash
# Backend health
curl http://localhost:8000/health

# View logs
docker-compose logs -f backend
```

## Commands

### Common Docker Compose Commands

```bash
# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Rebuild images
docker-compose build --no-cache

# Remove volumes (WARNING: deletes database)
docker-compose down -v

# SSH into container
docker-compose exec backend bash
docker-compose exec postgres psql -U aiuser -d enterprise_ai
```

## Architecture

### Backend (Python/FastAPI)
- **Multi-stage build**: Reduces image size by separating build and runtime stages
- **Health checks**: Built-in endpoint monitoring
- **Environment-based config**: All settings from environment variables
- **Dependencies**: Uvicorn ASGI server with all FastAPI requirements

### Frontend (React/Vite)
- **Optimized build**: Multi-stage build with production artifacts
- **Dev server**: Pre-configured to run in Docker on port 5173
- **API proxy**: Configured to connect to backend at http://localhost:8000

### Database (PostgreSQL)
- **Persistent storage**: Data stored in Docker volume `postgres_data`
- **Auto-initialization**: Database and user created automatically
- **Health checks**: Service validates database availability

## Environment Variables

Key environment variables used in `docker-compose.yml`:

```env
# Backend
APP_NAME=Enterprise AI Backend
ENV=production
DEBUG=false
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql://aiuser:aipassword@postgres:5432/enterprise_ai
FRONTEND_URL=http://localhost:5173
GOOGLE_API_KEY=

# Database
POSTGRES_USER=aiuser
POSTGRES_PASSWORD=aipassword
POSTGRES_DB=enterprise_ai
```

## Development vs Production

### Development
For development, modify `docker-compose.yml`:
```yaml
backend:
  environment:
    - DEBUG=true
  volumes:
    - ./backend:/app  # Hot reload
```

### Production
For production:
1. Use strong `SECRET_KEY`
2. Set `DEBUG=false`
3. Use proper database URL
4. Set up environment-specific `.env.production`
5. Consider using environment-specific docker-compose files

## Troubleshooting

### Container won't start
```bash
docker-compose logs backend
docker-compose logs postgres
```

### Database connection issues
```bash
# Check if postgres is healthy
docker-compose ps

# Manually connect to database
docker-compose exec postgres psql -U aiuser -d enterprise_ai
```

### Port conflicts
If ports 8000, 5173, or 5432 are in use:
```yaml
# Modify docker-compose.yml
services:
  backend:
    ports:
      - "8001:8000"  # Use 8001 instead
```

### Rebuild everything fresh
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## File Structure

```
project/
├── backend/
│   ├── DockerFile          # Python app container
│   ├── .dockerignore       # Files to exclude from image
│   ├── requirements.txt    # Python dependencies
│   ├── main.py            # FastAPI app entry point
│   └── app/               # Application modules
├── frontend/
│   ├── Dockerfile         # React/Vite container
│   ├── vite.config.js     # Vite configuration
│   ├── package.json       # Node dependencies
│   └── src/               # React source
├── docker-compose.yml     # Docker Compose configuration
├── .env.example          # Environment template
└── .gitignore            # Git ignore file
```

## Next Steps

1. **Database Migrations**: Set up Alembic for SQLAlchemy migrations
2. **Secrets Management**: Use Docker Secrets for production
3. **Monitoring**: Add health checks and logging
4. **Networking**: Configure reverse proxy (nginx) for production
5. **CI/CD**: Integrate with GitHub Actions for automated builds

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
