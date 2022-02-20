# Geo Collector Bot usage

## Create a new Bot

The first thing you need to do is create a new Telegram Bot, following 
[the official documentation](https://core.telegram.org/bots#3-how-do-i-create-a-bot).

You will receive an **authentication token** that you will need to provide to this service as an 
[environment variable](./30_configuration.md#environment-variables).

## Run with Docker

```shell
docker run --name geo-collector-bot \
  -e TELEGRAM_AUTH_TOKEN="<telegram_auth_token>" \
  -v <absolute_path_to_config_file>:/app/config.json \
  # -v <absolute_path_to_custom_translations_folder>:/app/custom_locales \
  -p 8080:8080 \
  geo-collector-bot
```

```shell
docker run --name geo-collector-bot \
  --network=host \
  -e TELEGRAM_AUTH_TOKEN="1963527030:AAHQSAXxJkg3stuqWn68kJLdu5NJIuBugm8" \
  -v /home/edoardo/Documents/personal/geocollectorbot/config.example.json:/home/app/config.json \
  -v /home/edoardo/Documents/personal/geocollectorbot/examples/postgres/media:/home/app/media \
  -p 8080:8080 \
  geo-collector-bot
```

## Available commands

The Bot exposes the following commands.

- `/start` to start the Bot.
- `/help` to get information about the Bot.
- `/collect` to start a new data gathering process.
