# Geo Collector Bot usage

## Create a new Bot

The first thing you need to do is create a new Telegram Bot, following 
[the official documentation](https://core.telegram.org/bots#3-how-do-i-create-a-bot).

You will receive an **authentication token** that you will need to provide to this service as an 
[environment variable](./30_configuration.md#environment-variables).

## Run with Docker

```shell
docker run --name geo-collector-bot \
  -e HTTP_PORT="<http_port>" \
  -e LOG_LEVEL="<log_level>" \
  -e TELEGRAM_AUTH_TOKEN="<telegram_auth_token" \
  -e CONFIGURATION_PATH="<configuration_path>" \
  -e CUSTOM_TRANSLATIONS_FOLDER_PATH="<custom_translations_folder_path>" \
  -v [path_to_application_file]:/app/application.yml \
  -p <host_http_port>:<container_http_port> \
  geo-collector-bot
```

## Available commands

The Bot exposes the following commands.

- `/start` to start the Bot.
- `/help` to get information about the Bot.
- `/collect` to start a new data gathering process.
- 
