"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MSG_SYMBOL = exports.NOT_SYMBOL = exports.WHEN_SYMBOL = exports.tableContext = exports.custom = exports.page = exports.app = exports.PATH_SYMBOL = void 0;
exports.getPath = getPath;
exports.isPathNode = isPathNode;
exports.isWhenCondition = isWhenCondition;
exports.when = when;
exports.isNotCondition = isNotCondition;
exports.not = not;
exports.exists = exists;
exports.isMessageConfig = isMessageConfig;
exports.msg = msg;
exports.and = and;
exports.or = or;
exports.isAndCondition = isAndCondition;
exports.isOrCondition = isOrCondition;
exports.isConditionGroup = isConditionGroup;
exports.isOrConditionGroup = isOrConditionGroup;
exports.isAndConditionGroup = isAndConditionGroup;
// ============================================
// PATH NODE INFRASTRUCTURE
// ============================================
/**
 * Symbol used to store the path string within PathNode objects.
 * This allows the decorator to extract the path at runtime.
 *
 * Using Symbol.for() creates a global symbol that persists across module loads,
 * ensuring isPathNode() works correctly even when the module is loaded multiple times.
 */
exports.PATH_SYMBOL = Symbol.for('decorator:pathNode');
/**
 * Creates a type-safe path builder for a given context shape.
 * Uses JavaScript Proxy to dynamically build paths with full TypeScript support.
 *
 * @template T - The shape type defining available properties
 * @param prefix - The root prefix for all paths (e.g., 'app', 'page', 'custom')
 * @returns A proxy object that builds typed paths
 * @example
 * ```typescript
 * type MyShape = { enabled: boolean; settings: { mode: string } };
 * const my = createPathBuilder<MyShape>('my');
 *
 * my.enabled[PATH_SYMBOL]           // 'my.enabled'
 * my.settings.mode[PATH_SYMBOL]     // 'my.settings.mode'
 * ```
 */
function createPathBuilder(prefix) {
    const handler = {
        get(_, prop) {
            if (prop === exports.PATH_SYMBOL) {
                return prefix;
            }
            if (typeof prop === 'string') {
                return createPathBuilder(`${prefix}.${prop}`);
            }
            return undefined;
        },
        // Add 'has' trap to make 'in' operator work with PathNode check
        has(_, prop) {
            return prop === exports.PATH_SYMBOL;
        }
    };
    return new Proxy({}, handler);
}
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
function getPath(node) {
    return node[exports.PATH_SYMBOL];
}
/**
 * Type guard to check if a value is a PathNode.
 *
 * @param value - The value to check
 * @returns True if the value is a PathNode
 */
function isPathNode(value) {
    return typeof value === 'object' && value !== null && exports.PATH_SYMBOL in value;
}
// ============================================
// PATH BUILDER EXPORTS
// ============================================
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
exports.app = createPathBuilder('app');
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
exports.page = createPathBuilder('page');
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
exports.custom = createPathBuilder('custom');
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
exports.tableContext = createPathBuilder('custom');
// ============================================
// WHEN CONDITION HELPER
// ============================================
/**
 * Symbol used to identify WhenCondition objects.
 */
exports.WHEN_SYMBOL = Symbol.for('decorator:when');
/**
 * Type guard to check if a value is a WhenCondition.
 *
 * @param value - The value to check
 * @returns True if value is a WhenCondition
 */
function isWhenCondition(value) {
    return typeof value === 'object' && value !== null && exports.WHEN_SYMBOL in value;
}
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
function when(path, expected) {
    return {
        [exports.WHEN_SYMBOL]: true,
        path,
        expected
    };
}
// ============================================
// NOT CONDITION HELPER
// ============================================
/**
 * Symbol used to identify NotCondition objects.
 */
exports.NOT_SYMBOL = Symbol.for('decorator:not');
/**
 * Type guard to check if a value is a NotCondition.
 *
 * @param value - The value to check
 * @returns True if value is a NotCondition
 */
function isNotCondition(value) {
    return typeof value === 'object' && value !== null && exports.NOT_SYMBOL in value;
}
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
function not(pathOrCondition, expected) {
    // If first argument is a WhenCondition, extract its path and expected WITHOUT inverting
    // The negate flag will handle inversion later in conditionToSingle
    if (isWhenCondition(pathOrCondition)) {
        const condition = pathOrCondition;
        return {
            [exports.NOT_SYMBOL]: true,
            path: condition.path,
            expected: condition.expected // Pass through without inversion - negate flag handles it
        };
    }
    // Normal case: path + optional expected
    return {
        [exports.NOT_SYMBOL]: true,
        path: pathOrCondition,
        expected
    };
}
// ============================================
// EXISTS HELPER
// ============================================
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
function exists(path) {
    return when(path, (value) => value !== undefined);
}
// ============================================
// MESSAGE HELPER
// ============================================
/**
 * Symbol used to identify MessageConfig objects.
 */
exports.MSG_SYMBOL = Symbol.for('decorator:msg');
/**
 * Type guard to check if a value is a MessageConfig.
 *
 * @param value - The value to check
 * @returns True if value is a MessageConfig
 */
function isMessageConfig(value) {
    return typeof value === 'object' && value !== null && exports.MSG_SYMBOL in value;
}
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
function msg(i18nKey, params, options) {
    return {
        [exports.MSG_SYMBOL]: true,
        i18nKey,
        params,
        deletable: options?.deletable ?? false
    };
}
// ============================================
// CONDITION HELPER FUNCTIONS
// ============================================
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
function and(...conditions) {
    return {
        __type: 'and',
        conditions
    };
}
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
function or(...conditions) {
    return {
        __type: 'or',
        conditions
    };
}
/**
 * Type guard to check if a value is an AndCondition.
 *
 * @param value - The value to check
 * @returns True if value is an AndCondition
 */
function isAndCondition(value) {
    return typeof value === 'object' && value !== null && value.__type === 'and';
}
/**
 * Type guard to check if a value is an OrCondition.
 *
 * @param value - The value to check
 * @returns True if value is an OrCondition
 */
function isOrCondition(value) {
    return typeof value === 'object' && value !== null && value.__type === 'or';
}
/**
 * Type guard to check if a value is a ConditionGroup (and or or).
 *
 * @param value - The value to check
 * @returns True if value is a ConditionGroup
 */
function isConditionGroup(value) {
    return isAndCondition(value) || isOrCondition(value);
}
// ============================================
// NESTED CONDITION TYPE GUARDS
// ============================================
/**
 * Type guard to check if an AND condition item is a nested OR group.
 *
 * @param item - The condition item to check
 * @returns True if item is an OrConditionGroup
 */
function isOrConditionGroup(item) {
    return item !== null && typeof item === 'object' && '__orConditions' in item;
}
/**
 * Type guard to check if an OR condition item is a nested AND group.
 *
 * @param item - The condition item to check
 * @returns True if item is an AndConditionGroup
 */
function isAndConditionGroup(item) {
    return item !== null && typeof item === 'object' && '__andConditions' in item;
}
//# sourceMappingURL=decorator-paths.js.map