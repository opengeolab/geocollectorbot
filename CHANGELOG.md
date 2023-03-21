# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.1] 2023-03-21

- Upgraded Node to version 18.x
- Upgraded Yarn to version 3.x
- Updated telegraf to version 4.10.0

## [1.1.0] 2022-12-07

- Upgraded Node to version 16.x

### Breaking changes
- Flow step type `media` is now `singleMedia` and takes field `acceptOnly` to assert accepted media type
- Responses to steps of type `singleMedia` are now saved as array of strings

### Added
- Bot now responds to messages of unsupported type with an appropriate error message
- [#3](https://github.com/opengeolab/geocollectorbot/issues/3): exposed `POST - /send-message` route to programmatically send messaged to chats
- [#6](https://github.com/opengeolab/geocollectorbot/issues/6): added support for video messages
- [#7](https://github.com/opengeolab/geocollectorbot/issues/7): exposed `GET - /interactions` route to return all saved interactions
- [#9](https://github.com/opengeolab/geocollectorbot/issues/9): added the possibility to skip questions
- [#14](https://github.com/opengeolab/geocollectorbot/issues/14): added on complete hook

### Changed
- Get media route base path can now be configured from environment variable `GET_MEDIA_BASE_PATH`

## [1.0.0] 2022-03-12
- First release
