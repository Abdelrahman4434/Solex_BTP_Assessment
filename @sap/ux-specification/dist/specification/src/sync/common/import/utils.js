"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importProperty = importProperty;
exports.checkDeprecatedProperties = checkDeprecatedProperties;
exports.getSectionTitle = getSectionTitle;
exports.getTargetFromCustomColumnRef = getTargetFromCustomColumnRef;
exports.removeEmptyStructure = removeEmptyStructure;
const __1 = require("../");
const extensionLogger_1 = require("../../../extensionLogger");
const dist_1 = require("@sap/ux-specification-types/dist");
/**
 * Transfers the value of a single manifest setting to the config.
 *
 * @param {SyncRule} syncRule - The synchronization rule containing information about the manifest key and import handler.
 * @param {{}} manifestSection - The manifest section from which the property will be imported.
 * @param {string} propertyKey - The key of the property to be imported.
 * @param {{ [key: string]: any }} configPart - The configuration object where the property will be added.
 * @param {string} [sectionId] - Optional identifier for the section in the manifest.
 * @param {string[]} [breadcrumbs] - Optional array of path breadcrumbs for context.
 * @param {Definition} [propertyDefinition] - Optional definition object for validating the manifest value.
 */
function importProperty(syncRule, manifestSection, propertyKey, configPart, sectionId, breadcrumbs, propertyDefinition) {
    const manifestKey = syncRule.manifest.key || propertyKey;
    const importHandler = syncRule.manifest.import;
    if (importHandler && typeof importHandler === 'function') {
        const value = importHandler(manifestSection, sectionId, propertyKey, breadcrumbs);
        if (value !== undefined) {
            configPart[propertyKey] = getValidatedManifestValue(value, propertyDefinition);
        }
    }
    else if (manifestSection[manifestKey] !== undefined) {
        configPart[propertyKey] = getValidatedManifestValue(manifestSection[manifestKey], propertyDefinition);
    }
}
/**
 * Validation during import: check if properties are marked as deprecated.
 * If so, log them.
 *
 * @param deprecatedProperties - existing list, to be actualized
 * @param manifestSection - Section in manifest.json
 * @param path - path to the section in manifest
 * @param {ExtensionLogger} logger - Logger class for logging messages
 */
function checkDeprecatedProperties(deprecatedProperties, manifestSection, path, logger) {
    if (manifestSection && deprecatedProperties) {
        for (const key in manifestSection) {
            const deprecated = deprecatedProperties[key];
            if (deprecated) {
                (0, extensionLogger_1.log)(logger, {
                    severity: "warning" /* LogSeverity.Warning */,
                    message: (0, __1.getTextForDeprecated)(key, deprecated),
                    location: {
                        path: 'webapp/manifest.json/',
                        range: path.split('/')
                    }
                });
                delete deprecatedProperties[key];
            }
        }
    }
}
/**
 * Determines the title of a section representation in the app schema, main aspect is checking the facet ID.
 *
 * @param schemaSection - Section in manifest.json
 * @param jsonSchema - app specific schema
 * @returns {string | undefined} - title of the section
 */
function getSectionTitle(schemaSection, jsonSchema) {
    if (schemaSection.$ref && !schemaSection.title) {
        const refTitle = jsonSchema.definitions[schemaSection.$ref.split(__1.DEFINITION_LINK_PREFIX)[1]];
        return getSectionTitle(refTitle, jsonSchema);
    }
    else if (schemaSection.title) {
        if (schemaSection.title.startsWith(dist_1.FACETTITLEPREFIX)) {
            return schemaSection.title.split(dist_1.FACETTITLEPREFIX)[1].replace(/com.sap/g, '@com.sap');
        }
        else {
            return schemaSection.title.replace(/com.sap/g, '@com.sap');
        }
    }
    else {
        return undefined;
    }
}
/**
 * Method returns target by resolving custom column reference name.
 * For example - 'TableCustomColumns<dummyTarget>' is resolved as 'dummyTarget'.
 *
 * @param {string} ref Reference key.
 * @returns {string | undefined} Resolved target.
 */
function getTargetFromCustomColumnRef(ref) {
    const refParts = ref.split(`${dist_1.DefinitionName.CustomColumns}<`);
    if (refParts[1]) {
        return refParts[1].split('>')[0];
    }
    return undefined;
}
/**
 * Removes part of a given config, if empty.
 *
 * @param {object} config - config part
 * @param {string} structure - part of config to be removed
 */
function removeEmptyStructure(config, structure) {
    if (!config[structure]) {
        return;
    }
    if (Object.keys(config[structure]).length < 1) {
        delete config[structure];
    }
}
/**
 * Validates and filters the manifest value based on the provided property definitions.
 *
 * @param {unknown | Record<string, unknown>} manifestValue - The manifest value to be validated and filtered. Can be any value or an object.
 * @param {Definition} [propertyDefinition] - The optional property definition or configuration specifying which properties to validate.
 * @returns {unknown | Record<string, unknown>} The validated and filtered manifest value.
 */
function getValidatedManifestValue(manifestValue, propertyDefinition) {
    // if there are no specific property definition, we just return the manifest value
    if (!propertyDefinition) {
        return manifestValue;
    }
    // otherwise, we check the manifest value and return only the properties defined in the property definition
    const { properties } = propertyDefinition;
    return Object.keys(properties).reduce((result, currentKey) => {
        return currentKey in manifestValue
            ? { ...result, [currentKey]: manifestValue[currentKey] }
            : result;
    }, {});
}
//# sourceMappingURL=utils.js.map