const yaml = require('js-yaml');
const fs   = require('fs');

const filePath = 'catalog-info.yaml';
const tagsList = ['go', 'javascript'];
const systemsList = ['payments', 'internal-libraries', 'internal-services']; // The systems of USC services

// Utility functions
const loadCatalogFile = (filePath) => {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.loadAll(fileContents);
  } catch (error) {
    console.log('Catalog file missing, more information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground/catalog/');
    process.exit(1);
  }
};

console.log(loadCatalogFile);

// if (!existsSync(filePath)) {
//   console.log('Catalog file missing, more information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground/catalog/');
//   process.exit(1);
// }



//
// const fileContent = readFileSync(filePath, 'utf8');
// const catalogFiles = yaml.loadAll(fileContent);
//
// const catalogFile = catalogFiles.find(doc => doc.spec && doc.spec.tags && doc.spec.system);
//
// if (!catalogFile) {
//   console.log('No valid document found in catalog file.');
//   process.exit(1);
// }
//
// const { system, tags } = catalogFile.spec;
//
// if (!tags.every(tag => tagsList.includes(tag))) {
//   console.log('Tag missing, more information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground/tags');
//   process.exit(1);
// }
//
// if (!systemsList.includes(system)) {
//   console.log('System missing, more information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground/systems');
//   process.exit(1);
// }
//
// if (tags.includes('go')) {
//   // Call go-validator.js
// }
//
// if (tags.includes('javascript')) {
//   // Call javascript-validator.js
// }
//
// if (system === 'payments') {
//   // Call payments-validator.js
// }
