import type { Parser } from '@sap/ux-specification-types';
import type { ObjectAggregation, AggregationVariant } from './ObjectAggregation';
import type { PageData } from './types';
import { ValidationState } from './types';
/**
 * Represents validator for aggregations.
 */
export declare class AggregationValidator {
    /**
     * Method validates states of properties and aggregation. Following states are supported:
     * 1. Valid.
     * 2. Invalid - when value is set for property/aggregation, but it is not valid.
     * 3. Skipped - when property/aggregation is not relevant in current value context and value does not set.
     *
     * @param aggregation ObjectAggregation which state should be validated.
     * @param data Page data.
     */
    validate(aggregation: ObjectAggregation, data: PageData): void;
    /**
     * Method receives possible variants of variants received from schema and validates against current values.
     *
     * @param variants Array of variants.
     * @param aggregation Aggregation to validate.
     * @returns State of each property and aggregation.
     */
    validateVariants(variants: Array<AggregationVariant>, aggregation: ObjectAggregation): {
        [k: string]: ValidationState;
    };
    /**
     * Method receives single variants and validates received property against variant schema.
     *
     * @param variant Variant to use as validation rule.
     * @param aggregation Aggregation to validate.
     * @param property Name of inner property or aggregation, which should be validated.
     * @param ignoreUnexisting Do not return skip state when ignore passed and variant property does not exist.
     * @returns Validation result.
     */
    validateVariant(variant: AggregationVariant, aggregation: ObjectAggregation, property: string, ignoreUnexisting?: boolean): ValidationState;
    /**
     * Iterates over all aggregations contained in the given variants.
     * Useful for replacing nested loops when traversing variant aggregations.
     *
     * @param variants List of variant aggregations to traverse.
     * @yields A tuple containing:
     *  - `name`: The aggregation key within the variant.
     *  - `aggregation`: The aggregation within the variant.
     */
    private iterateVariantAggregations;
    /**
     * Method goes through passed variants and checks for unify aggregations.
     * If there is any aggregation for unification, then method updates unify aggregation with latest valid context paths.
     *
     * @param aggregation Aggregation to validate.
     * @param variants Valid aggeregation to use as context for properties and aggregations paths.
     */
    private unifyVariants;
    /**
     * Recursive method updates paths of all aggregations and properties using passed context path.
     *
     * @param aggregation Target aggregation.
     * @param contextPath Context path.
     */
    applyContextPath(aggregation: ObjectAggregation, contextPath: Parser.PropertyPath): void;
}
//# sourceMappingURL=AggregationValidator.d.ts.map