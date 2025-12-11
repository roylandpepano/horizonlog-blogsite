.PHONY: help up down build logs install-client install-server test-server restart

help:
	@echo "Useful targets:"
	@echo "  make up             -> Build and start containers (detached)"
	@echo "  make down           -> Stop and remove containers and volumes"
	@echo "  make build          -> Build docker images"
	@echo "  make logs           -> Follow docker-compose logs"
	@echo "  make install-client -> Install client dependencies (npm)"
	@echo "  make install-server -> Install server Python dependencies"

up:
	docker-compose up -d --build

down:
	docker-compose down -v

build:
	docker-compose build --no-cache

logs:
	docker-compose logs -f

install-client:
	cd client && npm install

install-server:
	python -m pip install -r server/requirements.txt

test-server:
	cd server && pytest -q

restart: down up
