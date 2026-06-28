.PHONY: help up down logs build rebuild restart clean shell-backend shell-postgres db-shell

help:
	@echo "Enterprise AI Docker Commands"
	@echo "=============================="
	@echo "make up              - Start all services in background"
	@echo "make down            - Stop all services"
	@echo "make build           - Build images"
	@echo "make rebuild         - Rebuild images from scratch"
	@echo "make restart         - Restart all services"
	@echo "make logs            - View all service logs"
	@echo "make logs-backend    - View backend logs"
	@echo "make logs-postgres   - View postgres logs"
	@echo "make logs-frontend   - View frontend logs"
	@echo "make clean           - Stop services and remove volumes"
	@echo "make shell-backend   - SSH into backend container"
	@echo "make db-shell        - Connect to PostgreSQL"
	@echo "make health          - Check service health"

# Startup
up:
	docker-compose up -d
	@echo "✓ Services started. Backend: http://localhost:8000, Frontend: http://localhost:5173"

down:
	docker-compose down

# Build
build:
	docker-compose build

rebuild:
	docker-compose build --no-cache

restart: down up

# Logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-postgres:
	docker-compose logs -f postgres

logs-frontend:
	docker-compose logs -f frontend

# Shell access
shell-backend:
	docker-compose exec backend bash

shell-postgres:
	docker-compose exec postgres psql -U $${POSTGRES_USER:-aiuser} -d $${POSTGRES_DB:-enterprise_ai}

db-shell: shell-postgres

# Health checks
health:
	@echo "Checking services..."
	@curl -s http://localhost:8000/health | jq . || echo "Backend: Not responding"
	@docker-compose ps

# Cleanup
clean: down
	docker-compose down -v
	@echo "✓ Services stopped and volumes removed"

# Development helpers
dev-up:
	docker-compose -f docker-compose.yml up -d --build

dev-logs:
	docker-compose logs -f backend frontend

# Production-like build
build-prod:
	docker-compose build --no-cache backend postgres frontend
	@echo "✓ Production build complete"

# Database operations
db-backup:
	docker-compose exec -T postgres pg_dump -U $${POSTGRES_USER:-aiuser} $${POSTGRES_DB:-enterprise_ai} > backup_$$(date +%Y%m%d_%H%M%S).sql

db-restore:
	docker-compose exec -T postgres psql -U $${POSTGRES_USER:-aiuser} $${POSTGRES_DB:-enterprise_ai} < $$(ls -t backup_*.sql | head -1)

# Prune unused Docker resources
prune:
	docker system prune -f
	@echo "✓ Cleaned up unused Docker resources"
