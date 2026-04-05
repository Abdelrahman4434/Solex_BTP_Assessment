"use strict";
/**
 * @file This file is used for manual tests and will only be used temporarily.
 * It is needed while the generic schema handling solution for v2 List Report is still in development but
 * the previous logic is actually used at runtime.
 * For this purpose the file exposes a handler class that is capable to perform the three important tasks provided to the PageMap by specification
 * (generation of page specific schema, import, and export).
 * The implementation of these three tasks is forwarded to the corresponding 'classical' implementation files.
 * For manual tests you can set useGenericSchemaHandling to true. Then these three tasks will be executed based on the schema class ListReportNew
 * and the generic schema handling logic.
 * Do not forget to set the variable back to false, before submitting any changes!
 *
 * Note: This file also exposes some of its helper functions so that they can also be used by the unit tests that test the new schema generation logic for v2 LR as well.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersistentListReportNewSchema = getPersistentListReportNewSchema;
exports.createGenericSchemaInfoProvider = createGenericSchemaInfoProvider;
exports.getConfigInfo = getConfigInfo;
exports.getPathForRootPage = getPathForRootPage;
exports.flexInfoToChangeString = flexInfoToChangeString;
exports.generateListReportSchemaV2 = generateListReportSchemaV2;
exports.createListReportConfig = createListReportConfig;
exports.exportListReportPage = exportListReportPage;
const useGenericSchemaHandling = false; // Set this to true temporarily for manual tests to use the generic schema handling logic.
const ux_specification_types_1 = require("@sap/ux-specification-types");
const v2_1 = require("@sap/ux-specification-types/src/v2");
// Importing the 'classic' implementation of the three tasks:
const listReport_1 = require("../../generate/listReport");
const listReport_2 = require("../../import/pages/listReport");
const exportPage_1 = require("../../export/exportPage");
const schemaAdaptation_1 = require("../../generate/schemaAdaptation");
const ListReportNew_1 = require("./ListReportNew");
const path_1 = require("path");
const fs_1 = require("fs");
const utils_1 = require("../../utils");
const importPage_1 = require("../../import/importPage");
const exportPageGeneric_1 = require("../../export/exportPageGeneric");
const common_1 = require("../../../common");
const import_1 = require("../../import");
/**
 * The instance of type PageHandlerLR to be used in productive environment (until generic logic has been completely implemented).
 */
const pageHandlerLRClassic = {
    generateListReportSchemaV2(generateParameters, genericSchema) {
        return (0, listReport_1.generateListReportSchemaV2)(generateParameters, genericSchema);
    },
    createListReportConfig(importParameters) {
        return (0, listReport_2.createListReportConfig)(importParameters);
    },
    exportListReportPage(exportParameters, ui5Version, deletionRequest) {
        return (0, exportPage_1.exportListReportPage)(exportParameters, ui5Version, deletionRequest);
    }
};
let pageHandlerLRGeneric; // Cached instance of the PageHandler using generic schema handling logic. Created on demand only.
/**
 * Gives access to the new version of the generic schema for a v2 List Report Page as it has been persisted by the build process.
 *
 * @returns the schema definition of the v2 List Report Page
 */
function getPersistentListReportNewSchema() {
    // Access the generic schema for ListReportNew from the file system.
    let pathToDist; // path to the dist folder
    if (__dirname.endsWith('dist')) {
        //runtime case -> we have the dist folder already
        pathToDist = __dirname;
    }
    else {
        // unit test case -> need to navigate from the source older to the dist folder
        const endPosition = __dirname.lastIndexOf('specification');
        pathToDist = (0, path_1.join)(__dirname.substring(0, endPosition + 'specification'.length), 'dist');
    }
    const schemaPath = (0, path_1.join)(pathToDist, 'schemas', 'v2', 'ListReportNewConfig.json');
    const ListReportNewSchema = JSON.parse((0, fs_1.readFileSync)(schemaPath, 'utf8'));
    return ListReportNewSchema;
}
/**
 * Creates a GenericSchemaInfoProvider that can be used to access the required schema information for a v2 List Report Page when the generic schema handling logic is used.
 * Note that this function is called in two scenarios:
 * 1. In runtime case it is called when useGenericSchemaHandling has been set to true and the Page Editor for a v2 List Report page is opened.
 * 2. Unit tests for the generic schema handling logic of v2 List Report call this via function getGenericPageInfoProvider4NewPages.
 * Depending on the scenario the current directory (__dirname) will either point to the dist folder or to the source folder of this file.
 *
 * @returns a GenericSchemaInfoProvider that gives access to the schema information for the new v2 list report page.
 */
function createGenericSchemaInfoProvider() {
    const ListReportNewSchema = getPersistentListReportNewSchema();
    return function (componentName) {
        return componentName === v2_1.FE_TEMPLATE_V2_LIST_REPORT
            ? {
                genericSchema: ListReportNewSchema,
                syncRuleProvider: ListReportNew_1.ListReportNew
            }
            : undefined; // this instance is currently only working for v2 List Report
    };
}
/**
 * This function provides the configuration information for a v2 List Report Page.
 * All other page types are currently not handled by this function.
 *
 * @param componentName - name of the template component describing the page. Should identify the v2 list report page.
 * @returns the instance provider needed to create instances of the types for the v2 List Report Page, resp. undefined when another page is specified
 */
function getConfigInfo(componentName) {
    return componentName === v2_1.FE_TEMPLATE_V2_LIST_REPORT
        ? {
            // Up to now we do not need any conversion exit
            propertyInstanceProvider: function (propertyTypePath) {
                return new ListReportNew_1.ListReportNew(); // up to now no helper classes have been modelled for the v2 List Report Page
            }
        }
        : undefined;
}
/**
 * Provides the manifest path to the root page (either LR or ALP) the manifest of a FE v2 app.
 
 * @param manifest the manifest of the FE v2 app
 * @returns the manifest path to the root page resp. undefined if no root page is defined in the manifest
 */
function getPathForRootPage(manifest) {
    const { value: pagesSection } = (0, utils_1.getManifestPropertyByPath)(manifest, [ux_specification_types_1.ManifestSection.generic], 'pages');
    if (Array.isArray(pagesSection)) {
        return [ux_specification_types_1.ManifestSection.generic, 'pages', 0];
    }
    return pagesSection && typeof pagesSection === 'object'
        ? [ux_specification_types_1.ManifestSection.generic, 'pages', Object.keys(pagesSection)[0]]
        : undefined;
}
/**
 * Conversion form the FlexInfo representation of a flex change into its string representation.
 *
 * @param ui5Version - specifies the ui5 version the change is written for
 * @param manifest - manifest of the app the change is created for
 * @param flexInfo - description of the change to be converted
 * @returns - string representation of the flex change
 */
function flexInfoToChangeString(ui5Version, manifest, flexInfo) {
    const isCustomer = !ui5Version.layer || ui5Version.layer === "CUSTOMER_BASE" /* FlexChangeLayer.Customer */;
    const flexChange = {
        controlId: flexInfo.controlId,
        controlType: flexInfo.controlType,
        content: {
            property: flexInfo.propertyName
        },
        sapui5Version: ui5Version.ui5Version,
        isCustomer
    };
    if (flexInfo.isBinding) {
        flexChange.content.newBinding = flexInfo.newValue;
        flexChange.type = 'propertyBindingChange';
    }
    else {
        flexChange.content.newValue = flexInfo.newValue;
    }
    return (0, common_1.exportToFlexChange)(flexChange, manifest);
}
/**
 * This function is called on demand. It creates an instance of type PageHandlerLR that uses the generic schema handling logic.
 *
 * @returns the created instance of type PageHandlerLR
 */
function createPageHandlerLRGeneric() {
    // As the signatures of the functions provided by generic schema handling do not exactly fit to the signatures defined in type PageHandlerLR
    // (they are very similar to the classical ones) we need to build some adapters.
    const genericSchemaInfoProvider = createGenericSchemaInfoProvider();
    /* Translate the logical flex changes contained in exportPageResults into the string representation of the corresponding flex changes */
    const getFlexChangesAsStrings = function (appId, exportPageResults, ui5Version) {
        const localManifest = structuredClone(exportPageResults.manifest);
        localManifest[ux_specification_types_1.ManifestSection.app].id = appId;
        return exportPageResults.flexList.map(flexInfoToChangeString.bind(null, ui5Version, localManifest));
    };
    // Provide an instance that implements the PageHandlerLR interface using the generic schema handling logic:
    return {
        generateListReportSchemaV2(generateParameters) {
            const manifest = generateParameters.manifest;
            const pagePath = getPathForRootPage(manifest);
            if (!pagePath) {
                return null;
            }
            const pageSpec = {
                appId: manifest[ux_specification_types_1.ManifestSection.app]?.id || '', // todo: do we need to care for variable appIds in the manifest (e.g. '${project.artifactId})?
                manifest,
                pagePath,
                annotations: [],
                parsedAnnotations: generateParameters.serviceAVT,
                fragments: generateParameters.fragments
            };
            return (0, schemaAdaptation_1.getAdaptedSchema)(pageSpec, genericSchemaInfoProvider, generateParameters.logger);
        },
        createListReportConfig(importParameters) {
            const pagePath = getPathForRootPage(importParameters.manifest);
            return (0, importPage_1.getConfigForPage)(importParameters, pagePath, getConfigInfo);
        },
        exportListReportPage(exportParameters, ui5Version, deletionRequest) {
            const fragmentResults = exportParameters.fragments
                ? exportParameters.fragments.map(function (fragment) {
                    return {
                        ...fragment,
                        changeIndicator: ux_specification_types_1.ChangeIndicator.NoChange
                    };
                })
                : [];
            const inParameters = {
                appId: exportParameters.appId,
                config: exportParameters.page.config,
                manifest: exportParameters.manifest,
                jsonSchema: exportParameters.jsonSchema,
                //    conversionExitProvider:     // not needed, yet
                fragments: fragmentResults,
                logger: exportParameters.logger
            };
            const exportPageResults = (0, exportPageGeneric_1.exportPage)(inParameters);
            const flexChanges = getFlexChangesAsStrings(exportParameters.appId, exportPageResults, ui5Version);
            return {
                manifest: exportPageResults.manifest,
                fragments: exportPageResults.fragments,
                flexChanges,
                manifestChangeIndicator: exportPageResults.manifestChangeIndicator
            };
        }
    };
}
/**
 * This function provides then instance of type PageHandlerLR that is to be used in productive environment.
 *
 * @returns the instance to be used
 */
function getPageHandlerLR() {
    if (useGenericSchemaHandling) {
        pageHandlerLRGeneric = pageHandlerLRGeneric || createPageHandlerLRGeneric();
        return pageHandlerLRGeneric;
    }
    return pageHandlerLRClassic;
}
/**
 * Generates an app specific schema for the FE V2 ListReport from the generic schema.
 * Generic types are replaced by information from the app specific annotations.
 *
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @param {object} genericSchema - generic JSON schema of a list report
 * @returns appSchema - the application specific JSON schema
 */
function generateListReportSchemaV2(generateParameters, genericSchema) {
    // Ensure that only those flex changes are used that refer to the LR
    generateParameters = {
        ...generateParameters,
        flex: generateParameters.entitySet && generateParameters.flex
            ? (0, import_1.filterFlexChanges)(generateParameters.flex, v2_1.SAPUI5_VIEW_EXTENSION_LIST_REPORT, generateParameters.entitySet.name)
            : []
    };
    return getPageHandlerLR().generateListReportSchemaV2(generateParameters, genericSchema);
}
/**
 * Creates the configuration file content for a list report V2.
 *
 * @param importParameters  - object comprising all input data
 * @returns {v2.ListReportConfigV2 | undefined} - the configuration (JSON) for the list report
 */
function createListReportConfig(importParameters) {
    return getPageHandlerLR().createListReportConfig(importParameters);
}
/**
 * Run through the given ListReport config and return respective manifest entry and flex changes.
 *
 * @param {ExportListReportV2Parameters} exportParameters - all API parameters needed for the export
 * @param ui5Version - SAP UI5 version
 * @param deletionRequest - if set to true, any manifest setting specified by entityPath gets deleted even if it comprises any unknown property
 * @returns ExportResults - The export result comprises the enhanced manifest as well as a list of flex changes.
 */
function exportListReportPage(exportParameters, ui5Version, deletionRequest = false) {
    return getPageHandlerLR().exportListReportPage(exportParameters, ui5Version, deletionRequest);
}
//# sourceMappingURL=pageAccess.js.map