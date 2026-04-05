import type { PopinLayout } from 'sap/m/library';
import type { AnalyticalConfiguration, AnnotationPathAsObject, EnableMassEdit, RowCountable, TableSettings, TableTypeV4 } from '.';
import type { Placement, ObjectPageTableColumn as ObjectPageTableColumnIF, ObjectPageTableColumnAction, TableCustomColumn } from '../webapp/manifest/ManifestSettings';
import type { ObjectPageToolBar } from './ObjectPageToolBar';
export interface PositionOP {
    /**
     * The key of another column to be used as placement anchor.
     *
     * @artifactType Manifest
     */
    anchor?: string;
    /**
     * Define the placement, either before or after the anchor column.
     *
     * @artifactType Manifest
     */
    placement: Placement;
}
export interface TableCustomColumnOP extends TableCustomColumn {
    /**
     * Defines the position of the column relative to the anchor column.
     *
     * @artifactType Manifest
     */
    position?: PositionOP;
}
export type AnyObjectPageTableType = ObjectPageAnalyticalTableV4 | ObjectPageGridTableV4 | ObjectPageResponsiveTableV4 | ObjectPageTreeTableV4;
/**
 * Table
 *
 * @isViewNode true
 * @controlProperty type
 */
export interface ObjectPageGridTableV4 extends ObjectPageTable, RowCountable {
    /**
     * Defines the table type. Note: Grid tables, analytical tables, and tree tables aren't rendered on small-screen devices. Responsive tables are shown instead.
     */
    type?: TableTypeV4.GridTable;
    /**
     * Defines the page behavior when a new record is created.
     */
    creationMode?: TableCreationModeInlineOPTable | TableCreationModeInlineCreationsRowsOPGridTable | TableCreationModeNewPageOPTable | TableCreationModeCreationDialogOPTable | TableCreationModeExternalOPTable;
}
export interface ObjectPageAnalyticalConfiguration extends AnalyticalConfiguration {
}
/**
 * Table
 *
 * @isViewNode true
 * @controlProperty type
 */
export interface ObjectPageAnalyticalTableV4 extends ObjectPageTable, RowCountable {
    /**
     * Defines the table type. Note: Grid tables, analytical tables, and tree tables aren't rendered on small-screen devices. Responsive tables are shown instead.
     */
    type?: TableTypeV4.AnalyticalTable;
    analyticalConfiguration?: ObjectPageAnalyticalConfiguration;
}
/**
 * Table
 *
 * @isViewNode true
 * @controlProperty type
 */
export interface ObjectPageTreeTableV4 extends ObjectPageTable, RowCountable {
    /**
     * Defines the table type. Note: Grid tables, analytical tables, and tree tables aren't rendered on small-screen devices. Responsive tables are shown instead.
     */
    type?: TableTypeV4.TreeTable;
    /**
     * Defines the page behavior when a new record is created.
     */
    creationMode?: TableCreationModeNewPageOPTreeTable | TableCreationModeInlineOPTreeTable | TableCreationModeCreationDialogOPTreeTable;
}
/**
 * Table
 *
 * @isViewNode true
 * @controlProperty type
 * @defaultControlProperty true
 */
export interface ObjectPageResponsiveTableV4 extends ObjectPageTable {
    /**
     * Defines the table type. Note: Grid tables, analytical tables, and tree tables aren't rendered on small-screen devices. Responsive tables are shown instead.
     */
    type?: TableTypeV4.ResponsiveTable;
    /**
     * Defines the page behavior when a new record is created.
     */
    creationMode?: TableCreationModeInlineOPTable | TableCreationModeInlineCreationsRowsOPResponsiveTable | TableCreationModeNewPageOPTable | TableCreationModeCreationDialogOPTable | TableCreationModeExternalOPTable;
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
 * @controlProperty type
 */
export interface ObjectPageTable extends TableSettingsOP {
    /**
     * Enables full screen mode for this table. This adds a button to the table toolbar which opens the table in a full screen dialog.
     */
    enableFullScreen?: boolean;
    /**
     * In the Object Page tables, it is possible to add several items at a time by copying and pasting data from an excel file, if this property is set to true.
     */
    enablePaste?: boolean;
    /**
     * Tool Bar
     */
    toolBar?: ObjectPageToolBar;
}
/**
 * Table Section
 *
 * @isViewNode true
 */
export interface ObjectPageSectionTableV4 {
    table?: AnyObjectPageTableType;
}
export declare enum TableCreationModeType {
    NewPage = "NewPage",
    InlineCreationRows = "InlineCreationRows",
    Inline = "Inline",
    CreationDialog = "CreationDialog",
    External = "External"
}
/**
 * NewPage creation mode for TreeTable
 *
 * @defaultControlProperty true
 * @controlProperty name
 */
export interface TableCreationModeNewPageOPTreeTable extends TableCreationModeOPTreeTable {
    /**
     * Defines the creation mode to be used by the tree table.
     * Allowed values are 'NewPage', 'Inline', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline.
     * - CreationDialog: The creation is performed in a table. There is a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise, it is 'Inline'.
     */
    name?: TableCreationModeType.NewPage;
}
/**
 * Inline creation mode for TreeTable
 *
 * @controlProperty name
 */
export interface TableCreationModeInlineOPTreeTable extends TableCreationModeOPTreeTable {
    /**
     * Defines the creation mode to be used by the tree table.
     * Allowed values are 'NewPage', 'Inline', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline.
     * - CreationDialog: The creation is performed in the table using a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise it is 'Inline'.
     */
    name?: TableCreationModeType.Inline;
}
/**
 * CreationDialog creation mode for TreeTable
 *
 * @controlProperty name
 */
export interface TableCreationModeCreationDialogOPTreeTable extends TableCreationModeOPTreeTable {
    /**
     * Defines the creation mode to be used by the tree table.
     * Allowed values are 'NewPage', 'Inline', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline.
     * - CreationDialog: The creation is performed in the table using a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise it is 'Inline'.
     */
    name?: TableCreationModeType.CreationDialog;
    /**
     * Defines the list of properties that will be displayed in the creation dialog, when the creation mode is set to 'CreationDialog'.
     * The value is a comma-separated list of property names.
     */
    creationFields?: string[];
}
export interface TableCreationModeOPTreeTable {
    /**
     * Defines the creation mode to be used by the tree table.
     * Allowed values are 'NewPage', 'Inline', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline.
     * - CreationDialog: The creation is performed in the table using a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise it is 'Inline'.
     */
    name?: TableCreationModeType.NewPage | TableCreationModeType.Inline | TableCreationModeType.CreationDialog;
    /**
     * Specifies if the new entry should be placed at the position computed by the backend (e.g. taking sorting into account).
     * The default value is `false`. When set to `false`, the new entry is placed as the first child below its parent.
     */
    createInPlace?: boolean;
    /**
     * Defines the extension point to control the enablement of the "Create" button or "Create Menu" buttons.
     */
    isCreateEnabled?: string;
}
/**
 * Inline creation mode
 *
 * @controlProperty name
 */
export interface TableCreationModeInlineOPTable {
    /**
     * Defines the creation mode to be used by the table.
     * Allowed values are 'NewPage', 'Inline', 'InlineCreationsRows', 'External', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline
     * - InlineCreationsRows: The creation is performed inline with an empty row
     * - External: The creation is performed in a different application which is specified using the `outbound` parameter
     * - CreationDialog: The creation is performed in the table using a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise it is 'Inline'.
     */
    name?: TableCreationModeType.Inline;
    /**
     * Specifies if the new entry should be created at the top or bottom of a table when `creationMode` is set to `Inline`.
     * The default value is `false`.
     */
    createAtEnd?: boolean;
}
/**
 * InlineCreationsRows creation mode for the responsive table
 *
 * @controlProperty name
 */
export interface TableCreationModeInlineCreationsRowsOPResponsiveTable {
    /**
     * Defines the creation mode to be used by the table.
     * Allowed values are 'NewPage', 'Inline', 'InlineCreationsRows', 'External', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline
     * - InlineCreationsRows: The creation is performed inline with an empty row
     * - External: The creation is performed in a different application which is specified using the `outbound` parameter.
     * - CreationDialog: The creation is performed in the table using a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise it is 'Inline'.
     */
    name?: TableCreationModeType.InlineCreationRows;
    /**
     * Specifies if the new entry should be hidden when `creationMode` is set to `InlineCreationRows`. This only applies to responsive tables.
     * The default value is `false`.
     */
    inlineCreationRowsHiddenInEditMode?: boolean;
}
/**
 * InlineCreationsRows creation mode for the grid table
 *
 * @controlProperty name
 */
export interface TableCreationModeInlineCreationsRowsOPGridTable {
    /**
     * Defines the creation mode to be used by the table.
     * Allowed values are 'NewPage', 'Inline', 'InlineCreationsRows', 'External', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline
     * - InlineCreationsRows: The creation is performed inline with an empty row
     * - External: The creation is performed in a different application which is specified using the `outbound` parameter.
     * - CreationDialog: The creation is performed in the table using a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise it is 'Inline'.
     */
    name?: TableCreationModeType.InlineCreationRows;
}
/**
 * NewPage creation mode
 *
 * @defaultControlProperty true
 * @controlProperty name
 */
export interface TableCreationModeNewPageOPTable {
    /**
     * Defines the creation mode to be used by the table.
     * Allowed values are 'NewPage', 'Inline', 'InlineCreationsRows', 'External', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline
     * - InlineCreationsRows: The creation is performed inline with an empty row
     * - External: The creation is performed in a different application which is specified using the `outbound` parameter.
     * - CreationDialog: The creation is performed in the table using a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise it is 'Inline'.
     */
    name?: TableCreationModeType.NewPage;
}
/**
 * CreationDialog creation mode
 *
 * @controlProperty name
 */
export interface TableCreationModeCreationDialogOPTable {
    /**
     * Defines the creation mode to be used by the table.
     * Allowed values are 'NewPage', 'Inline', 'InlineCreationsRows', 'External', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline
     * - InlineCreationsRows: The creation is performed inline with an empty row
     * - External: The creation is performed in a different application which is specified using the `outbound` parameter.
     * - CreationDialog: The creation is performed in the table using a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise it is 'Inline'.
     */
    name?: TableCreationModeType.CreationDialog;
    /**
     * Defines the list of properties that will be displayed in the creation dialog, when the creation mode is set to 'CreationDialog'.
     * The value is a comma-separated list of property names.
     */
    creationFields?: string[];
}
/**
 * External creation mode
 *
 * @controlProperty name
 */
export interface TableCreationModeExternalOPTable {
    /**
     * Defines the creation mode to be used by the table.
     * Allowed values are 'NewPage', 'Inline', 'InlineCreationsRows', 'External', or 'CreationDialog'.
     *
     * - NewPage: The created document is shown in a new page, depending on whether 'Sync', 'Async', or 'Deferred' is specified in the metadata.
     * - Inline: The creation is performed inline
     * - InlineCreationsRows: The creation is performed inline with an empty row
     * - External: The creation is performed in a different application which is specified using the `outbound` parameter.
     * - CreationDialog: The creation is performed in the table using a dialog which allows you to specify some initial property values which are listed in 'creationFields'.
     *
     * If the 'name' property is not set:
     * If 'navigation' is defined, the default value is 'NewPage'. Otherwise it is 'Inline'.
     */
    name?: TableCreationModeType.External;
    /**
     * The navigation target where the document is created when `creationMode` is set to `External`.
     */
    outbound?: string;
}
export interface PersonalizationTypeOP {
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
export interface QuickVariantSelectionV4OP {
    /**
     * List of annotation paths referring to SelectionVariant annotations.
     */
    paths: AnnotationPathAsObject[];
    /**
     * You can hide the table and display only the titles of the tabs. To do so, add the hideTableTitle option and set it to true.
     */
    hideTableTitle?: boolean;
    /**
     * You can show the counts of entries of each view. To do so, add the showCounts option and set it to true.
     */
    showCounts?: boolean;
}
export interface GenericColumnsOP {
    [key: string]: ObjectPageTableColumnIF | ObjectPageTableColumnAction | TableCustomColumnOP;
}
export interface TableSettingsOP extends TableSettings {
    /**
     * Defines the personalization mode which is only effective if the variant management on the page is set to `Page` or `Control`.
     * By default all table settings are enabled. You can change this for the different parts of the table by setting the properties 'Column', 'Sort' and 'Filter' accordingly.
     * Omitting a property is treated as false, this allows apps to avoid getting new features like grouping in upcoming releases.
     */
    personalization?: PersonalizationTypeOP | boolean;
    /**
     * With quickVariantSelection, you can switch to multiple views (single table mode). It links to a SelectionVariant (filters) or SelectionPresentationVariant (filters and sorters) that you have added to your annotations.
     */
    quickVariantSelection?: QuickVariantSelectionV4OP;
    columns?: GenericColumnsOP;
    /**
     * Mass editing allows end users to simultaneously change multiple objects that share the same editable properties.
     */
    enableMassEdit?: EnableMassEdit;
}
//# sourceMappingURL=ObjectPageTable.d.ts.map