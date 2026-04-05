"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAdditionalPropertiesSchemaForCustomActionsAndMenus = buildAdditionalPropertiesSchemaForCustomActionsAndMenus;
exports.configureAdditionalPropertiesForCustomActionsAndMenus = configureAdditionalPropertiesForCustomActionsAndMenus;
exports.configureCustomActionDefinition = configureCustomActionDefinition;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../../common");
const utils_1 = require("../utils/utils");
const actionToMenuDefinitionMap = new Map([
    [ux_specification_types_1.DefinitionName.CustomHeaderActionOP, ux_specification_types_1.DefinitionName.ObjectPageHeaderCustomActionMenu],
    [ux_specification_types_1.DefinitionName.CustomFormActionOP, ux_specification_types_1.DefinitionName.ObjectPageCustomActionMenu],
    [ux_specification_types_1.DefinitionName.CustomTableActionOP, ux_specification_types_1.DefinitionName.ObjectPageCustomActionMenu],
    [ux_specification_types_1.DefinitionName.CustomTableAction, ux_specification_types_1.DefinitionName.CustomActionMenu],
    [ux_specification_types_1.DefinitionName.ViewCustomAction, ux_specification_types_1.DefinitionName.ViewCustomActionMenu]
]);
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
function buildAdditionalPropertiesSchemaForCustomActionsAndMenus(definitionKey, scopedActionDefinitionKey, scopedMenuDefinitionKey) {
    const actionRefSchema = {
        $ref: (0, common_1.getDefinitionsRef)(scopedActionDefinitionKey ?? definitionKey)
    };
    // actionToMenuDefinitionMap contains the mapping between the action and the corresponding menu definition
    const menuDefinitionKey = actionToMenuDefinitionMap.get(definitionKey);
    if (!menuDefinitionKey) {
        return actionRefSchema;
    }
    return {
        anyOf: [actionRefSchema, { $ref: (0, common_1.getDefinitionsRef)(scopedMenuDefinitionKey ?? menuDefinitionKey) }]
    };
}
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
function configureAdditionalPropertiesForCustomActionsAndMenus(appSchema, actionsSchemaKey, actionsPositionDefinitionKey, lineItemId, customActionDefinitionName, scopedCustomActionDefinitionKey) {
    const customActionMenuDefinitionKey = actionToMenuDefinitionMap.get(customActionDefinitionName);
    const actionsSchema = appSchema.definitions[actionsSchemaKey];
    if (!actionsSchema || !customActionMenuDefinitionKey) {
        return;
    }
    // Update actions position for each action - we need this for the action menu
    updateActionsPosition(appSchema, actionsSchema, actionsPositionDefinitionKey);
    // Create the specific action menu definition in the schema based on the generic action menu definition
    createCustomMenuDefinition(appSchema, lineItemId, actionsPositionDefinitionKey, customActionMenuDefinitionKey);
    const scopedCustomMenuDefinitionKey = (0, common_1.getFacetDefinitionKey)(customActionMenuDefinitionKey, lineItemId);
    actionsSchema.additionalProperties = buildAdditionalPropertiesSchemaForCustomActionsAndMenus(customActionDefinitionName, scopedCustomActionDefinitionKey, scopedCustomMenuDefinitionKey);
}
/**
 * Configures the custom action definition within the provided schema by adjusting relevant parameters and adding necessary definitions and enumerations.
 *
 * @param schemaAdjustmentParameters An object containing parameters required to adjust the schema for the custom action definition.
 * Includes the application schema, page information, generation parameters, section definition properties, and custom action details.
 */
function configureCustomActionDefinition(schemaAdjustmentParameters) {
    const { appSchema, v4Page, sectionActionsDefinitionKey, scopedCustomActionDefinitionKey, sectionIdInManifest, customActionPosition, facetDefinitionKey, customActionDefinitionName, logger } = schemaAdjustmentParameters;
    (0, utils_1.addCustomActionDefinition)(appSchema, v4Page, logger, scopedCustomActionDefinitionKey, sectionActionsDefinitionKey, sectionIdInManifest);
    (0, utils_1.addEnumForActionAnchor)(appSchema, sectionActionsDefinitionKey, customActionPosition ?? ux_specification_types_1.DefinitionName.CustomActionPosition);
    configureAdditionalPropertiesForCustomActionsAndMenus(appSchema, sectionActionsDefinitionKey, customActionPosition ?? ux_specification_types_1.DefinitionName.CustomActionPosition, facetDefinitionKey, customActionDefinitionName, scopedCustomActionDefinitionKey);
}
/**
 * Updates the position references of actions within a schema by linking them to a specified position identifier.
 *
 * @param {Definition} appSchema - The main application schema containing all definitions.
 * @param {Definition} schemaForActions - A schema that defines the actions to be updated.
 * @param {string} positionId - The identifier of the position to which the actions should be linked.
 */
function updateActionsPosition(appSchema, schemaForActions, positionId) {
    const { properties } = schemaForActions;
    for (const property in properties) {
        const { $ref } = properties[property];
        if ($ref) {
            const definitionKey = (0, common_1.getDefinitionKey)($ref);
            const definition = appSchema.definitions[definitionKey];
            if (definition?.properties?.position) {
                definition.properties.position.$ref = (0, common_1.getDefinitionsRef)(positionId);
            }
        }
    }
}
/**
 * Creates a custom actions menu definition in the given application schema using the provided parameters.
 *
 * @param {Definition} appSchema - The application schema object where the custom menu definition will be created.
 * @param {string} lineItemId - The identifier for the line item associated with the custom menu definition.
 * @param {string} positionId - The identifier for the position to be set in the custom menu definition.
 * @param {DefinitionName} customActionMenuDefinitionKey - The key for the generic action menu definition used as a base for customization.
 */
function createCustomMenuDefinition(appSchema, lineItemId, positionId, customActionMenuDefinitionKey) {
    // Create the specific action menu definition in the schema based on the generic action menu definition
    const customActionMenuDefinition = (0, common_1.parseSchemaDefinition)(customActionMenuDefinitionKey, lineItemId, appSchema);
    const customActionMenuActionsDefinitionKey = (0, common_1.getDefinitionKey)(customActionMenuDefinition?.properties[ux_specification_types_1.PropertyName.actions]?.$ref);
    (0, common_1.parseSchemaDefinition)(customActionMenuActionsDefinitionKey, lineItemId, appSchema);
    customActionMenuDefinition.properties.position.$ref = (0, common_1.getDefinitionsRef)(positionId);
    customActionMenuDefinition.properties.actions.$ref = (0, common_1.getDefinitionsRef)(customActionMenuActionsDefinitionKey);
}
//# sourceMappingURL=actions.js.map