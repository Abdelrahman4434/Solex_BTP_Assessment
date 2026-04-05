import type { Importance } from 'sap/uxap/library';
export declare enum Placement {
    After = "After",
    Before = "Before"
}
export interface Position {
    /**
     * The key of another column to be used as placement anchor.
     */
    anchor?: string;
    /**
     * Define the placement, either before or after the anchor column.
     */
    placement: Placement;
}
export interface ViewPosition {
    /**
     * The key of another column to be used as placement anchor.
     */
    anchor?: string;
    /**
     * Define the placement, either before or after the anchor column.
     */
    placement: Placement;
}
export type Positionable = {
    /**
     *   Defines the position of the column relative to other columns.
     */
    position?: Position;
};
export interface ActionAfterExecutionConfiguration {
    /**
     * Allows you to disable the navigation. By default, navigation is automatically triggered after you have performed an action.
     */
    navigateToInstance?: boolean;
    /**
     * Allows you to scroll to the newly created or changed item after you have performed an action.
     */
    enableAutoScroll?: boolean;
}
export declare enum Availability {
    'Default' = "Default",
    'Adaptation' = "Adaptation",
    'Hidden' = "Hidden"
}
export declare enum HorizontalAlign {
    'Begin' = "Begin",
    'Center' = "Center",
    'End' = "End"
}
/**
 * Table Column
 *
 * @isViewNode true
 */
export interface TableColumn {
    /**
     * A string type that represents CSS size values.
     * Refer to https://ui5.sap.com/api/sap.ui.core.CSSSize
     */
    width?: string;
    /**
     * Defines where the column should be shown.
     * Default: it will be shown by default in the table.
     * Adaptation: it will initially not be shown in the table but be available via end user adaptation.
     * Hidden: the column is neither available in the table nor in adaptation.
     */
    availability?: Availability;
    /**
     * By default, the column width is calculated based on the type of the content. You can include the column header in the width calculation using the widthIncludingColumnHeader setting in the manifest.json.
     */
    widthIncludingColumnHeader?: boolean;
}
/**
 * Table Column
 *
 * @isViewNode true
 */
export interface ViewTableColumn extends TableColumn {
}
/**
 * Table Column
 *
 * @isViewNode true
 */
export interface ObjectPageTableColumn extends TableColumn {
}
/**
 * Inline Action
 *
 * @isViewNode true
 */
export interface TableColumnAction extends TableColumn {
    /**
     * Settings that control the behavior after creating a new entry.
     */
    afterExecution?: ActionAfterExecutionConfiguration;
}
/**
 * Inline Action
 *
 * @isViewNode true
 */
export interface ViewTableColumnAction extends ViewTableColumn {
    /**
     * Settings that control the behavior after creating a new entry.
     */
    afterExecution?: ActionAfterExecutionConfiguration;
}
export type ColumnPropertiesType = string[];
/**
 * Inline Action for Object Page
 *
 * @isViewNode true
 */
export interface ObjectPageTableColumnAction extends ObjectPageTableColumn {
}
/**
 * Custom Column
 *
 * @isViewNode true
 */
export interface TableCustomColumn {
    /**
     * Defines the position of the column relative to other columns.
     *
     * @artifactType Manifest
     */
    position?: Position;
    /**
     * The header is shown on the table as header, as well as in the add/remove dialog.
     *
     * @i18nClassification COL: Custom column header text
     * @artifactType Manifest
     */
    header: string;
    /**
     * A string type that represents CSS size values.
     * Refer to https://ui5.sap.com/api/sap.ui.core.CSSSize
     *
     * @artifactType Manifest
     */
    width?: string;
    /**
     * Defines a target fragment.
     *
     * @artifactType Manifest
     */
    template: string;
    /**
     * Aligns the header as well as the content horizontally.
     *
     * @artifactType Manifest
     */
    horizontalAlign?: HorizontalAlign;
    /**
     * Defines where the column should be shown.
     * - Default: it will be shown by default in the table.
     * - Adaptation: it will initially not be shown in the table but be available via end user adaptation
     * - Hidden: the column is neither available in the table nor in adaptation
     *
     * @artifactType Manifest
     */
    availability?: Availability;
    /**
     * If provided and sorting for the table is enabled, the custom column header can be clicked.
     * Once clicked, a list of properties that can be sorted by are displayed.
     *
     * @artifactType Manifest
     */
    properties?: ColumnPropertiesType;
    /**
     *
     * Determines whether a custom column is required.
     * If set to true, an asterisk is displayed in the column header.
     *
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/d525522c1bf54672ae4e02d66b38e60c
     */
    required?: boolean;
    /**
     *
     * The responsive table provides a feature where the table automatically moves columns to the pop-in area in the following order based on their importance:
     * - Columns with "Low" importance are hidden first.
     * - Columns with "Medium" importance are hidden next.
     * - Columns with "High" importance are always displayed.
     *
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/d525522c1bf54672ae4e02d66b38e60c
     */
    importance?: Importance.Low | Importance.Medium | Importance.High;
    /**
     *
     * The tooltip is shown on the header of a custom column when a user hovers over it.
     *
     * @i18nClassification COL: Custom column tooltip text
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/d525522c1bf54672ae4e02d66b38e60c
     */
    tooltip?: string;
}
/**
 * Custom Column
 *
 * @isViewNode true
 */
export interface ViewTableCustomColumn {
    /**
     * Defines the position of the column relative to other columns.
     *
     * @artifactType Manifest
     */
    position?: ViewPosition;
    /**
     * The header appears in the table as a header, as well as in the add and remove dialogs.
     *
     * @i18nClassification COL: Custom column header text
     * @artifactType Manifest
     */
    header: string;
    /**
     * A string type that represents CSS size values.
     * Refer to https://ui5.sap.com/api/sap.ui.core.CSSSize
     *
     * @artifactType Manifest
     */
    width?: string;
    /**
     * Defines a target fragment.
     *
     * @artifactType Manifest
     */
    template: string;
    /**
     * Aligns the header as well as the content horizontally.
     *
     * @artifactType Manifest
     */
    horizontalAlign?: HorizontalAlign;
    /**
     * Defines where the column should be shown.
     * - Default: it will be shown by default in the table.
     * - Adaptation: it will initially not be shown in the table but be available via end user adaptation
     * - Hidden: the column is neither available in the table nor in adaptation
     *
     * @artifactType Manifest
     */
    availability?: Availability;
    /**
     * If provided and sorting for the table is enabled, the custom column header can be clicked.
     * Once clicked, a list of properties that can be sorted by are displayed.
     *
     * @artifactType Manifest
     */
    properties?: ColumnPropertiesType;
    /**
     *
     * Determines whether a custom column is required.
     * If set to true, an asterisk is displayed in the column header.
     *
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/d525522c1bf54672ae4e02d66b38e60c
     */
    required?: boolean;
    /**
     *
     * The responsive table provides a feature where the table automatically moves columns to the pop-in area in the following order based on their importance:
     * - Columns with "Low" importance are hidden first.
     * - Columns with "Medium" importance are hidden next.
     * - Columns with "High" importance are always displayed.
     *
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/d525522c1bf54672ae4e02d66b38e60c
     */
    importance?: Importance.Low | Importance.Medium | Importance.High;
    /**
     *
     * The tooltip is shown on the header of a custom column when a user hovers over it.
     *
     * @i18nClassification COL: Custom column tooltip text
     * @artifactType Manifest
     * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/d525522c1bf54672ae4e02d66b38e60c
     */
    tooltip?: string;
}
//# sourceMappingURL=ManifestSettings.d.ts.map