"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifestDrivenSchemaProcessor = void 0;
/**
 * Registry for schema processing rules.
 * Stores and resolves rules by name for later execution by the processor.
 *
 * @deprecated Use decorator-based approach instead of registering rules.
 */
class ManifestDrivenRuleRegistry {
    constructor() {
        this.rules = new Map();
    }
    /**
     * Registers a new rule by adding it to the collection of rules.
     *
     * @param {NamedRule} rule - The rule to register, including its name and associated functionality.
     */
    register(rule) {
        this.rules.set(rule.name, rule);
    }
    /**
     * Retrieves a named rule from the collection of rules.
     *
     * @param {RuleName} name - The name of the rule to retrieve.
     * @returns {NamedRule | undefined} The corresponding named rule if it exists, or undefined if it does not.
     */
    get(name) {
        return this.rules.get(name);
    }
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
class ManifestDrivenSchemaProcessor {
    /**
     * Constructs an instance of the class.
     *
     * @param {ManifestDrivenRuleRegistry} registry - The registry containing the manifest-driven rules.
     */
    constructor(registry) {
        this.registry = registry;
    }
    /**
     * Applies a specific rule from the registry to the given context.
     *
     * @param {RuleName} ruleName - The name of the rule to be applied.
     * @param {RuleContext} context - The context in which the rule will be processed.
     * @deprecated Use decorator-based approach instead.
     */
    apply(ruleName, context) {
        const rule = this.registry.get(ruleName);
        if (!rule) {
            return;
        }
        if (rule.match(context)) {
            rule.process(context);
        }
    }
}
const registry = new ManifestDrivenRuleRegistry();
// Note: List Report table rules have been migrated to decorator-based approach.
// See Table and TableCreationModeLR classes in src/sync/v4/export/controls/Table.ts
exports.manifestDrivenSchemaProcessor = new ManifestDrivenSchemaProcessor(registry);
//# sourceMappingURL=ManifestDrivenSchemaProcessor.js.map