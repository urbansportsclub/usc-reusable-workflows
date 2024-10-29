FROM europe-west3-docker.pkg.dev/urbansportsclub-dev/docker-hub/golang:1.23-alpine AS builder

COPY ./ ./

RUN apk add --update --no-cache make

ENV ENV SCE_REPOSITORY=$SCE_REPOSITORY

RUN git clone https://github.com/${SCE_REPOSITORY} /sce

WORKDIR /sce

RUN make build

ENTRYPOINT [ "./dist/sce-validator" ]
