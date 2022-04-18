# folks-finance-loan-notification

## Development
Setup environment files by copying .env.example and edit the variables
```shell
$ make preparer.env
```

Setup nodejs dependencies
```shell
$ make preparer.node
```

Run dependencies (zookeeper, kafka, mongodb) in background
```shell
$ make deps.up
```

Create a Kafka topic
```shell
$ make prepare.topic
```

Run monitor-service locally
```shell
$ make monitor.up
```

Run notifier-service locally
```shell
$ make notifier.up
```

Run user-setting-service locally
```shell
$ make user-setting.up
```
