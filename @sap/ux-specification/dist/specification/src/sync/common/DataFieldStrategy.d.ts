import type { DataFieldAbstractTypes } from '@sap-ux/vocabularies-types/vocabularies/UI';
import { UIAnnotationTypes } from '@sap-ux/vocabularies-types/vocabularies/UI';
import type { EntityType } from '@sap-ux/vocabularies-types';
import { type AddDefinitionParams } from './generate/objectPage';
import { type AddLineItemDefinitionParams, type ImportActionSettingsOfReferenceParams } from '../v4/utils/utils';
import type { Definition } from 'typescript-json-schema';
import { CustomUIAnnotationTypes } from '@sap/ux-specification-types';
export type DataFieldStrategyTypes = UIAnnotationTypes | CustomUIAnnotationTypes;
/**
 * Strategy interface for handling UI "data field"-like items during schema generation/import.
 *
 * Terminology:
 * In this module, "data field" refers to annotation-based UI DataFields and other artifacts with a similar nature
 * that participate in the same schema/config generation flow (for example, manifest-based actions / action menus).
 *
 * A concrete strategy implementation is selected by item type and can be used to:
 * - create/extend schema definitions (fields/actions),
 * - generate stable IDs and user-facing descriptions,
 * - import action settings from schema references.
 *
 * Some methods provide a default (fallback) implementation. Specialized strategies may override them
 * to apply type-specific handling (e.g. action groups, manifest-based action menus, etc.).
 */
export declare abstract class DataFieldStrategy {
    /**
     * Generates a stable identifier based on the provided data field.
     *
     * @param {DataFieldAbstractTypes} dataField - The data field used to generate the stable identifier.
     * @returns {string | undefined} A stable identifier as a string if successful, or undefined if the generation fails.
     */
    generateStableId?(dataField: DataFieldAbstractTypes): string | undefined;
    /**
     * Generates a descriptive string or value based on the provided data field, entity type, and data field label.
     *
     * @param {DataFieldAbstractTypes} dataField - The abstract type representation of the data field used to generate the description.
     * @param {EntityType} entityType - The type of entity associated with the data field.
     */
    generateDescription?(dataField: DataFieldAbstractTypes, entityType: EntityType): string;
    /**
     * Adds a new definition based on the provided parameters.
     *
     * @param {AddDefinitionParams} data - An object containing the parameters required to add the definition.
     */
    addDefinition?(data: AddDefinitionParams): void;
    /**
     * Adds a new line item definition to the system based on the provided parameters.
     *
     * @param {AddLineItemDefinitionParams} data - The parameters used to define the new line item.
     */
    addLineItemDefinition?(data: AddLineItemDefinitionParams): void;
    /**
     * Imports the action settings of a specified reference.
     * Default implementation: imports a single action’s settings from the referenced definition.
     * Specialized strategies override this for other cases (e.g. group actions, manifest-based action menus).
     *
     * @param {ImportActionSettingsOfReferenceParams} importActionParams - The parameters required to import action settings.
     * @param {Definition} definitionOfReference - The definition object of the reference.
     * @param {string} [definitionKey] - Optional schema-definition key providing additional context about the *target*
     * configuration scope. Some strategies use it as a discriminator to resolve special schema shapes (e.g. wrapper
     * definitions for action groups) and to pick the correct definition to read settings from / write settings into.
     *
     * Usage notes:
     * - Pass `definitionKey` when the caller knows the surrounding definition context (e.g. current facet/section key).
     * - Strategies must handle `definitionKey` being omitted; default implementation may ignore it.
     */
    importActionSettingsOfReference(importActionParams: ImportActionSettingsOfReferenceParams, definitionOfReference: Definition, definitionKey?: string): void;
}
export declare class DataFieldStrategyContext {
    private strategies;
    /**
     * Constructor to initialize the strategies map with various DataFieldStrategyTypes and their corresponding strategies.
     * It registers predefined strategies to handle different UI annotation types by mapping each type
     * to the appropriate strategy instance.
     *
     */
    constructor();
    /**
     * Registers a strategy for a specific type of data field.
     *
     * @param {string} type - The type of data field to associate with the strategy.
     * @param {DataFieldStrategy} strategy - The strategy to be registered for the specified type.
     */
    registerStrategy(type: DataFieldStrategyTypes, strategy: DataFieldStrategy): void;
    /**
     * Retrieves the strategy associated with the given type.
     *
     * @param {string} type - The key representing the type of strategy to retrieve.
     * @returns {DataFieldStrategy | undefined} The strategy corresponding to the provided type, or undefined if no strategy is found.
     */
    getStrategy(type: DataFieldStrategyTypes): DataFieldStrategy | undefined;
}
export declare const dataFieldStrategyContext: DataFieldStrategyContext;
//# sourceMappingURL=DataFieldStrategy.d.ts.map