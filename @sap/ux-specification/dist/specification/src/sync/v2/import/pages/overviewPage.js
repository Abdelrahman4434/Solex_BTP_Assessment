"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOverviewPageConfig = createOverviewPageConfig;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const decorators_1 = require("../../../common/decoration/decorators");
const manifest_1 = require("../../export/manifest");
const factory_1 = require("../../export/factory");
const export_1 = require("../../export/export");
const common_1 = require("../../../common");
const __1 = require("../../../..");
const i18next_1 = __importDefault(require("i18next"));
/**
 * Transfers settings of a referenced schema definition to the configuration part.
 *
 * @param {ImportOverviewPageV2Parameters} importParameters - Structure of import parameters.
 * @param {any} definitionArray - Array of definition references from the schema.
 * @param {{ [key: string]: any }} configPart - Current part of the configuration JSON.
 * @param {string} key - Property key of the parent.
 * @param {MetadataInstanceInterface} factory - Metadata factory instance.
 * @param {string[]} pathHierarchy - Parts of the path or breadcrumbs.
 */
function transferSettingsOfRef(importParameters, definitionArray, configPart, key, factory, pathHierarchy) {
    const targetDefinitionType = definitionArray[definitionArray.length - 1];
    const nextTargetDefinition = importParameters.jsonSchema.definitions[targetDefinitionType];
    configPart[key] = (0, export_1.assignReflectMetadataRules)(factory, key, configPart[key], targetDefinitionType);
    //transfer settings:
    pathHierarchy.push(key);
    processOvpProperties(factory, configPart[key], importParameters, nextTargetDefinition.properties, pathHierarchy);
}
/**
 * Resolves the reference of an object-type property and starts the transfer of the properties to the config.
 *
 * @param {{ [key: string]: any }} configPart - current part of the config JSON
 * @param {string} key - property key of parent
 * @param {Definition} schemaProperties - current properties' list of a definition from app schema
 * @param {ImportOverviewPageV2Parameters} importParameters  - structure of import parameters
 * @param {MetadataInstanceInterface} factory - Metadata factory
 * @param {string[]} pathHierarchy - Parts of the path or breadcrumbs
 * @param {v2.CardTemplateType} cardType - Target card type to process
 */
function processPropertiesOfObject(configPart, key, schemaProperties, importParameters, factory, pathHierarchy, cardType) {
    const isConfigPropertyDefined = key in configPart;
    if (schemaProperties[key].$ref) {
        configPart[key] = configPart[key] ?? {};
        const definitionArray = schemaProperties[key].$ref.split(common_1.DEFINITION_LINK_PREFIX);
        transferSettingsOfRef(importParameters, definitionArray, configPart, key, factory, pathHierarchy);
    }
    else if (key === 'settings' && schemaProperties[key].anyOf && cardType in ux_specification_types_1.v2.cardTemplateSettingsMap) {
        configPart[key] = configPart[key] ?? {};
        const ref = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.v2.cardTemplateSettingsMap[cardType]}`;
        const definitionArray = ref.split(common_1.DEFINITION_LINK_PREFIX);
        transferSettingsOfRef(importParameters, definitionArray, configPart, key, factory, pathHierarchy);
    }
    if (!isConfigPropertyDefined && !Object.keys(configPart[key]).length) {
        delete configPart[key];
    }
}
/**
 * Imports a single sap.ovp property into the config.
 *
 * @param configPart - part of the config JSON, to be updated
 * @param key - key of the property
 * @param pathHierarchy - Parts of the path or breadcrumbs
 * @param importParameters  - structure of import parameters
 * @param schemaProperties - current properties' list of a definition from app schema
 * @param factory - Metadata factory
 * @param cardType - Target card type to process
 */
function processOvpProperty(configPart, key, pathHierarchy, importParameters, schemaProperties, factory, cardType) {
    const syncRule = (0, decorators_1.getReflectMetadata)(configPart, key);
    if (syncRule?.manifest) {
        const path = syncRule.manifest.path([...pathHierarchy, key]);
        const manifestSection = (0, manifest_1.ensureManifestSectionByPathV2)(importParameters.manifest, path);
        if (Object.prototype.hasOwnProperty.call(manifestSection, key)) {
            try {
                (0, common_1.importProperty)(syncRule, manifestSection, key, configPart);
            }
            catch (error) {
                (0, __1.log)(importParameters.logger, {
                    severity: "error" /* LogSeverity.Error */,
                    message: i18next_1.default.t('XMLPARSEFAILURE', { error: (0, common_1.getErrorMessage)(error) }),
                    location: {
                        path
                    }
                });
            }
        }
    }
    else if (key !== 'cards' && key !== '$schema' && typeof schemaProperties[key] === 'object') {
        processPropertiesOfObject(configPart, key, schemaProperties, importParameters, factory, pathHierarchy, cardType);
    }
}
/**
 * Handles a list of properties of a given part of the schema, transfers the relevant property values or settings from manifest to config.
 *
 * @param {MetadataInstanceInterface} factory - Metadata factory
 * @param {{ [key: string]: any }} configPart - current part of the config JSON
 * @param {ImportOverviewPageV2Parameters} importParameters  - structure of import parameters
 * @param {Definition} schemaProperties - current properties' list of a definition from app schema
 * @param {string[]} pathHierarchy - Parts of the path or breadcrumbs
 * @param {v2.CardTemplateType} cardType - Target card type to process
 */
function processOvpProperties(factory, configPart, importParameters, schemaProperties, pathHierarchy, cardType) {
    for (const key in schemaProperties) {
        processOvpProperty(configPart, key, pathHierarchy, importParameters, schemaProperties, factory, cardType);
    }
}
/**
 * OVP: Transfers all settings from manifest to config.
 *
 * @param pageConfig - the OVP configuration (JSON)
 * @param importParameters  - structure of import parameters
 * @param factory - Metadata factory
 */
function addSettings(pageConfig, importParameters, factory) {
    processOvpProperties(factory, pageConfig, importParameters, importParameters.jsonSchema.properties, []);
    pageConfig.cards = {};
    Object.keys(importParameters.manifest[ux_specification_types_1.ManifestSection.ovp].cards).forEach((cardId) => {
        const cardTemplate = importParameters.manifest[ux_specification_types_1.ManifestSection.ovp]['cards'][cardId].template;
        const cardType = ux_specification_types_1.v2.cardTemplateTypeMap[cardTemplate] ?? 'CustomCard';
        const cardTypes = [];
        for (const template in ux_specification_types_1.v2.cardTemplateTypeMap) {
            if (ux_specification_types_1.v2.cardTemplateTypeMap[template] !== cardType) {
                cardTypes.push({
                    template,
                    cardType: ux_specification_types_1.v2.cardTemplateTypeMap[template]
                });
            }
        }
        // Ensure cardTemplate is moved to the end
        cardTypes.push({
            template: cardTemplate,
            cardType
        });
        for (const variantCard of cardTypes) {
            //instantiate Card:
            pageConfig.cards[cardId] = (0, export_1.assignReflectMetadataRules)(factory, variantCard.cardType, pageConfig.cards[cardId] ?? {}, 'CustomCard');
            pageConfig.cards = (0, export_1.assignReflectMetadataRules)(factory, variantCard.cardType, pageConfig.cards, 'CustomCard');
            //transfer settings:
            processOvpProperties(factory, pageConfig.cards[cardId], importParameters, importParameters.jsonSchema.definitions[variantCard.cardType]
                .properties, ['cards', cardId], variantCard.template);
        }
    });
}
/**
 * Creates the configuration (file content) for an overview page.
 *
 * @param {ImportOverviewPageV2Parameters} importParameters  - structure of import parameters
 * @returns {object} - the OVP configuration (JSON)
 */
function createOverviewPageConfig(importParameters) {
    const factory = new factory_1.MetadataInstanceFactoryV2();
    //Instantiate Page
    const config = factory.createPageInstance(ux_specification_types_1.PageTypeV2.OverviewPage);
    if (importParameters.jsonSchema) {
        addSettings(config, importParameters, factory);
    }
    return config;
}
//# sourceMappingURL=overviewPage.js.map