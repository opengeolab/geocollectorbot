# Geo Collector Bot configuration

The service needs some configuration in order to be used effectively.

# Environment variables

The service accepts the following environment variables.

| Name                            |  Type   | Required | Description                                                                                                 |           Default           |
|---------------------------------|:-------:|:--------:|-------------------------------------------------------------------------------------------------------------|:---------------------------:|
| PORT                            | integer |    ✓     | port on which the service will be exposed                                                                   |            8080             |
| LOG_LEVEL                       | string  |    ✓     | [pino logger level](https://getpino.io/#/docs/api?id=level-string)                                          |           `info`            |
| CONFIGURATION_PATH              | string  |    ✓     | path to the [configuration file](#service-configuration)                                                    |  `/home/node/config.json`   |
| CUSTOM_TRANSLATIONS_FOLDER_PATH | string  |    ✖     | optional path to the folder containing [custom translation files](#custom-translations)                     | `/home/node/custom_locales` |
| TELEGRAM_AUTH_TOKEN             | string  |    ✓     | [unique authentication token](https://core.telegram.org/bots/api#authorizing-your-bot) of your Telegram Bot |              -              |
| UPDATE_MODE                     | string  |    ✖     | defines how the Bot will receive updated. Possible values are `webhook` and `polling`                       |          `polling`          |
| PUBLIC_URL                      | string  |    ✖     | public url on which the Bot is exposed. Needed (and required) if UPDATE_MODE is `webhook`                   |              -              |

## Update mode

Telegram Bots can receive updates from the Telegram server in two ways, **polling** or **webhook**, as explained 
[here](https://core.telegram.org/bots/api#getting-updates).

Geo Collector Bot supports both of these modalities, through the **UPDATE_MODE** environment variable.

If the variable is set to `webhook`, you also need to provide a value to the **PUBLIC_URL** environment variable. This
should be the public url on which your instance of this service is reachable (e.g., https://geo-collector-bot.herokuapp.com).

# Service configuration

The service needs to be configured to work properly, and this configuration should be provided through a JSON file. The
schema of the configuration can be found 
[here](https://gitlab.com/geolab.como/geocollectorbot/-/blob/main/src/schemas/configuration/index.ts), while an example 
can be found [here](https://gitlab.com/geolab.como/geocollectorbot/-/blob/main/config.example.json).

The configuration has three main blocks, [the flow of questions](#questions-flow), the [data storage configuration](#data-storage),
and optionally the [media storage configuration](#media-storage), resulting in the following object:

```json
{
  "flow": { ... },
  "dataStorage": { ... },
  "mediaStorage": { ... }
}
```

## Questions flow

The `flow` property is used to configure the flow of questions that the Bot will pose to the user. It has the following
structure:

```json
{
  "firstStepId": "id of the first step",
  "steps": [ ... ]
}
```

Where,

- **firstStepId** is the unique identified of the first step.
- **steps** is an array of objects, each element of which represents a question.

### Steps

Each element of the `steps` array has the following structure:

```json
{
  "id": "id of the step",
  "question": "question text",
  "config": { ... },
  "persistAs": "key on the db",
  "nextStepId": "id of the next step"
}
```

Where,

- **id** is the unique identified of the step.
- **question** is the message sent to the user.
- **config** defines the type of question (more about this below).
- **persistAs** can be used to specify how the answer is persisted on the database. It is optional, if not provided the
`id` will be used instead.
- **nextStepId** is the identifier of the following step. It is optional, if not provided the sept is considered to be
the end if the interaction.

:::warning
There is a set of reserved keys used by the Bot, and properties `id` and `persistAs` cannot be equal to one of those
keys.

The reserved keys are **id**, **chatId**, **username**, **currStepId**, **interactionState**, **createdAt**, and **updatedAt**.

On top of those, each [data storage](#data-storage) has a set of its own reserved keys. Consult the relative documentation
to know which values are prohibited.
:::

While the property **question** can be a simple string, the Bot gives you the possibility to internationalize the messages
sent to the user. To do so, you can provide an object whose keys are [ETF language tags](https://en.wikipedia.org/wiki/IETF_language_tag),
and values are localized versions of the question text. If the language of the user is not found, the english translation
will be used as fallback, so remember to **always provide the `en` key in your localized questions**.

For example, a correctly localized question has the following form:

```json
{
  "question": {
    "en": "English text of the question",
    "it": "Testo della domanda in italiano"
  }
}
```

:::tip
The bot supports [Markdown V2](https://core.telegram.org/bots/api#markdownv2-style) formatting in your questions.
:::

It follows an explanation of the different types of questions you can use in your Bot.

#### Text question

This type of question accepts a text as answer. 

The `config` props for this kind of step has the following shape:

```json
{
  "type": "text"
}
```

#### Multiple choice question

This type of question presents accepts one of a series of predefined options as answer.

The `config` props for this kind of step has the following shape:

```json
{
  "type": "multipleChoice",
  "options": [ ... ]
}
```

The **options** field is used to specify the possible answer to be presented to the user. It is an array whose items are
arrays of objects. Each element of the outer array is a row of options, while each element of the inner arrays is a
column. The options themselves are the items of the inner arrays, and they have the following shape:

```json
{
  "text": "...",
  "value": "..."
}
```

Where,

- **text** is the visualized text. As for questions, it can be a string or an object of localized strings.
- **value** is the actual value of the answer, saved in the database.

#### Location question

This type of question accepts the current location of the user as answer.

The `config` props for this kind of step has the following shape:

```json
{
  "type": "location"
}
```

#### Media question

This type of question accepts a media as answer. For now, only photos are accepted.

The `config` props for this kind of step has the following shape:

```json
{
  "type": "media",
  "subType": "photo"
}
```

To be able to use media questions in your flow you need to set up a [media storage](#media-storage). The media itself
will be saved in the media storage, while on the data storage will be persisted the relative URL to be called to download
the media (i.e., GET - `<host_name_of_your_bot>/media/:mediaId`).

## Data storage

The `dataStorage` property is used to configure where the interactions should be persisted. The Bot is built to support
multiple storage types, but for now only [PostgreSQL](https://www.postgresql.org/) can be used.

### PostgreSQL

To use PostgreSQL as storage, the property `dataStorage` should have the following structure:

```json
{
  "type": "postgres",
  "configuration": {
    "connectionString": "db connection string",
    "interactionsTable": "name of the table where interactions are saved",
    "ssl": false
  }
}
```

The table you create to save your interaction should have the following base columns:

```shell
id SERIAL
chat_id bigint NOT NULL
username character varying
curr_step_id character varying
interaction_state character varying
created_at timestamp with time zone
updated_at timestamp with time zone
```

with `id` being the **primary key** of the table.

:::warning
The name of those base columns cannot be used as property `id` or `persistAs` of your steps, on top of the keys listed
in the [steps section](#steps).
:::

Then you should add to the table a column for each of your questions named as the `id` or `persistAs` property of the
corresponding step.
- The column for a text question should be of type `character varying`.
- The column for a multiple choice question should be of type `character varying`.
- The column for a location question should be of type `character varying`.
- The column for a media question should be of type `geometry` (you will need [PostGIS](https://postgis.net/) extension).

## Media storage

The `dataStorage` property is used to configure where the media send by users should be persisted. The Bot is built to
support multiple storage types, but for now only **file system** can be used.

Regardless of the storage used, the Bot will persist on the database the path to be called to retrieve the media in the
form of `/media/:media_id`.

### File system

To use file system as storage, the property `mediaStorage` should have the following structure:

```json
{
  "type": "fileSystem",
  "configuration": {
    "folderPath": "absolute path of the folder in which media will be saved"
  }
}
```

:::tip
If you are using the file system ad media storage in a Docker container, remember to bind a volume to the configured
`folderPath` (that in this case will refer to a location inside the container) to persist the saved media after the
container is stopped.
:::

## Configuration values interpolation

Each string value in the data storage and media storage configuration can be substituted at run time with an environment
variable if it is annotated with a [Handlebars template](https://handlebarsjs.com/).

For example, lets consider the following data storage configuration:

```json
{
  "type": "postgres",
  "configuration": {
    "connectionString": "{{CONNECTION_STRING}}",
    "interactionsTable": "interactions"
  }
}
```

If in your environment you have the `CONNECTION_STRING` variable, the final configuration will look like this:

```json
{
  "type": "postgres",
  "configuration": {
    "connectionString": "connection_string_from_environment",
    "interactionsTable": "interactions"
  }
}
```

# Custom translations

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
