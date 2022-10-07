FROM node:lts-alpine
RUN apk update && \
    apk add git g++ make py3-pip
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
ENTRYPOINT ["yarn", "start"]