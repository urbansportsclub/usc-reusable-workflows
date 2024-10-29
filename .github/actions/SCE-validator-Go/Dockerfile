FROM europe-west3-docker.pkg.dev/urbansportsclub-dev/docker-hub/golang:1.23-alpine AS builder

COPY ./ ./

RUN apk add --update --no-cache make

ARG SCE_REPOSITORY

RUN git clone urbansportsclub/usc-reusable-workflows/.github/actions/SCE-validator@DX-409-CL /sce

WORKDIR /sce

RUN make build

ENTRYPOINT [ "./dist/sce-validator" ]
