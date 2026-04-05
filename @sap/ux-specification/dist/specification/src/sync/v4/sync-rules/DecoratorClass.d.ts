import type { Definition } from 'typescript-json-schema';
import type { ExtensionLogger } from '@sap/ux-specification-types';
import type { App } from './App';
import type { Page } from './Page';
import type { AppSchema } from './AppSchema';
export type GeneralSettings<PageWithConfig extends Page = Page> = {
    appSchema: AppSchema;
    app: App;
    page: PageWithConfig;
    logger?: ExtensionLogger;
};
export declare class BaseConstruct {
    protected readonly appSchema: AppSchema;
    protected readonly app: App;
    protected readonly page: Page;
    protected readonly logger?: ExtensionLogger;
    /**
     * Creates the base construct with access to the app schema, app/page configuration, and logger.
     *
     * @param settings - Shared context (appSchema, app, page, logger) passed to all decorator classes
     */
    constructor(settings?: GeneralSettings);
    /**
     * Returns the shared context (appSchema, app, page, logger) for use by subclasses or callers.
     *
     * @returns The current settings object
     */
    getSettings(): GeneralSettings;
}
export interface Base {
    name: string;
    definition: Definition;
}
export declare class BaseClass extends BaseConstruct {
    private readonly base;
    /**
     * Looks up the matching schema definition by class name and stores it as the base.
     *
     * @param settings - Shared context (appSchema, app, page, logger) passed to all decorator classes
     */
    constructor(settings?: GeneralSettings);
    /**
     * Returns the class name used to look up the matching schema definition.
     *
     * @returns The constructor name of this class
     */
    getClassName(): string;
    /**
     * Returns the name stored at construction time for the schema definition lookup.
     *
     * @returns The base definition name
     */
    getBaseName(): string;
    /**
     * Returns the schema definition that decorators are applied to.
     *
     * @returns The JSON schema definition for this class
     */
    getBase(): Definition;
    /**
     * Builds an annotation path like `/<EntityType>/@<Term>#<Qualifier>` and stores it on the schema definition.
     *
     * @param entityTypeName - The OData entity type name (e.g. "SalesOrderItem")
     * @param term - The annotation term (e.g. "com.sap.vocabularies.UI.v1.LineItem")
     * @param qualifier - Optional qualifier to disambiguate multiple annotations of the same term
     * @returns The built annotation path, or undefined if entityTypeName is empty
     */
    createAnnotationPath(entityTypeName: string, term: string, qualifier?: string): string | undefined;
}
export declare class Decorator extends BaseClass {
    /**
     * Evaluation context built from app config, page config, and optional custom values.
     * Non-enumerable to stay hidden from serialization.
     */
    private decoratorContext;
    /**
     * Sets up the decorator context as non-enumerable so it stays hidden from serialization.
     *
     * @param settings - Shared context (appSchema, app, page, logger) passed to all decorator classes
     */
    constructor(settings?: GeneralSettings);
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
    init(customContext?: Record<string, unknown>, definition?: Definition): void;
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
    private getPropertyKeyValue;
    /**
     * Evaluates one condition: resolves the path, applies the check (custom function,
     * equality, or truthy), and optionally negates the result (for `not()` conditions).
     *
     * @param condition - A single condition with path, expected value, and optional negate flag
     * @returns Whether the condition passed along with the resolved value and key
     */
    private evaluateSingleCondition;
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
    private addConditionalMessage;
    /**
     * Resolves any `PathNode` values in message params to their actual values from the decorator context.
     *
     * @param params - Message parameters that may contain PathNode references
     * @returns A new params object with PathNode values replaced by their resolved context values
     */
    private resolveMessageParams;
    /**
     * Builds a human-readable context string from the evaluation results that did not pass.
     * Used for diagnostic messages showing which conditions were unmet.
     *
     * @param results - The condition evaluation results to summarize
     * @returns A comma-separated string of `key: value` pairs for failed conditions
     */
    private getContextForMessage;
    /**
     * Evaluates one item inside an AND group — either a single condition or a nested OR group.
     *
     * @param conditionItem - A single condition or a nested `{ __orConditions }` group
     * @returns Whether the item passed and the detailed evaluation results
     */
    private evaluateAndConditionItem;
    /**
     * Evaluates OR conditions — passes when at least one item (single condition or nested AND group) matches.
     * Short-circuits on the first passing item.
     *
     * @param orConditions - Array of conditions or nested AND groups to evaluate
     * @returns Whether any condition passed and the collected evaluation results
     */
    private evaluateOrConditions;
    /**
     * Evaluates AND conditions — passes only when every item (single condition or nested OR group) matches.
     * Continues even after a failure to collect all results for diagnostic context.
     *
     * @param andConditions - Array of conditions or nested OR groups that must all pass
     * @returns Whether all conditions passed and the collected evaluation results
     */
    private evaluateAndConditions;
    /**
     * Entry point for condition evaluation. Dispatches to OR, AND, or single evaluation
     * depending on the shape of the condition metadata.
     *
     * @param conditionInfo - The decorator condition metadata (single, AND, or OR)
     * @returns Whether the condition passed and a diagnostic context string
     */
    private evaluateCondition;
    /**
     * Yields each property from a schema definition for decorator processing.
     * Returns early if the definition has no properties or the target is falsy.
     *
     * @param schemaDefinition - The schema definition whose properties to iterate
     * @param target - Guard object — iteration is skipped if falsy
     * @yields Property name and its definition for each property in the schema
     */
    private iterateProperties;
    /**
     * Hides properties whose `@hide` conditions pass.
     * Multiple `@hide` decorators use OR semantics — any passing condition hides the property.
     * Skipped when the `@message` decorator already added messages to the property.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@hide` metadata
     */
    private applyHideDecorator;
    /**
     * Shows messages on properties whose `@message` conditions pass.
     * Must run before `applyHideDecorator` so hide can detect existing messages.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@message` metadata
     */
    private applyMessageDecorator;
    /**
     * Marks properties as read-only whose `@readonly` conditions pass.
     * Multiple `@readonly` decorators use OR semantics — any passing condition makes the property read-only.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@readonly` metadata
     */
    private applyReadonlyDecorator;
    /**
     * Restricts enum values on properties whose `@enums` conditions pass.
     * When multiple `@enums` decorators exist on the same property, the first matching condition wins.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@enums` metadata
     */
    private applyEnumsDecorator;
    /**
     * Reads the `@validity` metadata stored on a property of the decorated class.
     *
     * @param target - The decorated class instance
     * @param propertyName - The property to read validity metadata from
     * @returns The validity constraints (since, enum restrictions), or undefined if none
     */
    private getValidityMetadata;
    /**
     * Returns the enum values from a property definition, resolving `$ref` to a shared enum definition if needed.
     *
     * @param property - The schema property definition (may have inline `enum` or a `$ref`)
     * @returns The enum values array, or undefined if the property is not an enum
     */
    private resolveEnumFromProperty;
    /**
     * Writes filtered enum values to a property definition.
     * For `$ref` properties, inlines the enum, copies the type, and removes the `$ref`.
     *
     * @param property - The schema property definition to update
     * @param filteredEnum - The allowed enum values after filtering
     */
    private applyFilteredEnumToProperty;
    /**
     * Hides properties and filters enum values that require a UI5 version higher than the app's minimum.
     *
     * @param schemaDefinition - The schema definition to process
     * @param decoratedClass - The decorated class instance carrying `@validity` metadata
     * @param minUI5Version - The app's minimum UI5 version to check against
     */
    private applyValidityDecorator;
    /**
     * Marks the schema definition as a view node if the `@isViewNode` decorator is present on the target.
     *
     * @param schemaDefinition - The schema definition to tag
     * @param target - The class constructor or prototype carrying the decorator
     * @param propertyName - Optional property name for property-level decorators
     */
    private applyIsViewNodeDecorator;
    /**
     * Sets the schema `description` field from the `@description` decorator if present on the target.
     *
     * @param schemaDefinition - The schema definition to update
     * @param target - The class constructor or prototype carrying the decorator
     * @param propertyName - Optional property name for property-level decorators
     */
    private applyDescriptionDecorator;
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
    applyDecorators(minUi5Version?: string, propertyName?: string, customDefinition?: Definition): {
        definition: Definition;
    };
}
//# sourceMappingURL=DecoratorClass.d.ts.map