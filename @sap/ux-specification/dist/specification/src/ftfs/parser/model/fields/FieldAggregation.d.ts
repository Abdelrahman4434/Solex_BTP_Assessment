import { ObjectAggregation } from '../ObjectAggregation';
import { SortingOptions, AggregationActions } from '../types';
/**
 * Represents an aggregation for field objects.
 */
export declare class FieldAggregation extends ObjectAggregation {
    actions: AggregationActions[];
    sortableItem: SortingOptions | undefined;
    isViewNode: boolean;
    sortableCollection: string | undefined;
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
}
//# sourceMappingURL=FieldAggregation.d.ts.map