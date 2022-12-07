<div align="center">

<img 
  src="https://raw.githubusercontent.com/opengeolab/geocollectorbot/main/docs/img/geocollector_bot_logo.png"
  alt="logo"
  width="120" 
  height="120"
/>

# Geo Collector Bot

</div>

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Pipeline Status](https://gitlab.com/geolab.como/geocollectorbot/badges/main/pipeline.svg)](https://gitlab.com/geolab.como/geocollectorbot)

Telegram BOT for geodata collection, developed within the project [INSUBRI.PARKS](https://insubriparksturismo.eu) funded 
by the Interreg Co-operation Programme Italy–Switzerland 2014 -2020 (ID 605472).

## Documentation

To know how the Bot works you can follow the [official documentation](https://github.com/opengeolab/geocollectorbot_doc).

## Local development

To develop Servo locally you need:

- Node 16+
- Yarn 1.22+

To set up Node, please if possible try to use [nvm](https://github.com/creationix/nvm), so you can manage multiple
versions easily. Once you have installed nvm, you can go inside the directory of the project and simply run
`nvm install`, the `.nvmrc` file will install and select the correct version if you don’t already have it.

Yarn can be installed globally running `npm i -g yarn`.

Once you have all the dependency in place, you can launch:

```shell
yarn
yarn coverage
```

This two commands, will install the dependencies and run the tests with the coverage report that you can view as an HTML
page in `coverage/lcov-report/index.html`.

Now create your local copy of the default values for the `env` variables needed for launching the application.

```shell
cp ./example.env ./env
```

From now on, if you want to change anyone of the default values for the variables you can do it inside the `.env` file
without pushing it to the remote repository.

Once you have all your dependency in place you can launch:

```shell
yarn build
yarn start
```

and you will have the Bot exposed on your machine. From now on, you can follow the instructions in the
[examples](https://gitlab.com/geolab.como/geocollectorbot/-/tree/main/examples) folder to set up a working version of
your Bot.

## Contributions

[GEOlab](http://www.geolab.polimi.it/) - Politecnico di Milano (contact: [Daniele Oxoli](mailto:daniele.oxoli@polimi.it))

Developed by [Edoardo Pessina](mailto:edoardopessina.priv@gmail.com) - [GitHub](https://github.com/epessina)

## License

[MIT](https://opensource.org/licenses/MIT) © [GEOlab](mailto:geolab.como@gmail.com)
