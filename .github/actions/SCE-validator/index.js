import {goValidator} from "./go-validator";
import * as core from '@actions/core';
import * as utils from './utils/utils';
import {jsValidator} from "./javascript-validator";

const allowedTags = ['go', 'javascript']; // this should not be hardcoded
const allowedSystems = ['payments', 'internal-libraries']; // this should not be hardcoded


try {
    // We read the catalog file, validating that our services have a catalog file
    const fileContents = utils.readCatalogFile();

    // We load the catalog file and validate the content, getting the SCE required fields from categorized services
    const catalogs = utils.parseCatalogYaml(fileContents);
    const {system, tags} = utils.validateCatalogFile(catalogs, allowedSystems, allowedTags);


    // Based in the categorized information from the catalog file, we execute the corresponding validator scripts
    if (tags.includes('go')) {
        goValidator();
    }

    if (tags.includes('javascript')) {
        jsValidator();
    }

    if (system === 'payments') {
        console.log('Payments validator script is not implemented yet.');
    }
} catch (error) {
    // Unified error handler with gitHub action core
    core.setFailed(`Error: ${error.message}`);
}
