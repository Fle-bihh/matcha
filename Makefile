# Makefile for Matcha project

.PHONY: clean dev re no-cache

# Clean all dist folders, node_modules and package-lock.json files
clean:
	find . -name "dist" -type d -exec rm -rf {} +
	find . -name "node_modules" -type d -exec rm -rf {} +
	find . -name "package-lock.json" -type f -delete
	find . -name "tsconfig.tsbuildinfo" -type f -delete

install:
	npm install
	npm run build -w @matcha/shared

# Start development with docker compose
dev:
	docker compose up --build

# Restart docker compose (down then up with build)
re:
	docker compose down
	docker compose up --build

# Clean docker and restart (down, clean docker, up with build)
no-cache:
	docker compose down
	docker system prune -a -f
	docker volume prune -f
	docker compose up --build