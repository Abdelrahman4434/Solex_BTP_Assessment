"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderedEntries = exports.Logger = void 0;
exports.createTestLogger = createTestLogger;
exports.retrieveFileContent = retrieveFileContent;
exports.prepareFileData = prepareFileData;
exports.getSTTAAnnotations = getSTTAAnnotations;
exports.getSDV4Annotations = getSDV4Annotations;
exports.getSTTAAnnotationsProdMan2 = getSTTAAnnotationsProdMan2;
exports.getSTTAManifestProdMan2 = getSTTAManifestProdMan2;
exports.getALPAnnotations = getALPAnnotations;
exports.getALPVisualizationsAnnotations = getALPVisualizationsAnnotations;
exports.getExtensionsProdMan2 = getExtensionsProdMan2;
exports.getSEPMRAAnnotations = getSEPMRAAnnotations;
exports.getExtensionsForS2pMmPurSrcgprojMaintains1 = getExtensionsForS2pMmPurSrcgprojMaintains1;
exports.findFlexChangeBySelector = findFlexChangeBySelector;
exports.findFlexChange = findFlexChange;
exports.checkPositions = checkPositions;
exports.findManifestSettingV4 = findManifestSettingV4;
exports.getReferredTypeDefinition = getReferredTypeDefinition;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const ux_specification_types_2 = require("@sap/ux-specification-types");
const fs = __importStar(require("fs"));
const path_1 = require("path");
const manifest_json_1 = __importDefault(require("../test-projects/v2sttaProdMan2/webapp/manifest.json"));
class Logger {
    enrichLogMessage(meta, message) {
        let logMessage = message;
        const location = meta['location'];
        if (location) {
            if (location?.path) {
                logMessage += '; location: ' + location.path;
            }
            if (typeof location['range'] === 'object') {
                const range = '/' + location.range.join('/');
                logMessage = (logMessage + range).replace(/\/\//g, '/');
            }
        }
        return logMessage;
    }
    constructor() {
        this.logInfo = [];
        this.logError = [];
        this.logWarning = [];
    }
    info(message, meta) {
        if (meta) {
            this.logInfo.push(this.enrichLogMessage(meta, message));
        }
        else {
            this.logInfo.push(message);
        }
    }
    warning(message, meta) {
        if (meta) {
            this.logWarning.push(this.enrichLogMessage(meta, message));
        }
        else {
            this.logWarning.push(message);
        }
    }
    error(message, meta) {
        if (meta) {
            this.logError.push(this.enrichLogMessage(meta, message));
        }
        else {
            this.logError.push(message);
        }
    }
    reset() {
        this.logInfo = [];
        this.logWarning = [];
        this.logError = [];
    }
}
exports.Logger = Logger;
function createTestLogger() {
    return new Logger();
}
/**
 * Returns the content of a list of files that are indicated by a list of file paths
 */
function retrieveFileContent(path) {
    if (path) {
        return fs.readFileSync(path, 'utf8');
    }
}
function prepareFileData(path) {
    const fileData = {
        dataSourceUri: path,
        fileContent: retrieveFileContent(path)
    };
    return fileData;
}
function getTestProjectsFileData(projectFolder, pathSuffixes) {
    return pathSuffixes.map((pathParts) => prepareFileData((0, path_1.join)('test', 'test-projects', projectFolder, 'webapp', ...pathParts)));
}
function getSTTAAnnotations(annotationSuffix = '') {
    return getTestProjectsFileData('v2sttaProdMan', [
        ['localService', 'metadata.xml'],
        ['localService', 'Z2SEPMRA_C_PD_PRODUCT_CDS_VAN.xml'],
        ['annotations', `annotation${annotationSuffix}.xml`]
    ]);
}
function getSDV4Annotations() {
    return getTestProjectsFileData('v4Salesorder', [
        ['localService', 'metadata.xml'],
        ['annotations', 'annotation.xml']
    ]);
}
function getSTTAAnnotationsProdMan2() {
    return getTestProjectsFileData('v2sttaProdMan2', [
        ['localService', 'metadata.xml'],
        ['localService', 'STTA_PROD_MAN_ANNO_MDL.xml'],
        ['annotations', 'annotations.xml']
    ]);
}
/**
 * Provides access to the manifest for the v2sttaProdMan2 project.
 * Thereby it is possible to get a modified manifest containing an extended multi-view multi-table setting.
 *
 * @param forMultiView - information whether the extended multi-view setting should be provided
 * @param: hasAlsoQuickVariantSelection - if true, the manifest will contain both quickVariantSelectionX and quickVariantSelection settings
 * @returns the manifest as specified
 */
function getSTTAManifestProdMan2(forMultiView, hasAlsoQuickVariantSelection = false) {
    const manifest = structuredClone(manifest_json_1.default);
    if (forMultiView) {
        manifest['sap.ui.generic.app']['pages']['ListReport|STTA_C_MP_Product']['component']['settings']['quickVariantSelectionX'] = {
            variants: {
                // view containing a key containing special characters:
                'o\\me"g\\a': {
                    key: 'beta--gamma1::delta',
                    annotationPath: 'com.sap.vocabularies.UI.v1.SelectionPresentationVariant#SPVInline'
                },
                // view with a key that is numeric, use default line item of that entity set
                '03': {
                    key: '3',
                    entitySet: 'STTA_C_MP_ProductSalesPrice'
                },
                // chart view:
                chart: {
                    key: 'chart',
                    annotationPath: 'com.sap.vocabularies.UI.v1.SelectionPresentationVariant#SPVInlineChart'
                },
                // view with key and accessor being identical:
                xyz: {
                    key: 'xyz',
                    entitySet: 'STTA_C_MP_ProductSalesPrice',
                    annotationPath: 'com.sap.vocabularies.UI.v1.SelectionPresentationVariant#SPVInline'
                },
                // view with key and accessor being different:
                hugo: {
                    key: 'bla',
                    entitySet: 'STTA_C_MP_ProductSalesPrice',
                    annotationPath: 'com.sap.vocabularies.UI.v1.SelectionVariant'
                }
            },
            enableAutoBinding: true
        };
    }
    if (hasAlsoQuickVariantSelection) {
        // Note that the quickVariantSelection content is already prepared in the base manifest.
        manifest['sap.ui.generic.app']['pages']['ListReport|STTA_C_MP_Product']['component']['settings']['quickVariantSelection'] =
            manifest['sap.ui.generic.app']['pages']['ListReport|STTA_C_MP_Product']['component']['settings']['_quickVariantSelection'];
        delete manifest['sap.ui.generic.app']['pages']['ListReport|STTA_C_MP_Product']['component']['settings']['_quickVariantSelection'];
    }
    return manifest;
}
function getALPAnnotations() {
    const allAnnotationData = [];
    allAnnotationData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2alp', 'webapp', 'localService', 'metadata.xml')));
    allAnnotationData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2alp', 'webapp', 'localService', 'MM_PUR_SUPLRCONF_MNTR_ANNO_MDL.xml')));
    allAnnotationData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2alp', 'webapp', 'annotations', 'annotation.xml')));
    return allAnnotationData;
}
function getALPVisualizationsAnnotations() {
    const allAnnotationData = [];
    allAnnotationData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2alp-visualizations', 'webapp', 'localService', 'metadata.xml')));
    allAnnotationData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2alp-visualizations', 'webapp', 'localService', 'SEPMRA_ALP_SO_ANA_SRV.xml')));
    allAnnotationData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2alp-visualizations', 'webapp', 'annotations', 'annotation.xml')));
    return allAnnotationData;
}
function getExtensionsProdMan2() {
    const allExtensionData = [];
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'ApplicationLogBreakout.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'CustomFilter.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'DonutChart.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'HeaderExtensionFacet.view.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'ListReportGridTableColumns.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'ListReportResponsiveTableCells.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'ListReportResponsiveTableColumns.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'OPCustomFilter.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'ProductSalesDataAnalyticalTableColumns.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'ProductTextGridTableColumns.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'ProductTextResponsiveTableCells.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'ProductTextResponsiveTableColumns.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'SideContentExtension.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'SmartFormGroupElement.fragment.xml')));
    allExtensionData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2sttaProdMan2', 'webapp', 'ext', 'fragments', 'TextFacet.fragment.xml')));
    return allExtensionData;
}
function getSEPMRAAnnotations() {
    const allAnnotationData = [];
    allAnnotationData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2SEPMRA_PROD_MAN', 'webapp', 'localService', 'metadata.xml')));
    allAnnotationData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2SEPMRA_PROD_MAN', 'webapp', 'localService', 'SEPMRA_PROD_MAN.xml')));
    allAnnotationData.push(prepareFileData((0, path_1.join)('test', 'test-projects', 'v2SEPMRA_PROD_MAN', 'webapp', 'annotations', 'annotation.xml')));
    return allAnnotationData;
}
function getExtensionsForS2pMmPurSrcgprojMaintains1(specificFiles) {
    const allExtensionData = [];
    const projectFragmentPath = [
        'test',
        'test-projects',
        's2p.mm.pur.srcgproj.maintains1',
        'webapp',
        'ext',
        'fragments'
    ];
    const files = [
        'ChangeDocsDialog',
        'ChangeItemClfnActionSheet',
        'ContactsCells',
        'ContactsColumns',
        'CreateItemActionSheet',
        'CustomFilter',
        'DistributionFollowOnExt',
        'DmndDistrDetailsCells',
        'DmndDistrDetailsColumns',
        'ErrorDialog',
        'FollowOnExt',
        'GeneralInfoFormExt',
        'ItemLinkageCells',
        'ItemLinkageColumns',
        'ItemLinkageDialog',
        'ItemLinkageErrorDialog',
        'ItemSourceExt',
        'LegalDocumentsPopover',
        'LegalTransactionsCells',
        'LegalTransactionsColumns',
        'ListReportCells',
        'ListReportColumns',
        'MilestonesFiltersDialog',
        'NegotiationActionSheet',
        'PaymentTermsActionSheet',
        'PaymentTermsFormExt',
        'RestrictionPopover',
        'SourceSourcingProject',
        'SourcingProjectCancel',
        'SourcingProjectItemColumns',
        'SourcingProjectItemToolbar',
        'SourcingProjectSetToUnconfirmedDialog',
        'SourcingProjectVersion',
        'SrcgProjImprtdSuplrListFacet',
        'SrcgProjItemPaymentTermsToolbar',
        'SrcgProjPubdSuplrListFacet',
        'SupplierActionHistoryDialog',
        'SupplierDeclineParticipationDialog',
        'SupplierQuotationTableCells',
        'SupplierQuotationTableColumns',
        'UnlockSupplierDialog'
    ];
    (specificFiles || files).forEach((file) => allExtensionData.push(prepareFileData((0, path_1.join)(...projectFragmentPath, `${file}.fragment.xml`))));
    return allExtensionData;
}
function findFlexChangeBySelector(exportResult, selectorId, property) {
    const filteredList = exportResult['flexChanges'].filter((change) => {
        const changeObject = JSON.parse(change);
        return changeObject.selector.id === selectorId && changeObject.content.property === property;
    });
    return filteredList && filteredList[0] && JSON.parse(filteredList[0]);
}
/**
 * Function to find out the flexChange from a list. Uses global variable exportResult
 *
 * @param {string} property Property for which the flexChange is to be found
 * @returns {object} contents of the flexChange
 */
function findFlexChange(exportResult, property) {
    const filteredList = exportResult['flexChanges'].filter((change) => {
        return JSON.parse(change).content.property === property;
    });
    return filteredList && filteredList[0] && JSON.parse(filteredList[0]);
}
/**
 * Method checks position properties in schema.
 * It also updates schema by removing offset properties from position as it is related to OS
 * Macros id (internalId) is also getting removed from macros metadata as it depends on uuid library.
 * At the end there will be line and column indexes, which could be stored in snapshots.
 *
 * @param {object} schema Schema to check and update.
 * @returns {boolean} Valid positions.
 */
function checkPositions(schema) {
    const filePath = schema['metadata'] ? schema['metadata']['filePath'] : undefined;
    if (filePath) {
        delete schema['metadata']['filePath'];
    }
    const checkMacrosMetadataProperties = (properties) => {
        let valid = true;
        for (const name in properties) {
            const property = properties[name];
            const position = property.metadata?.position;
            const type = property.metadata?.type;
            const internalId = property.metadata?.internalId;
            if (position) {
                if (position['startOffset'] === undefined || position['endOffset'] === undefined) {
                    return false;
                }
                // Ignore those properties in snapshot - it returned by thirdparty library and result affected by OS
                // Line and column numbers will be shown in snapshot
                delete position['startOffset'];
                delete position['endOffset'];
            }
            if (type === ux_specification_types_2.MacrosPropertyType.Control) {
                if (!internalId) {
                    return false;
                }
                else {
                    delete property.metadata['internalId'];
                }
            }
            if (property.properties) {
                valid = checkMacrosMetadataProperties(property.properties);
            }
        }
        return valid;
    };
    return checkMacrosMetadataProperties(schema.properties);
}
/**
 * Method returns array of schema definition properties which sorted by 'propertyIndex' property.
 *
 * @param {SchemaDefinition} schemaDefinition Schema definition which contains properties.
 * @returns {string[]} Array of sorted properties by 'propertyIndex' property.
 */
const getOrderedEntries = (schemaDefinition) => {
    const entries = Object.keys(schemaDefinition.properties || {});
    entries.sort((key1, key2) => {
        const property1 = schemaDefinition.properties[key1];
        const property2 = schemaDefinition.properties[key2];
        if (property1.propertyIndex === property2.propertyIndex) {
            return 0;
        }
        return property1.propertyIndex > property2.propertyIndex ? 1 : -1;
    });
    return entries;
};
exports.getOrderedEntries = getOrderedEntries;
function findManifestSettingV4(exportResult, pageName) {
    return exportResult['manifest'][ux_specification_types_1.ManifestSection.ui5]['routing']['targets'][pageName]['options']['settings'];
}
/**
 * Returns the definition of the referred type of a schema element.
 *
 * @param element - the schema element that may refer to another type
 * @param schema - the global schema
 * @returns the definition of the type the elements refers to, or undefined if it does not refer to any type
 */
function getReferredTypeDefinition(element, schema) {
    if (element.$ref) {
        const typeName = element.$ref.replace('#/definitions/', '');
        return schema.definitions[typeName]; // as this function will normally only called when checkReferentialCorrectness has succeeded, we can exclude Boolean.
    }
    return undefined;
}
//# sourceMappingURL=utils.js.map