import type { JSONSchema4 } from 'json-schema';
import { ObjectAggregation } from '../ObjectAggregation';
import { SortingOptions, AggregationActions } from '../types';
import type { NodeProperty } from '../NodeProperty';
/**
 * Represents an aggregation for filter field objects.
 */
export declare class FilterFieldAggregation extends ObjectAggregation {
    actions: AggregationActions[];
    sortableItem: SortingOptions | undefined;
    isViewNode: boolean;
    /**
     * Method returns display name of aggregation without applying i18n translation.
     * Overwritten for column handling.
     *
     * @returns Display name of aggregation.
     */
    protected getRawDisplayName(): string;
    /**
     * Method parses object path key and returns field name / technical id.
     *
     * @returns Field name / technical id.
     */
    getTechnicalName(): string | undefined;
    /**
     * Public method to mark filter field as custom filter field.
     */
    markAsCustomFilterField(): void;
    /**
     * Method adds property object.
     * Overwritten to disable "property" property - it is done till we clarify how to handle it correctly.
     *
     * @param name Name of property.
     * @param schema Schema object of property.
     * @returns Instance of new property.
     */
    addProperty(name: string, schema: JSONSchema4): NodeProperty;
}
//# sourceMappingURL=FilterFieldAggregation.d.ts.map