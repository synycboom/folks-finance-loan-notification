deps-up:
	docker-compose -f docker-compose.deps.yaml up -d

deps-down:
	docker-compose -f docker-compose.deps.yaml down

monitor-up:
	cd services/monitor && yarn dev

notifier-up:
	cd services/notifier && yarn dev

user-setting-up:
	cd services/user-setting && yarn dev

.PHONY: deps-up deps-down monitor-up
