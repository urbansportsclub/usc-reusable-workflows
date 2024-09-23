const { existsSync } = require('fs');

const filePath = 'catalog-info.yaml';

if (existsSync(filePath)) {
  console.log('Catalog file found.');
  process.exit(0);
} else {
  console.log('Catalog file missing, more information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground');
  process.exit(1);
}
