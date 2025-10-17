.PHONY: deploy setup build clean up down re logs clear-cache

deploy:
	make clean
	make clear-cache
	make setup
	make re
	make logs
	
setup:
	./setup-env.sh
	npm install

clean:
	find . -name "dist" -type d -exec rm -rf {} +
	find . -name "node_modules" -type d -exec rm -rf {} +
	find . -name "package-lock.json" -type f -delete
	find . -name "tsconfig.tsbuildinfo" -type f -delete

up:
	docker compose up -d --build

down:
	docker compose down

re:
	make down
	make up

logs:
	docker compose logs -f 

clear-cache:
	docker system prune -a -f
	docker volume prune -f
	docker volume rm matcha_mysql_data 2>/dev/null || true
	docker volume rm matcha_server_node_modules 2>/dev/null || true
	docker volume rm matcha_web_node_modules 2>/dev/null || true