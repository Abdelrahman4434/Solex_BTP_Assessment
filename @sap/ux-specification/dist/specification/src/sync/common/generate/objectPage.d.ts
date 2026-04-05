import type { ConvertedMetadata, EntitySet, EntityType } from '@sap-ux/vocabularies-types';
import type { DataFieldAbstractTypes } from '@sap-ux/vocabularies-types/vocabularies/UI';
import type { FacetConfig, GenerateAppSchemaParameters, SchemaDefinition } from '@sap/ux-specification-types';
import { DefinitionName, FioriElementsVersion, SectionType, v2 } from '@sap/ux-specification-types';
import type { Definition } from 'typescript-json-schema';
import type { SapUiAppPageV4 } from '@sap/ux-specification-types/src/v4';
type DefinitionsProperties = {
    [key: string]: SchemaDefinition;
};
export interface AddDefinitionParams {
    appSchema: Definition;
    withActions: boolean;
    sectionType: SectionType;
    field: DataFieldAbstractTypes;
    targetID: string;
    containersSchema: FieldsContainerSchema;
    key: string;
    version: FioriElementsVersion;
    section: FacetConfig;
    entityTypeName: string;
    isInnerAction: boolean;
}
interface FieldsContainerSchema {
    fields?: DefinitionsProperties;
    actions?: DefinitionsProperties;
}
/**
 * Retrieves the modified field reference based on the specified Fiori Elements version
 * and the provided field reference identifier.
 *
 * @param {FioriElementsVersion} version - The Fiori Elements version (e.g., v2, v4).
 * @param {string} fieldReferenceId - The identifier for the field reference to be processed.
 * @returns {string} The transformed field reference if the version is v2 and the identifier contains '::',
 *                   otherwise returns the original field reference identifier.
 */
export declare function getFieldReference(version: FioriElementsVersion, fieldReferenceId: string): string;
/**
 * Adds definitions for forms in object page sections to the app schema.
 *
 * @param {SectionType} sectionType - prefix to distinguish Section and HeaderSection
 * @param {FacetConfig} section - section definition, as prepared from the annotations
 * @param {object} appSchemaSection - current definition of facet or section in the JSON schema
 * @param {object} appSchema - app specific schema that gets enhanced
 * @param {FioriElementsVersion} version - Fiori Elements version
 * @param {string} facetKey - facet key
 * @returns {string | undefined} target id of form
 */
export declare function handleForm(sectionType: SectionType, section: FacetConfig, appSchemaSection: Definition, appSchema: Definition, version: FioriElementsVersion, facetKey: string): string | undefined;
/**
 * Replaces an alias in an annotation ID or reference, based on the AVT references' list.
 *
 * @param annotationIdentifier - annotation ID or reference
 * @param {ConvertedMetadata} oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @returns the converted string
 */
export declare function replaceAlias(annotationIdentifier: string, oDataServiceAVT: ConvertedMetadata): string;
/**
 * Extracts the action name, action ID, and namespace from the given item and OData service metadata.
 *
 * @param item - The item containing action information.
 * @param oDataServiceAVT - The OData service metadata used for alias replacement.
 * @returns An object containing the action name, action ID, and namespace.
 */
export declare function getActionNameAndId(item: any, oDataServiceAVT: ConvertedMetadata): {
    actionName: string;
    actionId: string;
    namespace: string;
};
/**
 * Add Object Page Footer Action Buttons to app-specific schema.
 *
 * @param appSchema Schema of the app
 * @param generateParameters - Schema parameters
 * @param version - Fiori elements versions
 * @param addFooterActionCallBack - Callback function, either V2 or V4
 * @param pages - pages found in manifest
 */
export declare function addFooterActions(appSchema: Definition, generateParameters: GenerateAppSchemaParameters, version: FioriElementsVersion, addFooterActionCallBack: any, pages?: v2.SapUiAppPagesV2): void;
/**
 * Add Object Page Header Action Buttons to app-specific schema.
 *
 * @param {Definition} appSchema Schema of the app
 * @param entityType - The entity type for which the entity set is being determined
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @param {Function} addHeaderActionCallBack - Callback function, either V2 or V4
 * @param page - The page configuration for the object page
 * @param isV2 - Indicates whether the version is V2
 */
export declare function addHeaderActions(appSchema: Definition, entityType: EntityType, generateParameters: GenerateAppSchemaParameters, addHeaderActionCallBack: any, page?: SapUiAppPageV4, isV2?: boolean): void;
/**
 * Adds common Object Page Header definitions to the app schema.
 *
 * @param appSchema - app-specific JSOn schema
 * @param entityType - current entity Type
 */
export declare function addCommonHeaderSchema(appSchema: Definition, entityType: EntityType): void;
/**
 * Common logic to determine the EntitySet of a given EntityType.
 *
 * @param entityType - The entity type for which the entity set is being determined
 * @param serviceAVT - AVT converter output, comprising all annotation information
 * @returns the entity set as defined in AVT, if found
 */
export declare function determineEntitySetOfEntityType(entityType: EntityType, serviceAVT: ConvertedMetadata): EntitySet | undefined;
/**
 * Adds a data field definition to the application schema based on the provided parameters.
 *
 * @param {AddDefinitionParams} data - An object containing the parameters necessary to define and add the data field.
 * This includes:
 * - `appSchema`: The application schema to which the definition is added
 * - `section`: The section in which the field resides
 * - `sectionType`: The type of the section
 * - `field`: The specific field to be added
 * - `targetID`: The target identifier for the field
 * - `containersSchema`: The schema container for fields
 * - `key`: The key that determines the order of the field
 * - `version`: The version of the schema
 */
export declare function addDataFieldDefinition(data: AddDefinitionParams): void;
/**
 * Returns standard action and action group properties from the generic definition to the app specific schema.
 *
 * @param appSchema - Schema of the object page.
 * @param definitionName - Name of the generic action defition.
 * @returns Properties for standard action or action group.
 */
export declare function getPropertiesForStandardActionAndActionGroup(appSchema: Definition, definitionName: DefinitionName): DefinitionsProperties;
/**
 * Adds a data field to the schema definition for action and action group configurations.
 *
 * @param {AddDefinitionParams} data - The input data required to add the data field, including:
 * - appSchema: The application schema to be updated.
 * - withActions: A flag indicating whether actions are included.
 * - sectionType: The type of the section (e.g., Section).
 * - field: The data field to be added.
 * - targetID: The identifier of the target.
 * - containersSchema: The schema containing action and action groups configurations.
 * - key: The key used for the property's index.
 * - version: The schema version information.
 */
export declare function addDataFieldForActionAndActionGroupDefinition(data: AddDefinitionParams): void;
export {};
//# sourceMappingURL=objectPage.d.ts.map