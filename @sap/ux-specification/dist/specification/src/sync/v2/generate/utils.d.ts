import type { Definition } from 'typescript-json-schema';
import type { MetadataInstanceInterface } from '../../common/decoration/factory';
import type { v2, PageTypeV2, PageTypeV4, FileData, PropertyMessage, GenerateAppSchemaParameters } from '@sap/ux-specification-types';
import type { AnnotationTerm, EntitySet, EntityType } from '@sap-ux/vocabularies-types';
import type { Chart, DataPoint, DataFieldAbstractTypes, LineItem, SelectionFields } from '@sap-ux/vocabularies-types/vocabularies/UI';
import type * as Edm from '@sap-ux/vocabularies-types/Edm';
import type { EntityTypeAnnotations_UI } from '@sap-ux/vocabularies-types/vocabularies/UI_Edm';
import { ActionTypeV2 } from '../types';
import { FacetBase } from '../../../../../types/src/common/types';
import type { ExtensionLogger } from '../../..';
/**
 * Processes a LineItem record of type DataFieldForAction and DataFieldForIntentBasedNavigation during app schema generation.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param actions - actions definition in schema, parent object
 * @param lineItemProps - properties of the line item collection: lineItemPath, lineItemRecord, lineItemId
 * @param lineItemProps.lineItemPath - The path to the line item in the schema.
 * @param lineItemProps.lineItemRecord - The record of the line item in the collection.
 * @param lineItemProps.lineItemId - The identifier of the line item.
 * @param lineItemProps.entityType - the entity type as part of the AVT ConvertedMetadata
 * @param actionType - type of action
 * @param recordIndex - record index in the collection
 */
export declare function handleActionRecord(appSchema: Definition, actions: Definition, lineItemProps: {
    lineItemPath: any;
    lineItemRecord: any;
    lineItemId: any;
    entityType: EntityType;
}, actionType: ActionTypeV2, recordIndex: number): void;
/**
 *
 * @param annotationTerm "unqualified" annotation term that can be specified whithin a visualization (i.e. "LineItem" or "Chart")
 * @param visualization one visualization of a PresentationVariant
 * @returns empty string if the visualization does not match the annotationTerm. Otherwise the value of the visualization stripped by the reference to the ui vocabulary
 */
export declare function retrieveNameWithoutVocabularyFromVisualization(annotationTerm: FacetBase, visualization: Edm.AnnotationPath<Chart | DataPoint | LineItem>): string;
/**
 * Adds the line item records to the app schema (for the list report or an object page section comprising a table).
 *
 * @param isObjectPage - indicates that the page is an object page
 * @param appSchema - the app specific schema that shall get enhanced
 * @param lineItemAnnotation - the UI.LineItem annotation, comprising all records
 * @param entityType - the entity type as part of the AVT ConvertedMetadata
 * @param lineItemId - optional: in case of OP the parameter must be passed to distinguish the OP tables;
 *                      in case of LR or ALP no ID is passed, 'LineItems' is taken then.
 * @param customColumnRef - schema reference to custom column definition.
 */
export declare function addLineItemsType(isObjectPage: boolean, appSchema: Definition, lineItemAnnotation: AnnotationTerm<LineItem>, entityType: EntityType, lineItemId?: string, customColumnRef?: string): void;
/**
 * Adds enum entries of possible leading properties for 'leadingProperty' property in TableCustomColumn properties.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param entityType - the entity type as part of the AVT ConvertedMetadata
 * @param definitionName - definition name of CustomColumn definition
 */
export declare function addListReportLeadingProperties(appSchema: Definition, entityType: EntityType, definitionName: string): void;
/**
 * Adds enum entries of posible tabKey properties for 'leadingProperty' property in TableCustomColumn properties.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param definitionName - definition name of CustomColumn definition
 * @param page - sapui5 page object
 * @param facetID -  The facet ID
 */
export declare function addTabkeyEnum(appSchema: Definition, definitionName: string, page?: v2.SapUiAppPageV2, facetID?: string): void;
/**
 * Adds enum entries of posible fragment entries.
 *
 * @param {object} appSchema The app specific schema that shall get enhanced.
 * @param {FileData[]} fragments Array of fragments.
 * @param {string[]} appId Application id.
 * @param {string} property Property name.
 * @param {string} definitionName Definition name of CustomColumn definition.
 */
export declare function addFragmentEnum(appSchema: Definition, fragments: FileData[], appId: string, property: string, definitionName: string): void;
/**
 * Adds the custom columns to the line item records of the app schema (for the list report comprising a table).
 *
 * @param appSchema The app specific schema that shall get enhanced.
 * @param entityType The entity type as part of the AVT ConvertedMetadata.
 * @param page Sapui5 page object.
 * @param manifest Application manifest.
 * @param [fragments] Array of fragments.
 * @param [customColumnsDefinitionName] Definition name of Custom Columns definition.
 * @param [customColumnDefinitionName] Definition name of Custom Column definition.
 * @param facetID -  Facet ID
 */
export declare function addTableColumnExtensions(appSchema: object, entityType: EntityType, page: v2.SapUiAppPageV2, manifest: object, fragments?: FileData[], customColumnsDefinitionName?: string, customColumnDefinitionName?: string, facetID?: string): void;
/**
 * Apply post-processing rules as specified in form of "generate" at the syncRule.
 *
 * @param schema - given app schema, to be adapted
 * @param schemaDefinition - the current entry point or definition in the app schema
 * @param metaDataDefinition - the current entry point or definition in the metadata
 * @param pageType - page type
 * @param factory - factory for creating metadata instances
 * @param processedRefs - array of already processed refs which used to avoid cycling recursion
 * @param ref - currently processed schema definition reference name
 */
export declare function processMetadata(schema: object, schemaDefinition: object, metaDataDefinition: {
    [key: string]: any;
}, pageType: PageTypeV2 | PageTypeV4, factory: MetadataInstanceInterface, processedRefs: string[], ref?: string): void;
/**
 * Method updates passed 'enum' array by removing passed matching entries.
 *
 * @param {Array<unknown>} values Array of values.
 * @param {Array<unknown>} valuesToRemove Array of values to remove.
 */
export declare function removeElementsFromEnum(values: Array<unknown>, valuesToRemove: Array<unknown>): void;
/**
 * Adds the selection fields to the app schema, as properties of the Filterbar.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param selectionFieldsAnnotation - the UI.SelectionField annotation
 * @param entityType - the entity type as part of the AVT ConvertedMetadata
 */
export declare function addSelectionFields(appSchema: Definition, selectionFieldsAnnotation: AnnotationTerm<SelectionFields>, entityType: EntityType): void;
/**
 * Add entityProperties to passed a passed enum entry.
 *
 * @param {string[]} appSchemaEnum - Enum to be enhanced
 * @param {EntityType} entityType - Given entity type for which entries shall get generated
 */
export declare function addEntityPropertiesToEnum(appSchemaEnum: string[], entityType: EntityType): void;
/**
 * Checks if an entity supports draft capabilities.
 *
 * @param {EntitySet} entitySet Entity Set
 * @returns true if the entity supports draft
 */
export declare function isDraftEnabled(entitySet: EntitySet): boolean;
/**
 * Function to determine if the entity is deletable.
 *
 * @param {EntitySet} entitySet - current entity set
 * returns {boolean} return true if the Entity is deletable
 */
/**
 * Checks if an entity supports draft capabilities.
 *
 * @param entitySet - The entity set to check for draft capabilities.
 * @returns {boolean} True if the entity supports draft capabilities, otherwise false.
 */
export declare function isEntityDeletable(entitySet: EntitySet): boolean;
/**
 * Function to determine if the entity is updatable.
 *
 * @param {EntitySet} entitySet - current entity set
 * @returns returns true if the Entity is updatable
 */
export declare function isEntityUpdatable(entitySet: EntitySet): boolean;
/**
 * Adds standard header actions to schema (LR, ALP or OP).
 *
 * @param {Definition} appSchema - app-specific JSON schema
 * @param {boolean} isOP - flag to add to either LR/ALP or OP definition
 * @param {Definition} actions - optional standard actions definition
 */
export declare function addStandardHeaderActions(appSchema: Definition, isOP?: boolean, actions?: Definition): void;
/**
 * Adds standard footer actions to schema of Object Page.
 *
 * @param {Definition} appSchema - app-specific JSON schema
 * @param {Definition} actions - optional standard actions definition
 */
export declare function addStandardFooterActionsOP(appSchema: Definition, actions: Definition): void;
/**
 * Extract entity type and ui annotations for a entity set and log an error in case that either of these objects does not exist.
 *
 * @param {GenerateAppSchemaParameters} generateParameters list of API input parameters
 * @returns the entity type and the ui annotations for the given entity set
 */
export declare function getUIAnnotationForEntitySet(generateParameters: GenerateAppSchemaParameters): {
    entityType?: Edm.EntityType;
    uIAnnotations?: EntityTypeAnnotations_UI;
};
/**
 * Determine the LineItemAnnotation to be used for the LR.
 * Reproduces logic from Fiori Elements LR implementation (function createWorkingContext in LR specific AnnotationHelper).
 *
 * @param uIAnnotations - The UI annotations for the entity type.
 * @param settings - Optional settings object, typically a piece of the manifest, containing an optional annotationPath property.
 * @param logger - Optional logger instance for logging warnings or errors.
 * @returns The determined LineItem annotation or undefined if none is found.
 */
export declare function getLineItemAnnotation(uIAnnotations: EntityTypeAnnotations_UI, settings?: unknown, // an object (actually a piece of the manifest) possessing an optional property annotationPath which would define the path to the PresentationVariant
logger?: ExtensionLogger): LineItem | undefined;
/**
 * Possible placements for a datafield in the ui.
 */
export declare enum DataFieldTarget {
    Column = "Column",
    Toolbar = "Toolbar",// This value represents the toolbar of a table or chart. Note that the ui5 control sap.m.Toolbar may also be used for other purposes (e.g. the footer of a page)
    Footer = "Footer"
}
/**
 * An instance of this type collects information about one data field within a line item.
 *
 * @property target - where the data field is placed in the ui
 * @property stableIdPart - result of getStableIdPartFromDataField() for this data field, resp. '' if that function returned undefined (only happening if the service is the datafield is not modelled correctly)
 * @property isAction - true if the data field is of type DataFieldForAction or DataFieldForIntentBasedNavigation
 * @property description - the text of the data field (if any)
 * @property dataField - the actual data field from the ui annotations
 * @property message - possibly a message indicating an issue with this data field
 */
export type DataFieldInfo = {
    target: DataFieldTarget;
    stableIdPart: string;
    isAction: boolean;
    description: string;
    dataField: DataFieldAbstractTypes;
    message?: PropertyMessage;
};
/**
 * An instance of this type collects information about the line item configured for a table.
 *
 * @property name - the name of the line item annotation (including qualifier if any)
 * @property dataFieldInfos - information about each data field within the line item
 */
export type LineItemInfo = {
    name: string;
    dataFieldInfos: DataFieldInfo[];
};
/**
 * Collects all relevant information about a given line item.
 *
 * @param lineItemName - the name of the line item annotation (including qualifier if any)
 * @param lineItemDefinition - the definition of the line item
 * @param entityType - the entity type the line item belongs to
 * @param tableType - the table type the line item is used for
 * @param generateParameters - the generation parameters of the process the information is collected for. Used for logging.
 * @param isOP - whether the line item is for an object page
 * @returns an instance of LineItemInfo containing the collected information
 */
export declare function getLineItemInfo(lineItemName: string, lineItemDefinition: AnnotationTerm<LineItem>, entityType: Edm.EntityType, tableType: string, generateParameters: GenerateAppSchemaParameters, isOP: boolean): LineItemInfo;
/**
 * An instance of this type can be used to modify a section of a schema (e.g. in a post processing step for the app specific schema generation).
 *
 * @param definition - the schema section to be modified
 */
export type DefinitionAdapter = (definition: Definition) => void;
/**
 * This function provides a DefinitionAdapter that will modify sections of a schema that represent a table.
 * Thereby, the table properties enableExport and useExportToExcel are checked.
 * We assume that the first of those is preferred and the second one is only supported for compatibility.
 * Note that this is valid starting with UI5 release 1.142. Hence, this function should not be used for lower releases.
 *
 * @param flex - the flex changes applicable to the current page
 * @param smartTableControlId - if this parameter is truthy only flex changes for smart tables with this local id will be considered.
 * Otherwise all flex changes for any smart table will be considered.
 * Note that anyway only flex changes for the two properties mentioned above are relevant.
 * @returns a DefinitionAdapter that should be applied to all table sections that correspond to the specified SmartTable.
 */
export declare function getExportTablesPropertiesAdapter(flex: string[], smartTableControlId?: string): DefinitionAdapter;
//# sourceMappingURL=utils.d.ts.map