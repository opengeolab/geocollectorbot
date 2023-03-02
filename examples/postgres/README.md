# Postgres example

The `postgres` folder contains a Bot configured to save data in a [PostgreSQL](https://www.postgresql.org/) database
with [PostGIS](https://postgis.net/) extension, and media in the file system.

The first thing you need to do is to `cd` in the `postgres` directory with
```shell
cd postgres
```

Here you need to create a `.env` file containing
```dotenv
TELEGRAM_AUTH_TOKEN=<your_telegram_auth_token>
```

and to make PostgreSQL initialization script executable
```shell
chmod +x ./scripts/01-init.sh 
```

Now you can spin up the services running
```shell
docker-compose up
```

This command will create two containers, one running PostgreSQL and the other running the Bot. On top of that, it will
execute a script that will enable PostGIS extension and create the necessary table on the database.

The data and the media will be persisted in two volumes called `data` and `media` respectively, both of which are automatically
created in the directory. Even if you shout down the container, the interactions and the media will remain on your machine.

The database can be accessed on `localhost:5438`, and the Bot on `localhost:8080`.
