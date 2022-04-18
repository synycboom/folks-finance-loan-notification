SRC_PATH := $(shell pwd)

prepare.node:
	cd $(SRC_PATH)/app && yarn
	cd $(SRC_PATH)/services/monitor && yarn
	cd $(SRC_PATH)/services/notifier && yarn
	cd $(SRC_PATH)/services/user-setting && yarn

prepare.env:
	cd $(SRC_PATH)/app && cat .env.example > .env.local
	cd $(SRC_PATH)/services/monitor && cat .env.example | tee .env .env.production
	cd $(SRC_PATH)/services/notifier && cat .env.example | tee .env .env.production
	cd $(SRC_PATH)/services/user-setting && cat .env.example | tee .env .env.production

prepare.topic:
	docker exec loan-notification-dev-kafka /opt/bitnami/kafka/bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --topic loan-notification-alert-event-v1 --partitions 3 --replication-factor 1

deps.up:
	docker-compose -f docker-compose.deps.yaml up -d

deps.down:
	docker-compose -f docker-compose.deps.yaml down

monitor.up:
	cd $(SRC_PATH)/services/monitor && yarn dev

notifier.up:
	cd $(SRC_PATH)/services/notifier && yarn dev

user-setting.up:
	cd $(SRC_PATH)/services/user-setting && yarn dev

all.up:
	docker-compose up --build

.PHONY: deps.up deps.down monitor.up prepare.env prepare.node prepare.topic all.up
