const core = require('@actions/core');
const utils = require('./utils/utils');

const allowedTags = ['go', 'javascript']; // this should not be hardcoded
const allowedSystems = ['payments', 'internal-libraries']; // this should not be hardcoded


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
    // We read the catalog file, validating that our services have a catalog file
    const fileContents = utils.readCatalogFile();

    // We load the catalog file and validate the content, getting the SCE required fields from categorized services
    const catalogs = utils.parseCatalogYaml(fileContents);
    const {system, tags} = validateCatalogFile(catalogs);


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
