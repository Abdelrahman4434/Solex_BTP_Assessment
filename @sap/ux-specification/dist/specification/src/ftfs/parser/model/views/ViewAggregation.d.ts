import type { JSONSchema4 } from 'json-schema';
import { ObjectAggregation } from '../ObjectAggregation';
import type { PageEditAggregationData } from '../ObjectAggregation';
import { AggregationActions, SortingOptions } from '../types';
import type { PageData, PageAnnotations } from '../types';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
/**
 * Represents an aggregation for view objects.
 */
export declare class ViewAggregation extends ObjectAggregation {
    private title?;
    actions: AggregationActions[];
    sortableItem: SortingOptions | undefined;
    sortableCollection: string | undefined;
    /**
     * Creates an instance of `ViewAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Method returns display name of aggregation without applying i18n translation.
     * Overwritten for column handling.
     *
     * @returns Display name of aggregation.
     */
    protected getRawDisplayName(): string;
    /**
     * Public method to mark view as custom action.
     */
    markAsCustomView(): void;
    /**
     * Overwritten method for data update of list report view.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Annotations data.
     */
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations: PageAnnotations | undefined): void;
    /**
     * Method returns true if view aggregation is table view.
     *
     * @returns True if view is table view.
     */
    private isTableView;
    /**
     * Method returns true if view aggregation is chart view.
     *
     * @returns True if view is chart view.
     */
    private isChartView;
    /**
     * Method returns true if aggregation is annotation view.
     *
     * @returns True if view is annotation view.
     */
    isAnnotationView(): boolean;
}
//# sourceMappingURL=ViewAggregation.d.ts.map