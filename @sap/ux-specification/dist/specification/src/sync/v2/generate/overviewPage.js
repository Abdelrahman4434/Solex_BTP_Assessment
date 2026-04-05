"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCardDefinitionNames = getCardDefinitionNames;
exports.generateOverviewPageSchemaV2 = generateOverviewPageSchemaV2;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../../common");
const utils_1 = require("../utils");
const factory_1 = require("../export/factory");
const DEPRECATED_PROPERTIES = [
    {
        key: 'globalFilterEntityType',
        since: '',
        deprecated: {
            since: '1.54.0',
            text: 'Use globalFilterEntitySet instead.'
        }
    }
];
/**
 * Method returns array of card definition names.
 *
 * @param genericSchema - Generic schema of Overview Page.
 * @returns Array of definition names
 */
function getCardDefinitionNames(genericSchema) {
    // Apply enum to all card properties
    const properties = genericSchema['properties'];
    const cardProperties = (properties['cards'] &&
        properties['cards']['additionalProperties'] &&
        properties['cards']['additionalProperties']['anyOf']) ||
        [];
    return cardProperties.map((cardProperty) => {
        // Resolve ref
        const refParts = cardProperty['$ref'].split('/');
        return refParts[refParts.length - 1];
    });
}
/**
 * Defines and adds enum entries for 'model' property of Cards.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param manifest - manifest.json of the app
 */
function addModelsEnum(appSchema, manifest) {
    const dataSources = (manifest && manifest['sap.app'] && manifest['sap.app'].dataSources) || {};
    const serviceKeys = Object.keys(dataSources);
    const models = (manifest && manifest['sap.ui5'] && manifest['sap.ui5'].models) || {};
    let enumValues = [];
    enumValues = enumValues.concat(Object.keys(models).filter((model) => serviceKeys.includes(models[model].dataSource)));
    // Define enum
    const definition = appSchema.definitions;
    definition['CardModel'] = {
        type: 'string'
    };
    (0, common_1.addEnumToSchema)(enumValues, definition['CardModel']);
    // Apply enum to all card properties
    const cards = getCardDefinitionNames(appSchema);
    for (const card of cards) {
        const property = definition[card]['properties']['model'];
        delete property.type;
        property['$ref'] = common_1.DEFINITION_LINK_PREFIX + 'CardModel';
    }
}
/**
 * Sets warning messages for the deprecated properties.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param manifest - manifest.json of the app
 */
function markDeprecatedProperties(appSchema, manifest) {
    const schemaProperties = appSchema.properties;
    for (const property in DEPRECATED_PROPERTIES) {
        const deprecatedProperty = DEPRECATED_PROPERTIES[property];
        const key = deprecatedProperty.key;
        // Set warning messages for deprecated properties
        if (schemaProperties[key]) {
            schemaProperties[key]['messages'] = [
                {
                    text: (0, common_1.getTextForDeprecated)(key, {
                        since: deprecatedProperty.since,
                        deprecated: {
                            since: deprecatedProperty.deprecated.since,
                            text: deprecatedProperty.deprecated.text
                        }
                    })
                }
            ];
        }
        // Hide deprecated undefined properties
        const manifestOVPSection = manifest?.['sap.ovp'];
        if (manifestOVPSection && !manifestOVPSection[key]) {
            schemaProperties[key]['hidden'] = true;
        }
    }
}
/**
 * Adds 'manifestPath' to static nodes in schema.
 *
 * @param appSchema - Full schema.
 */
function addManifestPathsToStaticNodes(appSchema) {
    const ovpManifestPath = (0, common_1.appendJsonPathSegment)('$', ux_specification_types_1.ManifestSection.ovp);
    const cardsManifestPath = (0, common_1.appendJsonPathSegment)(ovpManifestPath, 'cards');
    appSchema['manifestPath'] = ovpManifestPath;
    appSchema['properties']['cards']['manifestPath'] = cardsManifestPath;
    // Add manifestPath to root level
    (0, utils_1.addManifestPathsToProperties)(appSchema, 'OverviewPage', appSchema, {}, factory_1.pageTypes.OverviewPage);
    // Add manifest path to cards in schema
    const definitions = appSchema.definitions;
    const cardsDefinitions = getCardDefinitionNames(appSchema);
    // Apply "manifestPath" to cards properties
    for (const cardDefinition of cardsDefinitions) {
        (0, utils_1.addManifestPathsToProperties)(appSchema, cardDefinition, definitions[cardDefinition], // created cards currently are not stored in schema, 'cardKey' is hardcoded so that consumer should determine exact card
        { cardKeys: ['cards', 'cardKey'] }, factory_1.pageTypes.OverviewPage, {
            name: 'cards',
            absoluteManifestPath: cardsManifestPath,
            relativeManifestPath: 'cards'
        }, true);
    }
}
/**
 * Generates an app specific schema out of the generic schema.
 * Generic types are replaced by information from the app manifest.
 *
 * @param genericSchema - generic JSON schema of an object page
 * @param manifest - manifest.json of the app
 * @returns the app specific JSON schema
 */
function generateOverviewPageSchemaV2(genericSchema, manifest) {
    const appSchema = JSON.parse(JSON.stringify(genericSchema));
    // schema validation for card name
    appSchema['properties']['cards']['propertyNames'] = {
        pattern: '^[a-zA-Z0-9_\\.\\-]+$'
    };
    markDeprecatedProperties(appSchema, manifest);
    // Enhance 'model' property with enum entries
    addModelsEnum(appSchema, manifest);
    // Add manifest path to static nodes in schema
    addManifestPathsToStaticNodes(appSchema);
    return appSchema;
}
//# sourceMappingURL=overviewPage.js.map