#!/bin/sh

if [ -f "catalog-info.yaml" ]; then
  echo "Catalog file found."
  exit 0
else
  echo "The catalog file is missing, more information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground"
  exit 1
fi
