FROM node:12.13.1-alpine3.10
ARG RABBITMQ_URL
ENV URL=$RABBITMQ_URL
RUN mkdir -p /usr/src/app
COPY src /usr/src/app/src
WORKDIR /usr/src/app/src
RUN npm install
CMD ["npm", "start"]