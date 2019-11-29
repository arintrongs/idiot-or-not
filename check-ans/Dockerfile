FROM node:12.13.1-alpine3.10
ARG RABBITMQ_URL
ENV URL=$RABBITMQ_URL
RUN mkdir -p /usr/src/app
COPY src /usr/src/app/src
WORKDIR /usr/src/app/src
RUN npm install
CMD ["npm", "start"]

# docker build -t gen-question .
# docker run -p 8000:8000 gen-question 
# docker push eyeayeeye/check-ans

# build on arm
# vim ~/.config.json
# "experimental" : "enabled"
# docker buildx create --name myfuckingbuilder
# docker buildx use myfuckingbuilder
# docker buildx build --platform linux/arm64,linux/arm/v7 -t <<your fucking image name>> --push .