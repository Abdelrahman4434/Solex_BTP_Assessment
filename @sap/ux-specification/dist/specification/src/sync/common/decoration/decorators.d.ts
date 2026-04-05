import 'reflect-metadata';
import type { SyncRule, PageLayoutInformation, ValidityInformation, SyncRuleProvider, Validity, DependsOnCondition } from '@sap/ux-specification-types';
import { type ConditionInput, type MessageConfig } from './decorator-paths';
/**
 * Metadata keys for schema post-processing.
 * Used by decorators to store metadata that is processed during schema generation.
 */
export declare const metadataKeys: {
    description: symbol;
    isViewNode: symbol;
    syncRule: symbol;
    validity: symbol;
    hide: symbol;
    message: symbol;
    readonly: symbol;
    enums: symbol;
};
export declare const syncRule: (propSpec: SyncRule) => any;
/**
 * Retrieves the metadata associated with a specific property of a target object.
 *
 * @param target - The object containing the property.
 * @param propertyName - The name of the property whose metadata is to be retrieved.
 * @returns The metadata of the property, or undefined if no metadata is found.
 */
export declare function getReflectMetadata(target: object, propertyName: string): SyncRule | undefined;
/**
 * Return the sync rule a given class has been decorated with.
 *
 * @param cls - The constructor of the class that provides the sync rule
 * @returns the sync rule (if it exists)
 */
export declare function getReflectTypeMetadata(cls: SyncRuleProvider): SyncRule | undefined;
export declare const pageLayoutInformation: (pageInfo: PageLayoutInformation) => (constructor: Function) => void;
export declare const childId: (id: string) => any;
export declare const getChildId: (target: any, propertyName: string) => string;
export declare const getPageLayoutInformation: (target: any) => PageLayoutInformation;
export declare const descriptionUrlMetadataKey: unique symbol;
export declare const descriptionSrcURL: (id: string) => any;
export declare const getDescriptionSrcURL: (target: any, propertyName: string) => string;
export declare const validity: (validity: Validity) => any;
/**
 * Retrieves the validity metadata associated with a specific property of a target object.
 *
 * @param target - The object containing the property.
 * @param propertyName - The name of the property whose validity metadata is to be retrieved.
 * @returns The validity information of the property, or undefined if no metadata is found.
 */
export declare function getValidityMetadata(target: object, propertyName: string): ValidityInformation | undefined;
/**
 * Mark the target class with a metadata flag indicating it is a view node.
 *
 * @param target - The constructor of the class to be marked as a view node
 */
export declare function isViewNode(target: Function): void;
/**
 * Decorator to add a description to a class or property in the schema.
 *
 * @param text - The description text
 * @returns ClassDecorator
 */
export declare function description(text: string): (target: Function) => void;
/**
 * Internal metadata structure stored by decorators.
 * Extends DependsOnCondition with optional message configuration.
 */
export interface DecoratorMetadata extends DependsOnCondition {
    messageConfig?: MessageConfig;
}
/**
 * Decorator to conditionally hide a property based on conditions.
 * The property will be hidden when the condition(s) ARE met.
 *
 * @example
 * ```typescript
 * import { page, custom, when, and, or } from './decorator-paths';
 *
 * // Truthy check - hide when page.isALP is truthy
 * @hide(page.isALP)
 *
 * // Equality check - hide when page.type === 'GridTable'
 * @hide(when(page.type, 'GridTable'))
 *
 * // Custom function - hide when function returns true (type !== 'GridTable')
 * @hide(when(page.type, (type) => type !== 'GridTable'))
 *
 * // Always hide
 * @hide(true)
 *
 * // AND logic - hide when isALP is truthy AND type === 'GridTable'
 * @hide(and(page.isALP, when(page.type, 'GridTable')))
 *
 * // OR logic - hide when actionType === 'Bound' OR actionType === 'Custom'
 * @hide(or(when(page.actionType, 'Bound'), when(page.actionType, 'Custom')))
 * ```
 * @param condition - The condition to evaluate
 * @returns PropertyDecorator
 */
export declare function hide(condition: ConditionInput): PropertyDecorator;
/**
 * Decorator to conditionally display a message based on conditions.
 * A message will be shown when the condition(s) are met.
 * Multiple @message decorators can be applied to the same property - all matching conditions will show their messages.
 *
 * @param condition - The condition to evaluate
 * @param messageConfig - The message configuration (use msg() helper)
 * @returns PropertyDecorator
 * @example
 * ```typescript
 * import { page, when, msg } from './decorator-paths';
 *
 * // Simple message
 * @message(page.betaFeature, msg('BETA_WARNING'))
 *
 * // Message with parameters
 * @message(when(page.type, 'GridTable'), msg('TABLE_WARNING', { type: 'GridTable' }))
 *
 * // Deletable message
 * @message(page.deprecated, msg('DEPRECATED', { since: '1.96' }, { deletable: true }))
 *
 * // With AND/OR conditions
 * @message(and(page.isALP, when(page.type, 'GridTable')), msg('ALP_GRID_INFO'))
 *
 * // Multiple messages on same property
 * @message(when(page.type, 'AnalyticalTable'), msg('ANALYTICAL_WARNING'))
 * @message(when(page.mode, 'edit'), msg('EDIT_MODE_WARNING'))
 * ```
 */
export declare function message(condition: ConditionInput, messageConfig: MessageConfig): PropertyDecorator;
/**
 * Decorator to conditionally mark a property as readonly based on conditions.
 * The property will be readonly when the condition(s) are met.
 *
 * @example
 * ```typescript
 * import { page, custom, when } from './decorator-paths';
 *
 * // Truthy check - readonly if page.isLocked is truthy
 * @readonly(page.isLocked)
 *
 * // Equality check - readonly if mode === 'view'
 * @readonly(when(page.mode, 'view'))
 *
 * // Custom function - readonly if role is 'viewer'
 * @readonly(when(custom.user.role, (role) => role === 'viewer'))
 * ```
 * @param condition - The condition to evaluate
 * @returns PropertyDecorator
 */
export declare function readonly(condition: ConditionInput): PropertyDecorator;
/**
 * Metadata structure for the @enums decorator.
 * Extends DecoratorMetadata with the list of allowed enum values.
 */
export interface EnumsDecoratorMetadata extends DecoratorMetadata {
    /** The allowed enum values when the condition is met */
    allowedValues: string[];
}
/**
 * Decorator to conditionally restrict enum values based on conditions.
 * When the condition is met, only the specified allowedValues will be available.
 * If multiple @enums decorators exist on the same property, the first matching condition wins.
 *
 * @example
 * ```typescript
 * import { custom, when } from './decorator-paths';
 *
 * // Restrict to specific values when table type is TreeTable
 * @enums(when(custom.table.type, 'TreeTable'), ['Inline', 'NewPage', 'CreationDialog'])
 *
 * // Different values for other table types
 * @enums(when(custom.table.type, 'ResponsiveTable'), ['Inline', 'InlineCreationRows', 'NewPage', 'CreationDialog', 'External'])
 *
 * // Default values when no other condition matches
 * @enums(true, ['NewPage', 'CreationDialog'])
 * ```
 * @param condition - The condition to evaluate
 * @param allowedValues - Array of allowed enum values when condition is met
 * @returns PropertyDecorator
 */
export declare function enums(condition: ConditionInput, allowedValues: string[]): PropertyDecorator;
/**
 * Generates a deprecation message for a given key, optionally including additional validity information.
 *
 * @param key - The key or property name that is deprecated.
 * @param validityInformation - Optional validity information providing details about the deprecation.
 * @returns A string containing the deprecation message.
 */
export declare function getTextForDeprecated(key: string, validityInformation?: ValidityInformation): string;
//# sourceMappingURL=decorators.d.ts.map