# base image
FROM node:12.13.1-alpine3.10

# set working directory
RUN mkdir -p /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
# ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY build /usr/src/app/build
# COPY package.json /usr/src/app/package.json
WORKDIR /usr/src/app

RUN npm install -g serve

# start app
CMD ["serve", "build"]