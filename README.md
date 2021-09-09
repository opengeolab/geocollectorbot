# Geo Collector Bot

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![javascript style guide](https://img.shields.io/badge/code_style-standard--mia-orange.svg)](https://github.com/mia-platform/eslint-config-mia)

Telegram BOT for geodata collection, developed within the Interreg Project INSUBRI.PARKS.

## Local development

To develop the service locally you need:

- Node 14+
- Yarn 1.x.x

To set up Node, please if possible try to use [nvm](https://github.com/nvm-sh/nvm), so you can manage multiple
versions easily. Once you have installed nvm, you can go inside the directory of the project and simply run
`nvm install` and the `.nvmrc` file will install and select the correct version of Node if you don’t already have it.

To install Yarn, run `npm install --global yarn`.

Once you have all the dependencies in place, you can launch:

```shell
yarn install
```

This command will install the dependencies. Now you can create your local copy of the `env` variables needed for
launching the application.

```shell
cp ./example.env ./.env
```

Once you have all your dependency in place, you can launch:

```shell
yarn build
yarn start
```

and you will have the service exposed on your machine on the port `8000`.

## Contributions

[GEOlab](http://www.geolab.polimi.it/) - Politecnico di Milano

Developed by [Edoardo Pessina](mailto:edoardopessina.priv@gmail.com) - [GitHub](https://github.com/epessina)


## License

[MIT](https://opensource.org/licenses/MIT) © [GEOlab](mailto:geolab.como@gmail.com)
