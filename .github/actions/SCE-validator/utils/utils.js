import fs from "fs";
const yaml = require('js-yaml');


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
const parseCatalogYaml = (fileContents) => {
    const catalogFiles = yaml.loadAll(fileContents);

    // Check if the catalog file is empty or invalid
    if (!catalogFiles || catalogFiles.length === 0) {
        throw new Error(
            `Error parsing the catalog content. Ensure that the file contains valid YAML content.
             \nMore information here: https://backstage.dev.urbansportsclub.tech/docs/default/component/devx-playground/catalog/`
        );
    }

    return catalogFiles; // Return the parsed YAML document as an object
};

export {parseCatalogYaml};