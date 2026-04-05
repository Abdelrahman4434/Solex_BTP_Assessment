/**
 * Type-safe path builders and condition helpers for decorator conditions.
 *
 * This module provides:
 *
 *  ## Context Sources
 * - **`app`**: App-level configuration (auto-injected from `app.config`)
 * - **`page`**: Page-level configuration (auto-injected from `page.config`)
 * - **`custom`**: Custom context (provided via `init()`)
 *
 * ## Utilities
 * - **Path builders**: Type-safe property access for `app`, `page`, and `custom` contexts
 * - **Condition helpers**: `when()`, `not()`, `and()`, `or()` for building conditions
 * - **Message helper**: `msg()` for i18n-based messages
 *
 * @example
 * ```typescript
 * import { page, custom, when, not, and, or, msg } from './decorator-paths';
 *
 * class MyTable extends Decorator {
 *     // Truthy check - hide when value is falsy
 *     @hide(page.isALP)
 *     alpOnlyField: string;
 *
 *     // Equality check with when() - hide when type IS GridTable
 *     @hide(when(page.type, 'GridTable'))
 *     gridField: string;
 *
 *     // Negation with not() - hide when type is NOT TreeTable
 *     @hide(not(page.type, 'TreeTable'))
 *     treeOnlyField: string;
 *
 *     // AND conditions
 *     @hide(and(page.isALP, when(page.type, 'GridTable')))
 *     alpGridField: string;
 *
 *     // OR conditions
 *     @hide(or(when(page.actionType, 'Bound'), when(page.actionType, 'Custom')))
 *     actionField: string;
 *
 *     // Message with i18n
 *     @message(page.betaFeature, msg('BETA_WARNING', { feature: 'table' }))
 *     betaField: string;
 *
 *     // Always hide
 *     @hide(true)
 *     internalField: string;
 * }
 * ```
 */
import type { Manifest, v4, AndConditionItem, OrConditionItem, AndConditionGroup, OrConditionGroup } from '@sap/ux-specification-types';
/**
 * App context (sourced from app.config).
 * This context is auto-injected and available via `app.*` paths.
 */
export type AppContext = {
    /** The application manifest */
    manifest: Manifest;
};
/**
 * Page context (sourced from page.config).
 * This context is auto-injected and available via `page.*` paths.
 *
 * These properties are determined by the Page class and its configuration.
 * Extend this type when new config properties are added to Page.
 */
export type PageContext = {};
/**
 * Settings for the Table Class context, taken from manifest.
 *
 * This context is provided via `init()` when applying table decorators.
 */
export type LRTableContext = {
    type: v4.TableTypeV4;
    creationMode?: v4.TableCreationModeLR;
    analyticalConfiguration?: v4.AnalyticalConfiguration;
    popinLayout?: string;
};
/**
 * Symbol used to store the path string within PathNode objects.
 * This allows the decorator to extract the path at runtime.
 *
 * Using Symbol.for() creates a global symbol that persists across module loads,
 * ensuring isPathNode() works correctly even when the module is loaded multiple times.
 */
export declare const PATH_SYMBOL: unique symbol;
/**
 * Represents a node in the path builder tree.
 * Contains the accumulated path string accessible via PATH_SYMBOL.
 *
 * @template P - The string literal type of the path
 */
export type PathNode<P extends string = string> = {
    readonly [PATH_SYMBOL]: P;
};
/**
 * Recursive type that builds typed property accessors for a given object shape.
 * Each property returns either:
 * - Another PathBuilder (for nested objects) combined with a PathNode
 * - A PathNode (for leaf/primitive values)
 *
 * @template T - The shape of the object to create paths for
 * @template Prefix - The accumulated path prefix (e.g., 'page.')
 */
type PathBuilder<T, Prefix extends string> = {
    readonly [K in keyof T & string]: NonNullable<T[K]> extends object ? NonNullable<T[K]> extends readonly unknown[] ? PathNode<`${Prefix}${K}`> : PathBuilder<NonNullable<T[K]>, `${Prefix}${K}.`> & PathNode<`${Prefix}${K}`> : PathNode<`${Prefix}${K}`>;
};
/**
 * Extracts the path string from a PathNode.
 *
 * @template P - The string literal type of the path
 * @param node - The PathNode to extract the path from
 * @returns The path string
 * @example
 * ```typescript
 * getPath(page.isALP)  // Returns: 'page.isALP'
 * getPath(app.manifest)  // Returns: 'app.manifest'
 * ```
 */
export declare function getPath<P extends string>(node: PathNode<P>): P;
/**
 * Type guard to check if a value is a PathNode.
 *
 * @param value - The value to check
 * @returns True if the value is a PathNode
 */
export declare function isPathNode(value: unknown): value is PathNode;
/**
 * Path builder for app.config properties.
 *
 * This context is **auto-injected** from `app.config` - you do not need to
 * provide it in the customContext parameter of `init()`.
 *
 * @example
 * ```typescript
 * // Access manifest properties
 * @hide(when(app.manifest['sap.app'].id, 'some-app-id'))
 * ```
 */
export declare const app: PathBuilder<AppContext, `${string}.`> & PathNode<string>;
/**
 * Path builder for page.config properties.
 *
 * This context is **auto-injected** from `page.config` - you do not need to
 * provide it in the customContext parameter of `init()`.
 *
 * @example
 * ```typescript
 * // Simple truthy check
 * @hide(page.isALP)
 *
 * // Equality check with when()
 * @hide(when(page.isALP, true))
 * @hide(when(page.visualization, 'Chart'))
 *
 * // Nested property
 * @hide(when(page.settings.enabled, false))
 * ```
 */
export declare const page: PathBuilder<PageContext, `${string}.`> & PathNode<string>;
/**
 * Path builder for custom context properties.
 *
 * This context **must be provided** in the customContext parameter of `init()`.
 * Use this for runtime-specific conditions like table state, section state, etc.
 *
 * **Note**: For table-specific decorators, prefer using `tableContext` which provides
 * full type safety for table properties.
 *
 * @example
 * ```typescript
 * // In decorator
 * @hide(when(custom.table.type, 'ResponsiveTable'))
 * @hide(when(custom.table.views, (views) => views.length > 0))
 *
 * // In init
 * decorator.init({
 *     table: { type: 'GridTable', views: [] }
 * });
 * ```
 */
export declare const custom: PathBuilder<Record<string, unknown>, `${string}.`> & PathNode<string>;
/**
 * Type-safe path builder for table decorator context.
 *
 * This context **must be provided** in the customContext parameter of `init()`.
 * Use this for table-specific conditions in List Report table decorators.
 *
 * Properties are accessed directly without nesting (e.g., `tableContext.type` not `tableContext.table.type`).
 *
 * @example
 * ```typescript
 * // In decorator - with full type safety
 * @hide(when(tableContext.type, 'AnalyticalTable'))
 * @hide(not(tableContext.type, 'TreeTable'))
 * @hide(when(tableContext.creationMode, (cm) => cm?.name === 'CreationDialog'))
 *
 * // In init - provide flat context object
 * decorator.init({
 *     type: 'GridTable',
 *     creationMode: { name: 'NewPage' },
 *     analyticalConfiguration: undefined,
 *     popinLayout: undefined
 * });
 * ```
 */
export declare const tableContext: PathBuilder<LRTableContext, `${string}.`> & PathNode<string>;
/**
 * Symbol used to identify WhenCondition objects.
 */
export declare const WHEN_SYMBOL: unique symbol;
/**
 * A condition function that receives the resolved value and returns a boolean.
 */
export type ConditionFunction = (value: unknown) => boolean;
/**
 * Represents a condition with a path and expected value or function.
 * Created by the `when()` helper function.
 */
export interface WhenCondition {
    readonly [WHEN_SYMBOL]: true;
    readonly path: PathNode;
    readonly expected: unknown | ConditionFunction;
}
/**
 * Type guard to check if a value is a WhenCondition.
 *
 * @param value - The value to check
 * @returns True if value is a WhenCondition
 */
export declare function isWhenCondition(value: unknown): value is WhenCondition;
/**
 * Creates a condition that checks if a path's value matches an expected value or function.
 *
 * @param path - The PathNode to check
 * @param expected - The expected value or a function that receives the value and returns boolean
 * @returns A WhenCondition object
 * @example
 * ```typescript
 * // Equality check
 * @hide(when(page.type, 'GridTable'))
 *
 * // Custom function (e.g., negation)
 * @hide(when(page.type, (type) => type !== 'GridTable'))
 *
 * // Check array length
 * @hide(when(custom.table.views, (views) => views?.length === 0))
 *
 * // Numeric comparison
 * @hide(when(page.count, (count) => count > 10))
 * ```
 */
export declare function when(path: PathNode, expected: unknown | ConditionFunction): WhenCondition;
/**
 * Symbol used to identify NotCondition objects.
 */
export declare const NOT_SYMBOL: unique symbol;
/**
 * Represents a negated condition with a path and optional expected value or function.
 * Created by the `not()` helper function.
 *
 * The condition is evaluated and then inverted:
 * - `not(path)` - true when value is falsy
 * - `not(path, value)` - true when value !== expected
 * - `not(path, fn)` - true when fn(value) returns false
 */
export interface NotCondition {
    readonly [NOT_SYMBOL]: true;
    readonly path: PathNode;
    readonly expected?: unknown | ConditionFunction;
}
/**
 * Type guard to check if a value is a NotCondition.
 *
 * @param value - The value to check
 * @returns True if value is a NotCondition
 */
export declare function isNotCondition(value: unknown): value is NotCondition;
/**
 * Creates a negated condition that checks if a path's value does not match an expected value or function.
 * This is the opposite of `when()`. While `when(path, value)` passes when value === expected,
 * `not(path, value)` passes when value !== expected.
 *
 * Can also invert a WhenCondition created by `when()` or `exists()`.
 *
 * @param pathOrCondition - The PathNode to check or a WhenCondition to invert
 * @param expected - Optional: The expected value or a function that receives the value and returns boolean
 * @returns A NotCondition object
 * @example
 * ```typescript
 * // Falsy check - hide when value is falsy
 * @hide(not(page.enabled))
 *
 * // Inequality check - hide when type is NOT TreeTable
 * @hide(not(page.type, 'TreeTable'))
 *
 * // Custom function negation - hide when function returns false
 * @hide(not(custom.settings, (s) => s?.enabled === true))
 *
 * // Invert exists() - hide when value does NOT exist
 * @hide(not(exists(tableContext.creationMode)))
 *
 * // Combined with and() - hide when BOTH conditions are met
 * @hide(and(not(page.type, 'TreeTable'), page.isEnabled))
 * ```
 */
export declare function not(pathOrCondition: PathNode | WhenCondition, expected?: unknown | ConditionFunction): NotCondition;
/**
 * Creates a condition that checks if a path's value exists (is not undefined).
 * This is a semantic shorthand for `when(path, (value) => value !== undefined)`.
 *
 * @param path - The PathNode to check for existence
 * @returns A WhenCondition that checks for defined value
 * @example
 * ```typescript
 * // Check if property exists - show message only when value is set
 * @message(
 *     and(
 *         not(tableContext.type, 'AnalyticalTable'),
 *         exists(tableContext.analyticalConfiguration.aggregationOnLeafLevel)
 *     ),
 *     msg('PROPERTY_NOT_ALLOWED')
 * )
 *
 * // Can be negated with not() - though typically just use truthy check
 * @hide(not(exists(tableContext.creationMode)))
 * ```
 */
export declare function exists(path: PathNode): WhenCondition;
/**
 * Symbol used to identify MessageConfig objects.
 */
export declare const MSG_SYMBOL: unique symbol;
/**
 * Parameter value that can be either a static value or a PathNode for dynamic resolution.
 */
export type MessageParamValue = unknown | PathNode;
/**
 * Configuration for an i18n-based message.
 * Created by the `msg()` helper function.
 */
export interface MessageConfig {
    readonly [MSG_SYMBOL]: true;
    /** The i18n translation key */
    readonly i18nKey: string;
    /** Parameters to pass to the i18n translation function. Values can be static or PathNode for dynamic resolution. */
    readonly params?: Record<string, MessageParamValue>;
    /** Whether the message can be dismissed/deleted in the UI (default: false) */
    readonly deletable: boolean;
}
/**
 * Type guard to check if a value is a MessageConfig.
 *
 * @param value - The value to check
 * @returns True if value is a MessageConfig
 */
export declare function isMessageConfig(value: unknown): value is MessageConfig;
/**
 * Creates an i18n message configuration for use with the `@message` decorator.
 *
 * @param i18nKey - The i18n translation key
 * @param params - Optional parameters to pass to the translation function.
 *   Values can be static or PathNode references for dynamic resolution.
 * @param options - Optional configuration
 * @param options.deletable - Whether the message can be dismissed/deleted in the UI (default: false)
 * @returns A MessageConfig object
 * @example
 * ```typescript
 * // Simple message
 * @message(page.betaFeature, msg('BETA_WARNING'))
 *
 * // Message with static parameters
 * @message(when(page.type, 'GridTable'), msg('TABLE_WARNING', { type: 'GridTable' }))
 *
 * // Message with dynamic parameters (resolved from context at runtime)
 * @message(condition, msg('TABLE_WARNING', { tableType: tableContext.table.type }))
 *
 * // Deletable message
 * @message(page.deprecated, msg('DEPRECATED', { since: '1.96' }, { deletable: true }))
 * ```
 */
export declare function msg(i18nKey: string, params?: Record<string, MessageParamValue>, options?: {
    deletable?: boolean;
}): MessageConfig;
/**
 * A single condition: PathNode (truthy check), WhenCondition (value check), NotCondition (negated check), or true (always)
 */
export type Condition = PathNode | WhenCondition | NotCondition | true;
/**
 * Marker interface for AND condition groups.
 * All conditions must be met for the overall condition to pass.
 */
export interface AndCondition {
    readonly __type: 'and';
    readonly conditions: ConditionInput[];
}
/**
 * Marker interface for OR condition groups.
 * At least one condition must be met for the overall condition to pass.
 */
export interface OrCondition {
    readonly __type: 'or';
    readonly conditions: ConditionInput[];
}
/**
 * Union type for condition groups.
 */
export type ConditionGroup = AndCondition | OrCondition;
/**
 * All valid inputs for conditional decorators.
 */
export type ConditionInput = Condition | ConditionGroup;
/**
 * Creates an AND condition group where ALL conditions must be met.
 *
 * @param conditions - Conditions to combine (PathNode for truthy, WhenCondition for value check)
 * @returns An AndCondition object for use with decorators
 * @example
 * ```typescript
 * // Both must be truthy
 * @hide(and(page.isALP, page.isMultiView))
 *
 * // Mixed truthy and value checks
 * @hide(and(page.isALP, when(page.type, 'GridTable')))
 *
 * // Multiple value checks
 * @hide(and(when(page.isALP, true), when(page.isMultiView, true)))
 * ```
 */
export declare function and(...conditions: ConditionInput[]): AndCondition;
/**
 * Creates an OR condition group where AT LEAST ONE condition must be met.
 *
 * @param conditions - Conditions to combine (PathNode for truthy, WhenCondition for value check)
 * @returns An OrCondition object for use with decorators
 * @example
 * ```typescript
 * // Either must be truthy
 * @hide(or(page.isALP, page.isOVP))
 *
 * // Either value must match
 * @hide(or(when(page.actionType, 'Bound'), when(page.actionType, 'Custom')))
 * ```
 */
export declare function or(...conditions: ConditionInput[]): OrCondition;
/**
 * Type guard to check if a value is an AndCondition.
 *
 * @param value - The value to check
 * @returns True if value is an AndCondition
 */
export declare function isAndCondition(value: unknown): value is AndCondition;
/**
 * Type guard to check if a value is an OrCondition.
 *
 * @param value - The value to check
 * @returns True if value is an OrCondition
 */
export declare function isOrCondition(value: unknown): value is OrCondition;
/**
 * Type guard to check if a value is a ConditionGroup (and or or).
 *
 * @param value - The value to check
 * @returns True if value is a ConditionGroup
 */
export declare function isConditionGroup(value: unknown): value is ConditionGroup;
/**
 * Type guard to check if an AND condition item is a nested OR group.
 *
 * @param item - The condition item to check
 * @returns True if item is an OrConditionGroup
 */
export declare function isOrConditionGroup(item: AndConditionItem): item is OrConditionGroup;
/**
 * Type guard to check if an OR condition item is a nested AND group.
 *
 * @param item - The condition item to check
 * @returns True if item is an AndConditionGroup
 */
export declare function isAndConditionGroup(item: OrConditionItem): item is AndConditionGroup;
/**
 * The complete decorator context type used internally.
 * Contains app, page and custom context.
 */
export type DecoratorContextType = {
    /**
     * App context - auto-injected from app.config.
     * Provides access to manifest and other app-level properties.
     */
    app?: Partial<AppContext>;
    /**
     * Page context - auto-injected from page.config.
     * Provides access to page-level properties like isALP, visualization, etc.
     */
    page?: Partial<PageContext>;
    /**
     * Custom context - provided via init().
     * Use for runtime-specific conditions like table state, section state, etc.
     */
    custom?: Record<string, unknown>;
};
export {};
//# sourceMappingURL=decorator-paths.d.ts.map