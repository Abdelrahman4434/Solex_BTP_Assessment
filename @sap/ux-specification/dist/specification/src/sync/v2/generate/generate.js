"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateObjectPageInterfaceV2 = generateObjectPageInterfaceV2;
exports.generateListReportInterfaceV2 = generateListReportInterfaceV2;
exports.generateAnalyticalListPageInterfaceV2 = generateAnalyticalListPageInterfaceV2;
exports.generateOVPInterfaceV2 = generateOVPInterfaceV2;
const utils_1 = require("../../common/utils");
const objectPage_1 = require("./objectPage");
// Normally generateListReportSchemaV2 will be routed by pageAccess to the sibling file listReport.ts of this file.
// For manual tests this can be changed by switching useGenericSchemaHandling in pageAccess.ts to true.
// In this case generic schema handling and the schema for ListReportNew will be used.
const pageAccess_1 = require("../genericSchemaHandling/pages/pageAccess");
const analyticalListReport_1 = require("./analyticalListReport");
const overviewPage_1 = require("./overviewPage");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const importProject_1 = require("../../common/importProject");
const i18next_1 = __importDefault(require("i18next"));
const extensionLogger_1 = require("../../../extensionLogger");
const i18n_1 = require("../../../i18n/i18n");
/**
 * Common logic for LR and OP to prepare the generation.
 *
 * @param {FileData[]} annotations - list of all annotation files (file content plus URI as identifier)
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @param {object} manifest - manifest.json of the app
 * @param {FileData[]} [fragments] - Array with XML fragments.
 * @param {string} entitySet - the base entity set name of the given page
 * @param {string[]} flex - list of flex changes to be considered
 * @param templateType - the type of the template used for schema generation
 * @returns the filled interface structure with all information for the schema generation
 */
function prepareGenerationV2(annotations, logger, manifest, fragments, entitySet, flex, templateType) {
    (0, i18n_1.initI18n)();
    const serviceAVT = (0, utils_1.parseAndMergeAndConvert)(annotations, logger);
    const generateParameters = {
        templateType,
        fioriElementsVersion: ux_specification_types_1.FioriElementsVersion.v2,
        manifest,
        fragments,
        serviceAVT,
        flex,
        logger
    };
    generateParameters.entitySet = (0, importProject_1.getEntitySetByEntitySetName)(entitySet, generateParameters.serviceAVT);
    if (!generateParameters.entitySet) {
        (0, extensionLogger_1.log)(generateParameters.logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('ENTITYSETNOTFOUND', { entitySetName: entitySet })
        });
    }
    return generateParameters;
}
/**
 * Generates an app specific schema out of the generic schema.
 * Generic types are replaced by information from the app specific annotations.
 *
 * @param {object} genericSchema - generic JSON schema of an object page
 * @param {string} entitySet - the base entity set name of the given page
 * @param {FileData[]} annotations - list of all annotation files (file content plus URI as identifier)
 * @param {object} manifest - manifest.json of the app
 * @param {FileData[]} [fragments] - Array with XML fragments.
 * @param {string[]} flex - list of flex changes to be considered
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns the app specific JSON schema
 */
function generateObjectPageInterfaceV2(genericSchema, entitySet, annotations, manifest, fragments, flex, logger) {
    const generateParameters = prepareGenerationV2(annotations, logger, manifest, fragments, entitySet, flex, ux_specification_types_1.TemplateType.ListReportObjectPageV2);
    return (0, objectPage_1.generateObjectPageSchemaV2)(generateParameters, genericSchema);
}
/**
 * Generates the app specific schema of a list report out of the generic schema.
 * Generic types are replaced by information from the app specific annotations.
 *
 * @param genericSchema - generic JSON schema of a list report
 * @param entitySet - the base entity set name of the given page
 * @param annotations - list of all annotation files (file content plus URI as identifier)
 * @param manifest - manifest.json of the app
 * @param {FileData[]} fragments - list of fragment files and their content
 * @param {string[]} flex - list of flex changes to be considered
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns the app specific JSON schema
 */
function generateListReportInterfaceV2(genericSchema, entitySet, annotations, manifest, fragments, flex, logger) {
    const generateParameters = prepareGenerationV2(annotations, logger, manifest, fragments, entitySet, flex, ux_specification_types_1.TemplateType.ListReportObjectPageV2);
    return (0, pageAccess_1.generateListReportSchemaV2)(generateParameters, genericSchema);
}
/**
 * Generates the app specific schema of an analytical list page out of the generic schema.
 * Generic types are replaced by information from the app specific annotations.
 *
 * @param genericSchema - generic JSON schema of a list report
 * @param entitySet - the base entity set name of the given page
 * @param annotations - list of all annotation files (file content plus URI as identifier)
 * @param manifest - manifest.json of the app
 * @param fragments - list of fragment files and their content
 * @param {string[]} flex - list of flex changes to be considered
 * @param logger - Logger class for logging messages
 * @returns the app specific JSON schema
 */
function generateAnalyticalListPageInterfaceV2(genericSchema, entitySet, annotations, manifest, fragments, flex, logger) {
    const generateParameters = prepareGenerationV2(annotations, logger, manifest, fragments, entitySet, flex, ux_specification_types_1.TemplateType.AnalyticalListPageV2);
    return (0, analyticalListReport_1.generateAnalyticalListReportSchemaV2)(generateParameters, genericSchema);
}
/**
 * Generates the app specific schema of an overview page.
 *
 * @param genericSchema - file content of the generic schema
 * @param manifest - manifest.json of the app
 * @returns the generic schema, as equivalent to the app schema
 */
function generateOVPInterfaceV2(genericSchema, manifest) {
    return (0, overviewPage_1.generateOverviewPageSchemaV2)(genericSchema, manifest);
}
//# sourceMappingURL=generate.js.map