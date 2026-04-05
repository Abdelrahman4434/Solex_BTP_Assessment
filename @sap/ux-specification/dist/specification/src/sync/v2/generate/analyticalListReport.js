"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAnalyticalListReportSchemaV2 = generateAnalyticalListReportSchemaV2;
const utils_1 = require("./utils");
const manifestPropertyUtils_1 = require("./manifestPropertyUtils");
const import_1 = require("../import");
const common_1 = require("../../common");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const listReport_1 = require("./listReport");
const i18next_1 = __importDefault(require("i18next"));
const extensionLogger_1 = require("../../../extensionLogger");
const types_1 = require("../types");
const types_2 = require("../../../../../types/src/common/types");
const factory_1 = require("../export/factory");
const utils_2 = require("../utils");
const v2_1 = require("@sap/ux-specification-types/src/v2");
const ROOT_PROPERTIES_ORDER = [
    'filterBar',
    'keyPerformanceIndicators',
    'chart',
    'table',
    'footer'
];
/**
 * Returns LineItem and Chart annotations used for the ALP. Reproduces logic from Fiori Elements ALP implementation (function createWorkingContext in ALP specific AnnotationHelper).
 *
 * @param {v2.SapUiAppPageV2} v2Page - actual page in the manifest
 * @param {EntityTypeAnnotations_UI} uIAnnotations - annotations of UI namespace of the given entityType
 * @param logger - Logger instance used for logging messages
 * @returns {LineItem | undefined} - LineItem annotation
 */
function getLineItemAndChartAnnotation(v2Page, uIAnnotations, logger) {
    const settings = v2Page?.component?.settings;
    if ((0, manifestPropertyUtils_1.hasPropertyTypeError)(settings, 'qualifier', logger)) {
        return {
            lineItemAnnotation: undefined,
            chartAnnotation: undefined
        }; // return undefined in case there is an error in the settings
    }
    const qualifier = settings?.qualifier; // qualifier from the manifest (if it has been configured)
    // retrieve the definition of the specified annotation for the qualifier which has been retrieved from the manifest settings
    const getAnnotationWithQualifier = function (annotationTerm) {
        const annotationPath = annotationTerm + (qualifier ? '#' + qualifier : '');
        return uIAnnotations[annotationPath];
    };
    const selectionPresentationVariant = getAnnotationWithQualifier(types_2.FacetBase.SelectionPresentationVariant);
    const presentationVariant = selectionPresentationVariant
        ? selectionPresentationVariant[types_2.FacetBase.PresentationVariant]
        : getAnnotationWithQualifier(types_2.FacetBase.PresentationVariant); // If no SPV with the given qualifier exists, then ALP code will try to identify a PV with the given qualifier directly.
    // If an SPV could be identified which does not point to an existing PV this is considered as an error
    if (selectionPresentationVariant && !presentationVariant) {
        const message = qualifier
            ? i18next_1.default.t('NOPRESENTATIONVARIANTFORSPV', { qualifier: qualifier })
            : i18next_1.default.t('NOPRESENTATIONVARIANTFORDEFAULTSPV');
        (0, extensionLogger_1.log)(logger, {
            severity: "error" /* LogSeverity.Error */,
            message: message
        });
        return {
            lineItemAnnotation: undefined,
            chartAnnotation: undefined
        };
    }
    // If a PV could be determined LineItem and Chart should be defined as a visualization of the PV.
    const visualizations = presentationVariant?.Visualizations || [];
    let lineItemName = ''; // the name that will be used to retrieve the LineItem from uiAnnotations
    let chartName = ''; // the name that will be used to retrieve the Chart from uiAnnotations
    visualizations.some(function (visualization) {
        lineItemName =
            lineItemName || (0, utils_1.retrieveNameWithoutVocabularyFromVisualization)(types_2.FacetBase.LineItem, visualization);
        chartName = chartName || (0, utils_1.retrieveNameWithoutVocabularyFromVisualization)(types_2.FacetBase.Chart, visualization);
        return lineItemName && chartName; // end loop as soon as names of LineItem and Chart have both been identified
    });
    // If the above logic did not identify a name for the LineItem/Chart then still the corresponding annotation (but without qualifier) will be used
    lineItemName = lineItemName || types_2.FacetBase.LineItem;
    chartName = chartName || types_2.FacetBase.Chart;
    const lineItemAnnotation = uIAnnotations[lineItemName];
    const chartAnnotation = uIAnnotations[chartName];
    // Not having any line item/chart annotation is allowed according to FE documentation but still questionable. Hence, we log a warning.
    const warningIndex = (lineItemAnnotation || settings.quickVariantSelectionX ? 0 : 1) + (chartAnnotation ? 0 : 2);
    if (warningIndex > 0) {
        const warningKey = ['NOLINEITEMS', 'NOCHARTS', 'NOLINEITEMANDCHARTS'][warningIndex - 1];
        const message = i18next_1.default.t(warningKey);
        (0, extensionLogger_1.log)(logger, {
            severity: "warning" /* LogSeverity.Warning */,
            message: message
        });
    }
    return {
        lineItemAnnotation,
        chartAnnotation
    };
}
/**
 * Adds missing annotation path to chart definition.
 *
 * @param {Definition} appSchema - app specific JSON schema
 * @param {Chart} chartAnnotation - chart annotation data
 */
function addChart(appSchema, chartAnnotation) {
    const chartSettings = appSchema.definitions[ux_specification_types_1.DefinitionName.ChartSettings];
    const pathParts = chartAnnotation.fullyQualifiedName.split('@');
    chartSettings[ux_specification_types_1.SchemaTag.annotationPath] = `/${pathParts[0]}/@${pathParts[1]}`;
}
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param appSchema - Full schema.
 * @param definitionName - The name of the definition/class whose properties are being processed.
 * @param definition - The definition object containing property schemas.
 * @param pathParams - Additional context required to compute manifest paths.
 */
function addManifestPathsToPropertiesALP(appSchema, definitionName, definition, pathParams) {
    let targetAnnotation = undefined;
    if (pathParams.targetAnnotation) {
        const annotationParts = pathParams.targetAnnotation?.split('/');
        targetAnnotation = annotationParts[annotationParts.length - 1];
    }
    else {
        // Default annotation path
        targetAnnotation = `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
    }
    (0, utils_2.addManifestPathsToProperties)(appSchema, definitionName, definition, {
        ...pathParams,
        pathsParts: [targetAnnotation, '', targetAnnotation]
    }, factory_1.pageTypes.AnalyticalListPage);
}
/**
 * Adds 'manifestPath' to static nodes in schema.
 *
 * @param appSchema - Full schema.
 * @param pathParams - Additional context required to compute manifest paths.
 */
function addManifestPathsToStaticNodes(appSchema, pathParams) {
    // Add "manifestPath" for current page
    appSchema['manifestPath'] = (0, utils_2.getPageManifestPath)(pathParams);
    // Add manifestPath to root level
    addManifestPathsToPropertiesALP(appSchema, 'AnalyticalListPage', appSchema, pathParams);
    // Add manifestPath to chart
    addManifestPathsToPropertiesALP(appSchema, undefined, appSchema.properties.chart, pathParams);
    // Add manifestPath to table
    addManifestPathsToPropertiesALP(appSchema, undefined, appSchema.properties.table, pathParams);
    // Add manifestPath to filterBar
    addManifestPathsToPropertiesALP(appSchema, undefined, appSchema.properties.filterBar, pathParams);
}
/**
 * Generates an app specific schema out of the generic schema.
 * Generic types are replaced by information from the app specific annotations.
 *
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @param genericSchema - generic JSON schema of a list report
 * @returns {object} - app specific JSON schema
 */
function generateAnalyticalListReportSchemaV2(generateParameters, genericSchema) {
    // Ensure that only those flex changes are used that refer to the ALP
    generateParameters = {
        ...generateParameters,
        flex: generateParameters.flex && generateParameters.entitySet
            ? (0, import_1.filterFlexChanges)(generateParameters.flex, v2_1.SAPUI5_VIEW_EXTENSION_ANALYTICAL_LIST_PAGE, generateParameters.entitySet.name)
            : []
    };
    const appSchema = JSON.parse(JSON.stringify(genericSchema));
    appSchema.properties[ux_specification_types_1.PropertyName.table].anyOf[0]['$ref'] =
        common_1.DEFINITION_LINK_PREFIX + 'ALPResponsiveTable<LineItems>';
    const tableDefinitionResponsive = JSON.parse(JSON.stringify(appSchema.definitions.ALPResponsiveTable));
    tableDefinitionResponsive.properties['columns']['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.LineItems}`;
    tableDefinitionResponsive.properties['toolBar']['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.ToolBarLR}`;
    appSchema.definitions['ALPResponsiveTable<LineItems>'] = tableDefinitionResponsive;
    appSchema.properties[ux_specification_types_1.PropertyName.table]['anyOf'][1]['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}ALPGridTable<LineItems>`;
    try {
        const tableDefinitionGrid = JSON.parse(JSON.stringify(appSchema['definitions']['ALPGridTable']));
        tableDefinitionGrid.properties.columns['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.LineItems}`;
        tableDefinitionGrid.properties.toolBar['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.ToolBarLR}`;
        appSchema.definitions['ALPGridTable<LineItems>'] = tableDefinitionGrid;
    }
    catch {
        throw new Error(i18next_1.default.t('INCONSISTENTSCHEMA', {
            function: 'generateAnalyticalListReportSchemaV2',
            definition: 'ALPGridTable'
        }));
    }
    appSchema.properties[ux_specification_types_1.PropertyName.table]['anyOf'][2]['$ref'] =
        `${common_1.DEFINITION_LINK_PREFIX}ALPAnalyticalTable<LineItems>`;
    const tableDefinitionAnalytical = JSON.parse(JSON.stringify(appSchema.definitions['ALPAnalyticalTable']));
    tableDefinitionAnalytical.properties.columns['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.LineItems}`;
    tableDefinitionAnalytical.properties.toolBar['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.ToolBarLR}`;
    appSchema.definitions['ALPAnalyticalTable<LineItems>'] = tableDefinitionAnalytical;
    // Remove Custom Column non existing extensions - TreeTableColumnsExtension does not exist in ALP
    (0, utils_1.removeElementsFromEnum)(appSchema.definitions.TableColumnExtensionTypeV2['enum'], [
        ux_specification_types_1.v2.TableColumnExtensionTypeV2.TreeTableColumnsExtension
    ]);
    const pageKeys = [];
    const v2Page = (0, import_1.findAnalyticalListPage)(generateParameters.manifest[ux_specification_types_1.ManifestSection.generic].pages, pageKeys, generateParameters.logger);
    // Inject special logic for property useExportToExcel into schema section for all table types.
    const exportTablePropertiesAdapter = (0, utils_1.getExportTablesPropertiesAdapter)(generateParameters.flex ?? []);
    types_1.ALPTABLETYPES.forEach((tableType) => {
        const tableDefinition = appSchema.definitions[tableType];
        exportTablePropertiesAdapter(tableDefinition);
    });
    const { entityType, uIAnnotations } = (0, utils_1.getUIAnnotationForEntitySet)(generateParameters); // would log an error in case these entities are missing
    if (uIAnnotations) {
        // then entityType is there as well
        // handle header actions
        (0, utils_1.addStandardHeaderActions)(appSchema);
        const { lineItemAnnotation, chartAnnotation } = getLineItemAndChartAnnotation(v2Page, uIAnnotations, generateParameters.logger);
        //handle line items
        if (lineItemAnnotation) {
            types_1.ALPTABLETYPES.forEach((tableType) => {
                appSchema.definitions[tableType][ux_specification_types_1.SchemaTag.annotationPath] = (0, common_1.createAnnotationPath)(entityType.fullyQualifiedName, lineItemAnnotation.term, lineItemAnnotation.qualifier);
            });
        }
        (0, utils_1.addLineItemsType)(false, appSchema, lineItemAnnotation, entityType);
        // handle chart item
        if (chartAnnotation) {
            addChart(appSchema, chartAnnotation);
        }
        //handle filter fields
        const selectionFieldAnnotation = uIAnnotations.SelectionFields;
        (0, utils_1.addSelectionFields)(appSchema, selectionFieldAnnotation, entityType);
        //add fields for createWithParameterDialog
        (0, common_1.addFieldsType)(appSchema, entityType);
        if (!v2Page) {
            (0, extensionLogger_1.log)(generateParameters.logger, {
                severity: "error" /* LogSeverity.Error */,
                message: i18next_1.default.t('NOLR'),
                location: {
                    path: ux_specification_types_1.MANIFESTPATH,
                    range: [ux_specification_types_1.ManifestSection.generic]
                }
            });
            return appSchema;
        }
        (0, utils_1.addTableColumnExtensions)(appSchema, entityType, v2Page, generateParameters.manifest, generateParameters.fragments);
        (0, listReport_1.addEnumForVariantPaths)(entityType, generateParameters.entitySet, appSchema, generateParameters.serviceAVT);
        // Delete generic definitions that have been replaced
        delete appSchema.definitions.ALPGridTable;
        delete appSchema.definitions.ALPResponsiveTable;
        delete appSchema.definitions.ALPAnalyticalTable;
        delete appSchema.definitions.GenericColumns;
        delete appSchema.definitions.TableColumnAction;
        delete appSchema.definitions.ToolBar;
        delete appSchema.definitions.GenericFooter;
        delete appSchema.definitions.Actions;
        delete appSchema.definitions.FieldPath;
    }
    // Add manifest path to static nodes in schema
    addManifestPathsToStaticNodes(appSchema, {
        manifest: generateParameters.manifest,
        pageName: pageKeys
    });
    (0, common_1.updatePropertyIndices)(appSchema, ROOT_PROPERTIES_ORDER);
    return appSchema;
}
//# sourceMappingURL=analyticalListReport.js.map