const core = require('@actions/core');
const yaml = require('js-yaml');
const fs = require('fs');

const filePath = 'catalog-info.yaml';
const allowedTags = ['go', 'javascript']; // this should not be hardcoded
const allowedSystems = ['payments', 'internal-libraries']; // this should not be hardcoded

// Utility function to load and parse the catalog file
const loadCatalogFile = (path) => {
    // Read the file contents
    const fileContents = fs.readFileSync(path, 'utf8');

    // Parse the YAML content
    const catalogFiles = yaml.loadAll(fileContents);

    // Check if the catalog file is empty or invalid
    if (!catalogFiles || catalogFiles.length === 0) {
        throw new Error(
            `No content found in the catalog file. Ensure that your catalog file contains valid YAML content.
             \nMore information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground/catalog/`
        );
    }

    return catalogFiles; // Return the parsed YAML document as an object
};


// Function to validate the required fields in the catalog file
const validateCatalogFile = (catalogFiles) => {
    // Find the 'Component' kind document
    const component = catalogFiles.find(
        (doc) => doc && doc.kind === 'Component'
    );

    if (!component) {
        throw new Error(
            `No 'Component' kind found in the catalog file. Ensure that your catalog file includes a 'Component' kind.\nMore information here: https://backstage.dev/docs/features/software-catalog/descriptor-format#kind-component`
        );
    }

    if (!component.metadata) {
        throw new Error(
            `Missing 'metadata' field in the 'Component'. Ensure that 'metadata' is defined in your catalog file.\nMore information here: https://backstage.dev/docs/features/software-catalog/descriptor-format#metadata`
        );
    }

    const {tags} = component.metadata;

    if (!component.spec) {
        throw new Error(
            `Missing 'spec' field in the 'Component'. Ensure that 'spec' is defined in your catalog file.\nMore information here: https://backstage.dev/docs/features/software-catalog/descriptor-format#spec`
        );
    }

    const {system} = component.spec;

    // Validate tags
    if (
        !tags ||
        !Array.isArray(tags) ||
        !tags.every((tag) => allowedTags.includes(tag))
    ) {
        throw new Error(
            `Invalid or missing tags in 'metadata'. Allowed tags are: ${allowedTags.join(
                ', '
            )}.\nMore information here: https://backstage.dev/docs/features/software-catalog/descriptor-format#metadata`
        );
    }

    // Validate system
    if (!system || !allowedSystems.includes(system)) {
        throw new Error(
            `Invalid or missing 'system' in 'spec'. Allowed systems are: ${allowedSystems.join(
                ', '
            )}.\nMore information here: https://backstage.dev/docs/features/software-catalog/descriptor-format#spec`
        );
    }

    return {system, tags};
};

try {
    // We load the catalog file and validate the content, getting the SCE required fields from categorized services
    const catalogFile = loadCatalogFile(filePath);
    const {system, tags} = validateCatalogFile(catalogFile);


    // Based in the categorized information from the catalog file, we execute the corresponding validator scripts
    if (tags.includes('go')) {
        console.log('Go validator script is not implemented yet.');
        // require('./go-validator.js')();
    }

    if (tags.includes('javascript')) {
        console.log('Javascript validator script is not implemented yet.');
        // require('./javascript-validator.js')();
    }

    if (system === 'payments') {
        console.log('Payments validator script is not implemented yet.');
        // require('./payments-validator.js')();
    }
} catch (error) {
    // Unified error handler with gitHub action core
    core.setFailed(`Error: ${error.message}`);
    // process.exit(1);
}
