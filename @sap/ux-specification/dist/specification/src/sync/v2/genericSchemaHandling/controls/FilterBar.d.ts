/**
 * @file This file contains the classes implementing the interfaces defined in the corresponding types file.
 */
import type * as v2 from '@sap/ux-specification-types/src/v2/genericSchemaHandling/controls/FilterBar';
export declare class DateRange implements v2.DateRange {
    useDateRange?: boolean;
    selectedValues?: v2.DateRangeEnum[];
    exclude?: boolean;
}
export declare class DefaultDateRange implements v2.DefaultDateRange {
    operation: v2.DefaultDateRangeValueEnum;
}
export declare class FilterField implements v2.FilterField {
    selectedValues?: v2.DateRangeEnum[];
    exclude?: boolean;
    customDateRangeImplementation?: string;
    filter?: v2.FilterType[];
    defaultValue?: DefaultDateRange;
}
export declare class FilterFields implements v2.FilterFields {
    [key: string]: v2.FilterField;
}
declare class CommonFilterBar implements v2.CommonFilterBar {
    liveMode?: boolean;
    smartVariantManagement?: boolean;
    variantManagementHidden: boolean;
    subTitleIfVariantMgmtHidden?: string;
    showClearOnFB?: boolean;
    showFilterConfiguration?: boolean;
    showRestoreOnFB?: boolean;
    dateSettings?: DateRange;
    selectionFields?: FilterFields;
}
export declare class ListReportFilterBar extends CommonFilterBar implements v2.ListReportFilterBar {
    annotationPath?: string;
}
export {};
//# sourceMappingURL=FilterBar.d.ts.map