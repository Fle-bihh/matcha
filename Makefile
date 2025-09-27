.PHONY: clean dev re no-cache

clean:
	find . -name "dist" -type d -exec rm -rf {} +
	find . -name "node_modules" -type d -exec rm -rf {} +
	find . -name "package-lock.json" -type f -delete
	find . -name "tsconfig.tsbuildinfo" -type f -delete

install:
	npm install
	npm run build -w @matcha/shared

dev:
	docker compose up --build

re:
	docker compose down
	docker compose up --build

no-cache:
	docker compose down
	docker system prune -a -f
	docker volume prune -f
	docker compose up --build