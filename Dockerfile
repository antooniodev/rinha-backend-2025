FROM node:22-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn install

COPY . /app/

RUN yarn build

EXPOSE 3333

CMD ["yarn", "start"]