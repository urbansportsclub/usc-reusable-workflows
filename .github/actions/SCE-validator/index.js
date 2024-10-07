import * as core from '@actions/core';
import * as utils from './utils/utils.js';
import {goValidator} from "./go-validator.js";
import {jsValidator} from "./javascript-validator.js";

const TAGS = {
    GOLANG: 'golang',
    JAVASCRIPT: 'javascript',
}

const SYSTEMS = {
    PAYMENTS: 'payments',
    INTERNAL_LIBRARIES: 'internal-libraries',
}

const allowedTags = [TAGS.GOLANG, TAGS.JAVASCRIPT]; // this should not be hardcoded
const allowedSystems = [SYSTEMS.PAYMENTS, SYSTEMS.INTERNAL_LIBRARIES]; // this should not be hardcoded


try {
    // We read the catalog file, validating that our services have a catalog file
    const fileContents = utils.readCatalogFile();

    // We load the catalog file and validate the content, getting the SCE required fields from categorized services
    const catalogs = utils.parseCatalogYaml(fileContents); // catalogs could contain several yaml documents
    const {system, tags} = utils.validateCatalogFile(catalogs, allowedSystems, allowedTags);


    // Based in the categorized information from the catalog file, we execute the corresponding validator scripts
    if (tags.includes(TAGS.GOLANG)) {
        goValidator();
    }

    if (tags.includes(TAGS.JAVASCRIPT)) {
        jsValidator();
    }

    if (system === SYSTEMS.PAYMENTS) {
        console.log('Payments validator script is not implemented yet.');
    }

    if (system === SYSTEMS.INTERNAL_LIBRARIES) {
        console.log('Internal libraries validator script is not implemented yet.');
    }
} catch (error) {
    // Unified error handler with gitHub action core
    core.setFailed(`Error: ${error.message}`);
}
