.PHONY: build up down logs clean

build:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

migrate:
	docker-compose exec api-gateway node migrations.js

backup:
	./scripts/backup.sh

clean:
	docker system prune -a --volumes
help:
    @echo "Available targets:"
    @echo "  build   - Build all containers"
    @echo "  up      - Start services"
    @echo "  down    - Stop services"
    @echo "  logs    - View service logs"
    @echo "  clean   - Remove unused Docker resources"
