FROM golang:1.13.4-alpine3.10

WORKDIR /go/src/app
COPY . .


RUN go get -d -v ./...
RUN go install -v ./...

CMD ["app"]