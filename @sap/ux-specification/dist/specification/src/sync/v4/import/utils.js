"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importSettingsOfObject = importSettingsOfObject;
const common_1 = require("../../common");
const decorators_1 = require("../../common/decoration/decorators");
/**
 * Transfers settings from manifest to object page config.
 *
 * @param {object} configPart - The configuration object that contains the settings to be imported.
 * @param {Manifest} manifest - The manifest object where the settings will be imported.
 * @param {Definition | DefinitionOrBoolean} appSchema - The application schema used for validation and structure.
 * @param {string} pageKey - The key representing the specific page in the manifest.
 * @param {string[]} breadcrumbs - The breadcrumb hierarchy guiding the location of the target settings.
 * @param {string} [sectionId] - The optional section ID for locating specific sections in the manifest.
 * @param {ExtensionLogger} [logger] - A logger instance used for logging deprecation warnings and issues.
 * @param {Definition | DefinitionOrBoolean} [schemaDefinitions] - Optional schema definitions that further specify the configuration structure.
 */
function importSettingsOfObject(configPart, manifest, appSchema, pageKey, breadcrumbs, sectionId, logger, schemaDefinitions) {
    if (!appSchema) {
        return;
    }
    let manifestSection = {};
    const deprecatedProperties = configPart?.getDeprecated;
    const targetAnnotationEncoded = sectionId && sectionId.replace(/\//g, '::');
    for (const propertyKey in appSchema['properties']) {
        const syncRule = (0, decorators_1.getReflectMetadata)(configPart, propertyKey);
        if (syncRule?.manifest) {
            const path = syncRule.manifest.path([pageKey], manifest, targetAnnotationEncoded, ...breadcrumbs);
            manifestSection = (0, common_1.getManifestSectionByPathV4)(manifest, path, sectionId, targetAnnotationEncoded, true);
            if (manifestSection && Object.keys(manifestSection).length > 0) {
                // if there are several definitions, we need to find the one that matches the manifest section element
                const property = appSchema['properties'][propertyKey];
                const propertyDefinition = getPropertyDefinition(property, schemaDefinitions, manifestSection?.[propertyKey]);
                (0, common_1.importProperty)(syncRule, manifestSection, propertyKey, configPart, sectionId, breadcrumbs, propertyDefinition);
                (0, common_1.checkDeprecatedProperties)(deprecatedProperties, manifestSection, path, logger);
            }
        }
    }
}
/**
 * Finds and returns the matching property definition from a set of schema definitions based on a given manifest section element.
 *
 * @param {Definition} property - Represents the property that contains potential definition variants to match against.
 * @param {Definition | DefinitionOrBoolean} schemaDefinitions - A collection of schema definitions to source the matching property definition.
 * @param {Record<string, unknown>} manifestSectionElement - An object representing the manifest section element used to determine the relevant schema definition.
 * @returns {Definition | DefinitionOrBoolean | undefined} The matching property definition, or undefined if no match is found.
 */
function getPropertyDefinition(property, schemaDefinitions, manifestSectionElement) {
    // if there are several definitions, we need to find the one that matches the manifest section element
    const { anyOf: definitionVariants } = property;
    if (!definitionVariants ||
        !schemaDefinitions ||
        !manifestSectionElement ||
        typeof manifestSectionElement !== 'object') {
        return undefined;
    }
    return definitionVariants.reduce((definition, variant) => {
        if (definition) {
            return definition;
        }
        // gets the definition from the schemaDefinitions
        const definitionName = variant.$ref?.split(common_1.DEFINITION_LINK_PREFIX)[1];
        const schemaDefinition = schemaDefinitions[definitionName];
        if (!schemaDefinition) {
            return undefined;
        }
        // use the control property to find the correct definition
        const { controlProperty, properties, defaultControlProperty } = schemaDefinition;
        const manifestValue = manifestSectionElement[controlProperty];
        // if this schema definition is the default one, we return it if the control property is not defined
        if (defaultControlProperty && manifestValue === undefined) {
            return schemaDefinition;
        }
        const controlPropertyDefinition = properties[controlProperty] ?? {};
        const definitionValue = controlPropertyDefinition[common_1.CONST_PROPERTY];
        return common_1.CONST_PROPERTY in controlPropertyDefinition && definitionValue === manifestValue
            ? schemaDefinition
            : undefined;
    }, undefined);
}
//# sourceMappingURL=utils.js.map