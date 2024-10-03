const core = require('@actions/core');
const yaml = require('js-yaml');
const fs = require('fs');

const filePath = 'catalog-info.yaml';
const allowedTags = ['go', 'javascript'];
const allowedSystems = ['payments', 'internal-libraries', 'internal-services'];

// Utility function to load and parse the catalog file
const loadCatalogFile = (path) => {
    // Read the file contents
    const fileContents = fs.readFileSync(path, 'utf8');

    // Parse the YAML content
    const catalogFile = yaml.load(fileContents, {});

    // Check if the catalog file is empty or invalid
    if (!catalogFile) {
        throw new Error(
            `No content found in the catalog file. Ensure that your catalog file contains valid YAML content.
             \nMore information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground/catalog/`
        );
    }

    return catalogFile; // Return the parsed YAML document as an object
};

try {
    // Load the catalog file
    const catalogFile = loadCatalogFile(filePath);

    if (!catalogFile.spec) {
        throw new Error(`Missing 'spec' field in the catalog file.`);
    }

    const {system, tags} = catalogFile.spec;

    if (
        !tags ||
        !Array.isArray(tags) ||
        !tags.every((tag) => allowedTags.includes(tag))
    ) {
        throw new Error(
            `Invalid or missing tags. Allowed tags are: ${allowedTags.join(', ')}.`
        );
    }

    if (!system || !allowedSystems.includes(system)) {
        throw new Error(
            `Invalid or missing system. Allowed systems are: ${allowedSystems.join(', ')}.`
        );
    }

    if (tags.includes('go')) {
        // Execute go-validator.js
        console.log('Go validator script is not implemented yet.');
        // require('./go-validator.js')();
    }

    if (tags.includes('javascript')) {
        // Execute javascript-validator.js
        console.log('Javascript validator script is not implemented yet.');
        // require('./javascript-validator.js')();
    }

    if (system === 'payments') {
        // Execute payments-validator.js
        console.log('Payments validator script is not implemented yet.');
        // require('./payments-validator.js')();
    }
} catch (error) {
    // Unified error handler
    core.setFailed(`Error: ${error.message}`);
    process.exit(1);
}
