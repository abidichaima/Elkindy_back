FROM node:16-alpine

WORKDIR /app

COPY . /app

RUN yarn install

RUN yarn run build-dev

EXPOSE 5000

CMD ["yarn", "start"]