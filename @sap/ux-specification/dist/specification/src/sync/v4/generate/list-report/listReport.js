"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TABLE_TYPE = void 0;
exports.addSelectionFields = addSelectionFields;
exports.getVisualFilters = getVisualFilters;
exports.addVisualFilters = addVisualFilters;
exports.applyCustomFilterFields = applyCustomFilterFields;
exports.analyzeViewAnnotation = analyzeViewAnnotation;
exports.addALPViews = addALPViews;
exports.applyLRSchemaAdjustments = applyLRSchemaAdjustments;
exports.addTagsToView = addTagsToView;
exports.addLRViewParts = addLRViewParts;
exports.addHeaderActions = addHeaderActions;
exports.addManifestPathsToPropertiesLR = addManifestPathsToPropertiesLR;
exports.generateListReportSchemaV4 = generateListReportSchemaV4;
const utils_1 = require("../../utils");
const utils_2 = require("../../utils");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const i18next_1 = __importDefault(require("i18next"));
const extensionLogger_1 = require("../../../../extensionLogger");
const common_1 = require("../../../common");
const actions_1 = require("../actions");
const sync_rules_1 = require("../../sync-rules");
const ListReportUtils_1 = require("./ListReportUtils");
const controls_1 = require("../../export/controls");
/**
 * Default table type when not specified in manifest.
 */
exports.DEFAULT_TABLE_TYPE = ux_specification_types_1.v4.TableTypeV4.ResponsiveTable;
const ROOT_PROPERTIES_ORDER = ['header', 'filterBar', 'chart', 'table'];
const UILINEITEM = '@UI.LineItem';
/**
 * Adds the selection fields to the app schema, as properties of the FilterBar.
 *
 * @param {EntityType} entityType - the entity type as part of the AVT ConvertedMetadata
 * @param {Definition} appSchema - the app specific schema that shall get enhanced
 * @param {AnnotationTerm<SelectionFields>} selectionFieldsAnnotation - the UI.SelectionField annotation
 * @param {Definition} [selectionFieldsDefinition] - Schema definitions of selection fields
 * @param {string} [qualifier] - Qualifier for SelectionFields
 * @returns {Definition} - the updated selection fields definition
 */
function addSelectionFields(entityType, appSchema, selectionFieldsAnnotation, selectionFieldsDefinition, qualifier) {
    // No @validity check needed here
    if (!selectionFieldsDefinition) {
        selectionFieldsDefinition = appSchema.definitions[ux_specification_types_1.DefinitionName.SelectionFields];
        selectionFieldsDefinition.additionalProperties = false;
        selectionFieldsDefinition.properties = {};
    }
    if (entityType) {
        selectionFieldsDefinition[ux_specification_types_1.SchemaTag.annotationPath] = (0, common_1.createAnnotationPath)(entityType.fullyQualifiedName, "com.sap.vocabularies.UI.v1.SelectionFields" /* UIAnnotationTerms.SelectionFields */, qualifier);
    }
    if (selectionFieldsAnnotation) {
        let i = 0;
        selectionFieldsAnnotation?.forEach((selectionField) => {
            const value = selectionField.value ?? `UnknownField${i}`;
            let description = selectionField.value;
            const fieldDefinition = 'SelectionField::' + (0, common_1.prepareRef)(value);
            if (selectionField.type === 'PropertyPath') {
                description = (0, common_1.getLabelForPropertyPath)(selectionField, entityType);
            }
            selectionFieldsDefinition.properties[fieldDefinition] = {
                $ref: common_1.DEFINITION_LINK_PREFIX + fieldDefinition
            };
            selectionFieldsDefinition.properties[fieldDefinition][ux_specification_types_1.SchemaTag.propertyIndex] = i;
            const dataType = (0, common_1.determineDataType)(selectionField);
            appSchema.definitions[fieldDefinition] = {
                type: 'object',
                properties: {},
                description,
                additionalProperties: false,
                ...(dataType && { dataType })
            };
            if (selectionField.value === undefined) {
                // Add message about unresolvable value for selection field
                (0, common_1.addMessageToSchema)(appSchema.definitions[fieldDefinition], {
                    text: i18next_1.default.t('UNRESOLVABLE_VALUE_OF_SELECTION_FIELD')
                });
            }
            appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.isViewNode] = true;
            appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.value, value: `${value}` }];
            if (selectionField.$target?.fullyQualifiedName.indexOf('@') > -1) {
                appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.target] = selectionField.$target.fullyQualifiedName
                    .split('@')[0]
                    .split('/')[0];
            }
            else if (selectionField.$target?.fullyQualifiedName) {
                appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.target] =
                    selectionField.$target.fullyQualifiedName.split('/')[0];
            }
            appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.annotationType] = selectionField?.type;
            appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.annotationPath] = `${selectionFieldsDefinition[ux_specification_types_1.SchemaTag.annotationPath]}/${i}`;
            i++;
        });
    }
    return selectionFieldsDefinition;
}
/**
 * Returns visual filters (if defined) from manifest page.
 *
 * @param v4Page - actual page in the manifest
 * @returns - The visual filters object if defined, otherwise undefined.
 */
function getVisualFilters(v4Page) {
    const selectionFields = v4Page.options.settings?.controlConfiguration?.[`@${"com.sap.vocabularies.UI.v1.SelectionFields" /* UIAnnotationTerms.SelectionFields */}`]?.['filterFields'];
    if (selectionFields) {
        const visualFilters = {};
        Object.keys(selectionFields).forEach((field) => {
            if (!selectionFields[field].template) {
                visualFilters[field] = selectionFields[field];
            }
        });
        return Object.keys(visualFilters).length > 0 ? visualFilters : undefined;
    }
}
/**
 * Collects indexes of selection fields and entityProperties to sort visual filters.
 *
 * @param selectionFields - The selection fields annotation to be processed
 * @param entityType - the entity type as part of the AVT ConvertedMetadata
 * @returns - An array of property names sorted by their index.
 */
function getPropertiesIndex(selectionFields, entityType) {
    const properties = [];
    selectionFields?.forEach((selectionField) => properties.push(selectionField.value));
    if (entityType) {
        entityType.entityProperties.forEach((property) => !properties.includes(property.name) ? properties.push(property.name) : undefined);
    }
    return properties;
}
/**
 * Adds visual filters to the app schema, as properties of the FilterBar.
 *
 * @param {EntityType} entityType - the entity type as part of the AVT ConvertedMetadata
 * @param {Definition} appSchema - the app specific schema that shall get enhanced
 * @param visualFiltersManifest - the UI.SelectionFields under controlConfiguration
 * @param selectionFields - The selection fields annotation to be processed
 */
function addVisualFilters(entityType, appSchema, visualFiltersManifest, selectionFields) {
    // No @validity check needed here
    const propertiesIndex = getPropertiesIndex(selectionFields, entityType);
    const visualFilters = appSchema.definitions[ux_specification_types_1.DefinitionName.VisualFilters];
    visualFilters.properties = {};
    for (const fieldName in visualFiltersManifest) {
        const filterField = visualFiltersManifest[fieldName];
        // No custom filter field support in visual filters
        if (!filterField.template) {
            const visualFiltersField = (visualFilters.properties[fieldName] = {
                $ref: (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.VisualFilter, fieldName)
            });
            const propertyIndex = propertiesIndex.indexOf(fieldName);
            if (propertyIndex !== -1) {
                visualFiltersField[ux_specification_types_1.SchemaTag.propertyIndex] = propertyIndex;
            }
            const filterDefinition = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.VisualFilter, fieldName, appSchema);
            if (filterField.visualFilter?.valueList) {
                filterDefinition[ux_specification_types_1.SchemaTag.annotationPath] = `${fieldName}/@${filterField.visualFilter.valueList}`;
            }
            const annotationLabel = entityType?.entityProperties
                ?.find((property) => property.name === fieldName)
                ?.annotations?.Common?.Label?.toString();
            filterDefinition.description = annotationLabel || fieldName;
            filterDefinition[ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.value, value: fieldName }];
        }
    }
}
/**
 * Method updates schema for custom filter fields:
 * 1. Enables creation of custom filter fields.
 * 2. Populates custom filter fields from manifest to schema.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param selectionFieldsDefinition - schema of selection fields which should contain custom filter fields
 * @param v4Page - actual page in the manifest
 */
function applyCustomFilterFields(appSchema, selectionFieldsDefinition, v4Page) {
    selectionFieldsDefinition.additionalProperties = {
        $ref: `#/definitions/${ux_specification_types_1.DefinitionName.CustomFilterField}`
    };
    (0, utils_2.addCustomFilterFieldDefinition)(appSchema, selectionFieldsDefinition, v4Page);
    const customSectionDefinition = appSchema.definitions[ux_specification_types_1.DefinitionName.CustomFilterFieldPosition];
    // Instantiate for @validity check
    new controls_1.CustomFilterFieldPosition().init();
    if (typeof customSectionDefinition === 'object') {
        (0, common_1.addDescriptiveEnumDefinition)(appSchema, selectionFieldsDefinition, {
            schema: customSectionDefinition,
            property: 'anchor'
        }, {
            resolveDefinition: true,
            keyProperties: [ux_specification_types_1.SchemaKeyName.value, ux_specification_types_1.SchemaKeyName.key],
            descriptionAsFallback: true
        });
    }
}
/**
 *
 * @param appSchema - The app JSON schema to be updated
 * @param schemaIdForActions - The schema ID for the actions to be defined
 * @param annotations - The UI annotations for the given entity type
 * @param targetAnnotation - The target annotation for the actions
 * @param entityType - The entity type as part of the AVT ConvertedMetadata
 */
function defineActions(appSchema, schemaIdForActions, annotations, targetAnnotation, entityType) {
    appSchema.definitions[schemaIdForActions] = JSON.parse(JSON.stringify(appSchema.definitions['Actions']));
    const actions = appSchema.definitions[schemaIdForActions];
    actions.properties = {};
    actions.additionalProperties = false;
    const chartAnnotation = annotations[targetAnnotation?.split(`${ux_specification_types_1.UIVOCABULARY}.`)[1]];
    if (chartAnnotation && chartAnnotation.Actions) {
        let i = 0;
        chartAnnotation.Actions.forEach((actionRecord) => {
            const actionDefinition = (0, common_1.prepareRef)(`${ux_specification_types_1.DefinitionName.ChartToolBarAction}<${actionRecord.Action}>`);
            const description = (0, common_1.getDataFieldDescription)(actionRecord, entityType);
            const prefix = actionRecord.$Type.split(`${ux_specification_types_1.UIVOCABULARY}.`)[1];
            const action = (actions.properties[`${prefix}::${actionRecord.Action}`] = {
                $ref: common_1.DEFINITION_LINK_PREFIX + actionDefinition,
                description
            });
            //Add tags
            action[ux_specification_types_1.SchemaTag.propertyIndex] = i;
            action[ux_specification_types_1.SchemaTag.annotationType] = actionRecord.$Type;
            action[ux_specification_types_1.SchemaTag.annotationPath] = `/${actionRecord.fullyQualifiedName}`;
            //as ChartToolBarAction is an empty object, copy ViewToolBarAction and remove properties
            appSchema.definitions[actionDefinition] = JSON.parse(JSON.stringify(appSchema.definitions[ux_specification_types_1.DefinitionName.ViewToolBarAction]));
            // Instantiate for @validity check
            new controls_1.ViewToolBarAction().init();
            appSchema.definitions[actionDefinition].properties = {};
            appSchema.definitions[actionDefinition][ux_specification_types_1.SchemaTag.annotationPath] = actionRecord.fullyQualifiedName;
            i++;
        });
    }
}
/**
 * Finds the right visualization for a given view.
 *
 * @param allVisualizations - list of visualizations for the given (S)PV
 * @param namespace - namespace for the UI annotations
 * @param viewKey - view key: primary, secondary, or anything else; may also be undefined. The first visualization is taken in this case.
 * @param visualizationType - allows to find the right visualization if there are many.
 * @returns the value of the first fitting visualization
 */
function findTheRightVisualization(allVisualizations, namespace, viewKey, visualizationType) {
    let visualization, visualizationObject, targetAnnotation;
    if (allVisualizations) {
        if (viewKey === 'primary') {
            visualizationObject = allVisualizations.find((vis) => {
                return vis['value'].indexOf('Chart') > -1;
            });
        }
        else if (viewKey === 'secondary') {
            visualizationObject = allVisualizations.find((vis) => {
                return vis['value'].indexOf(ux_specification_types_1.FacetBase.LineItem) > -1;
            });
        }
        else {
            if (visualizationType) {
                visualizationObject = allVisualizations.find((v) => v['value'].indexOf(visualizationType) > -1);
            }
            else {
                visualizationObject = allVisualizations[0];
            }
        }
        visualization =
            typeof visualizationObject?.['value'] === 'string'
                ? (0, common_1.replaceNamespaces)(visualizationObject['value'])
                : undefined;
        if (visualizationObject?.['$target']?.fullyQualifiedName) {
            targetAnnotation = `/${namespace}/${visualizationObject['$target'].fullyQualifiedName.split(namespace)[1]}`;
        }
        else if (visualization) {
            targetAnnotation = `/${namespace}/` + visualization.replace(`UI`, ux_specification_types_1.UIVOCABULARY);
        }
    }
    return { visualization, targetAnnotation };
}
/**
 * An annotationPath must be analyzed, to find the right target annotation and visualization.
 *
 * @param namespace - The namespace for the UI annotations.
 * @param annotationPath - The path of the annotation to be analyzed.
 * @param annotationAVT - The annotation object from the AVT (Annotation Vocabulary Tools).
 * @param viewKey - The key to distinguish between different view types.
 * @returns An object containing the visualization, target annotation, and chart title.
 */
function analyzeChartAnnotation(namespace, annotationPath, annotationAVT, viewKey) {
    const visualization = '@UI.Chart';
    const targetAnnotationFullName = `/${namespace}/@${annotationPath}`;
    let chartTitle;
    if (annotationAVT['Title']) {
        chartTitle = annotationAVT['Title'];
    }
    else {
        chartTitle = `Chart View (${viewKey})`;
    }
    return { visualization, targetAnnotation: targetAnnotationFullName, chartTitle };
}
/**
 * Analyzes a SelectionPresentationVariant, to find the right target annotation and visualization.
 *
 * @param uiAnnotations - The UI annotations of the given entity type.
 * @param namespace - The namespace for the UI annotations.
 * @param viewKey - The key to distinguish between different view types.
 * @param visualizationType - The type of visualization to find the right one if there are multiple.
 * @param logger - The logger instance for logging messages.
 * @param title - The title to be displayed for the view.
 * @returns An object containing the visualization, target annotation, namespace, and title.
 */
function analyzeSPVforView(uiAnnotations, namespace, viewKey, visualizationType, logger, title) {
    let { visualization, targetAnnotation } = findTheRightVisualization(uiAnnotations.PresentationVariant?.Visualizations, namespace, viewKey, visualizationType);
    if (!visualization) {
        (0, extensionLogger_1.log)(logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('NOVISUALIZATIONS')
        });
        visualization = UILINEITEM; // default visualization
        targetAnnotation = `/${namespace}/` + visualization.replace(`UI`, ux_specification_types_1.UIVOCABULARY); // default targetAnnotation
    }
    title = title || `View (${viewKey})`;
    return { visualization, targetAnnotation, namespace, title };
}
/**
 * An annotationPath must be analyzed, to find the right target annotation and visualization.
 *
 * @param annotationPath - given annotationPath
 * @param uIAnnotations - annotations of UI namespace of the given entityType
 * @param serviceAVT Combined service metadata, as returned by annotation vocabularies tools.
 * @param viewKey - allows to distinguish the different view types (LR or ALP)
 * @param visualizationType - allows to find the right visualization if there are many.
 * @param logger - extension logger.
 * @returns visualization: string describing the visualization of the annotation,
 *          targetAnnotation: the target annotation behind the visualization
 *          namespace: namespace of the annotation,
 *          title: title to be shown, derived from the annotation
 */
function analyzeViewAnnotation(annotationPath, uIAnnotations, serviceAVT, viewKey, visualizationType, logger) {
    let namespace = undefined, title;
    const annotationInManifest = annotationPath?.split(`${ux_specification_types_1.UIVOCABULARY}.`)[1];
    const annotationAVT = annotationInManifest && uIAnnotations[annotationInManifest];
    if (!annotationAVT) {
        return { visualization: undefined, targetAnnotation: undefined, namespace, title: `View (${viewKey})` };
    }
    title = annotationAVT.Text;
    namespace = annotationAVT.fullyQualifiedName.split(ux_specification_types_1.UIVOCABULARYALPHADOT)[0];
    if (annotationInManifest.startsWith('PresentationVariant')) {
        const { visualization, targetAnnotation } = findTheRightVisualization(annotationAVT.Visualizations, namespace, viewKey, visualizationType);
        title = title || `View (${viewKey})`;
        return { visualization, targetAnnotation, namespace, title };
    }
    else if (annotationInManifest.startsWith('SelectionPresentationVariant')) {
        return analyzeSPVforView(annotationAVT, namespace, viewKey, visualizationType, logger, title);
    }
    else if (annotationInManifest.startsWith('SelectionVariant')) {
        const visualization = UILINEITEM;
        const targetAnnotation = `/${namespace}/@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
        title = title || `Table View (${viewKey})`;
        return { visualization, targetAnnotation, namespace, title };
    }
    else if (annotationInManifest.startsWith('LineItem')) {
        let visualization = UILINEITEM;
        if (annotationAVT.qualifier) {
            visualization += `#${annotationAVT.qualifier}`;
        }
        const targetAnnotation = annotationPath.substring(0, 1) === '@'
            ? `/${namespace}/${annotationPath}`
            : `/${namespace}/@${annotationPath}`;
        title = title || `Table View (${viewKey})`;
        return { visualization, targetAnnotation, namespace, title };
    }
    else if (annotationInManifest.startsWith('Chart')) {
        const { visualization, targetAnnotation, chartTitle } = analyzeChartAnnotation(namespace, annotationPath, annotationAVT, viewKey);
        return { visualization, targetAnnotation, namespace, title: chartTitle };
    }
    return { visualization: undefined, targetAnnotation: undefined, namespace, title: `View (${viewKey})` };
}
/**
 * Adds the ALP chart view to the app-specific schema.
 *
 * @param {Definition} appSchema - app-specific JSON schema
 * @param chartAnnotationPath - The annotation path for the chart view
 * @param targetAnnotation - target annotation of the chart view, as determined by analyzeViewAnnotation
 * @param annotations - UI annotations, as determined by AVT
 */
function addALPChartView(appSchema, chartAnnotationPath, targetAnnotation, annotations) {
    const chartView = appSchema.definitions[ux_specification_types_1.DefinitionName.ALPChartView];
    appSchema.definitions[ux_specification_types_1.DefinitionName.ALPChart] = JSON.parse(JSON.stringify(chartView));
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ALPChart][ux_specification_types_1.SchemaTag.isViewNode];
    if (targetAnnotation) {
        appSchema.definitions[ux_specification_types_1.DefinitionName.ALPChart][ux_specification_types_1.SchemaTag.annotationPath] = targetAnnotation;
    }
    appSchema.definitions[ux_specification_types_1.DefinitionName.ALPChart].properties.annotationPath[ux_specification_types_1.SchemaTag.hidden] = true;
    chartView.properties.annotationPath[ux_specification_types_1.SchemaTag.hidden] = true;
    chartView.additionalProperties = false;
    chartView.description = `Chart (key: primary)`;
    chartView.title = `Chart`;
    chartView.$ref = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.ALPChart}`;
    if (chartAnnotationPath) {
        const viewAnnotation = chartAnnotationPath.split(ux_specification_types_1.UIVOCABULARYDOT)[1];
        if (annotations[viewAnnotation]) {
            const pathParts = annotations[viewAnnotation].fullyQualifiedName.split('@');
            chartView[ux_specification_types_1.SchemaTag.annotationPath] = `/${pathParts[0]}/@${pathParts[1]}`;
        }
        else {
            // Add message about unexisting annotation path
            (0, common_1.addMessageToSchema)(chartView, { text: i18next_1.default.t('UNEXISTING_ANNOTATION_PATH') });
        }
    }
    chartView[ux_specification_types_1.SchemaTag.artifactType] = ux_specification_types_1.ArtifactType.Manifest;
    chartView[ux_specification_types_1.SchemaTag.key] = 'primary';
    chartView[ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.key, value: 'primary' }];
    // Instantiate for @validity check
    new controls_1.ALPChart().init();
}
/**
 * Adds the ALP views to the app-specific schema.
 *
 * @param appSchema - app-specific JSON schema
 * @param viewsPaths - views' paths' section in the manifest
 * @param generateParameters - list of API input parameters
 * @param templateAnnotation - defaultTemplateAnnotationPath as registered in manifest
 * @param v4Page - actual page in the manifest
 * @param tableDefinitionName - The name of the table definition in the schema
 */
function addALPViews(appSchema, viewsPaths, generateParameters, templateAnnotation, v4Page, tableDefinitionName) {
    const annotations = generateParameters.entityType?.annotations.UI;
    //1. Chart View
    const chartAnnotationPath = viewsPaths?.[0]?.['primary']?.[0]?.[ux_specification_types_1.SchemaTag.annotationPath];
    const { targetAnnotation } = analyzeViewAnnotation(chartAnnotationPath, annotations, generateParameters.serviceAVT, 'primary', undefined, generateParameters.logger);
    addALPChartView(appSchema, chartAnnotationPath, targetAnnotation, annotations);
    // Copy toolbar
    const schemaIdForActions = `Actions<ALPChart>`;
    appSchema.definitions[ux_specification_types_1.DefinitionName.ViewChartToolBar].properties.actions['$ref'] =
        common_1.DEFINITION_LINK_PREFIX + schemaIdForActions;
    defineActions(appSchema, schemaIdForActions, annotations, targetAnnotation, generateParameters.entityType);
    //2. Table View
    const { visualization: tableVisualization, targetAnnotation: target } = analyzeViewAnnotation(viewsPaths?.[0]?.['secondary']?.[0]?.[ux_specification_types_1.SchemaTag.annotationPath], annotations, generateParameters.serviceAVT, 'secondary', undefined, generateParameters.logger);
    const tableDefinition = appSchema.definitions[tableDefinitionName];
    if (tableVisualization || templateAnnotation) {
        tableDefinition.properties.toolBar['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.ToolBarLR}`;
        // Switch from generic column to specific definition
        tableDefinition.properties['columns'] = {
            $ref: common_1.DEFINITION_LINK_PREFIX + ux_specification_types_1.DefinitionName.LineItems
        };
        tableDefinition.properties.annotationPath[ux_specification_types_1.SchemaTag.hidden] = true;
    }
    else {
        tableDefinition.properties = {};
    }
    const tableView = appSchema.definitions[ux_specification_types_1.DefinitionName.ALPTableView];
    appSchema.definitions[ux_specification_types_1.DefinitionName.ALPTable] = JSON.parse(JSON.stringify(tableView));
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ALPTable][ux_specification_types_1.SchemaTag.isViewNode];
    tableView.additionalProperties = false;
    tableView.description = `Table (key: secondary)`;
    tableView.title = `Table`;
    if (tableVisualization) {
        delete tableView.properties;
        tableView.$ref = `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.ALPTable}`;
    }
    else if (!templateAnnotation) {
        tableView.properties = {};
    }
    tableView[ux_specification_types_1.SchemaTag.artifactType] = ux_specification_types_1.ArtifactType.Manifest;
    let annotationTerm, viewAnnotation;
    if (tableVisualization && tableVisualization.indexOf(ux_specification_types_1.FacetBase.LineItem) > -1) {
        annotationTerm = tableVisualization.split('.')[1];
        viewAnnotation = viewsPaths[0]['secondary'][0].annotationPath.split(ux_specification_types_1.UIVOCABULARYDOT)[1];
    }
    else if (templateAnnotation) {
        annotationTerm = viewAnnotation = templateAnnotation.split(ux_specification_types_1.UIVOCABULARYDOT)[1];
    }
    if (annotationTerm) {
        const dataForLineItem = {
            isObjectPage: false,
            appSchema,
            lineItemAnnotation: generateParameters.entityType?.annotations.UI[annotationTerm],
            entityType: generateParameters.entityType,
            oDataServiceAVT: generateParameters.serviceAVT,
            lineItemId: ux_specification_types_1.DefinitionName.LineItems
        };
        (0, utils_2.addLineItemsTypeToSchema)(dataForLineItem, ux_specification_types_1.DefinitionName.ViewTableColumn);
        if (target) {
            appSchema.definitions[ux_specification_types_1.DefinitionName.ALPTable][ux_specification_types_1.SchemaTag.annotationPath] = target;
        }
        const schemaAdjustmentParameters = {
            logger: generateParameters.logger,
            appSchema,
            v4Page,
            tableDefinitionKey: ux_specification_types_1.DefinitionName.ALPTable,
            facetDefinitionKey: ux_specification_types_1.DefinitionName.LineItems,
            dataForLineItem,
            customActionDefinitionName: ux_specification_types_1.DefinitionName.CustomTableAction,
            sectionActionsDefinitionKey: `${ux_specification_types_1.DefinitionName.Actions}<${(0, common_1.prepareRef)(ux_specification_types_1.DefinitionName.LineItems)}>`
        };
        applyLRSchemaAdjustments(schemaAdjustmentParameters);
        const pathParts = annotations[viewAnnotation].fullyQualifiedName.split('@');
        tableView[ux_specification_types_1.SchemaTag.annotationPath] = `/${pathParts[0]}/@${pathParts[1]}`;
        tableView[ux_specification_types_1.SchemaTag.key] = 'secondary';
        tableView[ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.key, value: 'secondary' }];
    }
    (0, utils_2.addCustomColumnDefinition)(appSchema, v4Page, generateParameters.logger);
    // Add "manifestPath" for table properties
    addManifestPathsToPropertiesLR(appSchema, ux_specification_types_1.DefinitionName.ALPTable, tableDefinition, {
        pageName: v4Page.id,
        manifest: generateParameters.manifest,
        targetAnnotation: target
    });
}
/**
 * Modifies the app schema, adds the right line chart settings.
 *
 * @param inputParameters - list of input parameters as collected by the calling instance
 * @param annotations - UI annotations of the given entityType
 * @returns the ID for the chart view in schema
 */
function addViewChartDefinitions(inputParameters, annotations) {
    const idForChart = `${ux_specification_types_1.DefinitionName.LRChartView}<${inputParameters.viewKey}>`;
    inputParameters.appSchema.definitions[idForChart] = JSON.parse(JSON.stringify(inputParameters.appSchema.definitions[ux_specification_types_1.DefinitionName.LRChartView]));
    delete inputParameters.appSchema.definitions[idForChart][ux_specification_types_1.SchemaTag.isViewNode];
    inputParameters.appSchema.definitions[idForChart][ux_specification_types_1.SchemaTag.annotationPath] = inputParameters.targetAnnotation;
    if (inputParameters.navPropName) {
        inputParameters.appSchema.definitions[idForChart]['navigationProperty'] = inputParameters.navPropName;
    }
    //Copy toolbar
    const idForToolbar = `${ux_specification_types_1.DefinitionName.ViewChartToolBar}<${inputParameters.viewKey}>`;
    inputParameters.appSchema.definitions[idForToolbar] = JSON.parse(JSON.stringify(inputParameters.appSchema.definitions[ux_specification_types_1.DefinitionName.ViewChartToolBar]));
    inputParameters.appSchema.definitions[idForChart]['properties'].toolBar.$ref =
        `${common_1.DEFINITION_LINK_PREFIX}${idForToolbar}`;
    //Copy actions
    const schemaIdForActions = `${ux_specification_types_1.DefinitionName.Actions}<${inputParameters.viewKey}>`;
    defineActions(inputParameters.appSchema, schemaIdForActions, annotations, inputParameters.targetAnnotation, inputParameters.targetEntityType);
    inputParameters.appSchema.definitions[idForToolbar]['properties'][ux_specification_types_1.PropertyName.actions]['$ref'] =
        `${common_1.DEFINITION_LINK_PREFIX}${schemaIdForActions}`;
    return idForChart;
}
/**
 * Adds the definition of a chart view to the app schema.
 *
 * @param inputParameters - list of input parameters as collected by the calling instance
 * @param UIAnnotations - AVT UI annotations of the given entity type
 * @param appSchema - app schema
 * @param viewsDefinition - the views definition in app schema (MultiTableModeV4)
 * @param viewKey - view key
 * @param title - view title
 * @param page - Represents the page in the application's structure where the view line items are to be added.
 * @param app - Represents the overall application structure, providing access to the manifest.
 */
function addViewChart(inputParameters, UIAnnotations, appSchema, viewsDefinition, viewKey, title, page, app) {
    const idForChart = addViewChartDefinitions(inputParameters, UIAnnotations);
    const chartViewDefinition = appSchema.definitions[idForChart];
    chartViewDefinition.properties.annotationPath[ux_specification_types_1.SchemaTag.hidden] = true;
    chartViewDefinition.properties.index[ux_specification_types_1.SchemaTag.hidden] = true;
    chartViewDefinition.properties.entitySet[ux_specification_types_1.SchemaTag.hidden] = true;
    const titleOnHover = `Chart View (key: ${viewKey})`;
    viewsDefinition.properties[viewKey] = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${idForChart}`,
        description: title ? title : titleOnHover,
        title: titleOnHover
    };
    // Add "manifestPath" for table properties
    addManifestPathsToPropertiesLR(inputParameters.appSchema, ux_specification_types_1.DefinitionName.LRChartView, chartViewDefinition, {
        pageName: page.target.id,
        manifest: app.manifest,
        targetAnnotation: inputParameters.targetAnnotation,
        viewConfig: {
            key: viewKey,
            entitySet: inputParameters.entitySet
        }
    }, true);
}
/**
 * Retrieves the line item reference for a specified view and entity type.
 *
 * @param {SapUiAppPageV4} v4Page - The page object containing application-specific settings and views configuration.
 * @param {EntityType} entityType - The entity type definition for which the line item reference is required.
 * @param {string} viewKey - The key identifying the desired view configuration.
 * @param {string} lineItemTerm - The term representing the line item annotation.
 * @param {string} lineItemQualifier - The qualifier representing the line item annotation.
 * @returns {string} The resolved line item reference in the form of a path or annotation term.
 */
function getLineItemRef(v4Page, entityType, viewKey, lineItemTerm, lineItemQualifier) {
    const qualifier = lineItemQualifier ? `#${lineItemQualifier}` : ``;
    const path = (v4Page?.options?.settings?.views?.paths ?? []).find((path) => path.key === viewKey);
    if (path === undefined) {
        return `@${lineItemTerm}${qualifier}`;
    }
    const { annotationPath, entitySet } = path;
    const viewAnnotationPath = (annotationPath ?? '').split(ux_specification_types_1.UIVOCABULARYDOT)[1];
    const lineItemReference = entityType?.annotations?.UI?.[viewAnnotationPath]?.PresentationVariant?.Visualizations?.[0]?.value ??
        `@${lineItemTerm}${qualifier}`;
    return entitySet ? `/${entitySet}/${lineItemReference}` : lineItemReference;
}
/**
 * Adjusts the schema for a table by making necessary changes such as populating creation fields,
 * adjusting creation field definitions, and adding enum mappings for mass edit functionalities.
 *
 * @param {SchemaAdjustmentParameters} schemaAdjustmentParameters - Object containing the parameters required for schema adjustments. Includes the generate parameters, application schema, table definition ID, and facet definition ID.
 */
function applyLRSchemaAdjustments(schemaAdjustmentParameters) {
    const { entityType, appSchema, tableDefinitionKey, facetDefinitionKey } = schemaAdjustmentParameters;
    // in the future, all postgeneration adjustments for the LR Page should be done here
    // populate the creation fields for the table with the data from the columns
    (0, utils_1.initializeCreationModeSchema)(appSchema, facetDefinitionKey, entityType, ux_specification_types_1.DefinitionName.TableCreationModeLR);
    // Apply decorator-based visibility rules for table properties
    applyTableDecorators(schemaAdjustmentParameters);
    // add columns to a enum, in this case enableMassEdit -> visibleFields and ignoredFields
    (0, utils_2.addEnumForEnableMassEdit)(appSchema, tableDefinitionKey, facetDefinitionKey, entityType);
    // add the custom action and custom action menu definition
    (0, actions_1.configureCustomActionDefinition)(schemaAdjustmentParameters);
}
/**
 * Retrieves the table settings from the manifest for a given line item reference.
 * The returned object includes both TableSettings and Table-level properties
 * like creationMode, analyticalConfiguration, and popinLayout.
 *
 * @param v4Page - The V4 page configuration from manifest
 * @param lineItemRef - The line item reference (e.g., '@UI.LineItem')
 * @returns The table settings or undefined if not found
 */
function getTableSettingsFromManifest(v4Page, lineItemRef) {
    return v4Page?.options?.settings?.controlConfiguration?.[lineItemRef ?? '']?.[ux_specification_types_1.PropertyName.tableSettings];
}
/**
 * Applies decorator-based visibility rules to table and creation mode definitions.
 * This function uses the @hide and @message decorators defined on the Table and TableCreationModeLR classes
 * to conditionally hide properties and show warning messages based on table type and settings.
 *
 * @param schemaAdjustmentParameters - Parameters containing schema, page, and table definition information
 */
function applyTableDecorators(schemaAdjustmentParameters) {
    const { appSchema, tableDefinitionKey, facetDefinitionKey, v4Page, viewKey, entityType, dataForLineItem } = schemaAdjustmentParameters;
    // Get the line item reference for looking up table settings in manifest
    const lineItemRef = getLineItemRef(v4Page, entityType, viewKey, entityType?.annotations?.UI?.LineItem?.term, dataForLineItem?.lineItemAnnotation?.qualifier);
    // Get table settings from manifest and build custom context for decorator evaluation
    const tableSettings = getTableSettingsFromManifest(v4Page, lineItemRef);
    const customContext = {
        ...tableSettings,
        type: tableSettings?.type ?? exports.DEFAULT_TABLE_TYPE
    };
    // Get the table definition to apply decorators to
    const tableDefinition = appSchema.definitions[tableDefinitionKey];
    // Get the creation mode definition
    const creationModeDefinitionKey = (0, common_1.getFacetDefinitionKey)(ux_specification_types_1.DefinitionName.TableCreationModeLR, facetDefinitionKey);
    const creationModeDefinition = appSchema.definitions[creationModeDefinitionKey] ??
        (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.TableCreationModeLR, facetDefinitionKey, appSchema);
    // Set up the $ref for creationMode property
    if (tableDefinition?.properties?.[ux_specification_types_1.PropertyName.creationMode]) {
        const creationModeProperty = tableDefinition.properties[ux_specification_types_1.PropertyName.creationMode];
        creationModeProperty.$ref = (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.TableCreationModeLR, facetDefinitionKey);
    }
    // Apply decorators to the Table definition (creationMode, analyticalConfiguration, popinLayout)
    // Create a Table instance and apply its decorators to the specific table definition
    new controls_1.Table().init(customContext, tableDefinition);
    // Apply decorators to the TableCreationModeLR definition (creationFields, createInPlace, isCreateEnabled)
    new controls_1.TableCreationModeLR().init(customContext, creationModeDefinition);
    // Apply analyticalConfiguration decorators only when the property is specified in manifest
    const hasAnalyticalConfiguration = tableSettings?.analyticalConfiguration !== undefined;
    if (!hasAnalyticalConfiguration) {
        return;
    }
    if (viewKey) {
        // Multi-view: create a view-specific definition to isolate decorator messages per view
        (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ViewAnalyticalConfiguration, viewKey, appSchema);
        const definitionKey = (0, common_1.getFacetDefinitionKey)(ux_specification_types_1.DefinitionName.ViewAnalyticalConfiguration, viewKey);
        const definition = appSchema.definitions[definitionKey];
        if (definition) {
            new controls_1.ViewAnalyticalConfiguration().init(customContext, definition);
            // Update the table's $ref to point to the view-specific definition
            const analyticalConfigProp = tableDefinition?.properties?.[ux_specification_types_1.PropertyName.analyticalConfiguration];
            if (analyticalConfigProp) {
                analyticalConfigProp.$ref = (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.ViewAnalyticalConfiguration, viewKey);
            }
        }
    }
    else {
        // Single table: use the shared definition
        const definition = appSchema.definitions[ux_specification_types_1.DefinitionName.AnalyticalConfiguration];
        if (definition) {
            new controls_1.AnalyticalConfiguration().init(customContext, definition);
        }
    }
}
/**
 * Modifies the app schema, adds the right line item settings as derived from the visualization.
 *
 * @param {ViewsParameters} inputParameters - Parameters containing details needed for the view line item addition, including the app schema, view key, and target annotation.
 * @param {Definition} viewsDefinition - The definition object to which the view line items will be added.
 * @param {string} visualization - The specific visualization type, typically used to determine the annotation term.
 * @param {string} templateAnnotation - Annotation path or type related to the template.
 * @param generateParameters - list of API input parameters
 * @param generateParameters.serviceAVT - OData service AVT information
 * @param generateParameters.entityType - entity type of the current page
 * @param {Page} page - Represents the page in the application's structure where the view line items are to be added.
 * @param app - the application object containing manifest and other app-specific information.
 * @param {ExtensionLogger} logger - Logger for recording informational or error messages during the schema adjustment process.
 */
function addViewLineItems(inputParameters, viewsDefinition, visualization, templateAnnotation, { serviceAVT, entityType }, page, app, logger) {
    const tableId = `${ux_specification_types_1.DefinitionName.LRTableView}<${inputParameters.viewKey}>`;
    const schemaIdForColumns = `${ux_specification_types_1.DefinitionName.LineItemsOfView}::${inputParameters.viewKey}`;
    const schemaIdForActions = `${ux_specification_types_1.DefinitionName.Actions}<${schemaIdForColumns}>`;
    const lrTableView = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.LRTableView, inputParameters.viewKey, inputParameters.appSchema);
    delete lrTableView[ux_specification_types_1.SchemaTag.isViewNode];
    lrTableView[ux_specification_types_1.SchemaTag.annotationPath] = inputParameters.targetAnnotation;
    if (inputParameters.navPropName) {
        lrTableView['navigationProperty'] = inputParameters.navPropName;
    }
    if (inputParameters.entitySet) {
        lrTableView['entitySet'] = inputParameters.entitySet;
    }
    //Copy toolbar
    (0, common_1.addDefinitionRef)(lrTableView.properties.toolBar, ux_specification_types_1.DefinitionName.ToolBar, schemaIdForColumns);
    const title = `Table View (key: ${inputParameters.viewKey})`;
    viewsDefinition.properties[inputParameters.viewKey] = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${tableId}`,
        description: inputParameters.title || title,
        title
    };
    (0, common_1.addDefinitionRef)(lrTableView.properties.columns, schemaIdForColumns);
    lrTableView.properties.annotationPath[ux_specification_types_1.SchemaTag.hidden] = true;
    lrTableView.properties.index[ux_specification_types_1.SchemaTag.hidden] = true;
    lrTableView.properties.entitySet[ux_specification_types_1.SchemaTag.hidden] = true;
    const annotationTerm = visualization?.split('.')[1] || templateAnnotation.split(ux_specification_types_1.UIVOCABULARYDOT)[1];
    const dataForLineItem = {
        isObjectPage: false,
        appSchema: inputParameters.appSchema,
        lineItemAnnotation: inputParameters.targetEntityType?.annotations.UI[annotationTerm],
        entityType: inputParameters.targetEntityType,
        oDataServiceAVT: serviceAVT,
        lineItemId: schemaIdForColumns
    };
    (0, utils_2.addLineItemsTypeToSchema)(dataForLineItem, ux_specification_types_1.DefinitionName.ViewTableColumn, ux_specification_types_1.DefinitionName.ViewCustomColumn, ux_specification_types_1.DefinitionName.ViewCustomAction);
    // Table toolbar actions with custom actions
    const sectionIdPrefix = inputParameters.entitySet ? `/${inputParameters.entitySet}/` : '';
    const sectionIdInManifest = `${sectionIdPrefix}@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}${visualization.split(ux_specification_types_1.Visualization.LineItem)[1]}`;
    const customActionDefinitionKey = `${ux_specification_types_1.DefinitionName.ViewCustomAction}<${schemaIdForColumns}>`;
    // Anchor selection
    (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ViewCustomActionPosition, schemaIdForColumns, inputParameters.appSchema);
    const customActionPositionDefinitionKey = `${ux_specification_types_1.DefinitionName.ViewCustomActionPosition}<${schemaIdForColumns}>`;
    const customActionDefinition = inputParameters.appSchema.definitions[customActionDefinitionKey];
    customActionDefinition.properties.position.$ref =
        `${common_1.DEFINITION_LINK_PREFIX}${customActionPositionDefinitionKey}`;
    const schemaAdjustmentParameters = {
        logger: logger,
        appSchema: inputParameters.appSchema,
        v4Page: page.target,
        tableDefinitionKey: tableId,
        facetDefinitionKey: schemaIdForColumns,
        viewKey: inputParameters.viewKey,
        entityType: inputParameters.targetEntityType || entityType,
        dataForLineItem,
        sectionActionsDefinitionKey: schemaIdForActions,
        scopedCustomActionDefinitionKey: customActionDefinitionKey,
        customActionDefinitionName: ux_specification_types_1.DefinitionName.ViewCustomAction,
        sectionIdInManifest,
        customActionPosition: customActionPositionDefinitionKey
    };
    applyLRSchemaAdjustments(schemaAdjustmentParameters);
    // Add "manifestPath" for table properties
    addManifestPathsToPropertiesLR(inputParameters.appSchema, ux_specification_types_1.DefinitionName.LRTableView, lrTableView, {
        pageName: page.target.id,
        manifest: app.manifest,
        targetAnnotation: inputParameters.targetAnnotation,
        viewConfig: {
            key: inputParameters.viewKey,
            entitySet: inputParameters.entitySet
        }
    }, true);
    // Add "manifestPath" for view actions
    (0, ListReportUtils_1.addManifestPathsToDefinitionPropertiesLR)(inputParameters.appSchema, page.target.id, schemaIdForActions, app.getManifest(), inputParameters.targetAnnotation, inputParameters.entitySet);
}
/**
 * Adds the schema tags to a given view.
 *
 * @param viewsDefinition - the views definition in app schema (MultiTableModeV4)
 * @param viewKey - key property of the view
 * @param namespace - target namespace for annotations
 * @param view - the given view
 */
function addTagsToView(viewsDefinition, viewKey, namespace, view) {
    viewsDefinition.properties[viewKey][ux_specification_types_1.SchemaTag.isViewNode] = true;
    viewsDefinition.properties[viewKey][ux_specification_types_1.SchemaTag.annotationPath] = namespace
        ? `/${namespace}/@${view[ux_specification_types_1.SchemaTag.annotationPath]}`
        : undefined;
    viewsDefinition.properties[viewKey][ux_specification_types_1.SchemaTag.artifactType] = ux_specification_types_1.ArtifactType.Manifest;
    viewsDefinition.properties[viewKey][ux_specification_types_1.SchemaTag.key] = viewKey;
    viewsDefinition.properties[viewKey][ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.key, value: viewKey }];
}
/**
 * Adds view custom extensions - custom column and custom action definitions.
 *
 * @param commonInputParameters - list of input parameters as collected by the calling instance
 * @param visualization - visualization of the annotation
 * @param v4Page - the given page in manifest
 * @param manifest - The application manifest
 * @param logger - extension logger
 */
function addViewCustomExtensions(commonInputParameters, visualization, v4Page, manifest, logger) {
    const schemaIdForColumns = `${ux_specification_types_1.DefinitionName.LineItemsOfView}::${commonInputParameters.viewKey}`;
    const sectionIdPrefix = commonInputParameters.entitySet ? `/${commonInputParameters.entitySet}/` : '';
    const sectionIdInManifest = `${sectionIdPrefix}@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}${visualization.split(ux_specification_types_1.Visualization.LineItem)[1]}`;
    const viewColumnDefinition = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ViewCustomColumn, schemaIdForColumns, commonInputParameters.appSchema);
    (0, common_1.addDefinitionRef)(viewColumnDefinition.properties.position, ux_specification_types_1.DefinitionName.ViewPosition, schemaIdForColumns);
    (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ViewPosition, schemaIdForColumns, commonInputParameters.appSchema);
    (0, utils_2.addCustomColumnDefinition)(commonInputParameters.appSchema, v4Page, logger, `${ux_specification_types_1.DefinitionName.ViewCustomColumn}<${schemaIdForColumns}>`, schemaIdForColumns, sectionIdInManifest);
    (0, utils_2.addFragmentEnumForAnchor)(commonInputParameters.appSchema, schemaIdForColumns, v4Page, `${ux_specification_types_1.DefinitionName.ViewPosition}<${schemaIdForColumns}>`, sectionIdInManifest);
    // Add "manifestPath" for view columns
    (0, ListReportUtils_1.addManifestPathsToDefinitionPropertiesLR)(commonInputParameters.appSchema, v4Page.id, schemaIdForColumns, manifest, commonInputParameters.targetAnnotation, commonInputParameters.entitySet);
    // Remove generic position
    if (commonInputParameters.appSchema.definitions.Position) {
        delete commonInputParameters.appSchema.definitions.Position;
    }
}
/**
 * Adds definition parts to a LR View (LineItem/Chart).
 *
 * @param visualization - visualization of the annotation
 * @param viewsDefinition - the views definition in app schema (MultiTableModeV4)
 * @param commonInputParameters - list of input parameters as collected by the calling instance
 * @param generateParameters - list of API input parameters
 * @param generateParameters.serviceAVT - OData service AVT information
 * @param generateParameters.entityType - entity type of the current page
 * @param generateParameters.logger - extension logger
 * @param page - the current page object
 * @param app - the application object containing manifest and other app-specific information.
 * @param uiAnnotations - UI annotations of the given entityType
 * @param view - the given view
 */
function addLRViewParts(visualization, viewsDefinition, commonInputParameters, { serviceAVT, entityType, logger }, page, app, uiAnnotations, view) {
    if (visualization?.indexOf(ux_specification_types_1.Visualization.LineItem) > -1) {
        //Add Line item view
        addViewLineItems(commonInputParameters, viewsDefinition, visualization, commonInputParameters.targetAnnotation, { serviceAVT, entityType }, page, app, logger);
        addViewCustomExtensions(commonInputParameters, visualization, page.target, app.getManifest(), logger);
    }
    else if (visualization?.indexOf('Chart') > -1) {
        //Add Chart view
        addViewChart(commonInputParameters, uiAnnotations, commonInputParameters.appSchema, viewsDefinition, commonInputParameters.viewKey, commonInputParameters.title, page, app);
    }
    else if (view['template']) {
        const titleOnHover = view['label'] || `Custom View (key: ${commonInputParameters.viewKey})`;
        viewsDefinition.properties[commonInputParameters.viewKey] = {
            description: commonInputParameters.title || titleOnHover,
            title: titleOnHover,
            // Default view - use table view reference as default
            $ref: `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.TableViewExtension}`
        };
    }
    else {
        const titleOnHover = `View (key: ${commonInputParameters.viewKey})`;
        viewsDefinition.properties[commonInputParameters.viewKey] = {
            description: commonInputParameters.title || titleOnHover,
            title: titleOnHover,
            // Default view - use table view reference as default
            $ref: `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.LRTableView}`
        };
    }
}
/**
 * Checks for the default annotation path to use for LR table.
 *
 * @param page - the current page object
 * @returns annotation term
 */
function getDefaultAnnotationPath(page) {
    const { entity: { type: entityType }, template: { type: templateType }, target } = page;
    if (target?.options?.settings?.views?.paths && templateType === ux_specification_types_1.TemplateType.ListReportObjectPageV4) {
        return;
    }
    if (target?.options?.settings?.defaultTemplateAnnotationPath) {
        return target?.options?.settings.defaultTemplateAnnotationPath;
    }
    if (templateType === ux_specification_types_1.TemplateType.ListReportObjectPageV4) {
        return (entityType?.annotations.UI?.SelectionPresentationVariant?.term ||
            entityType?.annotations.UI?.PresentationVariant?.term);
    }
}
/**
 * Adds header actions to schema (LR or ALP).
 *
 * @param appSchema - app-specific JSON schema
 * @param v4Page - actual page in the manifest
 * @param logger - Logger class for logging messages
 */
function addHeaderActions(appSchema, v4Page, logger) {
    // add header action definitions
    const headerActionsDefinitionKey = ux_specification_types_1.DefinitionName.HeaderActions;
    const headerActionsDefinition = appSchema.definitions[headerActionsDefinitionKey];
    headerActionsDefinition[ux_specification_types_1.SchemaTag.isViewNode] = true;
    headerActionsDefinition.description = 'Actions';
    headerActionsDefinition.properties = {};
    // add custom action definitions
    const customActionDefinitionKey = ux_specification_types_1.DefinitionName.CustomHeaderAction;
    const customActionDefinition = appSchema.definitions[customActionDefinitionKey];
    customActionDefinition[ux_specification_types_1.SchemaTag.isViewNode] = true;
    customActionDefinition.description = 'Custom Action';
    (0, utils_2.addHeaderFooterCustomActionDefinition)(appSchema, v4Page, logger, customActionDefinitionKey, headerActionsDefinitionKey);
    const facetKey = ux_specification_types_1.DefinitionName.CustomHeaderActionPosition;
    (0, common_1.parseSchemaDefinition)(facetKey, facetKey, appSchema, false);
    // Anchor selection
    customActionDefinition.properties.position.$ref = `${common_1.DEFINITION_LINK_PREFIX}${facetKey}`;
    (0, utils_2.addEnumForActionAnchor)(appSchema, headerActionsDefinitionKey, facetKey);
}
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param appSchema - Full schema.
 * @param definitionName - The name of the definition/class whose properties are being processed.
 * @param definition - The definition object containing property schemas.
 * @param pathParams - Additional context required to compute manifest paths.
 * @param handleRelative - A flag indicating whether to use relative paths for definition properties.
 */
function addManifestPathsToPropertiesLR(appSchema, definitionName, definition, pathParams, handleRelative = false) {
    let targetAnnotation = undefined;
    if (pathParams.targetAnnotation) {
        const annotationParts = pathParams.targetAnnotation?.split('/');
        targetAnnotation = annotationParts[annotationParts.length - 1];
    }
    else {
        // Default annotation path
        targetAnnotation = `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
    }
    const entitySet = pathParams.viewConfig?.entitySet;
    if (entitySet) {
        targetAnnotation = entitySet ? `/${entitySet}/${targetAnnotation}` : targetAnnotation;
    }
    (0, utils_1.addManifestPathsToProperties)(appSchema, definitionName, definition, {
        ...pathParams,
        pathsParts: [
            pathParams.sectionId ? undefined : targetAnnotation,
            pathParams.columnKey ? pathParams.columnKey : '',
            targetAnnotation,
            pathParams.viewConfig
        ]
    }, handleRelative);
}
/**
 * Adds 'manifestPath' to static nodes in schema.
 *
 * @param appSchema - Full schema.
 * @param pathParams - Additional context required to compute manifest paths.
 */
function addManifestPathsToStaticNodes(appSchema, pathParams) {
    // Add "manifestPath" for current page
    appSchema['manifestPath'] = (0, utils_1.getPageManifestPath)(pathParams);
    // Root level - rules stored on page class level
    addManifestPathsToPropertiesLR(appSchema, ux_specification_types_1.PageTypeV4.ListReport, appSchema, pathParams);
    // Other definitions
    const definitions = [ux_specification_types_1.DefinitionName.FilterBar, ux_specification_types_1.DefinitionName.MultiTableModeV4];
    for (const definitionName of definitions) {
        const definition = appSchema.definitions?.[definitionName];
        if (typeof definition === 'object') {
            addManifestPathsToPropertiesLR(appSchema, definitionName, definition, pathParams);
        }
    }
}
/**
 * Class to generate the List Report page schema.
 */
class ListReportPage {
    /**
     * Constructor for ListReportPage.
     *
     * @param generateParameters - parameters for generating the app schema
     * @param schema - generic JSON schema of the List Report page
     * @param templateName - name of the template
     * @param contextPath - context path of the page
     */
    constructor(generateParameters, schema, templateName, contextPath) {
        const template = { name: templateName, type: generateParameters.templateType };
        this.appSchema = new sync_rules_1.AppSchema(schema);
        this.app = (0, sync_rules_1.createApp)(generateParameters.manifest, generateParameters.serviceAVT, generateParameters.logger);
        this.page = new sync_rules_1.Page(this.app, template, generateParameters.entitySet, generateParameters.entityType, contextPath);
        this.logger = this.app.logger;
        this.page.addConfig({
            isALP: template.type === ux_specification_types_1.TemplateType.AnalyticalListPageV4,
            views: this.page.target?.options?.settings.views,
            defaultAnnotation: getDefaultAnnotationPath(this.page)
        });
    }
    /**
     * Cleans up the schema by hiding specific properties and removing unnecessary definitions.
     */
    cleanup() {
        this.appSchema.hide(this.appSchema.getRootProperty([ux_specification_types_1.PropertyName.defaultTemplateAnnotationPath]));
        this.appSchema.cleanup(['GenericColumns', 'Action']);
        (0, common_1.updatePropertyIndices)(this.appSchema.get(), ROOT_PROPERTIES_ORDER);
    }
    /**
     * Generates the finalized schema for the List Report page.
     *
     * @returns The finalized schema for List Report page
     */
    generate() {
        const params = {
            appSchema: this.appSchema,
            app: this.app,
            page: this.page,
            logger: this.logger
        };
        new ListReportUtils_1.GeneralListReportSettings(params).init();
        if (!this.page.target) {
            return this.appSchema.get();
        }
        new controls_1.Header(params).init();
        new controls_1.HeaderActions(params).init();
        new controls_1.CustomHeaderAction(params).init();
        new ListReportUtils_1.FilterBar(params).init();
        new ListReportUtils_1.TableAndViews(params).init();
        // Add "manifestPath" for properties in static nodes
        addManifestPathsToStaticNodes(this.appSchema.get(), {
            pageName: this.page.target.id,
            manifest: this.app.getManifest()
        });
        // Add "manifestPath" for custom header actions
        const definitionNames = [ux_specification_types_1.DefinitionName.HeaderActions];
        definitionNames.forEach((definitionName) => {
            (0, ListReportUtils_1.addManifestPathsToDefinitionPropertiesLR)(this.appSchema.get(), this.page.target.id, definitionName, this.app.getManifest());
        });
        this.cleanup();
        return this.appSchema.get();
    }
}
/**
 * Generates an app specific schema for the FE V4 ListReport from the generic schema.
 * Generic types are replaced by information from the app specific annotations.
 *
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @param genericSchema  - generic JSON schema of an object page
 * @param {string} templateName - allows to distinguish list report from ALP
 * @param {string} contextPath - entity set (AVT object) that is relevant for the given page
 * @returns {object} application-specific schema of the list report
 */
function generateListReportSchemaV4(generateParameters, genericSchema, templateName, contextPath) {
    const listReport = new ListReportPage(generateParameters, genericSchema, templateName, contextPath);
    if (!listReport.app.getManifest()) {
        listReport.cleanup();
        return listReport.appSchema.get();
    }
    return listReport.generate();
}
//# sourceMappingURL=listReport.js.map