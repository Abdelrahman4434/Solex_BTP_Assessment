"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregationValidator = void 0;
const types_1 = require("./types");
const i18next_1 = __importDefault(require("i18next"));
const utils_1 = require("./utils");
/**
 * Represents validator for aggregations.
 */
class AggregationValidator {
    /**
     * Method validates states of properties and aggregation. Following states are supported:
     * 1. Valid.
     * 2. Invalid - when value is set for property/aggregation, but it is not valid.
     * 3. Skipped - when property/aggregation is not relevant in current value context and value does not set.
     *
     * @param aggregation ObjectAggregation which state should be validated.
     * @param data Page data.
     */
    validate(aggregation, data) {
        if (aggregation.state === types_1.ValidationState.Valid && aggregation.variants.length >= 1) {
            const properties = this.validateVariants(aggregation.variants, aggregation);
            for (const property in properties) {
                const entry = aggregation.properties[property] || aggregation.aggregations[property];
                if (entry) {
                    entry.state = properties[property];
                    if (entry.state === types_1.ValidationState.Invalid) {
                        // Property is defined in source, but it is not allowed
                        (0, utils_1.addValidationMessages)(entry, [
                            {
                                text: i18next_1.default.t('PAGE_EDITOR_PROPERTIES_PROPERTY_WARNING_PROPERTY_NOT_ALLOWED', {
                                    name: property
                                }),
                                deletable: true
                            }
                        ]);
                    }
                }
            }
        }
        // Go through standard aggregation with recursion
        for (const name in aggregation.aggregations) {
            this.validate(aggregation.aggregations[name], data ? data[name] : {});
        }
    }
    /**
     * Method receives possible variants of variants received from schema and validates against current values.
     *
     * @param variants Array of variants.
     * @param aggregation Aggregation to validate.
     * @returns State of each property and aggregation.
     */
    validateVariants(variants, aggregation) {
        const valueProperties = {};
        // Get properties with actual values
        for (const property in aggregation.properties) {
            if (aggregation.properties[property].value !== undefined) {
                valueProperties[property] = aggregation.properties[property].value;
            }
        }
        for (const property in aggregation.aggregations) {
            if (aggregation.aggregations[property].value !== undefined) {
                valueProperties[property] = aggregation.aggregations[property].value;
            }
        }
        // Get valid variants
        let validVariants = [...variants];
        for (const property in valueProperties) {
            validVariants = validVariants.filter((variant) => {
                const result = this.validateVariant(variant, aggregation, property);
                return result === types_1.ValidationState.Valid;
            });
        }
        if (validVariants.length === 0) {
            validVariants = [...variants];
            for (const property in valueProperties) {
                validVariants = validVariants.filter((variant) => {
                    const result = this.validateVariant(variant, aggregation, property, true);
                    return result === types_1.ValidationState.Valid;
                });
            }
        }
        // Unify aggregation and variants if 'unionName' is used in aggregation
        this.unifyVariants(aggregation, validVariants);
        // Populate property states
        const propertyStates = {};
        const properties = [...Object.keys(aggregation.properties), ...Object.keys(aggregation.aggregations)];
        for (const property of properties) {
            const valid = validVariants.some((variant) => {
                return property in variant.properties || property in variant.aggregations;
            });
            if (valid) {
                propertyStates[property] = types_1.ValidationState.Valid;
            }
            else if (property in valueProperties) {
                propertyStates[property] = types_1.ValidationState.Invalid;
            }
            else {
                propertyStates[property] = types_1.ValidationState.Skipped;
            }
        }
        return propertyStates;
    }
    /**
     * Method receives single variants and validates received property against variant schema.
     *
     * @param variant Variant to use as validation rule.
     * @param aggregation Aggregation to validate.
     * @param property Name of inner property or aggregation, which should be validated.
     * @param ignoreUnexisting Do not return skip state when ignore passed and variant property does not exist.
     * @returns Validation result.
     */
    validateVariant(variant, aggregation, property, ignoreUnexisting = false) {
        const variantProperty = variant.aggregations[property] || variant.properties[property];
        if (variantProperty === undefined) {
            return ignoreUnexisting ? types_1.ValidationState.Valid : types_1.ValidationState.Skipped;
        }
        // Check enum value
        const entity = aggregation.properties[property] || aggregation.aggregations[property] || {};
        const value = 'value' in entity ? entity.value : undefined;
        if (variantProperty.schema) {
            if (variantProperty.schema.pattern &&
                !new RegExp(variantProperty.schema.pattern).exec(value.toString())) {
                return types_1.ValidationState.Skipped;
            }
            if (variantProperty.schema.enum &&
                !variantProperty.schema.enum.includes(value) &&
                !variantProperty.freeText) {
                return types_1.ValidationState.Skipped;
            }
        }
        return types_1.ValidationState.Valid;
    }
    /**
     * Iterates over all aggregations contained in the given variants.
     * Useful for replacing nested loops when traversing variant aggregations.
     *
     * @param variants List of variant aggregations to traverse.
     * @yields A tuple containing:
     *  - `name`: The aggregation key within the variant.
     *  - `aggregation`: The aggregation within the variant.
     */
    *iterateVariantAggregations(variants) {
        for (const variant of variants) {
            for (const [name, aggregation] of Object.entries(variant.aggregations)) {
                yield [name, aggregation];
            }
        }
    }
    /**
     * Method goes through passed variants and checks for unify aggregations.
     * If there is any aggregation for unification, then method updates unify aggregation with latest valid context paths.
     *
     * @param aggregation Aggregation to validate.
     * @param variants Valid aggeregation to use as context for properties and aggregations paths.
     */
    unifyVariants(aggregation, variants) {
        const handledProperties = {};
        for (const [name, variantAggregation] of this.iterateVariantAggregations(variants)) {
            if (variantAggregation.union && !handledProperties[name]) {
                this.applyContextPath(aggregation.aggregations[name], variantAggregation.path);
                // Name correction to show context
                aggregation.aggregations[name].name =
                    variantAggregation.path[variantAggregation.path.length - 1].toString();
                // Mark handled property
                handledProperties[name] = true;
            }
        }
        if (!Object.keys(handledProperties).length) {
            return;
        }
        // update variant arrays
        for (const name in handledProperties) {
            aggregation.aggregations[name].variants = [];
        }
        for (const variant of variants) {
            for (const name in handledProperties) {
                const variantAggregation = variant.aggregations[name];
                if (!variantAggregation) {
                    continue;
                }
                aggregation.aggregations[name].variants = [
                    ...aggregation.aggregations[name].variants,
                    ...(variantAggregation.variants.length ? variantAggregation.variants : [variantAggregation])
                ];
            }
        }
    }
    /**
     * Recursive method updates paths of all aggregations and properties using passed context path.
     *
     * @param aggregation Target aggregation.
     * @param contextPath Context path.
     */
    applyContextPath(aggregation, contextPath) {
        aggregation.path = aggregation.path.slice();
        for (let i = 0; i < contextPath.length; i++) {
            aggregation.path[i] = contextPath[i];
        }
        for (const name in aggregation.aggregations) {
            this.applyContextPath(aggregation.aggregations[name], contextPath);
        }
    }
}
exports.AggregationValidator = AggregationValidator;
//# sourceMappingURL=AggregationValidator.js.map