import { ObjectAggregation } from '../ObjectAggregation';
import { AggregationActions, SortingOptions } from '../types';
import type { DefaultExtensionPosition } from '../utils/sort';
/**
 * Represents an aggregation for action object.
 */
export declare class ActionAggregation extends ObjectAggregation {
    actions: AggregationActions[];
    sortableItem: SortingOptions | undefined;
    isViewNode: boolean;
    sortableCollection: string | undefined;
    data?: DefaultExtensionPosition;
    /**
     * Method parses object path key and returns action name.
     *
     * @returns Action name.
     */
    getTechnicalName(): string | undefined;
    /**
     * Public method to mark action as custom action.
     */
    markAsCustomAction(): void;
    /**
     * Public method to mark action as standard action.
     */
    markAsStandardAction(): void;
    /**
     * Method returns action type from schema data.
     *
     * @returns Action type from schema.
     */
    getActionType(): string | undefined;
}
//# sourceMappingURL=ActionAggregation.d.ts.map