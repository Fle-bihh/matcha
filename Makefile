.PHONY: clean dev re no-cache

clean:
	find . -name "dist" -type d -exec rm -rf {} +
	find . -name "node_modules" -type d -exec rm -rf {} +
	find . -name "package-lock.json" -type f -delete
	find . -name "tsconfig.tsbuildinfo" -type f -delete

install:
	npm install
	npm run build -w @matcha/shared
	npm run build -w @matcha/server
	npm run build -w @matcha/web

with-logs:
	docker compose up --build

show-logs:
	docker compose logs -f

up:
	docker compose up -d --build

down:
	docker compose down

re:
	docker compose down
	docker compose up -d --build

no-cache:
	docker compose down
	docker system prune -a -f
	docker volume prune -f
	docker volume rm matcha_mysql_data 2>/dev/null || true
	docker compose up -d --build

clear-cache:
	docker system prune -a -f
	docker volume prune -f
	docker volume rm matcha_mysql_data 2>/dev/null || true