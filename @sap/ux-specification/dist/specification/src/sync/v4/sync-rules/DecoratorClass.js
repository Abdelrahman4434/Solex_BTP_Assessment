"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decorator = exports.BaseClass = exports.BaseConstruct = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const decoration_1 = require("../../common/decoration");
const i18next_1 = __importDefault(require("i18next"));
const jsonpath_plus_1 = require("jsonpath-plus");
const utils_1 = require("./utils");
/**
 * Appends a message to a schema element's message array.
 * Inlined here to avoid circular dependency issues.
 *
 * @param element - The schema element that will receive the message
 * @param message - The message content and options
 * @param message.text - The translated message text to display
 * @param message.deletable - Whether the user can dismiss the message (default: false)
 */
function addMessageToSchema(element, { text, deletable = false }) {
    if (!element[ux_specification_types_1.SchemaTag.messages]) {
        element[ux_specification_types_1.SchemaTag.messages] = [];
    }
    element[ux_specification_types_1.SchemaTag.messages].push({ text, deletable });
}
class BaseConstruct {
    /**
     * Creates the base construct with access to the app schema, app/page configuration, and logger.
     *
     * @param settings - Shared context (appSchema, app, page, logger) passed to all decorator classes
     */
    constructor(settings) {
        const { app, appSchema, page, logger } = settings || {};
        // Define properties as non-enumerable to hide them from serialization and Object.keys()
        Object.defineProperty(this, 'appSchema', {
            value: appSchema,
            writable: false,
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(this, 'app', {
            value: app,
            writable: false,
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(this, 'page', {
            value: page,
            writable: false,
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(this, 'logger', {
            value: logger,
            writable: false,
            enumerable: false,
            configurable: true
        });
    }
    /**
     * Returns the shared context (appSchema, app, page, logger) for use by subclasses or callers.
     *
     * @returns The current settings object
     */
    getSettings() {
        return {
            appSchema: this.appSchema,
            app: this.app,
            page: this.page,
            logger: this.logger
        };
    }
}
exports.BaseConstruct = BaseConstruct;
class BaseClass extends BaseConstruct {
    /**
     * Looks up the matching schema definition by class name and stores it as the base.
     *
     * @param settings - Shared context (appSchema, app, page, logger) passed to all decorator classes
     */
    constructor(settings) {
        super(settings);
        const name = this.getClassName();
        // Define base as non-enumerable to hide it from serialization and Object.keys()
        Object.defineProperty(this, 'base', {
            value: { name, definition: this.appSchema?.get().definitions?.[name] },
            writable: true,
            enumerable: false,
            configurable: true
        });
    }
    /**
     * Returns the class name used to look up the matching schema definition.
     *
     * @returns The constructor name of this class
     */
    getClassName() {
        return this.constructor.name;
    }
    /**
     * Returns the name stored at construction time for the schema definition lookup.
     *
     * @returns The base definition name
     */
    getBaseName() {
        return this.base.name;
    }
    /**
     * Returns the schema definition that decorators are applied to.
     *
     * @returns The JSON schema definition for this class
     */
    getBase() {
        return this.base.definition;
    }
    /**
     * Builds an annotation path like `/<EntityType>/@<Term>#<Qualifier>` and stores it on the schema definition.
     *
     * @param entityTypeName - The OData entity type name (e.g. "SalesOrderItem")
     * @param term - The annotation term (e.g. "com.sap.vocabularies.UI.v1.LineItem")
     * @param qualifier - Optional qualifier to disambiguate multiple annotations of the same term
     * @returns The built annotation path, or undefined if entityTypeName is empty
     */
    createAnnotationPath(entityTypeName, term, qualifier) {
        if (!entityTypeName) {
            return undefined;
        }
        let annotationPath = `/${entityTypeName}/@${term}`;
        if (qualifier) {
            annotationPath += `#${qualifier}`;
        }
        this.getBase()[ux_specification_types_1.SchemaTag.annotationPath] = annotationPath;
        return annotationPath;
    }
}
exports.BaseClass = BaseClass;
class Decorator extends BaseClass {
    /**
     * Sets up the decorator context as non-enumerable so it stays hidden from serialization.
     *
     * @param settings - Shared context (appSchema, app, page, logger) passed to all decorator classes
     */
    constructor(settings) {
        super(settings);
        // Define decoratorContext as non-enumerable to hide from serialization
        Object.defineProperty(this, 'decoratorContext', {
            value: {},
            writable: true,
            enumerable: false,
            configurable: true
        });
    }
    /**
     * Builds the decorator context from app, page, and custom values, then applies all
     * decorators (enums, message, hide, readonly) to the schema definition.
     *
     * @param customContext - Specific values (e.g. table state, section state) used for condition evaluation
     * @param definition - Override the schema definition to decorate (defaults to getBase())
     * @example
     * ```typescript
     * // Basic initialization (app and page auto-injected)
     * decorator.init();
     *
     * // With custom context for table-specific conditions
     * decorator.init({
     *     table: { type: 'GridTable', views: [] }
     * });
     *
     * // With custom definition (for dynamically created definitions)
     * decorator.init({ table: { type: 'GridTable' } }, customTableDefinition);
     * ```
     */
    init(customContext, definition) {
        this.decoratorContext = {
            app: this.app?.config,
            page: this.page?.config,
            custom: customContext
        };
        // @ToDo activate for actual use of minUI5Version.
        // const minUi5Version = this.app?.getMinUI5Version();
        this.applyDecorators(undefined, undefined, definition);
    }
    /**
     * Resolves a dotted property path (e.g. `page.isALP`, `custom.items[0].name`) against
     * the decorator context using JSONPath. The path must start with a known source prefix
     * (`app`, `page`, or `custom`).
     *
     * @param propertyPath - Dotted path with source prefix, supports full JSONPath syntax
     * @returns The resolved `{ key, value }` pair, or undefined if the path does not resolve
     * @example
     * ```typescript
     * // With decoratorContext = {
     * //   app: { manifest: { 'sap.ui5': { routing: {...} } } },
     * //   page: { isALP: true },
     * //   custom: { type: 'GridTable', items: [{ name: 'Item1' }, { name: 'Item2' }] }
     * // }
     * getPropertyKeyValue('page.isALP')                    // { key: 'isALP', value: true }
     * getPropertyKeyValue('custom.items[0]')               // { key: '0', value: { name: 'Item1' } }
     * getPropertyKeyValue('custom.items[1].name')          // { key: 'name', value: 'Item2' }
     * getPropertyKeyValue('app.manifest["sap.ui5"]')       // Access property with dot in name
     * getPropertyKeyValue('$.app.manifest["sap.ui5"].routing') // JSONPath with root reference
     * getPropertyKeyValue('$app["manifest"]["sap.ui5"]')   // Alternative JSONPath format
     * ```
     */
    getPropertyKeyValue(propertyPath) {
        if (!propertyPath || !this.decoratorContext) {
            return undefined;
        }
        try {
            // Ensure path starts with $ for JSONPath
            const jsonPath = propertyPath.startsWith('$') ? propertyPath : `$.${propertyPath}`;
            // Use JSONPath to query with resultType 'all' to get both value and metadata
            const results = (0, jsonpath_plus_1.JSONPath)({
                path: jsonPath,
                json: this.decoratorContext,
                resultType: 'all'
            });
            // JSONPath with resultType 'all' returns an array of result objects
            if (!results || results.length === 0) {
                return undefined;
            }
            // Get the first result (wrap: false behavior)
            const result = results[0];
            // parentProperty contains the last key in the path
            const key = String(result.parentProperty);
            const value = result.value;
            return { key, value };
        }
        catch {
            // If JSONPath fails, return undefined
            return undefined;
        }
    }
    /**
     * Evaluates one condition: resolves the path, applies the check (custom function,
     * equality, or truthy), and optionally negates the result (for `not()` conditions).
     *
     * @param condition - A single condition with path, expected value, and optional negate flag
     * @returns Whether the condition passed along with the resolved value and key
     */
    evaluateSingleCondition(condition) {
        // Handle special __always__ path (from @hide(true))
        if (condition.path === '__always__') {
            return { passed: true, value: true, key: '__always__' };
        }
        const result = this.getPropertyKeyValue(condition.path);
        const key = result?.key ?? condition.path;
        const value = result?.value;
        let passed = false;
        if (condition.dependsOn) {
            // Use custom condition function
            passed = condition.dependsOn(value);
        }
        else if (condition.expectedValue !== undefined) {
            // Use simple equality check
            passed = value === condition.expectedValue;
        }
        else {
            // Default: truthy check
            passed = !!value;
        }
        // Apply negation if negate flag is set (from not() helper)
        if (condition.negate) {
            passed = !passed;
        }
        return { passed, value, key };
    }
    /**
     * Translates and attaches a message to a schema property.
     * Supports both the new `MessageConfig` format (from `msg()` helper) and the legacy `DependsOnMessage` format.
     *
     * @param condition - The decorator metadata or enum value condition containing the message definition
     * @param decoratedClass - The decorated class instance, used for legacy function-based message text
     * @param definition - The schema property definition to attach the message to
     * @param i18nProperties - Context for i18n translation (propertyName, evaluation context)
     * @param i18nProperties.propertyName - The property name used as i18n parameter
     * @param i18nProperties.context - The evaluation context string used as i18n parameter
     */
    addConditionalMessage(condition, decoratedClass, definition, i18nProperties) {
        // Handle new MessageConfig format (from msg() helper)
        const metadata = condition;
        if (metadata.messageConfig && (0, decoration_1.isMessageConfig)(metadata.messageConfig)) {
            // Resolve any PathNode values in the params
            const resolvedParams = this.resolveMessageParams(metadata.messageConfig.params);
            const messageText = i18next_1.default.t(metadata.messageConfig.i18nKey, resolvedParams);
            addMessageToSchema(definition, { text: messageText, deletable: metadata.messageConfig.deletable });
            return;
        }
        // Handle legacy DependsOnMessage format
        if (!condition.message) {
            return;
        }
        let messageText;
        if (typeof condition.message.text === 'function') {
            messageText = condition.message.text(decoratedClass);
        }
        else if (typeof condition.message.text === 'string') {
            messageText = condition.message.text;
        }
        else if (condition.message.text === true) {
            // true means use default i18n translation
            messageText = i18next_1.default.t('PROPERTY_NOT_ALLOWED', { ...i18nProperties });
        }
        else {
            messageText = i18next_1.default.t('PROPERTY_NOT_ALLOWED', { ...i18nProperties });
        }
        addMessageToSchema(definition, { text: messageText, deletable: condition.message.deletable });
    }
    /**
     * Resolves any `PathNode` values in message params to their actual values from the decorator context.
     *
     * @param params - Message parameters that may contain PathNode references
     * @returns A new params object with PathNode values replaced by their resolved context values
     */
    resolveMessageParams(params) {
        if (!params) {
            return params;
        }
        const resolved = {};
        for (const [key, value] of Object.entries(params)) {
            if ((0, decoration_1.isPathNode)(value)) {
                // Resolve PathNode to actual value
                const result = this.getPropertyKeyValue((0, decoration_1.getPath)(value));
                resolved[key] = result?.value ?? '';
            }
            else {
                resolved[key] = value;
            }
        }
        return resolved;
    }
    /**
     * Builds a human-readable context string from the evaluation results that did not pass.
     * Used for diagnostic messages showing which conditions were unmet.
     *
     * @param results - The condition evaluation results to summarize
     * @returns A comma-separated string of `key: value` pairs for failed conditions
     */
    getContextForMessage(results) {
        return results
            .filter((result) => !result.passed)
            .map((result) => `${result.key}: ${result.value}`)
            .join(', ');
    }
    /**
     * Evaluates one item inside an AND group — either a single condition or a nested OR group.
     *
     * @param conditionItem - A single condition or a nested `{ __orConditions }` group
     * @returns Whether the item passed and the detailed evaluation results
     */
    evaluateAndConditionItem(conditionItem) {
        // Check if this is a nested OR group
        if ((0, decoration_1.isOrConditionGroup)(conditionItem)) {
            // Evaluate the nested OR - at least one must pass
            return this.evaluateOrConditions(conditionItem.__orConditions);
        }
        // It's a single condition
        const result = this.evaluateSingleCondition(conditionItem);
        return { passed: result.passed, results: [result] };
    }
    /**
     * Evaluates OR conditions — passes when at least one item (single condition or nested AND group) matches.
     * Short-circuits on the first passing item.
     *
     * @param orConditions - Array of conditions or nested AND groups to evaluate
     * @returns Whether any condition passed and the collected evaluation results
     */
    evaluateOrConditions(orConditions) {
        const allResults = [];
        for (const conditionItem of orConditions) {
            // Check if this is a nested AND group
            if ((0, decoration_1.isAndConditionGroup)(conditionItem)) {
                // Evaluate all conditions in the AND group - all must pass
                const andResults = [];
                let allAndPassed = true;
                for (const andItem of conditionItem.__andConditions) {
                    const { passed, results } = this.evaluateAndConditionItem(andItem);
                    andResults.push(...results);
                    if (!passed) {
                        allAndPassed = false;
                        // Don't break - we want all results for context
                    }
                }
                allResults.push(...andResults);
                if (allAndPassed) {
                    // Short-circuit: if this AND group passes, the OR passes
                    return { passed: true, results: allResults };
                }
            }
            else {
                // Single condition (symmetric with AND handling)
                const result = this.evaluateSingleCondition(conditionItem);
                allResults.push(result);
                if (result.passed) {
                    // Short-circuit: if any condition passes, the OR passes
                    return { passed: true, results: allResults };
                }
            }
        }
        return { passed: false, results: allResults };
    }
    /**
     * Evaluates AND conditions — passes only when every item (single condition or nested OR group) matches.
     * Continues even after a failure to collect all results for diagnostic context.
     *
     * @param andConditions - Array of conditions or nested OR groups that must all pass
     * @returns Whether all conditions passed and the collected evaluation results
     */
    evaluateAndConditions(andConditions) {
        const allResults = [];
        let allPassed = true;
        for (const conditionItem of andConditions) {
            const { passed, results } = this.evaluateAndConditionItem(conditionItem);
            allResults.push(...results);
            if (!passed) {
                allPassed = false;
                // Continue to collect all results for context
            }
        }
        return { passed: allPassed, results: allResults };
    }
    /**
     * Entry point for condition evaluation. Dispatches to OR, AND, or single evaluation
     * depending on the shape of the condition metadata.
     *
     * @param conditionInfo - The decorator condition metadata (single, AND, or OR)
     * @returns Whether the condition passed and a diagnostic context string
     */
    evaluateCondition(conditionInfo) {
        let passed = false;
        let context = '';
        if (conditionInfo.orConditions && Array.isArray(conditionInfo.orConditions)) {
            // OR logic: At least one condition object must match
            const result = this.evaluateOrConditions(conditionInfo.orConditions);
            passed = result.passed;
            context = this.getContextForMessage(result.results);
        }
        else if (conditionInfo.conditions && Array.isArray(conditionInfo.conditions)) {
            // Multi-condition: ALL must be met (AND logic)
            // Now supports nested OR groups via evaluateAndConditions
            const result = this.evaluateAndConditions(conditionInfo.conditions);
            passed = result.passed;
            context = this.getContextForMessage(result.results);
        }
        else if (conditionInfo.path) {
            // Single condition
            const result = this.evaluateSingleCondition(conditionInfo);
            passed = result.passed;
            context = this.getContextForMessage([result]);
        }
        return { passed, context };
    }
    /**
     * Yields each property from a schema definition for decorator processing.
     * Returns early if the definition has no properties or the target is falsy.
     *
     * @param schemaDefinition - The schema definition whose properties to iterate
     * @param target - Guard object — iteration is skipped if falsy
     * @yields Property name and its definition for each property in the schema
     */
    *iterateProperties(schemaDefinition, target) {
        if (!schemaDefinition?.properties || !target) {
            return;
        }
        for (const propertyName in schemaDefinition.properties) {
            const property = schemaDefinition.properties[propertyName];
            yield { propertyName, property };
        }
    }
    /**
     * Hides properties whose `@hide` conditions pass.
     * Multiple `@hide` decorators use OR semantics — any passing condition hides the property.
     * Skipped when the `@message` decorator already added messages to the property.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@hide` metadata
     */
    applyHideDecorator(schemaDefinition, decoratedClass) {
        for (const { propertyName, property } of this.iterateProperties(schemaDefinition, decoratedClass)) {
            const hideConditions = Reflect.getMetadata(decoration_1.metadataKeys.hide, decoratedClass, propertyName);
            if (hideConditions) {
                // Hide when ANY condition IS met (OR semantics across multiple @hide decorators)
                // But only if no messages were added by the message decorator
                const hasMessages = Array.isArray(property[ux_specification_types_1.SchemaTag.messages]) && property[ux_specification_types_1.SchemaTag.messages].length > 0;
                for (const condition of hideConditions) {
                    const { passed } = this.evaluateCondition(condition);
                    if (passed && !hasMessages) {
                        property[ux_specification_types_1.SchemaTag.hidden] = true;
                        break;
                    }
                }
            }
        }
    }
    /**
     * Shows messages on properties whose `@message` conditions pass.
     * Must run before `applyHideDecorator` so hide can detect existing messages.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@message` metadata
     */
    applyMessageDecorator(schemaDefinition, decoratedClass) {
        for (const { propertyName, property } of this.iterateProperties(schemaDefinition, decoratedClass)) {
            const messageConditions = Reflect.getMetadata(decoration_1.metadataKeys.message, decoratedClass, propertyName);
            if (messageConditions) {
                for (const condition of messageConditions) {
                    const { passed, context } = this.evaluateCondition(condition);
                    if (passed && (condition.message || condition.messageConfig)) {
                        this.addConditionalMessage(condition, decoratedClass, property, {
                            propertyName,
                            context
                        });
                    }
                }
            }
        }
    }
    /**
     * Marks properties as read-only whose `@readonly` conditions pass.
     * Multiple `@readonly` decorators use OR semantics — any passing condition makes the property read-only.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@readonly` metadata
     */
    applyReadonlyDecorator(schemaDefinition, decoratedClass) {
        for (const { propertyName, property } of this.iterateProperties(schemaDefinition, decoratedClass)) {
            const readonlyConditions = Reflect.getMetadata(decoration_1.metadataKeys.readonly, decoratedClass, propertyName);
            if (readonlyConditions) {
                // Readonly when ANY condition IS met (OR semantics across multiple @readonly decorators)
                for (const condition of readonlyConditions) {
                    const { passed } = this.evaluateCondition(condition);
                    if (passed) {
                        property.readOnly = true;
                        break;
                    }
                }
            }
        }
    }
    /**
     * Restricts enum values on properties whose `@enums` conditions pass.
     * When multiple `@enums` decorators exist on the same property, the first matching condition wins.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@enums` metadata
     */
    applyEnumsDecorator(schemaDefinition, decoratedClass) {
        for (const { propertyName, property } of this.iterateProperties(schemaDefinition, decoratedClass)) {
            const enumsConditions = Reflect.getMetadata(decoration_1.metadataKeys.enums, decoratedClass, propertyName);
            if (!enumsConditions?.length) {
                continue;
            }
            // Find first matching condition (first match wins)
            for (const condition of enumsConditions) {
                const { passed } = this.evaluateCondition(condition);
                if (passed) {
                    const currentEnumValues = this.resolveEnumFromProperty(property);
                    if (currentEnumValues) {
                        // Filter to only allowed values that exist in original enum
                        const filteredValues = condition.allowedValues.filter((v) => currentEnumValues.includes(v));
                        this.applyFilteredEnumToProperty(property, filteredValues);
                    }
                    break; // First match wins, stop processing
                }
            }
        }
    }
    /**
     * Reads the `@validity` metadata stored on a property of the decorated class.
     *
     * @param target - The decorated class instance
     * @param propertyName - The property to read validity metadata from
     * @returns The validity constraints (since, enum restrictions), or undefined if none
     */
    getValidityMetadata(target, propertyName) {
        let validityInfo;
        if (target) {
            validityInfo = Reflect.getMetadata(decoration_1.metadataKeys.validity, target, propertyName);
        }
        return validityInfo;
    }
    /**
     * Returns the enum values from a property definition, resolving `$ref` to a shared enum definition if needed.
     *
     * @param property - The schema property definition (may have inline `enum` or a `$ref`)
     * @returns The enum values array, or undefined if the property is not an enum
     */
    resolveEnumFromProperty(property) {
        // Check for inline enum
        if (property?.enum && Array.isArray(property.enum)) {
            return property.enum;
        }
        // Check for $ref to an enum definition
        if (property?.$ref) {
            const refName = property.$ref.replace('#/definitions/', '');
            const schema = this.appSchema?.get();
            const refDef = schema?.definitions?.[refName];
            if (refDef?.enum && Array.isArray(refDef.enum)) {
                return refDef.enum;
            }
        }
        return undefined;
    }
    /**
     * Writes filtered enum values to a property definition.
     * For `$ref` properties, inlines the enum, copies the type, and removes the `$ref`.
     *
     * @param property - The schema property definition to update
     * @param filteredEnum - The allowed enum values after filtering
     */
    applyFilteredEnumToProperty(property, filteredEnum) {
        if (property.$ref) {
            // For $ref properties, resolve the referenced definition to get the type
            const refName = property.$ref.replace('#/definitions/', '');
            const schema = this.appSchema?.get();
            const refDef = schema?.definitions?.[refName];
            // Copy the type from the referenced definition if it exists
            if (refDef?.type) {
                property.type = refDef.type;
            }
            // Remove the $ref and inline the filtered enum
            delete property.$ref;
            property.enum = filteredEnum;
        }
        else {
            // For inline enum properties, update directly
            property.enum = filteredEnum;
        }
    }
    /**
     * Hides properties and filters enum values that require a UI5 version higher than the app's minimum.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@validity` metadata
     * @param minUI5Version - The app's minimum UI5 version to check against
     */
    applyValidityDecorator(schemaDefinition, decoratedClass, minUI5Version) {
        if (!schemaDefinition?.properties || !decoratedClass || !minUI5Version) {
            return;
        }
        for (const propertyName in schemaDefinition.properties) {
            const property = schemaDefinition.properties[propertyName];
            const validityInfo = this.getValidityMetadata(decoratedClass, propertyName);
            // Check if property has a 'since' requirement that exceeds the app's minUI5Version
            if (validityInfo?.since && !(0, utils_1.compareUI5Versions)(minUI5Version, validityInfo.since)) {
                property[ux_specification_types_1.SchemaTag.hidden] = true;
                // possible message?
            }
            // Process enum validity configuration from @validity decorator
            // Supports both inline enums and $ref to enum definitions
            if (validityInfo?.enum) {
                const enumValues = this.resolveEnumFromProperty(property);
                if (enumValues) {
                    const filteredEnum = enumValues.filter((enumValue) => {
                        const enumValueStr = String(enumValue);
                        const condition = validityInfo.enum[enumValueStr];
                        if (!condition) {
                            return true; // Keep values without conditions
                        }
                        // Check UI5 version requirement (if specified)
                        if (condition.since && minUI5Version) {
                            if (!(0, utils_1.compareUI5Versions)(minUI5Version, condition.since)) {
                                if (condition.message) {
                                    this.addConditionalMessage(condition, decoratedClass, property, {
                                        propertyName: enumValueStr
                                    });
                                }
                                return false; // Version requirement not met
                            }
                        }
                        // Check property dependency using dependsOn function
                        if (condition.dependsOn) {
                            if (!condition.dependsOn(decoratedClass)) {
                                if (condition.message) {
                                    this.addConditionalMessage(condition, decoratedClass, property, {
                                        propertyName: enumValueStr
                                    });
                                }
                                return false; // Dependency condition not met
                            }
                        }
                        return true;
                    });
                    // Only update if enum was actually filtered
                    if (filteredEnum.length !== enumValues.length) {
                        this.applyFilteredEnumToProperty(property, filteredEnum);
                    }
                }
            }
        }
    }
    /**
     * Marks the schema definition as a view node if the `@isViewNode` decorator is present on the target.
     *
     * @param schemaDefinition - The schema definition to tag
     * @param target - The class constructor or prototype carrying the decorator
     * @param propertyName - Optional property name for property-level decorators
     */
    applyIsViewNodeDecorator(schemaDefinition, target, propertyName) {
        const isViewNode = Reflect.getMetadata(decoration_1.metadataKeys.isViewNode, target, propertyName);
        if (isViewNode !== undefined) {
            schemaDefinition[ux_specification_types_1.SchemaTag.isViewNode] = isViewNode;
            schemaDefinition.properties = schemaDefinition.properties || {};
        }
    }
    /**
     * Sets the schema `description` field from the `@description` decorator if present on the target.
     *
     * @param schemaDefinition - The schema definition to update
     * @param target - The class constructor or prototype carrying the decorator
     * @param propertyName - Optional property name for property-level decorators
     */
    applyDescriptionDecorator(schemaDefinition, target, propertyName) {
        const description = Reflect.getMetadata(decoration_1.metadataKeys.description, target, propertyName);
        if (description !== undefined) {
            schemaDefinition.description = description;
        }
    }
    /**
     * Applies all decorators to the schema in the correct order:
     * description → isViewNode → validity → enums → message → hide → readonly.
     * Message runs before hide so that hide can skip properties that already have messages.
     *
     * @param minUi5Version - The app's minimum UI5 version for validity checks
     * @param propertyName - Optional property name when decorating a single property
     * @param customDefinition - Override the schema definition (defaults to `getBase()`)
     * @returns The decorated schema definition
     */
    applyDecorators(minUi5Version, propertyName, customDefinition) {
        const definition = customDefinition ?? this.getBase();
        if (!definition) {
            return;
        }
        const target = propertyName ? this : this.constructor;
        // Apply description decorator
        this.applyDescriptionDecorator(definition, target, propertyName);
        // Apply isViewNode decorator
        this.applyIsViewNodeDecorator(definition, target, propertyName);
        // Apply validity decorator (for properties)
        this.applyValidityDecorator(definition, this, minUi5Version);
        // Apply enums decorator - filter enum values based on conditions
        this.applyEnumsDecorator(definition, this);
        // Apply message decorator - show messages based on conditions
        // NOTE: Message decorator must run before hide decorator so hide can check for messages
        this.applyMessageDecorator(definition, this);
        // Apply hide decorator - hide properties based on conditions
        // NOTE: Only hides if message decorator did not add any messages
        this.applyHideDecorator(definition, this);
        // Apply readonly decorator - mark properties as readonly based on conditions
        this.applyReadonlyDecorator(definition, this);
        return { definition };
    }
}
exports.Decorator = Decorator;
//# sourceMappingURL=DecoratorClass.js.map