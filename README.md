# Calling Reusable Workflows

## Call Build&Push Docker Workflow

```
name: Build and push docker

on:
  pull_request:
    branches:
      - main

jobs:
  call-docker-build-push-workflow:
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/build-and-push-docker-image.yaml@main
    with:
      REGISTRY: eu.gcr.io 
      REPOSITORY: usc-your-repo
      IMAGE: your-awesome-app
      PROJECT_ID: urbansportsclub-dev
      IMAGE_TAG: "v0.9.4" 
      DOCKERFILE_PATH: "Dockerfile"
```

## Call Deploy to Kubernetes Workflow ( Helm ) 

```
name: Deploy to Kubernetes Cluster 

on:
  pull_request:
    branches:
      - main

jobs:
  deploy-to-k8s-workflow:
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/deploy-to-k8s-cluster.yaml@main
    with:
      GKE_ZONE: "europe-west3"
      GKE_CLUSTER: "internal"
      STAGE: "dev"
      CHART_NAME: "your-chart-name"
      NAMESPACE: "test"
      SOPS: true
```
