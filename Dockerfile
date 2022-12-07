FROM node:gallium-alpine

LABEL maintainer="GEOlab<http://www.geolab.polimi.it/>" \
      name="geo-collector-bot" \
      description="Telegram BOT for geodata collection"

ENV NODE_ENV=production
ENV PATH="${PATH}:/home/node/node_modules/.bin/"

WORKDIR /home/node

COPY package.json .
COPY yarn.lock .

COPY ./build ./build

RUN echo "geo-collector-bot: $COMMIT_SHA" >> ./commit.sha
RUN yarn install --frozen-lockfile

CMD node --unhandled-rejections=strict build/index.js
