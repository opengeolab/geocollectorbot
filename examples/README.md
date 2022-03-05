# Geo Collector Bot examples

This folder contains Bots set up with different configurations that can run out-of-the-box with Docker Compose.

To run those examples you will need to install [Docker](https://docs.docker.com/get-docker/) and 
[Docker Compose](https://docs.docker.com/compose/).

Furthermore, you will need a valid Telegram authentication token, that you can create following
[the official documentation](https://core.telegram.org/bots#3-how-do-i-create-a-bot).

## Postgres

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

Now you can spin up the services running
```shell
docker-compose up
```

This command will create two containers, one running PostgreSQL and the other running the Bot. On top of that, it will
execute a script that will enable PostGIS extension and create the necessary table on the database.

The data and the media will be persisted in two volumes called `data` and `media` respectively, both of which are automatically
created in the directory. Even if you shout down the container, the interactions and the media will remain on your machine.

The database can be accessed on `localhost:5438`, and the Bot on `localhost:8080`.
