import type { TableColumn, TableColumnAction, TableCustomColumn, ViewTableColumn, ViewTableColumnAction, ViewTableCustomColumn } from '../webapp/manifest/ManifestSettings';
import type { ToolBar, ViewChartToolBar } from './ToolBar';
import type { TableCreationModeType } from './ObjectPageTable';
import type { PopinLayout } from 'sap/m/library';
/**
 * @artifactType Manifest
 * @descriptionSrcURL https://help.sap.com/docs/SAPUI5/4a476671e9bd4e898445a16858d9cf24/116b5d82e8c545e2a56e1b51b8b0a9bd.html?#additional-features-in-sap-fiori-elements-for-odata-v4
 */
export declare enum SelectionMode {
    Multi = "Multi",
    None = "None",
    Single = "Single",
    Auto = "Auto"
}
/**
 * @artifactType Manifest
 * @descriptionSrcURL https://ui5.sap.com/#/api/sap.ui.mdc.enums.TableRowCountMode
 */
export declare enum RowCountMode {
    Fixed = "Fixed",
    Auto = "Auto",
    Interactive = "Interactive"
}
export declare enum TableTypeV4 {
    ResponsiveTable = "ResponsiveTable",
    GridTable = "GridTable",
    AnalyticalTable = "AnalyticalTable",
    TreeTable = "TreeTable"
}
export declare enum InitialLoadType {
    Disabled = "Disabled",
    Enabled = "Enabled",
    Auto = "Auto"
}
export declare enum DefaultPathType {
    Primary = "primary",
    Secondary = "secondary",
    Both = "both"
}
export declare const EMPTY_OPTION = "";
export type EmptyOption = typeof EMPTY_OPTION;
/**
 * @artifactType Manifest
 * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/965ef5b2895641bc9b6cd44f1bd0eb4d
 */
export declare enum OperationGroupingMode {
    ChangeSet = "ChangeSet",
    Isolated = "Isolated"
}
/**
 * @artifactType Manifest
 * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/965ef5b2895641bc9b6cd44f1bd0eb4d
 */
export type EnableMassEdit = boolean | {
    /**
     * The 'visibleFields' property lets you specify which fields are available in the mass edit dialog.
     *
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/965ef5b2895641bc9b6cd44f1bd0eb4d
     */
    visibleFields?: string[];
    /**
     * The 'ignoredFields' property lets you hide specific fields from the mass edit dialog, even if these fields are displayed in the table.
     *
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/965ef5b2895641bc9b6cd44f1bd0eb4d
     */
    ignoredFields?: string[];
    /**
     * Define how the changes using mass edit should be applied. The default mode for mass editing is 'ChangeSet' on the Object Page and 'Isolated' in the List Report.
     *
     * - ChangeSet: Grouped for all objects within the same request.
     * - Isolated: Separately for each object (as an individual OData change set in the same request).
     */
    operationGroupingMode?: OperationGroupingMode;
};
export interface PersonalizationType {
    /**
     * Defines whether the user can add and remove columns to a given table.
     */
    column?: boolean;
    /**
     * Defines whether the user can sort a given table.
     */
    sort?: boolean;
    /**
     * Defines whether the user can filter data of a given table.
     */
    filter?: boolean;
}
export interface ViewPersonalizationType {
    /**
     * Defines whether the user can add and remove columns to a given table.
     */
    column?: boolean;
    /**
     * Defines whether the user can sort a given table.
     */
    sort?: boolean;
    /**
     * Defines whether the user can filter data of a given table.
     */
    filter?: boolean;
}
export interface AnnotationPathAsObject {
    annotationPath: string;
}
export interface QuickVariantSelectionV4 {
    /**
     * List of annotation paths referring to SelectionVariant annotations.
     */
    paths: AnnotationPathAsObject[];
    /**
     * Determines whether the table title is hidden and the tab titles are displayed.
     */
    hideTableTitle?: boolean;
    /**
     * Determines whether the entry view counts are shown.
     */
    showCounts?: boolean;
}
export interface GenericColumns {
    [key: string]: TableColumn | TableColumnAction | TableCustomColumn;
}
/**
 * View Columns
 *
 * @isViewNode true
 */
export interface ViewColumns {
    [key: string]: ViewTableColumn | ViewTableColumnAction | ViewTableCustomColumn;
}
/**
 * Interface representing properties for managing row count behavior in a table.
 */
export interface RowCountable {
    /**
     * Defines how the table handles the visible rows. Does not apply to responsive tables. Allowed values are Auto and Fixed.
     *  - Fixed: The table always has as many rows as defined in the rowCount property.
     *  - Auto (default): The number of rows is changed by the table automatically. It will then adjust its row count to the space it is allowed to cover (limited by the surrounding container) but it cannot have less than defined in the rowCount property.
     *  - Interactive: The user can change the number of displayed rows by dragging a resize handle.
     */
    rowCountMode?: RowCountMode;
    /**
     * Number of rows to be displayed in the table.
     *
     * @minimum 0
     */
    rowCount?: number;
}
export interface TableSettings {
    /**
     * Defines the table type. Note: Grid tables, analytical tables, and tree tables aren't rendered on small-screen devices. Responsive tables are shown instead.
     */
    type?: TableTypeV4;
    /**
     * Allows you to enable or disable row selection and choose between single or multiple row selection.
     * - Auto: This type is deprecated. Choose any of the following modes:
     * - Multi (default): This type allows multiple table selections if relevant actions are available in the toolbar.
     * - Single: This type allows single table selection if relevant actions are available in the toolbar.
     * - None: No table selection is possible in display mode.
     */
    selectionMode?: SelectionMode;
    /**
     * The selectAll configuration overrides the selectionLimit and allows the user to select all the items. When set to true, the select all feature is enabled: a checkbox in the table header is displayed which selects all items when clicked.
     */
    selectAll?: boolean;
    /**
     * You can define how many items can be selected at a time using the selectionLimit.
     */
    selectionLimit?: number;
    /**
     * Defines whether the Export button is displayed in the table toolbar. The default value is true.
     *
     */
    enableExport?: boolean;
    /**
     * With quickVariantSelection you can switch to multiple views (single table mode). It links to a SelectionVariant (filters) or SelectionPresentationVariant (filters and sorters) that you have added to your annotations.
     */
    quickVariantSelection?: QuickVariantSelectionV4;
    /**
     * Determines whether the content density for ui.table is condensed.
     */
    condensedTableLayout?: boolean;
    /**
     *  Leading property that decides between either a recursive hierarchy or data aggregation.
     */
    hierarchyQualifier?: string;
    /**
     * Determines whether the column header is included in the column width calculation. By default, the column width is calculated based on the type of the content.
     */
    widthIncludingColumnHeader?: boolean;
    /**
     * Determines the visibility of the Copy to Clipboard button. By default, the Copy to Clipboard button is displayed in the table toolbar if the selection mode is configured.
     */
    disableCopyToClipboard?: boolean;
    /**
     * Mass editing allows end users to simultaneously change multiple objects that share the same editable properties.
     *
     */
    enableMassEdit?: EnableMassEdit;
}
/**
 * Interface representing properties for managing creation mode behavior in a table.
 */
export interface LRCreationModeConfigurable {
    /**
     * Defines the page behavior when a new record is created.
     */
    creationMode?: TableCreationModeLR;
}
/**
 * Interface representing properties for managing analytical configuration behavior in a table.
 */
export interface AnalyticalConfiguration {
    /**
     * When set to true, aggregation is based only on visible columns.
     *
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/1.136.0/#/topic/7f844f1021cd4791b8f7408eac7c1cec
     */
    aggregationOnLeafLevel?: boolean;
}
export interface ViewAnalyticalConfiguration extends AnalyticalConfiguration {
}
export type ViewTypeV4 = LRTableView | LRChartView | TableViewExtension | boolean;
/**
 * Views
 *
 * @isViewNode true
 */
export interface MultiTableModeV4 {
    /**
     * List of annotation paths.
     */
    [key: string]: ViewTypeV4;
    /**
     * You can show the counts of entries of each view. To do so, add the showCounts option and set it to true.
     */
    showCounts?: boolean;
}
/**
 * Chart View
 *
 * @isViewNode true
 */
export interface ALPChartView {
    /**
     * The primary annotation path can be either UI.Chart, UI.PresentationVariant, or UI.SelectionPresentationVariant.
     */
    annotationPath: string;
    /**
     * Chart Toolbar
     *
     * @isViewNode true
     */
    toolBar?: ViewChartToolBar;
}
export interface CommonViewSettings {
    /**
     * Unique tab identifier.
     *
     * @hidden true
     */
    key: string;
    /**
     * @hidden true
     */
    index: number;
    /**
     * The annotationPath refers to a SelectionPresentationVariant or PresentationVariant annotation.
     * To use charts in multiple table mode, define a UI.Chart annotation, including a qualifier, and reference the UI.Chart annotation in your SelectionPresentationVariant or PresentationVariant annotation.
     */
    annotationPath: string;
    /**
     * Each chart can be based on a different entitySet.
     */
    entitySet?: string;
}
/**
 * Chart View
 *
 * @isViewNode true
 */
export interface LRChartView extends CommonViewSettings {
    /**
     * Chart Toolbar
     *
     * @isViewNode true
     */
    toolBar?: ViewChartToolBar;
    /**
     * Defines whether the view is visible or not.
     */
    visible?: boolean;
}
/**
 * Table View
 *
 * @isViewNode true
 */
export interface ALPTableView extends TableSettings, LRCreationModeConfigurable {
    /**
     * The secondary annotation path can be either UI.LineItem, UI.PresentationVariant, or UI.SelectionPresentationVariant.
     */
    annotationPath: string;
    /**
     * Determines whether the data in the table is automatically loaded.
     * - Auto (default): Data is loaded automatically if a default filter value has been set in the filter bar.
     * - Enabled: Data is loaded automatically,  as defined by the standard variant.
     * - Disabled: Data is not loaded automatically. Users have to click the Go button.
     */
    initialLoad?: InitialLoadType;
    /**
     * Defines the personalization mode, currently only effective if variant management on page is either set to Page or Control.
     * By default all table settings are enabled. You can change this for the different parts of the table by setting the properties "Column", "Sort" and "Filter" accordingly.
     * Omitting a property is treated as false, this allows apps to avoid getting new features like grouping in upcoming releases.
     */
    personalization?: ViewPersonalizationType | boolean;
    /**
     * Table Toolbar
     */
    toolBar?: ToolBar;
    columns?: ViewColumns;
}
/**
 * Table View Extension
 *
 * @isViewNode true
 */
export interface TableViewExtension {
    /**
     * Unique tab identifier.
     *
     * @hidden true
     */
    key: string;
    /**
     * @hidden true
     */
    index: number;
    /**
     * View title (localization supported).
     *
     * @i18nClassification TIT: Custom view title
     */
    label?: string;
    /**
     * The name contains sap.app.id as a prefix, followed by the path in the app/webapp folder and the name of the XML view.
     */
    template: string;
    /**
     * Defines whether the view is visible.
     */
    visible?: boolean;
}
/**
 * Table View
 *
 * @isViewNode true
 */
export interface LRTableView extends TableSettings, LRCreationModeConfigurable {
    /**
     * Unique tab identifier.
     *
     * @hidden true
     */
    key: string;
    /**
     * @hidden true
     */
    index: number;
    /**
     * The annotation path can be either UI.LineItem, UI.PresentationVariant, or UI.SelectionPresentationVariant.
     */
    annotationPath: string;
    /**
     * Each table can be based on a different entitySet.
     */
    entitySet?: string;
    /**
     *  The tab keeps the default LineItem ID (without the key), so the variant is applied to it.
     */
    keepPreviousPersonalization?: boolean;
    /**
     * Defines the personalization mode, currently only effective if variant management on page is either set to Page or Control.
     * By default all table settings are enabled. You can change this for the different parts of the table by setting the properties "Column", "Sort" and "Filter" accordingly.
     * Omitting a property is treated as false, this allows apps to avoid getting new features like grouping in upcoming releases.
     */
    personalization?: ViewPersonalizationType | boolean;
    /**
     * Table Toolbar
     */
    toolBar?: ToolBar;
    /**
     * Columns
     */
    columns?: ViewColumns;
    /**
     * Defines whether the view is visible.
     */
    visible?: boolean;
    analyticalConfiguration?: ViewAnalyticalConfiguration;
    /**
     * Defines the layout options of the table popins. A popin layout defined at the table level takes precedence over a popin layout defined at the application level.
     *
     * @descriptionSrcURL https://help.sap.com/docs/SAPUI5/b1cda5dc7a7644eb886bc6ac04c0b438/7f844f1021cd4791b8f7408eac7c1cec.html
     */
    popinLayout?: PopinLayout.Block | PopinLayout.GridSmall | PopinLayout.GridLarge;
}
/**
 * Table
 *
 * @isViewNode true
 */
export interface Table extends TableSettings, LRCreationModeConfigurable {
    /**
     * The secondary annotation path can be either UI.LineItem, UI.PresentationVariant, or UI.SelectionPresentationVariant.
     */
    annotationPath?: string;
    /**
     * Determines whether the data in the table is automatically loaded.
     * - Auto (default): Data is loaded automatically if a default filter value has been set in the filter bar.
     * - Enabled: Data is loaded automatically, as defined by the standard variant
     * - Disabled: Data is not loaded automatically. Users have to click the Go button.
     */
    initialLoad?: InitialLoadType;
    /**
     * Defines the personalization mode, currently only effective if variant management on page is either set to Page or Control.
     * By default all table settings are enabled. You can change this for the different parts of the table by setting the properties "Column", "Sort" and "Filter" accordingly.
     * Omitting a property is treated as false, this allows apps to avoid getting new features like grouping in upcoming releases.
     */
    personalization?: PersonalizationType | boolean;
    views?: MultiTableModeV4;
    /**
     * Tool Bar
     */
    toolBar?: ToolBar;
    columns?: GenericColumns;
    analyticalConfiguration?: AnalyticalConfiguration;
    /**
     * Defines the layout options of the table popins. A popin layout defined at the table level takes precedence over a popin layout defined at the application level.
     *
     * @descriptionSrcURL https://help.sap.com/docs/SAPUI5/b1cda5dc7a7644eb886bc6ac04c0b438/7f844f1021cd4791b8f7408eac7c1cec.html
     */
    popinLayout?: PopinLayout.Block | PopinLayout.GridSmall | PopinLayout.GridLarge;
}
/**
 * Creation Mode for List Report Table
 *
 * @controlProperty name
 */
export interface TableCreationModeLR {
    /**
     * Defines the creation mode to be used by the List Report table.
     * The allowed values are `NewPage` or `CreationDialog`.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async' or 'Deferred' metadata is used.
     * - CreationDialog: The creation is performed in the table, with a dialog which allows you to specify initial property values that are are listed in `creationFields`.
     *
     * If this is not set with a value, the default value is 'NewPage'.
     */
    name?: TableCreationModeType.NewPage | TableCreationModeType.CreationDialog;
    /**
     * Defines the list of properties that are displayed in the creation dialog when the creation mode is set to 'CreationDialog'.
     * This value is a comma-separated list of property names.
     */
    creationFields?: string[];
    /**
     * Specifies if the new entry is placed at the position computed by the back end. For example, considering sorting.
     * The default value is 'false' which means the new entry is placed as the first child below its parent.
     */
    createInPlace?: boolean;
    /**
     * Defines the extension point to control whether the Create button or Create Menu buttons are enabled.
     */
    isCreateEnabled?: string;
}
//# sourceMappingURL=Table.d.ts.map