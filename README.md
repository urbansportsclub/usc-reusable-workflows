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
      image_name: your-awesome-app
      project_id: urbansportsclub-dev
      dockerfile_path: "Dockerfile"
```

We use docker/metadata to guess your image tag based on your branch, or tag. This will then be pushed to GCR and you can use that when deploying.

## Call Deploy to Kubernetes Workflow ( Helm ) 

Putting all together, we have the following.

```
name: Deploy to Kubernetes Cluster 

on:
  pull_request:
    branches:
      - main

jobs:

  call-docker-build-push-workflow:  # ID of the build job
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/build-and-push-docker-image.yaml@main
    with:
      repository: usc-your-repo
      image: your-awesome-app
      project_id: urbansportsclub-dev
      dockerfile_path: "Dockerfile"
      # image_tag: "v1.14.14"  # Add this line if you need to specify docker image tag

  deploy-to-k8s-workflow:
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/deploy-to-k8s-cluster.yaml@main
    needs: call-docker-build-push-workflow
    with:
      chart_path: "charts/your-chart-directory"  # No trailing slash at the end of the chart path.
      chart_name: "your-chart-name"
      image_version: ${{ needs.call-docker-build-push-workflow.outputs.image_version }}  # Same as the ID of the build job 
      namespace: "test"
      stage: "dev"
      gke_cluster: "internal"
      sops: true
```

## Rollback Workflow

```
name: Rollback Helm Deployment 

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Revision ( version ) number. Enter 0 to rollback previous release.'     
        required: true
        default: '0'
  pull_request:
    branches:
      - main

jobs:

  helm-rollback-workflow:
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/helm-rollback.yaml@main
    with:
      chart_name: "your-chart-name"
      version: 0 # Optional, Revision (version) number. If this argument is omitted, it will rollback to the previous release.
      namespace: "test"
      gke_cluster: "internal"
      project_id: "urbansportsclub-dev" # GCP Project ID
      runner: "deploy" # Which Action Runner to use, change to "deploylive" for staging/live deployments.
```

## SonarQube
### Setting Up

1. To start a new project on SonarQube, you need to access [sonarqube.svc.urbansportsclub.tech](https://sonarqube.svc.urbansportsclub.tech/). Once logged in, you can click on the button on the top right corner called `Create Project` and select `Github`.

![create project](resources/readme/new-project-github.png)

2. Now, you have to select the organization and which repository do you want to create the project for. After you have selected, you can click in `Set up selected repository`.

![selecting the project](resources/readme/selecting-project.png)

3. To setup the repository, you need to select `GitHub Actions`.

![github actions](resources/readme/github-actions.png)

4. The `GitHub Actions` secrets will show up. In this section, is where you will generate the `SONAR_TOKEN` necessary to send the data from your repository to SonarQube. After clicking on `Generate Token`, a pop-up will show, you can select an expiration time, you can select `No expiration` and then, finally click in `Generate`.

![secrets](resources/readme/project-secrets.png)

5. Copy the token and go to your repository. There, you will need to set a new secret. For that, go to `Settings > Secrets and variables > New repository secret`. Give the name of `SONAR_TOKEN` and paste the token from SonarQube.

![github secrets](resources/readme/github-secrets.png)

6. Back to SonarQube page, you can click on `Continue` and finish the tutorial.

7. You will also need to retrieve the `Project key`, which can be found inside the project that you just created, clicking in the top right corner link, called `Project information` and copy the value.

![project information](resources/readme/project-information.png)

### Using the Workflow

Here is an example on how to use SonarQube in your pull requests:

```yaml
---
name: Lint and Test
on:
  pull_request:
    branches:
      - "*"

jobs:
  test:
    name: Test
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/test-go.yaml@main
    secrets:
      github-token: ${{ secrets.GB_TOKEN_PRIVATE }}

  scan:
    name: Sonarqube Scan
    needs: [ test ]
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/sonarqube-scan.yaml@main
    with:
      download_coverage_artifact: true
    secrets:
      token: ${{ secrets.SONAR_TOKEN }}
```

Here is an example on how to use SonarQube for the `master|main` branch. You can notice that we are exposing two inputs for the `scan`:

- `enable_quality_gate`: should be set to `false` if you don't want your workflow to fail.
- `download_coverage_artifact`: it will download the coverage file from the test.

```yaml
---
name: Build and Deploy Staging
on:
  push:
    branches:
      - master

jobs:
  test:
    name: Test
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/test-go.yaml@main
    secrets:
      github-token: ${{ secrets.GB_TOKEN_PRIVATE }}
  
  scan:
    name: Sonarqube Scan
    needs: [ test ]
    uses: urbansportsclub/usc-reusable-workflows/.github/workflows/sonarqube-scan.yaml@main
    with:
      enable_quality_gate: false
      download_coverage_artifact: true
    secrets:
      token: ${{ secrets.SONAR_TOKEN }}
```

### Code coverage for other languages

To use code coverage for other languages, your test step should output a coverage file. This file then, should be uploaded to GitHub artifacts. Since the upload step and download happen in different moments, you have to specify the name of the artifact to be downloaded.

```yaml
test:
  - name: Run tests with phpunit/phpunit
    run: vendor/bin/phpunit --coverage-clover=coverage.xml

  - name: Archive code coverage results
    uses: actions/upload-artifact@v3
    with:
      name: php-coverage-xml
      path: coverage.xml
      retention-days: 5
      if-no-files-found: error

scan:
  name: Sonarqube Scan
  needs: [ test ]
  uses: urbansportsclub/usc-reusable-workflows/.github/workflows/sonarqube-scan.yaml@main
  with:
    enable_quality_gate: true
    download_coverage_artifact: true
    coverage_artifact_name: php-coverage-xml
  secrets:
    token: ${{ secrets.SONAR_TOKEN }}
```
