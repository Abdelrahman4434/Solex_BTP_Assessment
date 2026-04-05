import type { Definition } from 'typescript-json-schema';
import type { GenerateAppSchemaParameters } from '../../..';
import type { ConvertedMetadata, EntityType } from '@sap-ux/vocabularies-types';
import { ActionType, DefinitionName } from '@sap/ux-specification-types';
export declare const OBJECT_PAGE_TABLE_DEFINITION_TYPES: readonly [DefinitionName.ObjectPageResponsiveTableV4, DefinitionName.ObjectPageAnalyticalTableV4, DefinitionName.ObjectPageGridTableV4, DefinitionName.ObjectPageTreeTableV4];
type ActionListType = {
    index: string;
    item: object;
    isInnerAction?: boolean;
};
/**
 * Adds a list of actions to the header actions in the application schema.
 *
 * @param {ActionListType[]} actions - The list of actions to be added.
 * @param {ConvertedMetadata} oDataServiceAVT - The converted metadata service containing OData service annotations.
 * @param {Definition} appSchema - The application schema definition where actions will be added.
 * @param {EntityType} entityType - The entity type for which the actions are applicable.
 * @param {Definition} headerActions - The definition where the header actions will be appended.
 * @param {ActionType} actionType - The type of actions to be processed and added.
 * @param {number} [startingIndex] - The starting index for assigning actions in the header actions definition.
 */
export declare function addGroupedHeaderActions(actions: ActionListType[], oDataServiceAVT: ConvertedMetadata, appSchema: Definition, entityType: EntityType, headerActions: Definition, actionType: ActionType, startingIndex?: number): void;
/**
 * Generates an app specific schema out of the generic schema.
 * Generic types are replaced by information from the app specific annotations.
 *
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @param {object} genericSchema  - generic JSON schema of an object page
 * @param {string} contextPath - contextPath of the given page
 * @param {object} genericMacrosSchema - generic JSON schema of custom page
 * @returns the app specific JSON schema
 */
export declare function generateObjectPageSchemaV4(generateParameters: GenerateAppSchemaParameters, genericSchema: object, contextPath: string, genericMacrosSchema?: object): object;
export {};
//# sourceMappingURL=objectPage.d.ts.map