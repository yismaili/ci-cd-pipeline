build:
	cd backend && npm install
	cd frontend && npm install
	mkdir -p db
	touch .env
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

clean:
	docker compose down -v
