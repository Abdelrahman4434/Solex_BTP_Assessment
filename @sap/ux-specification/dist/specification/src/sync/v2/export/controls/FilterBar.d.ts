import type { v2 } from '@sap/ux-specification-types';
/**
 * Imports date settings from the provided manifest section.
 *
 * @param manifestSection - The manifest section containing date settings.
 * @returns The imported date settings as a DateRange object or undefined if not available.
 */
export declare function importDateSettings(manifestSection: object): DateRange;
/**
 * Exports date settings to the manifest section.
 *
 * @param manifestSection - The manifest section to which the field will be exported.
 * @param configPart - The configuration part containing the field data to export.
 * @param key - The key of the field to export.
 */
export declare function exportDateSettingsField(manifestSection: unknown, configPart: DateRange, key: string): void;
export declare class DateRange implements v2.DateRange {
    useDateRange?: boolean;
    selectedValues?: v2.DateRangeType[];
    exclude?: boolean;
}
export declare class DefaultDateRange implements v2.DefaultDateRange {
    operation: v2.DefaultDateRangeValueType;
}
export declare class SelectionFieldDateSettings implements v2.SelectionFieldDateSettings {
    selectedValues?: v2.DateRangeType[];
    exclude?: boolean;
    customDateRangeImplementation?: string;
    filter?: v2.FilterType[];
    defaultValue?: DefaultDateRange;
}
export declare class SelectionFields implements v2.SelectionFields {
    [key: string]: v2.SelectionField | v2.SelectionFieldDateSettings;
}
export declare class CommonFilterBar implements v2.CommonFilterBar {
    smartVariantManagement?: boolean;
    liveMode?: boolean;
    variantManagementHidden: boolean;
    subTitleIfVariantMgmtHidden?: string;
    dateSettings?: DateRange;
    selectionFields?: SelectionFields;
    showClearOnFB?: boolean;
    showFilterConfiguration?: boolean;
    showRestoreOnFB?: boolean;
}
export declare class AnalyticalListPageFilterBar extends CommonFilterBar implements v2.AnalyticalListPageFilterBar {
    showGoButtonOnFilterBar?: boolean;
    filterDefaultsFromSelectionVariant?: boolean;
}
export declare class ListReportFilterBar extends CommonFilterBar implements v2.ListReportFilterBar {
    annotationPath?: string;
}
//# sourceMappingURL=FilterBar.d.ts.map