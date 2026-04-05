"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEnumForVariantPaths = addEnumForVariantPaths;
exports.generateListReportSchemaV2 = generateListReportSchemaV2;
const utils_1 = require("./utils");
const import_1 = require("../import");
const common_1 = require("../../common");
const i18next_1 = __importDefault(require("i18next"));
const ux_specification_types_1 = require("@sap/ux-specification-types");
const extensionLogger_1 = require("../../../extensionLogger");
const types_1 = require("../types");
const utils_2 = require("../utils");
const factory_1 = require("../export/factory");
const ROOT_PROPERTIES_ORDER = ['filterBar', 'table', 'footer'];
/**
 * Adds the enum types for QuickVariant and QuickVariantX, based on the entity type annotations.
 *
 * @param {EntityType} entityType - The entity type containing annotations to be processed
 * @param {EntitySet} entitySet - current entity set of the page or view
 * @param {Definition} appSchema - app specific JSON schema
 * @param {ConvertedMetadata} oDataServiceAVT - combined service metadata, as returned by annotation vocabularies tools
 */
function addEnumForVariantPaths(entityType, entitySet, appSchema, oDataServiceAVT) {
    (0, common_1.addEnumForSingleTabVariant)(entityType, appSchema, 'QuickVariant');
    (0, common_1.addEnumForMultiTabVariant)(appSchema, 'QuickVariantX', entitySet);
    (0, common_1.addEnumForVariantEntitySet)(oDataServiceAVT, appSchema, 'QuickVariantX');
}
/**
 * Adds an enum filled with existing UI annotations for annotationPath property in FilterBar.
 *
 * @param entityType - The entity type containing annotations to be processed
 * @param appSchema - app specific JSOn schema
 * @param definitionName - name of the definition in the app schema
 */
function addEnumForFilterBarAnnotationPath(entityType, appSchema, definitionName) {
    const annoPath = appSchema.definitions[definitionName].properties.annotationPath;
    const validAnnotations = [
        "com.sap.vocabularies.UI.v1.SelectionPresentationVariant" /* UIAnnotationTerms.SelectionPresentationVariant */,
        "com.sap.vocabularies.UI.v1.SelectionVariant" /* UIAnnotationTerms.SelectionVariant */,
        "com.sap.vocabularies.UI.v1.PresentationVariant" /* UIAnnotationTerms.PresentationVariant */
    ];
    (0, common_1.addEnumForValidAnnotations)(entityType, validAnnotations, annoPath);
}
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param appSchema - Full schema.
 * @param definitionName - The name of the definition/class whose properties are being processed.
 * @param definition - The definition object containing property schemas.
 * @param pathParams - Additional context required to compute manifest paths.
 */
function addManifestPathsToPropertiesLR(appSchema, definitionName, definition, pathParams) {
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
    }, factory_1.pageTypes.ListReport);
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
    addManifestPathsToPropertiesLR(appSchema, 'ListReport', appSchema, pathParams);
    // Add manifestPath to table
    addManifestPathsToPropertiesLR(appSchema, undefined, appSchema.properties.table, pathParams);
    // Add manifestPath to filterBar
    addManifestPathsToPropertiesLR(appSchema, undefined, appSchema.properties.filterBar, pathParams);
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
    const appSchema = JSON.parse(JSON.stringify(genericSchema));
    const lrLineItems = {
        $ref: common_1.DEFINITION_LINK_PREFIX + ux_specification_types_1.DefinitionName.LineItems
    };
    const lrToolBar = common_1.DEFINITION_LINK_PREFIX + ux_specification_types_1.DefinitionName.ToolBarLR;
    const exportTablePropertiesAdapter = (0, utils_1.getExportTablesPropertiesAdapter)(generateParameters.flex ?? []);
    types_1.LINEITEMTABLETYPES.forEach((tableType, i) => {
        appSchema.properties.table['anyOf'][i.toString()]['$ref'] = common_1.DEFINITION_LINK_PREFIX + tableType;
        const tableTypeRaw = tableType.replace('<LineItems>', '');
        const localGenericSchema = JSON.parse(JSON.stringify(genericSchema.definitions[tableTypeRaw]));
        localGenericSchema.properties.columns = lrLineItems;
        localGenericSchema.properties.toolBar['$ref'] = lrToolBar;
        exportTablePropertiesAdapter(localGenericSchema);
        appSchema.definitions[tableType] = localGenericSchema;
    });
    const { entityType, uIAnnotations } = (0, utils_1.getUIAnnotationForEntitySet)(generateParameters); // would log an error in case these entities are missing
    if (uIAnnotations) {
        // then entityType is there as well
        // retrieve page definition of root page from manifest
        const pageKeys = [];
        const v2Page = (0, import_1.findListReportPageV2)(generateParameters.manifest[ux_specification_types_1.ManifestSection.generic].pages, pageKeys);
        // handle standard header actions
        (0, utils_1.addStandardHeaderActions)(appSchema);
        //handle line items
        const lineItemAnnotation = (0, utils_1.getLineItemAnnotation)(uIAnnotations, v2Page?.component?.settings, generateParameters.logger);
        if (lineItemAnnotation) {
            const annotationPath = (0, common_1.createAnnotationPath)(entityType.fullyQualifiedName, lineItemAnnotation.term, lineItemAnnotation.qualifier);
            types_1.LINEITEMTABLETYPES.forEach((tableType) => {
                const tableDefinition = appSchema.definitions[tableType];
                tableDefinition[ux_specification_types_1.SchemaTag.annotationPath] = annotationPath;
            });
        }
        (0, utils_1.addLineItemsType)(false, appSchema, lineItemAnnotation, entityType);
        //handle filter fields
        const selectionFieldAnnotation = uIAnnotations.SelectionFields;
        (0, utils_1.addSelectionFields)(appSchema, selectionFieldAnnotation, entityType);
        //add fields for createWithParameterDialog
        (0, common_1.addFieldsType)(appSchema, entityType);
        // add columns to a enum, in this case MultiEdit -> ignoredFields
        appSchema.definitions.MultiEdit.properties.ignoredFields['items']['enum'] = [];
        (0, utils_1.addEntityPropertiesToEnum)(appSchema.definitions.MultiEdit.properties.ignoredFields['items']['enum'], entityType);
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
        addEnumForVariantPaths(entityType, generateParameters.entitySet, appSchema, generateParameters.serviceAVT);
        addEnumForFilterBarAnnotationPath(entityType, appSchema, ux_specification_types_1.DefinitionName.ListReportFilterBar);
        (0, common_1.addEnumFieldGroupAnnotationPath)(entityType, appSchema, ux_specification_types_1.DefinitionName.MultiEditV2);
        // Add manifest path to static nodes in schema
        addManifestPathsToStaticNodes(appSchema, {
            manifest: generateParameters.manifest,
            pageName: pageKeys
        });
        //Delete generic definitions
        delete appSchema.definitions.ResponsiveTableWithMultiSelect;
        delete appSchema.definitions.ResponsiveTableWithInlineDelete;
        delete appSchema.definitions.TreeTable;
        delete appSchema.definitions.AnalyticalTable;
        delete appSchema.definitions.GridTable;
        delete appSchema.definitions.GenericColumns;
        delete appSchema.definitions.TableColumnAction;
        delete appSchema.definitions.ToolBar;
        delete appSchema.definitions.Actions;
        delete appSchema.definitions.GenericFooter;
        delete appSchema.definitions.FieldPath;
        delete appSchema.definitions.Share;
    }
    (0, common_1.updatePropertyIndices)(appSchema, ROOT_PROPERTIES_ORDER);
    return appSchema;
}
//# sourceMappingURL=listReport.js.map