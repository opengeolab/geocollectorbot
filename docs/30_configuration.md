# Geo Collector Bot configuration

The service needs some configuration in order to be used effectively.

## Environment variables

The service accepts the following environment variables.

| Name                            |  Type   | Required | Description                                                                                                 | Default |
|---------------------------------|:-------:|:--------:|-------------------------------------------------------------------------------------------------------------|:-------:|
| HTTP_PORT                       | integer |    ✖     | Port on which the service will be exposed                                                                   |  8080   |
| LOG_LEVEL                       | string  |    ✖     | [pino logger level](https://getpino.io/#/docs/api?id=level-string)                                          | `info`  |
| CONFIGURATION_PATH              | string  |    ✓     | path to the [configuration file](#service-configuration)                                                    |    -    |
| CUSTOM_TRANSLATIONS_FOLDER_PATH | string  |    ✖     | optional path the folder containing [custom translation files](#custom-translations)                        |    -    |
| TELEGRAM_AUTH_TOKEN             | string  |    ✓     | [unique authentication token](https://core.telegram.org/bots/api#authorizing-your-bot) of your Telegram Bot |    -    |

## Service configuration

TODO...

## Custom translations

This Bot is built to be multi-language. By default, only English translation is offered, and English is the default and
fallback language in case the translation for the user's language is not provided.

You can easily provide your own custom translations inside a folder referenced by the `CUSTOM_TRANSLATIONS_FOLDER_PATH`
[environment variables](#environment-variables). Each translation file should be a valid `.yaml` file (please note that
`.yml` files will not be accepted) named as `ietf_language_code.yaml` (e.g., `en.yaml`). An explanation of what IETF 
language tags are can be found [here](https://en.wikipedia.org/wiki/IETF_language_tag).

The bot always uses [Markdown V2](https://core.telegram.org/bots/api#markdownv2-style) as formatting option, so feel
free to use it in your custom translation (pay attention to the characters that need to be escaped!).

The keys used by the bot can be found in the [default english translation file](https://gitlab.com/geolab.como/geocollectorbot/-/blob/main/src/locales/en.yaml).

Please note that if you provide your own translations, an `en.yaml` file should always be provided in your custom folder.
