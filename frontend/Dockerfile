# base image
FROM node:12.13.1-alpine3.10

ARG GATEWAY_URL
ENV URL=$GATEWAY_URL
# set working directory
RUN mkdir -p /usr/src/app

# install and cache app dependencies
COPY build /usr/src/app/build
# COPY package.json /usr/src/app/package.json
WORKDIR /usr/src/app

RUN npm install -g serve

# start app
CMD ["serve","-l","80", "build"]