# Calling a reusable workflow

```
name: Call a reusable workflow

on:
  pull_request:
    branches:
      - main

jobs:
  call-docker-build-push-workflow:
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/workflow-B.yml@main
    with:
      REGISTRY: eu.gcr.io 
      REPOSITORY: usc-your-repo
      IMAGE: your-awesome-app
      PROJECT_ID: urbansportsclub-dev
      IMAGE_TAG: "v0.9.4" 
```