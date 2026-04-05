import type { PageEditAggregationData } from '../ObjectAggregation';
import { ObjectAggregation } from '../ObjectAggregation';
import type { PageData, PageAnnotations, UINode } from '../types';
import { AggregationCreationForm, TableColumnExtensionType } from '../types';
import type { JSONSchema4 } from 'json-schema';
import type { PageConfig, Parser } from '@sap/ux-specification-types';
import { PageType } from '@sap/ux-specification-types';
export interface ColumnBase {
    id?: string;
    text?: string;
    columnKey: string;
    columnIndex?: number;
    leadingProperty?: string;
    fragmentName: string;
    tabKey?: string;
    cellsFragmentName?: string;
    extensionType: TableColumnExtensionType;
}
/**
 * Represents an aggregation for columns objects.
 */
export declare class ColumnsAggregation extends ObjectAggregation {
    formSchema?: ObjectAggregation;
    customColumns: Array<ColumnBase>;
    private columnKeys;
    tableColumnExtensionType?: TableColumnExtensionType;
    allowedAnnotationCreationForms: AggregationCreationForm[];
    private readonly isV4?;
    sectionId?: string;
    sortableCollection: string | undefined;
    /**
     * Creates an instance of `ColumnsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Groups all custom table columns by their extension type.
     *
     * @returns Grouped custom table columns by their extension type.
     */
    private groupCustomColumnsByExtension;
    /**
     * Method ensures that 'order' property of aggregation is zero based and does not have any gap.
     */
    private ensureColumnOrder;
    /**
     * Data update of custom columns from 'custom' block, V2 scenario.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type
     * @param path Path of columns.
     */
    private updatePropertiesFromCustomAggregation;
    /**
     * Overwritten method for data update of table columns.
     *
     * @param data - Data which should be used for value population.
     * @param page - Page config data.
     * @param pageType - Page type
     * @param path - Path of columns.
     * @param annotations - Annotations
     */
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations: PageAnnotations): void;
    /**
     * Method returns available column id for candidate column id.
     *
     * @param id Candidate id.
     * @param existingIds Array of existing ids.
     * @returns Available id.
     */
    private getFreeId;
    /**
     * Method detects default extension type for current page with table object.
     *
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Path of columns.
     */
    private resolveTableColumnExtensionType;
    /**
     * Method returns if passed custom column matches table type.
     * Table can have multiple columns with different 'extensionType', but Runtime will render only those which are matches to table type.
     *
     * @param column - Custom column object from 'page.json'.
     * @returns True if custom column extension type matches table type.
     */
    private doesColumnExtensionMatchTableType;
    /**
     * Method checks if custom columns schema supports 'extensionType' property.
     * Old 'spec' version does not support this property, but we still can support custom columns with old spec version.
     *
     * @returns True if 'extensionType' property exists in schema for Custom Column definition.
     */
    isExtensionTypeSupported(): boolean;
    /**
     * Method returns maximal order by looping through all aggregations and all custom columns data.
     *
     * @param columnData - Custom column data.
     * @returns Maximal property order index.
     */
    private getMaxColumnIndex;
    /**
     * Refreshes node locations based on the annotation node data.
     *
     * @param annotations All page annotation nodes.
     * @param currentUINode Current annotation node.
     */
    protected updateLocations(annotations: PageAnnotations | undefined, currentUINode?: UINode): void;
}
//# sourceMappingURL=ColumnsAggregation.d.ts.map