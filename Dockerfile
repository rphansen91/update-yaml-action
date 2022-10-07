FROM node:lts-alpine
WORKDIR /github/workspace
RUN apk update && \
    apk add git g++ make py3-pip
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 8080

ENTRYPOINT ["yarn", "start"]