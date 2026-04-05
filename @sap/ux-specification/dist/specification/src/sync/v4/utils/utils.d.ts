import type { DataFieldForActionAbstractTypes, LineItem } from '@sap-ux/vocabularies-types/vocabularies/UI';
import type { AnnotationTerm, ConvertedMetadata, EntitySet, EntityType } from '@sap-ux/vocabularies-types';
import { type ManifestPathParams } from '../../common/utils';
import type { Definition, DefinitionOrBoolean } from 'typescript-json-schema';
import { DefinitionName, type ExtensionLogger, type FileData, type Manifest, TemplatePropertyName, TemplateType, v4 } from '@sap/ux-specification-types';
import { type ExtensionFileData } from '../types';
import type { MetadataInstanceInterface } from '../../common/decoration/factory';
export type CustomExtension = v4.TableCustomColumn | v4.CustomAction | v4.CustomActionMenu | v4.SapUi5RoutingTargetContentSection | v4.SapUiGenericAppPageCustomFilterField;
export interface CustomExtensions {
    [key: string]: CustomExtension;
}
/**
 * Parameter object used while generating/appending LineItem entries (columns and actions) into the app schema.
 *
 * This bundle is passed into helpers that write schema fragments for different record types
 * (e.g. DataField columns, single actions, and action groups). It provides:
 * - the current LineItem context (entity type, schema, annotation path),
 * - the target schema node (actions definition / line item definition),
 * - the concrete record and its index in the annotation collection.
 *
 * @property lineItemData Context describing where the LineItem is written (app schema, entity type, annotation, etc.).
 * @property actions Target schema definition that collects action entries (toolbar/actions container).
 * @property lineItemPath Annotation path pointing to the LineItem collection being processed.
 * @property lineItemRecord The concrete LineItem record currently processed (may represent an action or a field-like record).
 * @property index Index of `lineItemRecord` within the LineItem annotation array; used for ordering and annotationPath.
 * @property lineItemDefinition Optional schema definition to write into when generating inline/embedded objects (no $ref case).
 * @property columnDefinitionName Base definition name used for column records (may be specialized for action columns).
 */
export interface AddLineItemDefinitionParams {
    lineItemData: LineItemDataForSchema;
    actions: Definition;
    lineItemPath: string;
    lineItemRecord: DataFieldForActionAbstractTypes;
    index: number;
    lineItemDefinition?: Definition;
    columnDefinitionName: string;
}
/**
 * Parameter object used when importing action settings from a schema definition reference into the generated config.
 *
 * This bundle is passed through the different action-import helpers/strategies (single action, group action,
 * manifest-based action menu) and carries:
 * - the schema fragments needed to resolve/read properties,
 * - the target config object where settings are written,
 * - manifest routing/context information required to compute correct manifest paths.
 *
 * @property actionPropertyDefinition Schema definition describing the action's properties (source of truth for what can be imported).
 * @property appSchema Application-specific JSON schema containing all definitions and references.
 * @property factory Metadata factory used to resolve sync rules / decorators and to materialize config instances.
 * @property actionsInConfig Target object in the config that receives imported action settings (e.g. actions map under a section/table).
 * @property actionKey Key/name of the action within `actionsInConfig` (the entry to read/write).
 * @property manifest The application manifest; used to resolve manifest paths for the imported settings.
 * @property routingId Routing target/page identifier providing context for manifest path resolution.
 * @property manifestSectionId Optional section identifier in the manifest (e.g. OP section id) to scope the action settings.
 * @property targetAnnotation Optional annotation path/identifier that further scopes action settings (e.g. LineItem qualifier / view context).
 */
export interface ImportActionSettingsOfReferenceParams {
    actionPropertyDefinition: Definition;
    appSchema: Definition;
    factory: MetadataInstanceInterface;
    actionsInConfig: object;
    actionKey: string;
    manifest: Manifest;
    routingId: string;
    manifestSectionId?: string;
    targetAnnotation?: string;
}
/**
 * Parsed schema definition identifier split into base name and optional qualifier.
 *
 * Used when a schema definition name encodes additional context (e.g. qualifier, facet/lineItem id) and callers
 * need to distinguish the generic base definition from the specific qualified variant.
 *
 * @property baseDefinitionName The unqualified/base schema definition name.
 * @property definitionQualifier Optional qualifier extracted from the full definition name (format depends on naming convention).
 */
export interface ParsedDefinitionName {
    baseDefinitionName: DefinitionName;
    definitionQualifier?: string;
}
export type ActionDetails = [string, DefinitionOrBoolean];
export declare const DATA_FIELD_FOR_ACTION_GROUP = "DataFieldForActionGroup";
export declare const FIELD_SEPARATOR = "::";
export declare const QUALIFIER_SEPARATOR = "#";
/**
 * Adds extension entries to a sorted array of extensions based on specific rules,
 * including using anchors, callbacks, and custom templates.
 *
 * @param {CustomExtensions} extensions - The object containing custom extensions to be added to the array.
 * @param {ActionDetails[]} sortedExtensionsArray - The array of sorted extensions to which new extensions will be added.
 * @param {string} extensionDefinitionName - The definition name associated with the extensions being added.
 * @param {TemplatePropertyName | TemplatePropertyName[]} [templatePropertyName=TemplatePropertyName.Template] -
 * The property name(s) to check for existence in an extension; used to determine compatibility.
 * @param {ExtensionLogger} [logger] - An optional logger to handle logging of invalid extensions or other events.
 * @param {boolean} [ignoreAnnotationAnchors=false] - A flag to indicate whether extension anchors should be ignored.
 * @returns {ActionDetails[]} The updated sorted extensions array, including newly added and valid extensions.
 */
export declare function addExtensionToArray(extensions: CustomExtensions, sortedExtensionsArray: ActionDetails[], extensionDefinitionName: string, templatePropertyName?: TemplatePropertyName | TemplatePropertyName[], logger?: ExtensionLogger, ignoreAnnotationAnchors?: boolean): ActionDetails[];
/**
 * Adds enum values to the properties definition of a custom column.
 *
 * @param lineItems - current lineItems definition, with all records.
 * @param customColumnDefinition - current custom column definition, in the app schema
 */
export declare function addEnumForProperties(lineItems: boolean | Definition, customColumnDefinition: Definition): void;
/**
 * Common function for enhancing the LineItems definition of app schema by custom columns.
 *
 * @param appSchema - app-specific JSON schema
 * @param v4Page - actual page in the manifest
 * @param logger - logger for error messages
 * @param customColumnDefinitionName - custom column definition name, distinguishes LR from OP
 * @param sectionId - identifier of the current object page section in schema
 * @param sectionIdInManifest - identifier of the current object page section in manifest
 */
export declare function addCustomColumnDefinition(appSchema: Definition, v4Page: v4.SapUiAppPageV4, logger: ExtensionLogger, customColumnDefinitionName?: string, sectionId?: string, sectionIdInManifest?: string): void;
/**
 * Adds an action record to a schema definition based on the provided line item definition parameters.
 * This involves defining action-specific properties, references, and metadata, and updating the schema accordingly.
 *
 * @param {AddLineItemDefinitionParams} lineItemDefinitionParams - The parameters describing the line item definition, including data, actions, path, record, and index.
 * @param {boolean} [createRef] - A flag indicating whether to create a reference for the action definition.
 * @param {boolean} isInnerAction - Whether the action belongs to the action group.
 */
export declare function addActionRecordToSchema(lineItemDefinitionParams: AddLineItemDefinitionParams, createRef?: boolean, isInnerAction?: boolean): void;
/**
 * Adds a group action record to the schema based on the given parameters. This involves determining
 * action definitions, creating or referencing schema properties, and setting metadata fields.
 *
 * @param {AddLineItemDefinitionParams} lineItemDefinitionParams - Parameters that define the line item, including data, record, path, index, and actions.
 * @param {boolean} [createRef] - Indicates whether to create a reference for the action definition or to use an inline object.
 */
export declare function addGroupActionRecordToSchema(lineItemDefinitionParams: AddLineItemDefinitionParams, createRef?: boolean): void;
/**
 * Adds a line item action definition to the schema based on the provided parameters.
 * Handles determining which action to take based on specific conditions of the line item record.
 *
 * @param {AddLineItemDefinitionParams} data - An object containing the details of the line item record and the line item definition.
 * @param {object} data.lineItemRecord - The record of the line item to be processed, containing relevant properties.
 * @param {boolean} data.lineItemRecord.Inline - Indicates whether the line item is inline.
 * @param {boolean} data.lineItemRecord.Determining - Indicates if the line item is determining.
 * @param {boolean} data.lineItemDefinition - Indicates whether the line item definition is present.
 */
export declare function addLineItemActionDefinition(data: AddLineItemDefinitionParams): void;
/**
 * Adds a line item record to the provided schema based on the definition parameters.
 *
 * @param {AddLineItemDefinitionParams} lineItemDefinitionParams - The parameters defining the line item data, schema information, and record.
 */
export declare function addLineItemRecordToSchema(lineItemDefinitionParams: AddLineItemDefinitionParams): void;
export type LineItemDataForSchema = {
    isObjectPage: boolean;
    isMacro?: boolean;
    appSchema: Definition;
    lineItemAnnotation: AnnotationTerm<LineItem>;
    entityType: EntityType;
    oDataServiceAVT: ConvertedMetadata;
    lineItemId: string;
};
/**
 * Appends line item columns and actions to the app schema (for the list report, custom page or an object page section comprising a table).
 *
 * @param {LineItemDataForSchema} data structure comprising
 * - appSchema - the app specific schema that shall get enhanced
 * - lineItemAnnotation - the UI.LineItem annotation, comprising all records
 * - entityType - the entity type as part of the AVT ConvertedMetadata
 * - oDataServiceAVT - complete service information, as returned by Annotation Vocabularies Tool
 * - lineItemId - in case of OP the parameter must be passed to distinguish the OP tables;
 *                in case of LR or ALP 'LineItems' is passed.
 * @param {Definition} actions - actions definition in schema, parent object
 * @param {string} lineItemPath - annotation path to the line item
 * @param {Definition | undefined} lineItemDefinition - line item definition
 * @param {string} columnDefinitionName - line item definition name
 */
export declare function appendLineItemsToSchema(data: LineItemDataForSchema, actions: Definition, lineItemPath: string, lineItemDefinition?: Definition, columnDefinitionName?: string): void;
/**
 * Adds the line item definition, columns and actions to the app schema (for the list report, custom page or an object page section comprising a table.
 *
 * @param data structure comprising
 * - isObjectPage - indicates that the page is an object page
 * - appSchema - the app specific schema that shall get enhanced
 * - lineItemAnnotation - the UI.LineItem annotation, comprising all records
 * - entityType - the entity type as part of the AVT ConvertedMetadata
 * - oDataServiceAVT - complete service information, as returned by Annotation Vocabularies Tool
 * - lineItemId - in case of OP the parameter must be passed to distinguish the OP tables;
 *                in case of LR or ALP 'LineItems' is passed.
 * @param columnDefinitionName - name of the column definition, i.e. TableColumn or ObjectPageTableColumn
 * @param customColumnDefinitionName - name of the custom column definition
 * @param customActionDefinitionName - name of the custom action definition
 */
export declare function addLineItemsTypeToSchema(data: LineItemDataForSchema, columnDefinitionName?: string, customColumnDefinitionName?: string, customActionDefinitionName?: string): void;
/**
 * Adds an enum or value help to position > anchor of custom column.
 *
 * @param appSchema - app specific JSON schema
 * @param lineItemId - ID of the current line item in schema
 * @param v4Page - current page in manifest
 * @param positionName - ID of the definition of custom column position in schema
 * @param sectionIdInManifest - identifier of the current object page section in manifest
 */
export declare function addFragmentEnumForAnchor(appSchema: Definition, lineItemId: string, v4Page: v4.SapUiAppPageV4, positionName?: string, sectionIdInManifest?: string): void;
/**
 * Adds an enum or value help to position > anchor of custom column or custom action.
 *
 * @param appSchema - app specific JSON schema
 * @param definitionId - definition key of actions
 * @param positionName - target definition to update
 */
export declare function addEnumForActionAnchor(appSchema: Definition, definitionId: string, positionName?: string): void;
/**
 * Adds an enum options of the columns to the table enableMassEdit properties.
 *
 * @param {Definition} appSchema - The schema of the application where the enums will be added.
 * @param {string} tableDefinitionName - The name of the table definition in the schema.
 * @param {string} columnsDefinitionName - The name of the columns definition used to extract column enumerations.
 * @param {EntityType} [entityType] - Optional entity type for additional context when retrieving column definitions.
 */
export declare function addEnumForEnableMassEdit(appSchema: Definition, tableDefinitionName: string, columnsDefinitionName: string, entityType?: EntityType): void;
/**
 * Initializes and modifies a specific schema definition for the creation mode of a line item.
 *
 * @param {Definition} appSchema - The base application schema containing definitions.
 * @param {string} lineItemId - The identifier for the line item in the schema.
 * @param {EntityType} entityType - The metadata entity type related to the line item.
 * @param {string} definitionName - The name of the general schema definition to be adapted.
 * @returns {string} The name of the newly created specific schema definition for the creation mode.
 */
export declare function initializeCreationModeSchema(appSchema: Definition, lineItemId: string, entityType: EntityType, definitionName: string): string;
/**
 * Updates the schema for specific creation fields in the provided application schema.
 * This method dynamically modifies schemas of particular table types to include specific definitions for creation fields.
 *
 * @param appSchema The application schema to update, represented as a Definition object.
 * @param entityType The entity type used for determining field groups.
 * @param definitionName The name of the schema definition that serves as the base for the specific creation mode schema.
 * @param lineItemId The identifier of the line item related to the creation fields to be updated in the schema.
 */
export declare function addOneOfForCreationFields(appSchema: Definition, entityType: EntityType, definitionName: string, lineItemId: string): void;
/**
 * Find the relevant V4 page under the routing targets of manifest,json.
 *
 * @param pages - list of all pages in manifest
 * @param templateName - search criterion: template name
 * @param entitySet - search criterion: entity set object from AVT
 * @param contextPath - search criterion: contextPath
 * @returns the page definition in manifest (if found)
 */
export declare function findPageV4(pages: v4.SapUiAppPageV4[], templateName: string, entitySet?: EntitySet, contextPath?: string): v4.SapUiAppPageV4 | undefined;
/**
 * Depending on the template type, strip down the app schema so that only the relevant views are part of it.
 *
 * @param {Definition} appSchema - app specific JSON schema, to be adjusted
 * @param templateType - template type of the current page
 * @returns the right definition name for the table in the schema
 */
export declare function alignSchemaWithTemplateType(appSchema: Definition, templateType: TemplateType): DefinitionName.Table | DefinitionName.ALPTableView;
/**
 * Common function for enhancing LineItems, FieldGroups and Custom Section definitions of app schema by custom action definitions.
 *
 * @param appSchema The application schema where the custom action definition will be added.
 * @param v4Page The V4 page configuration object that contains metadata and settings for the page.
 * @param logger A logging instance for logging warnings or errors during the processing.
 * @param customActionDefinitionName The name of the custom action definition to be added. Defaults to `DefinitionName.CustomTableAction`.
 * @param sectionDefinitionName The name of the section definition within the schema to which the action definition will be added.
 * @param sectionIdInManifest Optional: The section ID in the manifest, used to derive the configuration ID.
 * @param lineItemId Optional: The ID of the line item, if applicable.
 */
export declare function addCustomActionDefinition(appSchema: Definition, v4Page: v4.SapUiAppPageV4, logger: ExtensionLogger, customActionDefinitionName?: string, sectionDefinitionName?: string, sectionIdInManifest?: string, lineItemId?: string): void;
/**
 * Common function for enhancing header and footer definitions of app schema by custom action definitions.
 *
 * @param appSchema - app-specific JSON schema
 * @param v4Page - actual page in the manifest
 * @param logger - logger for error messages
 * @param customActionDefinitionName - definition name of custom action
 * @param sectionId - identifier of the current object page section in schema
 */
export declare function addHeaderFooterCustomActionDefinition(appSchema: Definition, v4Page: v4.SapUiAppPageV4, logger: ExtensionLogger, customActionDefinitionName?: DefinitionName, sectionId?: string): void;
/**
 * Parses a given definition name into its base name and optional qualifier.
 *
 * @param definitionName The definition name to parse. This should be a string in the format "BaseName" or "BaseName<Qualifier>".
 * @returns An object containing the base definition name and, if applicable, its qualifier.
 * If there is no qualifier, it will return undefined for the qualifier field.
 */
export declare function parseDefinitionName(definitionName?: string): ParsedDefinitionName;
/**
 * Method returns page from manifest by passed page key.
 *
 * @param manifest Object from manifest.json.
 * @param pageId Page id.
 * @param logger Logger to report error of unexisting page.
 * @returns Manifest's target page.
 */
export declare function getManifestPage(manifest: Manifest, pageId: string, logger?: ExtensionLogger): v4.RoutingTargetOptions | undefined;
/**
 * Method finds custom view/section XML file for passed page.
 *
 * @param files All extension files.
 * @param page - the page object containing routing target options
 * @param manifest Object from manifest.json.
 * @param xmlType XML file type - view or fragment.
 * @param extensionName Extension namespace or path to extension name in page object.
 * @returns Custom page's data containing XML file.
 */
export declare function getPageCustomExtensionFile(files: FileData[], page: v4.RoutingTargetOptions, manifest: Manifest, xmlType: 'view' | 'fragment', extensionName: string): ExtensionFileData | undefined;
/**
 * Method finds view XML file for passed page.
 *
 * @param files All view files.
 * @param pageId Page id.
 * @param manifest Object from manifest.json.
 * @param logger Logger.
 * @returns Custom page's data containing view XML file.
 */
export declare function getPageCustomViewFile(files: FileData[], pageId: string, manifest: Manifest, logger?: ExtensionLogger): ExtensionFileData | undefined;
/**
 * Adds custom section or custom sub section definitions to app schema.
 *
 * @param appSchema - app-specific JSON schema
 * @param definition - sections definition
 * @param v4Page - actual page in the manifest
 * @param customSectionRef - value of custom section ref
 * @param isMergedSections - are merged section used
 * @param facetKey - facet key
 * @param logger - logger for error messages
 */
export declare function addCustomSectionDefinition(appSchema: Definition, definition: Definition, v4Page: v4.SapUiAppPageV4, customSectionRef: string, isMergedSections: boolean, facetKey?: string, logger?: ExtensionLogger): void;
/**
 * Method adds custom filter fields from manifest to schema properties.
 *
 * @param appSchema - app-specific JSON schema
 * @param definition - filter fields definition
 * @param v4Page - actual page in the manifest
 */
export declare function addCustomFilterFieldDefinition(appSchema: Definition, definition: Definition, v4Page: v4.SapUiAppPageV4): void;
/**
 * Imports the settings of a single action reference into the configuration object.
 *
 * @param {ImportActionSettingsOfReferenceParams} importActionParams - The parameters required for importing action settings, including property definitions.
 * @param {Definition} definitionOfReference - The reference definition object used to resolve the action.
 */
export declare function importSingleActionSettingsOfReference(importActionParams: ImportActionSettingsOfReferenceParams, definitionOfReference: Definition): void;
/**
 * Imports and processes the settings for a group of actions based on a reference definition.
 *
 * @param {ImportActionSettingsOfReferenceParams} importActionParams - Parameters containing details required to import group action settings, such as action property definitions, application schema, action configurations, and action keys.
 * @param {Definition} definitionOfReference - The definition object that serves as the reference for importing group action settings.
 * @param {string} definitionKey - Optional, the reference definition key from which the action group settings are imported.
 */
export declare function importGroupActionSettingsOfReference(importActionParams: ImportActionSettingsOfReferenceParams, definitionOfReference: Definition, definitionKey?: string): void;
/**
 * Imports and updates the action menu settings in a configuration object based on a given reference definition and related action parameters.
 *
 * @param {ImportActionSettingsOfReferenceParams} importActionParams - An object containing details such as the action property definition, application schema, actions configuration, and action key. These parameters are used for resolving and importing the settings.
 * @param {Definition} definitionOfReference - The reference definition object which includes properties and other settings required to define action menus and their related configurations.
 */
export declare function importManifestBasedActionMenuSettingsOfReference(importActionParams: ImportActionSettingsOfReferenceParams, definitionOfReference: Definition): void;
/**
 * Imports the action settings of a specified reference based on the given parameters.
 *
 * @param {object} importActionParams - The parameters required for importing action settings.
 * @param {object} importActionParams.actionPropertyDefinition - The action property definition containing the $ref to the reference.
 * @param {object} importActionParams.appSchema - The application schema containing definitions and other related metadata.
 */
export declare function importActionSettingsOfReference(importActionParams: ImportActionSettingsOfReferenceParams): void;
/**
 * Enhances the application schema with custom field definitions for Object Page sections.
 *
 * @param appSchema - The application-specific JSON schema object representing the Object Page.
 * @param v4Page - The current Object Page configuration from the manifest (V4 format).
 * @param fieldGroupInManifest - The manifest identifier for the Object Page section associated with the field definitions.
 * @param logger - Logger instance for reporting or debugging schema processing errors.
 * @param customFieldDefinitionName - The schema definition name to be used for custom fields (defaults to `CustomTableAction`).
 * @param fieldsDefinitionName - The schema definition name for the set of fields being enhanced.
 */
export declare function addCustomFieldDefinition(appSchema: Definition, v4Page: v4.SapUiAppPageV4, fieldGroupInManifest: string, logger: ExtensionLogger, customFieldDefinitionName: string, fieldsDefinitionName: string): void;
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param {string} appSchema - Full schema.
 * @param {string | undefined} definitionName - The name of the definition/class whose properties are being processed.
 *   If `undefined`, the function attempts to resolve the definition name from the `$ref` property of the provided definition.
 * @param {Definition} definition - The definition object containing property schemas.
 * @param {ManifestPathParams} pathParams - Additional context required to compute manifest paths.
 * @param handleRelative - A flag indicating whether to use relative paths for definition properties.
 */
export declare function addManifestPathsToProperties(appSchema: Definition, definitionName: string | undefined, definition: Definition, pathParams: ManifestPathParams, handleRelative?: boolean): void;
/**
 * Returns the manifest path for a given page based on the provided path parameters.
 *
 * @param {ManifestPathParams} pathParams - Parameters containing page information for path resolution.
 * @returns {string | undefined} The resolved manifest path as a string, or undefined if not applicable.
 */
export declare function getPageManifestPath(pathParams: ManifestPathParams): string | undefined;
//# sourceMappingURL=utils.d.ts.map