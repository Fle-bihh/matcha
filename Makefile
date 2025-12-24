.PHONY: all setup up down re logs logs-db logs-server logs-web logs-shared logs-adminer clean clean-all clear-cache shell-server shell-web shell-shared

# Default target: initial setup without showing logs
all:
	@make setup
	@make up
	@echo "✅ All services started successfully!"
	@echo "Run 'make logs' to follow logs"

setup:
	@echo "🔧 Setting up environment..."
	@./setup-env.sh
	@npm install
	@echo "✅ Setup complete!"

up:
	@echo "🚀 Starting services..."
	@docker compose up -d --build

down:
	@echo "🛑 Stopping services..."
	@docker compose down

# Rebuild with node_modules cache clear, but preserve critical data
re:
	@echo "🔄 Rebuilding services..."
	@make down
	@docker volume rm matcha_server_node_modules 2>/dev/null || true
	@docker volume rm matcha_web_node_modules 2>/dev/null || true
	@docker volume rm matcha_shared_node_modules 2>/dev/null || true
	@docker volume rm matcha_shared_dist 2>/dev/null || true
	@make up
	@echo "✅ Rebuild complete!"

# Logs - all services
logs:
	@docker compose logs -f

# Logs - specific services
logs-db:
	@docker compose logs -f db

logs-server:
	@docker compose logs -f server

logs-web:
	@docker compose logs -f web

logs-shared:
	@docker compose logs -f shared

logs-adminer:
	@docker compose logs -f adminer

# Full clean including database and uploads (DANGER: data loss)
clean-all:
	@echo "⚠️  WARNING: This will delete ALL data including database and uploads!"
	@printf "Are you sure? [y/N] "; \
	read REPLY; \
	case "$$REPLY" in \
		[Yy]*) \
			make down; \
			docker volume rm matcha_mysql_data 2>/dev/null || true; \
			docker volume rm matcha_server_uploads 2>/dev/null || true; \
			docker volume rm matcha_server_node_modules 2>/dev/null || true; \
			docker volume rm matcha_web_node_modules 2>/dev/null || true; \
			docker volume rm matcha_shared_node_modules 2>/dev/null || true; \
			docker volume rm matcha_shared_dist 2>/dev/null || true; \
			echo "✅ All data cleaned!" \
			;; \
		*) \
			echo "❌ Cancelled" \
			;; \
	esac

# Clean local node_modules and build artifacts
clean:
	@echo "🧹 Cleaning local files..."
	@find . -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
	@find . -name "package-lock.json" -type f -delete 2>/dev/null || true
	@find . -name "tsconfig.tsbuildinfo" -type f -delete 2>/dev/null || true
	@echo "✅ Local files cleaned!"

# Shell access to containers
shell-server:
	@docker exec -it $${CONTAINER_SERVER:-matcha-server} sh

shell-web:
	@docker exec -it $${CONTAINER_WEB:-matcha-web} sh

shell-shared:
	@docker exec -it $${CONTAINER_SHARED:-matcha-shared} sh

# Docker system cleanup
clear-cache:
	@echo "🗑️  Clearing Docker cache..."
	@docker system prune -a -f
	@docker volume prune -f
	@echo "✅ Docker cache cleared!"