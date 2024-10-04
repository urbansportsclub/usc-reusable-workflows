import fs from "fs";
import yaml from 'js-yaml';

export function readCatalogFile() {
    try {
        return fs.readFileSync('catalog-info.yaml', 'utf8');
    } catch (error) {
        throw new Error(
            `Error reading the catalog file. Ensure that the file exists and contains valid YAML content.
             More information here: https://backstage.dev/docs/features/software-catalog/descriptor-format`
        );
    }
}

// Utility function to load and parse the catalog yaml file
export function parseCatalogYaml(fileContents) {
    const catalogFiles = yaml.loadAll(fileContents); // todo check this error

    // Check if the catalog file is empty or invalid
    if (!catalogFiles || catalogFiles.length === 0) {
        throw new Error(
            `Error parsing the catalog content. Ensure that the file contains valid YAML content.
             \nMore information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground/catalog/`
        );
    }

    return catalogFiles; // Return the parsed YAML document as an object
}

// Function to validate the required fields in the catalog file
export function validateCatalogFile(catalogFiles, allowedSystems, allowedTags) {
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
            // todo fix the url in the error message
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
}
