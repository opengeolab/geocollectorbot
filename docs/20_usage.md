# Geo Collector Bot usage

## Available commands

The Bot exposes the following commands.

- `/start` to start the Bot.
- `/help` to get information about the Bot.
- `/collect` to start a new data gathering process.
- `/abort` to abort the currently ongoing interaction.

## Create a new Bot

The first thing you need to do is create a new Telegram Bot, following 
[the official documentation](https://core.telegram.org/bots#3-how-do-i-create-a-bot).

You will receive an **authentication token** that you will need to provide to this service as an 
[environment variable](./30_configuration.md#environment-variables).

## Run with Docker Compose

Since you need more than one service to run the Bot (e.g., a database and the Bot itself), [Docker Compose](https://docs.docker.com/compose/)
may come in handy.

The [examples](https://gitlab.com/geolab.como/geocollectorbot/-/tree/main/examples) folder of the repository contains
some set-ups that allow you to quickly run a complete functioning Bot with different configurations using Docker Compose.

To use them, you just need to [download the directory](https://gitlab.com/geolab.como/geocollectorbot/-/archive/main/geocollectorbot-main.zip?path=examples)
and follow the instructions in the `README.md` file you can find inside.

## Run with Docker

If you don't want to set up your whole project using Docker Compose, you can run the standalone Bot Docker image with
the following command:

```shell
docker run --name geo-collector-bot \
  --detach \
  -e TELEGRAM_AUTH_TOKEN="<telegram_auth_token>" \
  -v <absolute_path_to_config_file>:/home/node/config.json \
  -p 8080:8080 \
  geolabpolimi/geo-collector-bot
```

Now your Bot will be available on `localhost:8080`.

Let's go through the lines of the command one by one.

`docker run` is the command to start the container. You can find a reference [here](https://docs.docker.com/engine/reference/run/).

`--name geo-collector-bot` sets the name of the container.

`--detach` runs the container in the background.

`-e TELEGRAM_AUTH_TOKEN="<telegram_auth_token>"` sets the environment variable `TELEGRAM_AUTH_TOKEN`. You need to substitute
`<telegram_auth_token>` with the token generated [here](#create-a-new-bot).
<br>
The other [variables](./30_configuration.md#environment-variables) are not set here since we want to use their default value,
but you can provide your own values with the same syntax (i.e., `-e <variable_name>=<variable_value>`).

`-v <absolute_path_to_config_file>:/home/node/config.json` mounts a new [volume](https://docs.docker.com/storage/volumes/)
containing the [configuration file](./30_configuration.md#service-configuration). You need to substitute `<absolute_path_to_config_file>`
with the absolute path of your configuration file *on the host*.
<br>
Please note that with this command, *in the container* the file will be placed under `/home/node/config.json` which is the
default value of the `CONFIGURATION_PATH` environment variable. If you provide a different value for this variable you need
to change tht mount path accordingly.

`-v <absolute_path_to_custom_translations_folder>:/home/node/custom_locales` mounts a new volume containing the
[custom translation files](./30_configuration.md#custom-translations). The line is not in the command above, add it if you
need the functionality.

`-p 8080:8080` exposes the port on which the Bot runs.

`geolabpolimi/geo-collector-bot` is the name of the image to run.

## Run locally

To run the Bot locally you firstly need to clone the repository running
```shell
git clone https://gitlab.com/geolab.como/geocollectorbot.git
```

The Bot is written in Typescript, so you will need to install [Node.js](https://nodejs.org/it/) 14+ and [yarn](https://yarnpkg.com/)

To set up Node, please if possible try to use [nvm](https://github.com/nvm-sh/nvm), so you can manage multiple
versions easily. Once you have installed nvm, you can go inside the directory of the project and simply run
```shell
nvm install
```
and the `.nvmrc` file will install and select the correct version of Node if you don’t already have it.

To install Yarn, run 
```shell
npm install --global yarn
```

Now you need to install the project dependencies with
```shell
yarn install
```

and build the project with
```shell
yarn build
```

To run, the Bot will need an [environment variables](./30_configuration.md#environment-variables) file and a
[configuration](./30_configuration.md#service-configuration) file. You can find an example of both of them in the
repository, namely `example.env` and `config.example.json`.

Make your own copy of the files with
```shell
cp ./example.env ./.env
cp ./config.example.json ./config.json
```

and update them according to your needs.

Once you have all your dependency in place, you can launch the Bot with
```shell
yarn start
```

### Build a local Docker image

Now that you have everything set up, if you want you can build your own Docker image running
```shell
docker build -t geo-collector-bot .
```

in the root directory of the repository.
