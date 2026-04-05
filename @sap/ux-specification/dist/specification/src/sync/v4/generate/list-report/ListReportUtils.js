"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableAndViews = exports.FilterBar = exports.GeneralListReportSettings = void 0;
exports.addManifestPathsToDefinitionPropertiesLR = addManifestPathsToDefinitionPropertiesLR;
const __1 = require("../../../..");
const utils_1 = require("../../utils");
const listReport_1 = require("../list-report/listReport");
const sync_rules_1 = require("../../sync-rules");
const common_1 = require("../../../common");
const i18next_1 = __importDefault(require("i18next"));
/**
 * Add general settings to schema (LR or ALP).
 *
 * - Adds Selection-(PresentationVariant) related enums to the schema.
 */
class GeneralListReportSettings extends sync_rules_1.BaseConstruct {
    /**
     * Constructor for general settings of ListReport.
     *
     * @param settings - general settings (App, Page, AppSchema, Logger)
     */
    constructor(settings) {
        super(settings);
    }
    init() {
        this.addSPVEnums(__1.DefinitionName.AnnotationPathAsObject);
    }
    /**
     * Adds Selection-(PresentationVariant) related enums to the schema.
     *
     * @param definitionName - definition name
     */
    addSPVEnums(definitionName) {
        const targetTerms = ["com.sap.vocabularies.UI.v1.SelectionVariant" /* UIAnnotationTerms.SelectionVariant */, "com.sap.vocabularies.UI.v1.SelectionPresentationVariant" /* UIAnnotationTerms.SelectionPresentationVariant */];
        const uiAnnotations = this.page.getUIAnnotations();
        if (!uiAnnotations) {
            return;
        }
        const enumStrings = Object.values(uiAnnotations)
            .filter((annotation) => targetTerms.includes(annotation.term))
            .map((annotation) => annotation.qualifier ? `${annotation.term}#${annotation.qualifier}` : annotation.term);
        const enums = [...new Set(enumStrings)];
        this.appSchema.addEnumToSchema(definitionName, ['properties', __1.SchemaTag.annotationPath], enums);
    }
}
exports.GeneralListReportSettings = GeneralListReportSettings;
/**
 * Add filter bar to schema (LR or ALP).
 */
class FilterBar extends sync_rules_1.BaseConstruct {
    /**
     *
     * @param settings - general settings (App, Page, AppSchema, Logger)
     */
    constructor(settings) {
        super(settings);
    }
    /**
     * Initializes the filter bar adjustments.
     */
    init() {
        this.addFilterBar(this.page.getEntityType(), this.appSchema, this.page.target, this.page.getUIVocabularyAlias());
    }
    // Implementation for FilterBar can be added here
    addVisualFilters() {
        (0, listReport_1.getVisualFilters)(this.page.target);
    }
    addSelectionFields() { }
    /**
     * Adds filter bar to schema (LR or ALP).
     *
     * @param entityType - the entity type
     * @param schema - the application schema
     * @param v4Page - the actual page in the manifest
     * @param alias - alias definition for the UI vocabulary
     */
    addFilterBar(entityType, schema, v4Page, alias) {
        const selectionFields = alias && entityType?.annotations?.[alias]?.SelectionFields;
        let selectionFieldsDefinition;
        // Hide visualFilters/selectionFields depending on existing visual filters
        const appSchema = schema.get();
        const visualFilters = (0, listReport_1.getVisualFilters)(v4Page);
        if (visualFilters) {
            appSchema.definitions[__1.DefinitionName.SelectionFields][__1.SchemaTag.hidden] = true;
            appSchema.definitions[__1.DefinitionName.SelectionFields]['properties'] = {};
            selectionFieldsDefinition = appSchema.definitions[__1.DefinitionName.CompactFilters];
            selectionFieldsDefinition.additionalProperties = false;
            selectionFieldsDefinition.properties = {};
            (0, listReport_1.addVisualFilters)(entityType, appSchema, visualFilters, selectionFields);
        }
        else {
            const filterBar = schema.getDefinition(__1.DefinitionName.FilterBar);
            filterBar.properties['initialLayout'][__1.SchemaTag.hidden] = true;
            filterBar.properties['layout'][__1.SchemaTag.hidden] = true;
            appSchema.definitions[__1.DefinitionName.CompactFilters][__1.SchemaTag.hidden] = true;
            appSchema.definitions[__1.DefinitionName.VisualFilters][__1.SchemaTag.hidden] = true;
        }
        selectionFieldsDefinition = (0, listReport_1.addSelectionFields)(entityType, appSchema, selectionFields, selectionFieldsDefinition);
        // Apply custom filter fields
        (0, listReport_1.applyCustomFilterFields)(appSchema, selectionFieldsDefinition, v4Page);
        // Add "manifestPath" to filter fields
        addManifestPathsToDefinitionPropertiesLR(schema.get(), v4Page.id, __1.DefinitionName.SelectionFields, this.app.getManifest());
    }
}
exports.FilterBar = FilterBar;
/**
 * Adjusts the entity type if a different entity set is maintained for a view.
 *
 * @param {EntitySet} entitySet - actual entity set (AVT information)
 * @param view - the current view in manifest
 * @param page - the page object
 * @param app - the app object
 * @returns the target entity type
 */
function getTargetEntityType(entitySet, view, page, app) {
    let targetEntityType = page.getEntityType();
    let viewEntitySet = entitySet;
    if (view['entitySet'] && view['entitySet'] !== entitySet.name) {
        viewEntitySet = app.getAVT()?.entitySets.find((es) => {
            return es.name === view['entitySet'];
        });
        targetEntityType = viewEntitySet.entityType;
    }
    return targetEntityType;
}
/**
 * Adapts the table definition in schema.
 * Evaluates the path depending on if defaultTemplateAnnotationPath or Selection-/PresentationVariant is present.
 *
 * @param settings - general settings (App, Page, AppSchema, Logger)
 * @param templateAnnotation - defaultTemplateAnnotationPath as registered in manifest
 * @param tableDefinitionName - The name of the table definition in the schema
 */
function adaptTableDefinition(settings, templateAnnotation, tableDefinitionName) {
    const { appSchema, page, app } = settings;
    let schemaIdForColumns = `${__1.DefinitionName.LineItems}`;
    let schemaIdForActions;
    //here: tableDefinitionName = DefinitionName.Table
    const tableDefinition = appSchema.getDefinition(tableDefinitionName);
    const { visualization, targetAnnotation, namespace } = (0, listReport_1.analyzeViewAnnotation)(templateAnnotation, page.getUIAnnotations(), app.getAVT(), undefined, __1.Visualization.LineItem, app.logger);
    if (visualization) {
        const annotationTerm = visualization.split('.')[1];
        schemaIdForColumns = `${__1.DefinitionName.LineItems}OfSPV::${(0, common_1.prepareRef)(annotationTerm)}`;
        const spvTable = appSchema.cloneDefinition(tableDefinitionName, `${tableDefinitionName}SPV`);
        appSchema.setPropertyRef(spvTable, ['properties', 'toolBar'], `${__1.DefinitionName.ToolBar}<${schemaIdForColumns}>`);
        // Switch from generic column to specific definition
        // schema.setProperty(spvTable, ['properties', 'columns'], {});
        appSchema.setProperty(spvTable, [__1.SchemaTag.annotationPath], targetAnnotation);
        appSchema.setPropertyRef(spvTable, ['properties', 'columns'], schemaIdForColumns);
        appSchema.setDefinitionRef(tableDefinition, `${tableDefinitionName}SPV`);
        appSchema.removeProperty(spvTable, __1.SchemaTag.isViewNode);
        appSchema.removeProperty(tableDefinition, 'properties');
        appSchema.setProperty(tableDefinition, [__1.SchemaTag.annotationPath], `/${namespace}/@${templateAnnotation}`);
        const lineItemAnnotation = page.getUIAnnotations()[annotationTerm];
        if (!lineItemAnnotation) {
            (0, __1.log)(app.logger, {
                severity: "error" /* LogSeverity.Error */,
                message: i18next_1.default.t('NOTARGET', { target: annotationTerm })
            });
        }
        const dataForLineItem = {
            isObjectPage: false,
            appSchema: appSchema.get(),
            lineItemAnnotation,
            entityType: page.entity.type,
            oDataServiceAVT: app.getAVT(),
            lineItemId: schemaIdForColumns
        };
        (0, utils_1.addLineItemsTypeToSchema)(dataForLineItem);
        const annotationTermQualifier = annotationTerm.split('#')?.[1];
        const sectionIdInManifest = annotationTermQualifier
            ? `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}#${annotationTermQualifier}`
            : `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
        (0, utils_1.addCustomColumnDefinition)(appSchema.get(), page.target, app.logger, undefined, schemaIdForColumns, sectionIdInManifest);
        (0, utils_1.addFragmentEnumForAnchor)(appSchema.get(), schemaIdForColumns, page.target, undefined, sectionIdInManifest);
        // Table toolbar actions with custom actions
        schemaIdForActions = `${__1.DefinitionName.Actions}<${schemaIdForColumns}>`;
        const customColumnDefinitionName = (0, common_1.getCustomExtensionDefinitionName)(appSchema.get(), schemaIdForColumns, __1.DefinitionName.CustomTableAction);
        const schemaAdjustmentParameters = {
            logger: app.logger,
            appSchema: appSchema.get(),
            v4Page: page.target,
            tableDefinitionKey: `${tableDefinitionName}SPV`,
            facetDefinitionKey: schemaIdForColumns,
            dataForLineItem,
            entityType: page.entity.type,
            sectionActionsDefinitionKey: schemaIdForActions,
            scopedCustomActionDefinitionKey: (0, common_1.getDefinitionKey)(customColumnDefinitionName),
            customActionDefinitionName: __1.DefinitionName.CustomTableAction,
            sectionIdInManifest
        };
        (0, listReport_1.applyLRSchemaAdjustments)(schemaAdjustmentParameters);
    }
    else {
        appSchema.setPropertyRef(tableDefinition, ['properties', 'toolBar'], `${__1.DefinitionName.ToolBarLR}`);
        appSchema.setPropertyRef(tableDefinition, ['properties', 'columns'], `${__1.DefinitionName.LineItems}`);
        // Switch from generic column to specific definition
        const lineItemAnnotation = page.getUIAnnotations()?.LineItem;
        if (!lineItemAnnotation && !page.target.options?.settings?.views?.paths) {
            (0, __1.log)(app.logger, {
                severity: "error" /* LogSeverity.Error */,
                message: i18next_1.default.t('NOLINEITEMS')
            });
        }
        const dataForLineItem = {
            isObjectPage: false,
            appSchema: appSchema.get(),
            lineItemAnnotation,
            entityType: page.entity.type,
            oDataServiceAVT: app.getAVT(),
            lineItemId: __1.DefinitionName.LineItems
        };
        (0, utils_1.addLineItemsTypeToSchema)(dataForLineItem);
        (0, utils_1.addCustomColumnDefinition)(appSchema.get(), page.target, app.logger);
        (0, utils_1.addFragmentEnumForAnchor)(appSchema.get(), __1.DefinitionName.LineItems, page.target);
        schemaIdForActions = `${__1.DefinitionName.Actions}<${(0, common_1.prepareRef)(schemaIdForColumns)}>`;
        const schemaAdjustmentParameters = {
            logger: app.logger,
            appSchema: appSchema.get(),
            v4Page: page.target,
            tableDefinitionKey: tableDefinitionName,
            facetDefinitionKey: schemaIdForColumns,
            dataForLineItem,
            entityType: page.entity.type,
            customActionDefinitionName: __1.DefinitionName.CustomTableAction,
            sectionActionsDefinitionKey: schemaIdForActions
        };
        (0, listReport_1.applyLRSchemaAdjustments)(schemaAdjustmentParameters);
        if (lineItemAnnotation && !page.target.options?.settings?.views?.paths) {
            tableDefinition[__1.SchemaTag.annotationPath] = (0, common_1.createAnnotationPath)(page.entity.type.fullyQualifiedName, lineItemAnnotation.term, lineItemAnnotation.qualifier);
        }
    }
    // Add "manifestPath" for table properties
    (0, listReport_1.addManifestPathsToPropertiesLR)(appSchema.get(), tableDefinitionName, tableDefinition, {
        pageName: page.target.id,
        manifest: app.getManifest(),
        targetAnnotation
    });
    // Add "manifestPath" for table columns and actions
    const customExtensionDefinitionNames = [schemaIdForColumns, schemaIdForActions];
    customExtensionDefinitionNames.forEach((definitionName) => {
        addManifestPathsToDefinitionPropertiesLR(appSchema.get(), page.target.id, definitionName, app.getManifest());
    });
}
/**
 * Add list report views to the app-specific schema.
 *
 * @param settings - general settings (App, Page, AppSchema, Logger)
 * @param tableDefinitionName - The name of the table definition in the schema
 */
function addLRViews(settings, tableDefinitionName) {
    const { appSchema, app, page } = settings;
    const viewsPaths = page.config.views.paths;
    const tableDefinition = appSchema.getDefinition(tableDefinitionName);
    tableDefinition.properties = {
        annotationPath: tableDefinition.properties.annotationPath,
        initialLoad: tableDefinition.properties.initialLoad,
        views: tableDefinition.properties.views
    };
    const viewsDefinition = appSchema.getDefinition(__1.DefinitionName.MultiTableModeV4);
    for (const view of viewsPaths) {
        if (!view[__1.SchemaTag.key]) {
            continue;
        }
        let navPropName = undefined;
        const targetEntityType = getTargetEntityType(page.entity.set, view, page, app);
        const uiAnnotations = targetEntityType?.annotations.UI;
        const { visualization, targetAnnotation, namespace, title } = (0, listReport_1.analyzeViewAnnotation)(view?.[__1.SchemaTag.annotationPath], uiAnnotations, app.getAVT(), view[__1.SchemaTag.key], undefined, app.logger);
        if (view['entitySet']) {
            navPropName = page.entity.type.navigationProperties.find((np) => {
                return np.targetTypeName === namespace;
            })?.name;
        }
        const viewKey = (0, common_1.prepareRef)(view[__1.SchemaTag.key]);
        const commonInputParameters = {
            viewKey,
            appSchema: appSchema.get(),
            targetAnnotation,
            navPropName,
            targetEntityType,
            title,
            entitySet: view['entitySet']
        };
        (0, listReport_1.addLRViewParts)(visualization, viewsDefinition, commonInputParameters, { serviceAVT: app.getAVT(), entityType: targetEntityType, logger: app.logger }, page, app, uiAnnotations, view);
        (0, listReport_1.addTagsToView)(viewsDefinition, viewKey, namespace, view);
    }
}
class TableAndViews extends sync_rules_1.BaseConstruct {
    /**
     * Initializes the addition of table and views to the schema.
     */
    init() {
        this.addTableAndViews();
    }
    /**
     * Adds table and views to the schema.
     */
    addTableAndViews() {
        const tableDefinitionName = (0, utils_1.alignSchemaWithTemplateType)(this.appSchema.get(), this.page.template.type);
        const config = this.page.config;
        if (this.page.template.type === __1.TemplateType.ListReportObjectPageV4) {
            this.appSchema.hide(this.appSchema.getRootProperty([__1.PropertyName.chart]));
            adaptTableDefinition(this.getSettings(), config.defaultAnnotation, tableDefinitionName);
            if (!config.views) {
                this.appSchema.setProperty(__1.DefinitionName.MultiTableModeV4, ['properties'], {});
            }
            else if (config.views.paths) {
                this.appSchema.cleanup(['LineItems', 'ToolBar<LineItems>', 'Actions<LineItems>']);
                addLRViews(this.getSettings(), tableDefinitionName);
            }
        }
        else if (config.isALP) {
            const generateParameters = {
                logger: this.logger,
                entityType: this.page.getEntityType(),
                serviceAVT: this.app.getAVT()
            };
            (0, listReport_1.addALPViews)(this.appSchema.get(), config.views?.paths, generateParameters, config.defaultAnnotation, this.page.target, tableDefinitionName);
            (0, utils_1.addFragmentEnumForAnchor)(this.appSchema.get(), __1.DefinitionName.LineItems, this.page.target);
        }
    }
}
exports.TableAndViews = TableAndViews;
/**
 * Enhances the List Report schema with manifest paths for definition and properties.
 *
 * This function extends the app schema (`appSchema`) by adding manifestPath to definition and properties on the List Report.
 *
 * @param {Definition} appSchema - The application schema object representing the List Report structure.
 * @param {string} pageId - Identifier of the page.
 * @param {string} definitionName - Identifier of the corresponding definition.
 * @param {Manifest} manifest - The application manifest.
 * @param {string} targetAnnotation - Target annotation.
 * @param {string} entitySet - Entity set.
 */
function addManifestPathsToDefinitionPropertiesLR(appSchema, pageId, definitionName, manifest, targetAnnotation, entitySet) {
    const matchingDefinition = appSchema.definitions[definitionName];
    for (const key in matchingDefinition?.properties ?? {}) {
        const property = matchingDefinition.properties[key];
        (0, listReport_1.addManifestPathsToPropertiesLR)(appSchema, undefined, property, {
            pageName: pageId,
            columnKey: key,
            manifest,
            targetAnnotation,
            viewConfig: {
                entitySet
            }
        }, true);
    }
}
//# sourceMappingURL=ListReportUtils.js.map