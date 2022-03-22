# Reusable Workflows

This is our set of reusable workflows that you can use to make your life simplert when dealing with a few standard actions in our CI.

## Call Build & Push Docker Workflow

If you wan to build and push images you can simply add this to your workflow

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
      repository: usc-your-repo
      image: your-awesome-app
      project_id: urbansportsclub-dev
      dockerfile_path: "Dockerfile"
```

We use docker/metadata to guess your image tag based on your branch, or tag. This will then be pushed to GCR and you can use that when deploying.

## Call Deploy to Kubernetes Workflow ( Helm ) 

Putting all together, we have the follwoing.

```
name: Deploy to Kubernetes Cluster 

on:
  pull_request:
    branches:
      - main

jobs:

  call-docker-build-push-workflow:
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/build-and-push-docker-image.yaml@main
    with:
      repository: usc-your-repo
      image: your-awesome-app
      project_id: urbansportsclub-dev
      dockerfile_path: "Dockerfile"

  deploy-to-k8s-workflow:
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/deploy-to-k8s-cluster.yaml@main
    needs: call-docker-build-push-workflow
    with:
      chart_name: "your-chart-name"
      image_version: ${{ needs.call-docker-build-push-workflow.outputs.version }}
      namespace: "test"
      stage: "dev"
      gke_cluster: "internal"
      sops: true
```
