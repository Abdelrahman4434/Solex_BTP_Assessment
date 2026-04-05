import type { Definition } from 'typescript-json-schema';
import type { ExtensionLogger, v4, RuleName } from '@sap/ux-specification-types';
export interface RuleContext {
    page?: v4.SapUiAppPageV4;
    schema?: Definition;
    logger?: ExtensionLogger;
    parameters?: Record<string, unknown>;
}
/**
 * Named schema rule that can check applicability and adapt the schema.
 */
export interface NamedRule {
    name: RuleName;
    /**
     * Determines whether the rule should be executed for the current context.
     *
     * @param {RuleContext} context - The context against which the match is evaluated.
     * @returns {boolean} True if the context meets the required conditions; otherwise, false.
     */
    match(context: RuleContext): boolean;
    /**
     * Performs the schema adaptation.
     *
     * @param {RuleContext} context - The context object containing the details and state required for processing.
     */
    process(context: RuleContext): void;
}
/**
 * Registry for schema processing rules.
 * Stores and resolves rules by name for later execution by the processor.
 *
 * @deprecated Use decorator-based approach instead of registering rules.
 */
declare class ManifestDrivenRuleRegistry {
    private rules;
    /**
     * Registers a new rule by adding it to the collection of rules.
     *
     * @param {NamedRule} rule - The rule to register, including its name and associated functionality.
     */
    register(rule: NamedRule): void;
    /**
     * Retrieves a named rule from the collection of rules.
     *
     * @param {RuleName} name - The name of the rule to retrieve.
     * @returns {NamedRule | undefined} The corresponding named rule if it exists, or undefined if it does not.
     */
    get(name: RuleName): NamedRule | undefined;
}
/**
 * Applies schema adaptation rules driven by manifest settings.
 * Given a rule name, page context, and schema, it executes the matching rule(s)
 * and mutates the schema accordingly.
 *
 * @deprecated This processor is being replaced by decorator-based schema modifications.
 * Use @hide, @message, and @enums decorators on definition classes instead.
 * @see Table and TableCreationModeLR classes for examples of the new approach.
 */
declare class ManifestDrivenSchemaProcessor {
    private registry;
    /**
     * Constructs an instance of the class.
     *
     * @param {ManifestDrivenRuleRegistry} registry - The registry containing the manifest-driven rules.
     */
    constructor(registry: ManifestDrivenRuleRegistry);
    /**
     * Applies a specific rule from the registry to the given context.
     *
     * @param {RuleName} ruleName - The name of the rule to be applied.
     * @param {RuleContext} context - The context in which the rule will be processed.
     * @deprecated Use decorator-based approach instead.
     */
    apply(ruleName: RuleName, context: RuleContext): void;
}
export declare const manifestDrivenSchemaProcessor: ManifestDrivenSchemaProcessor;
export {};
//# sourceMappingURL=ManifestDrivenSchemaProcessor.d.ts.map