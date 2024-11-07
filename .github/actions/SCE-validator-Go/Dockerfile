FROM europe-west3-docker.pkg.dev/urbansportsclub-dev/docker-hub/golang:1.23-alpine AS builder

COPY ./ ./

RUN --mount=type=secret,id=GITHUB_TOKEN \
    GITHUB_TOKEN=$(cat /run/secrets/GITHUB_TOKEN) && \
    git config --global url."https://${GITHUB_TOKEN}:x-oauth-basic@github.com/".insteadOf "https://github.com/" && \
    make build

ENV ENV SCE_REPOSITORY=$SCE_REPOSITORY

RUN git clone https://github.com/${SCE_REPOSITORY} /sce

WORKDIR /sce

RUN make build

ENTRYPOINT [ "./dist/sce-validator" ]
