import { ObjectAggregation } from '../ObjectAggregation';
import type { PageData, PageAnnotations } from '../types';
import { SortingOptions, AggregationActions, TableColumnExtensionType } from '../types';
import { PageType } from '@sap/ux-specification-types';
import type { PageConfig, Parser } from '@sap/ux-specification-types';
/**
 * Represents an aggregation for column objects.
 */
export declare class ColumnAggregation extends ObjectAggregation {
    private title?;
    originalIndex?: number;
    isViewNode: boolean;
    actions: AggregationActions[];
    sortableItem: SortingOptions;
    private readonly criticality?;
    /**
     * Setter for title.
     *
     * @param title Title.
     */
    setTitle(title?: string): void;
    /**
     * Method returns display name of aggregation without applying i18n translation.
     * Overwritten for column handling.
     *
     * @returns Display name of aggregation.
     */
    protected getRawDisplayName(): string;
    /**
     * Method validates column positioning by checking anchoring.
     */
    private validateColumnPositioning;
    /**
     * Public method to mark section as custom section.
     *
     * @param params Parameters used to configure the custom column.
     * @param params.pageType Page type
     * @param params.originalIndex Original element index - data to store and use on reordering.
     * @param params.columnExtension Column extension type.
     * @param params.isExtensionTypeSupported Whether column extension type is supported.
     * @param params.i18nKey I18n custom key.
     * @param params.tableExtension Target table extension type.
     * @param params.isV4 Whether Custom column is for V4.
     * @param params.tabkey Tab/view key identificator.
     */
    markAsCustomColumn(params: {
        pageType: PageType;
        originalIndex: number;
        columnExtension: TableColumnExtensionType;
        isExtensionTypeSupported: boolean;
        i18nKey?: string;
        tableExtension?: TableColumnExtensionType;
        isV4?: boolean;
        tabkey?: string;
    }): void;
    /**
     * Method parses object path key and returns field name / technical id.
     *
     * @returns Field name / technical id.
     */
    getTechnicalName(): string | undefined;
    /**
     * Overwritten method for aggregation update.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Annotation data.
     */
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations?: PageAnnotations): void;
    /**
     * Method updates column move settings according to column state.
     */
    private updateMoveProperties;
    /**
     * Checks if this column represents an action column.
     *
     * @returns true if this is an action column.
     */
    isActionColumn(): boolean;
    /**
     * Checks if this column represents a navigation column.
     *
     * @returns true if this is a navigation column.
     */
    isNavigationColumn(): boolean;
}
//# sourceMappingURL=ColumnAggregation.d.ts.map