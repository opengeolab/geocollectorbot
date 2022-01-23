# Geo Collector Bot

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Telegram BOT for geodata collection, developed within the project [INSUBRI.PARKS](https://insubriparksturismo.eu) funded 
by the Interreg Co-operation Programme 2014 -2020 (ID 605472)

## Local development

To develop the service locally you need:

- Node 14+
- Yarn 1.x.x

To set up Node, please if possible try to use [nvm](https://github.com/nvm-sh/nvm), so you can manage multiple
versions easily. Once you have installed nvm, you can go inside the directory of the project and simply run
`nvm install` and the `.nvmrc` file will install and select the correct version of Node if you don’t already have it.

To install Yarn, run `npm install --global yarn`.

Now you can launch:

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

[GEOlab](http://www.geolab.polimi.it/) - Politecnico di Milano (contact: [Daniele Oxoli](mailto:daniele.oxoli@polimi.it))

Developed by [Edoardo Pessina](mailto:edoardopessina.priv@gmail.com) - [GitHub](https://github.com/epessina)

## License

[MIT](https://opensource.org/licenses/MIT) © [GEOlab](mailto:geolab.como@gmail.com)
