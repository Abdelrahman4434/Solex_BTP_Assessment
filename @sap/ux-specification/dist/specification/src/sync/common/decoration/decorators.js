"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validity = exports.getDescriptionSrcURL = exports.descriptionSrcURL = exports.descriptionUrlMetadataKey = exports.getPageLayoutInformation = exports.getChildId = exports.childId = exports.pageLayoutInformation = exports.syncRule = exports.metadataKeys = void 0;
exports.getReflectMetadata = getReflectMetadata;
exports.getReflectTypeMetadata = getReflectTypeMetadata;
exports.getValidityMetadata = getValidityMetadata;
exports.isViewNode = isViewNode;
exports.description = description;
exports.hide = hide;
exports.message = message;
exports.readonly = readonly;
exports.enums = enums;
exports.getTextForDeprecated = getTextForDeprecated;
require("reflect-metadata");
const decorator_paths_1 = require("./decorator-paths");
// ============================================
// METADATA KEYS
// ============================================
/**
 * Metadata keys for schema post-processing.
 * Used by decorators to store metadata that is processed during schema generation.
 */
exports.metadataKeys = {
    description: Symbol('ui:description'),
    isViewNode: Symbol('ui:isViewNode'),
    syncRule: Symbol('sync:rule'),
    validity: Symbol('generate:validity'),
    hide: Symbol('generate:hide'),
    message: Symbol('generate:message'),
    readonly: Symbol('generate:readonly'),
    enums: Symbol('generate:enums')
};
/**
 * Appends a decorator condition entry to the metadata array stored on a property.
 *
 * @param key - The metadata key identifying the decorator type (hide, message, readonly, enums)
 * @param instance - The class instance that owns the decorated property
 * @param propertyKey - The name of the decorated property
 * @param entry - The parsed condition to append
 */
function appendCondition(key, instance, propertyKey, entry) {
    const existing = Reflect.getMetadata(key, instance, propertyKey) || [];
    existing.push(entry);
    Reflect.defineMetadata(key, existing, instance, propertyKey);
}
// ============================================
// SYNC RULE DECORATORS
// ============================================
const syncRule = (propSpec) => {
    return Reflect.metadata(exports.metadataKeys.syncRule, propSpec);
};
exports.syncRule = syncRule;
/**
 * Retrieves the metadata associated with a specific property of a target object.
 *
 * @param target - The object containing the property.
 * @param propertyName - The name of the property whose metadata is to be retrieved.
 * @returns The metadata of the property, or undefined if no metadata is found.
 */
function getReflectMetadata(target, propertyName) {
    let rule;
    if (target) {
        rule = Reflect.getMetadata(exports.metadataKeys.syncRule, target, propertyName);
    }
    return rule;
}
/**
 * Return the sync rule a given class has been decorated with.
 *
 * @param cls - The constructor of the class that provides the sync rule
 * @returns the sync rule (if it exists)
 */
function getReflectTypeMetadata(cls) {
    let rule;
    if (cls) {
        rule = Reflect.getMetadata(exports.metadataKeys.syncRule, cls);
    }
    return rule;
}
// ============================================
// PAGE LAYOUT DECORATORS
// ============================================
const pageLayoutInformation = (pageInfo) => (constructor) => {
    constructor.prototype.pageLayoutInformation = pageInfo;
};
exports.pageLayoutInformation = pageLayoutInformation;
const childIdKey = Symbol('childId');
const childId = (id) => {
    return Reflect.metadata(childIdKey, id);
};
exports.childId = childId;
const getChildId = (target, propertyName) => {
    return Reflect.getMetadata(childIdKey, target, propertyName);
};
exports.getChildId = getChildId;
const getPageLayoutInformation = (target) => {
    return Object.getPrototypeOf(target).pageLayoutInformation;
};
exports.getPageLayoutInformation = getPageLayoutInformation;
// ============================================
// DESCRIPTION URL DECORATOR
// ============================================
exports.descriptionUrlMetadataKey = Symbol('descriptionSrcURL');
const descriptionSrcURL = (id) => {
    return Reflect.metadata(exports.descriptionUrlMetadataKey, id);
};
exports.descriptionSrcURL = descriptionSrcURL;
const getDescriptionSrcURL = (target, propertyName) => {
    return Reflect.getMetadata(exports.descriptionUrlMetadataKey, target, propertyName);
};
exports.getDescriptionSrcURL = getDescriptionSrcURL;
// ============================================
// VALIDITY DECORATOR
// ============================================
const validity = (validity) => {
    return Reflect.metadata(exports.metadataKeys.validity, validity);
};
exports.validity = validity;
/**
 * Retrieves the validity metadata associated with a specific property of a target object.
 *
 * @param target - The object containing the property.
 * @param propertyName - The name of the property whose validity metadata is to be retrieved.
 * @returns The validity information of the property, or undefined if no metadata is found.
 */
function getValidityMetadata(target, propertyName) {
    let validityInfo;
    if (target) {
        validityInfo = Reflect.getMetadata(exports.metadataKeys.validity, target, propertyName);
    }
    return validityInfo;
}
// ============================================
// VIEW NODE DECORATOR
// ============================================
/**
 * Mark the target class with a metadata flag indicating it is a view node.
 *
 * @param target - The constructor of the class to be marked as a view node
 */
function isViewNode(target) {
    Reflect.defineMetadata(exports.metadataKeys.isViewNode, true, target);
}
// ============================================
// DESCRIPTION DECORATOR
// ============================================
/**
 * Decorator to add a description to a class or property in the schema.
 *
 * @param text - The description text
 * @returns ClassDecorator
 */
function description(text) {
    return function (target) {
        Reflect.defineMetadata(exports.metadataKeys.description, text, target);
    };
}
// ============================================
// CONDITION PARSING
// ============================================
/**
 * Parses a path string to extract the source prefix (app, page, custom).
 * Used to determine which context source to look up values from.
 *
 * @param path - The path string to parse (e.g., 'app.manifest', 'page.isALP', 'custom.table.type')
 * @returns An object with source and the full path
 */
function parsePathWithSource(path) {
    if (path.startsWith('app.')) {
        return { source: 'app', path };
    }
    if (path.startsWith('page.')) {
        return { source: 'page', path };
    }
    if (path.startsWith('custom.')) {
        return { source: 'custom', path };
    }
    // Return path without source - this will not resolve since a recognized prefix is required
    return { path };
}
/**
 * Converts a single Condition (PathNode, WhenCondition, NotCondition, or true) into a SingleDependsOnCondition.
 *
 * @param condition - The condition to convert
 * @returns A SingleDependsOnCondition object
 */
function conditionToSingle(condition) {
    if (condition === true) {
        // Always true condition - use a path that will resolve to truthy
        return { path: '__always__', expectedValue: true };
    }
    if ((0, decorator_paths_1.isWhenCondition)(condition)) {
        const fullPath = (0, decorator_paths_1.getPath)(condition.path);
        const parsed = parsePathWithSource(fullPath);
        const result = {
            path: fullPath,
            source: parsed.source
        };
        if (typeof condition.expected === 'function') {
            result.dependsOn = condition.expected;
        }
        else {
            result.expectedValue = condition.expected;
        }
        return result;
    }
    if ((0, decorator_paths_1.isNotCondition)(condition)) {
        const fullPath = (0, decorator_paths_1.getPath)(condition.path);
        const parsed = parsePathWithSource(fullPath);
        const result = {
            path: fullPath,
            source: parsed.source,
            negate: true // Set the negate flag for NotCondition
        };
        if (condition.expected !== undefined) {
            if (typeof condition.expected === 'function') {
                result.dependsOn = condition.expected;
            }
            else {
                result.expectedValue = condition.expected;
            }
        }
        // If no expected value, it will be a truthy check that gets negated (i.e., falsy check)
        return result;
    }
    if ((0, decorator_paths_1.isPathNode)(condition)) {
        const fullPath = (0, decorator_paths_1.getPath)(condition);
        const parsed = parsePathWithSource(fullPath);
        return {
            path: fullPath,
            source: parsed.source
            // No expectedValue = truthy check
        };
    }
    // Fallback (should not happen with proper typing)
    return { path: String(condition) };
}
/**
 * Parses a condition input into a normalized depends on condition object.
 *
 * This ensures consistent behavior across hide, message, and readonly decorators.
 *
 * Supports:
 * - `true` - Always true (e.g., `@hide(true)` to always hide)
 * - PathNode - Truthy check (e.g., `@hide(page.isALP)`)
 * - WhenCondition - Value or function check (e.g., `@hide(when(page.type, 'GridTable'))`)
 * - AndCondition - All conditions must be met
 * - OrCondition - At least one condition must be met.
 *
 * @param condition - The condition to parse.
 * @returns A normalized DependsOnCondition object.
 */
function parseCondition(condition) {
    // Handle `true` - always true
    if (condition === true) {
        return {
            path: '__always__',
            expectedValue: true
        };
    }
    // Handle WhenCondition from when() helper
    if ((0, decorator_paths_1.isWhenCondition)(condition)) {
        return conditionToSingle(condition);
    }
    // Handle NotCondition from not() helper
    if ((0, decorator_paths_1.isNotCondition)(condition)) {
        return conditionToSingle(condition);
    }
    // Handle PathNode (truthy check)
    if ((0, decorator_paths_1.isPathNode)(condition)) {
        return conditionToSingle(condition);
    }
    // Handle ConditionGroup from and()/or() helpers
    if ((0, decorator_paths_1.isConditionGroup)(condition)) {
        if ((0, decorator_paths_1.isAndCondition)(condition)) {
            // AND logic: Convert to conditions array (MultiDependsOnCondition)
            // Supports both simple conditions and nested OR groups
            const conditions = condition.conditions.map((c) => {
                const parsed = parseCondition(c);
                // Check if this is a nested OR condition (has orConditions array)
                if ('orConditions' in parsed && Array.isArray(parsed.orConditions)) {
                    // Return as OrConditionGroup for nested OR within AND
                    return { __orConditions: parsed.orConditions };
                }
                // Return as SingleDependsOnCondition
                return parsed;
            });
            return { conditions };
        }
        else if ((0, decorator_paths_1.isOrCondition)(condition)) {
            // OR logic: Convert to orConditions array
            // Supports both simple conditions and nested AND groups
            const orConditions = condition.conditions.map((c) => {
                const parsed = parseCondition(c);
                // Check if this is a nested AND condition (has conditions array)
                if ('conditions' in parsed && Array.isArray(parsed.conditions)) {
                    // Return as AndConditionGroup for nested AND within OR
                    return { __andConditions: parsed.conditions };
                }
                // Return as SingleDependsOnCondition (symmetric with AND handling)
                return parsed;
            });
            return { orConditions };
        }
    }
    // Fallback - should not reach here with proper typing
    return { path: '__unknown__' };
}
// ============================================
// HIDE DECORATOR
// ============================================
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
function hide(condition) {
    return (instance, propertyKey) => appendCondition(exports.metadataKeys.hide, instance, propertyKey, parseCondition(condition));
}
// ============================================
// MESSAGE DECORATOR
// ============================================
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
function message(condition, messageConfig) {
    return (instance, propertyKey) => {
        const info = parseCondition(condition);
        info.messageConfig = messageConfig;
        appendCondition(exports.metadataKeys.message, instance, propertyKey, info);
    };
}
// ============================================
// READONLY DECORATOR
// ============================================
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
function readonly(condition) {
    return (instance, propertyKey) => appendCondition(exports.metadataKeys.readonly, instance, propertyKey, parseCondition(condition));
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
function enums(condition, allowedValues) {
    return (instance, propertyKey) => appendCondition(exports.metadataKeys.enums, instance, propertyKey, { ...parseCondition(condition), allowedValues });
}
// ============================================
// DEPRECATION HELPER
// ============================================
/**
 * Generates a deprecation message for a given key, optionally including additional validity information.
 *
 * @param key - The key or property name that is deprecated.
 * @param validityInformation - Optional validity information providing details about the deprecation.
 * @returns A string containing the deprecation message.
 */
function getTextForDeprecated(key, validityInformation) {
    let text = `${key} is deprecated`;
    if (validityInformation && validityInformation.deprecated) {
        text = validityInformation.deprecated.since ? `${text} since ${validityInformation.deprecated.since}` : text;
        text = validityInformation.deprecated.text ? `${text}. ${validityInformation.deprecated.text}` : text;
    }
    return text;
}
//# sourceMappingURL=decorators.js.map