FROM node:hydrogen-alpine

LABEL maintainer="GEOlab<http://www.geolab.polimi.it/>" \
      name="geo-collector-bot" \
      description="Telegram BOT for geodata collection"

ENV NODE_ENV=production
ENV PATH="${PATH}:/home/node/node_modules/.bin/"

WORKDIR /home/node

COPY package.json ./
COPY .yarn ./.yarn
COPY yarn.lock ./
COPY .yarnrc.yml ./

RUN corepack enable
RUN yarn install --immutable

COPY src ./src
COPY scripts ./scripts
COPY tsconfig.json ./tsconfig.json

RUN yarn build

RUN echo "geo-collector-bot: $COMMIT_SHA" >> ./commit.sha

CMD node --unhandled-rejections=strict build/index.js
