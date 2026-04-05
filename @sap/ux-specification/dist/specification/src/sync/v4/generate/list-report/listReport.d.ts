import { type LineItemDataForSchema } from '../../utils';
import { Visualization, DefinitionName, v4 } from '@sap/ux-specification-types';
import type { ExtensionLogger, GenerateAppSchemaParameters } from '@sap/ux-specification-types';
import type { AnnotationTerm, EntityType, ConvertedMetadata } from '@sap-ux/vocabularies-types';
import type { SelectionFields } from '@sap-ux/vocabularies-types/vocabularies/UI';
import { type ManifestPathParams } from '../../../common';
import type { Definition } from 'typescript-json-schema';
import type { PageConfig, App } from '../../sync-rules';
import { Page } from '../../sync-rules';
/**
 * Parameter bag for post-generation schema adjustments.
 *
 * Used by helper functions that refine already generated schema nodes (e.g. ListReport/ALP tables and views),
 * including manifest-driven tweaks and custom extensions (custom actions / custom action menus).
 *
 * Conventions / contract:
 * - All adjustments mutate `appSchema` in-place.
 * - `tableDefinitionKey` and `facetDefinitionKey` must point to existing entries in `appSchema.definitions` that are being adjusted.
 * - `entityType` may be different from `generateParameters.entityType` for view-specific schemas; if provided, it should be used
 *   as the primary entity type (fallback is `generateParameters.entityType`).
 * - `viewKey` is only relevant for multi-view scenarios; if omitted, the default view is assumed.
 * - `sectionActionsDefinitionKey` / `scopedCustomActionDefinitionKey` / `customActionPosition` are only required when the
 *   adjustment step configures scoped custom actions and/or custom action menus.
 */
export interface SchemaAdjustmentParameters {
    appSchema: Definition;
    v4Page: v4.SapUiAppPageV4;
    tableDefinitionKey: string;
    logger: ExtensionLogger;
    facetDefinitionKey: string;
    viewKey?: string;
    entityType?: EntityType;
    dataForLineItem: LineItemDataForSchema;
    sectionActionsDefinitionKey?: string;
    scopedCustomActionDefinitionKey?: string;
    customActionDefinitionName?: DefinitionName;
    sectionIdInManifest?: string;
    customActionPosition?: string;
}
/**
 * Default table type when not specified in manifest.
 */
export declare const DEFAULT_TABLE_TYPE = v4.TableTypeV4.ResponsiveTable;
/**
 * Configuration interface for List Report pages.
 * Extends the base PageConfig with List Report specific properties.
 */
export interface ListReportPageConfig extends PageConfig {
    isALP?: boolean;
    defaultAnnotation?: string;
    views?: v4.SapUi5Views;
}
/**
 * Type alias for a Page with ListReportPageConfig configuration.
 */
export type LRPage = Page<ListReportPageConfig>;
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
export declare function addSelectionFields(entityType: EntityType, appSchema: Definition, selectionFieldsAnnotation: AnnotationTerm<SelectionFields>, selectionFieldsDefinition?: Definition, qualifier?: string): Definition;
/**
 * Returns visual filters (if defined) from manifest page.
 *
 * @param v4Page - actual page in the manifest
 * @returns - The visual filters object if defined, otherwise undefined.
 */
export declare function getVisualFilters(v4Page: v4.SapUiAppPageV4): {} | undefined;
/**
 * Adds visual filters to the app schema, as properties of the FilterBar.
 *
 * @param {EntityType} entityType - the entity type as part of the AVT ConvertedMetadata
 * @param {Definition} appSchema - the app specific schema that shall get enhanced
 * @param visualFiltersManifest - the UI.SelectionFields under controlConfiguration
 * @param selectionFields - The selection fields annotation to be processed
 */
export declare function addVisualFilters(entityType: EntityType, appSchema: Definition, visualFiltersManifest: any, selectionFields: AnnotationTerm<SelectionFields>): void;
/**
 * Method updates schema for custom filter fields:
 * 1. Enables creation of custom filter fields.
 * 2. Populates custom filter fields from manifest to schema.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param selectionFieldsDefinition - schema of selection fields which should contain custom filter fields
 * @param v4Page - actual page in the manifest
 */
export declare function applyCustomFilterFields(appSchema: Definition, selectionFieldsDefinition: Definition, v4Page: v4.SapUiAppPageV4): void;
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
export declare function analyzeViewAnnotation(annotationPath: string, uIAnnotations: object, serviceAVT: ConvertedMetadata, viewKey?: string, visualizationType?: Visualization, logger?: ExtensionLogger): {
    visualization: string;
    targetAnnotation: string;
    namespace: string;
    title: string;
};
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
export declare function addALPViews(appSchema: Definition, viewsPaths: Array<object>, generateParameters: GenerateAppSchemaParameters, templateAnnotation: string, v4Page: v4.SapUiAppPageV4, tableDefinitionName: string): void;
export type ViewsParameters = {
    viewKey: string;
    appSchema: Definition;
    targetAnnotation: string;
    navPropName: string;
    targetEntityType: EntityType;
    title: string;
    entitySet?: string;
};
/**
 * Adjusts the schema for a table by making necessary changes such as populating creation fields,
 * adjusting creation field definitions, and adding enum mappings for mass edit functionalities.
 *
 * @param {SchemaAdjustmentParameters} schemaAdjustmentParameters - Object containing the parameters required for schema adjustments. Includes the generate parameters, application schema, table definition ID, and facet definition ID.
 */
export declare function applyLRSchemaAdjustments(schemaAdjustmentParameters: SchemaAdjustmentParameters): void;
/**
 * Adds the schema tags to a given view.
 *
 * @param viewsDefinition - the views definition in app schema (MultiTableModeV4)
 * @param viewKey - key property of the view
 * @param namespace - target namespace for annotations
 * @param view - the given view
 */
export declare function addTagsToView(viewsDefinition: Definition, viewKey: string, namespace: string, view: object): void;
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
export declare function addLRViewParts(visualization: string, viewsDefinition: Definition, commonInputParameters: ViewsParameters, { serviceAVT, entityType, logger }: Partial<GenerateAppSchemaParameters>, page: Page, app: App, uiAnnotations: object, view: object): void;
/**
 * Adds header actions to schema (LR or ALP).
 *
 * @param appSchema - app-specific JSON schema
 * @param v4Page - actual page in the manifest
 * @param logger - Logger class for logging messages
 */
export declare function addHeaderActions(appSchema: Definition, v4Page: v4.SapUiAppPageV4, logger: ExtensionLogger): void;
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param appSchema - Full schema.
 * @param definitionName - The name of the definition/class whose properties are being processed.
 * @param definition - The definition object containing property schemas.
 * @param pathParams - Additional context required to compute manifest paths.
 * @param handleRelative - A flag indicating whether to use relative paths for definition properties.
 */
export declare function addManifestPathsToPropertiesLR(appSchema: Definition, definitionName: string | undefined, definition: Definition, pathParams: ManifestPathParams, handleRelative?: boolean): void;
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
export declare function generateListReportSchemaV4(generateParameters: GenerateAppSchemaParameters, genericSchema: object, templateName: string, contextPath: string): object;
//# sourceMappingURL=listReport.d.ts.map