# folks-finance-loan-notification

## Development
Setup environment files by copying .env.example and edit the variables
```shell
$ cd services/<target_service>
$ cat .env.example > .env
```

Run dependencies (zookeeper, kafka, mongodb) in background
```shell
$ make deps-up
```

Run monitor-service locally
```shell
$ make monitor-up
```

Run notifier-service locally
```shell
$ make notifier-up
```

Run user-setting-service locally
```shell
$ make user-setting-up
```
