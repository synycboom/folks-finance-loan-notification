# folks-finance-loan-notification

## Development
Run dependencies (zookeeper, kafka, mongodb)
```shell
$ docker-compose -f docker-compose.deps.yaml up -d
```

Setup environment files by copying .env.example and edit the variables
```shell
$ cd services/<target_service>
$ cat .env.example > .env
```

Run locally
```shell
$ cd services/<target_service>
$ yarn dev
```
