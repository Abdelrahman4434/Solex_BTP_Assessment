import { DefinitionName } from '@sap/ux-specification-types';
import type { Definition } from 'typescript-json-schema';
import type { SchemaAdjustmentParameters } from './list-report/listReport';
/**
 * Builds the JSON Schema definition to be used as `additionalProperties` for custom actions.
 *
 * Depending on the action type (`definitionKey`), this function uses the action-to-menu mapping to decide whether
 * only an action reference is allowed, or both an action reference and a menu reference (via `anyOf`).
 *
 * @param definitionKey - Base definition name of the custom action type.
 * @param scopedActionDefinitionKey - Optional scoped definition key to use for the action `$ref`.
 * @param scopedMenuDefinitionKey - Optional scoped definition key to use for the menu `$ref` (if the mapping provides one).
 * @returns A schema fragment (`$ref` or `anyOf` with `$ref`s) that can be assigned to `additionalProperties`.
 */
export declare function buildAdditionalPropertiesSchemaForCustomActionsAndMenus(definitionKey: DefinitionName, scopedActionDefinitionKey?: string, scopedMenuDefinitionKey?: string): Definition;
/**
 * Configures additional properties for custom actions and menus in the provided application schema.
 * This includes updating actions' positions, creating specific action menu definitions, and setting up additional properties.
 *
 * @param appSchema The application schema that needs to be updated with custom actions and menus.
 * @param actionsSchemaKey The key in the schema that references the actions definitions.
 * @param actionsPositionDefinitionKey The key for the definition related to an action's position in the schema.
 * @param lineItemId The identifier for the specific line item being processed.
 * @param customActionDefinitionName The name of the definition for the custom action being added.
 * @param scopedCustomActionDefinitionKey The key for the scoped definition specific to the custom action.
 */
export declare function configureAdditionalPropertiesForCustomActionsAndMenus(appSchema: Definition, actionsSchemaKey: string, actionsPositionDefinitionKey: string, lineItemId: string, customActionDefinitionName: DefinitionName, scopedCustomActionDefinitionKey: string): void;
/**
 * Configures the custom action definition within the provided schema by adjusting relevant parameters and adding necessary definitions and enumerations.
 *
 * @param schemaAdjustmentParameters An object containing parameters required to adjust the schema for the custom action definition.
 * Includes the application schema, page information, generation parameters, section definition properties, and custom action details.
 */
export declare function configureCustomActionDefinition(schemaAdjustmentParameters: SchemaAdjustmentParameters): void;
//# sourceMappingURL=actions.d.ts.map