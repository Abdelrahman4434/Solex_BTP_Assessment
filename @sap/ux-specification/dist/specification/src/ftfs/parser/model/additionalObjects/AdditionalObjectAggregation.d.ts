import { ObjectAggregation } from '../ObjectAggregation';
import { AggregationActions } from '../types';
/**
 * Represents an aggregation for additional object.
 */
export declare class AdditionalObjectAggregation extends ObjectAggregation {
    actions: AggregationActions[];
    /**
     * Method returns display name of aggregation.
     * Is used as display name in outline.
     * Overwritten to avoid translation attempt and "startCase" format.
     *
     * @returns Display name of aggregation.
     */
    getDisplayName(): string;
}
//# sourceMappingURL=AdditionalObjectAggregation.d.ts.map