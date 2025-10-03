.PHONY: help build up down logs clean deploy k8s-deploy k8s-delete trivy sonar

# Variables
DOCKER_REGISTRY ?= your-docker-registry
VERSION ?= latest

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker Commands
build: ## Build Docker images
	docker-compose build

up: ## Start all services with Docker Compose
	docker-compose up -d
	@echo "Services started. Access:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Backend: http://localhost:5000"
	@echo "  MongoDB: localhost:27017"

down: ## Stop all services
	docker-compose down

logs: ## View logs
	docker-compose logs -f

clean: ## Clean up Docker resources
	docker-compose down --rmi all --volumes
	docker system prune -af --volumes

restart: down up ## Restart all services

# Kubernetes Commands
k8s-deploy: ## Deploy to Kubernetes
	kubectl apply -f k8s/mongodb-deployment.yaml
	kubectl apply -f k8s/backend-deployment.yaml
	kubectl apply -f k8s/frontend-deployment.yaml
	kubectl apply -f k8s/ingress.yaml
	@echo "Waiting for deployments..."
	kubectl rollout status deployment/mongodb-deployment
	kubectl rollout status deployment/backend-deployment
	kubectl rollout status deployment/frontend-deployment

k8s-delete: ## Delete Kubernetes resources
	kubectl delete -f k8s/

k8s-status: ## Check Kubernetes status
	kubectl get all
	kubectl get ingress

k8s-logs-backend: ## View backend logs
	kubectl logs -f deployment/backend-deployment

k8s-logs-frontend: ## View frontend logs
	kubectl logs -f deployment/frontend-deployment

# Build and Push
build-backend: ## Build backend Docker image
	docker build -t $(DOCKER_REGISTRY)/ecommerce-backend:$(VERSION) ./backend
	docker tag $(DOCKER_REGISTRY)/ecommerce-backend:$(VERSION) $(DOCKER_REGISTRY)/ecommerce-backend:latest

build-frontend: ## Build frontend Docker image
	docker build -t $(DOCKER_REGISTRY)/ecommerce-frontend:$(VERSION) ./frontend
	docker tag $(DOCKER_REGISTRY)/ecommerce-frontend:$(VERSION) $(DOCKER_REGISTRY)/ecommerce-frontend:latest

push: ## Push images to registry
	docker push $(DOCKER_REGISTRY)/ecommerce-backend:$(VERSION)
	docker push $(DOCKER_REGISTRY)/ecommerce-backend:latest
	docker push $(DOCKER_REGISTRY)/ecommerce-frontend:$(VERSION)
	docker push $(DOCKER_REGISTRY)/ecommerce-frontend:latest

# Security Scans
trivy-backend: ## Scan backend image with Trivy
	trivy image --severity HIGH,CRITICAL $(DOCKER_REGISTRY)/ecommerce-backend:$(VERSION)

trivy-frontend: ## Scan frontend image with Trivy
	trivy image --severity HIGH,CRITICAL $(DOCKER_REGISTRY)/ecommerce-frontend:$(VERSION)

trivy-all: trivy-backend trivy-frontend ## Scan all images

# Code Quality
sonar-backend: ## Run SonarQube analysis on backend
	cd backend && sonar-scanner

sonar-frontend: ## Run SonarQube analysis on frontend
	cd frontend && sonar-scanner

# Development
dev-backend: ## Run backend in development mode
	cd backend && npm run dev

dev-frontend: ## Run frontend in development mode
	cd frontend && npm run dev

install: ## Install all dependencies
	cd backend && npm install
	cd frontend && npm install

# Testing
test-backend: ## Run backend tests
	cd backend && npm test

test-frontend: ## Run frontend tests
	cd frontend && npm test

# Complete Deployment
deploy-all: build push k8s-deploy ## Build, push and deploy everything

# Monitoring
monitor: ## Open monitoring dashboards
	@echo "Opening dashboards..."
	@echo "Jenkins: http://localhost:8080"
	@echo "SonarQube: http://localhost:9000"
	@echo "Application: http://localhost:3000"