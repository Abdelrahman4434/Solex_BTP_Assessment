import type { v4 } from '@sap/ux-specification-types';
import type { Importance } from 'sap/uxap/library';
export declare class ActionAfterExecutionConfiguration implements v4.ActionAfterExecutionConfiguration {
    navigateToInstance?: boolean;
    enableAutoScroll?: boolean;
}
/************************************
 * Sync class for TableColumn
 */
export declare class TableColumn implements v4.TableColumn {
    width?: string;
    availability?: v4.Availability;
    widthIncludingColumnHeader?: boolean;
}
/************************************
 * Sync class for ViewTableColumn
 */
export declare class ViewTableColumn implements v4.ViewTableColumn {
    width?: string;
    availability?: v4.Availability;
    widthIncludingColumnHeader?: boolean;
}
export declare class TableColumnAction extends TableColumn implements v4.TableColumnAction {
    afterExecution?: ActionAfterExecutionConfiguration;
    overflowGroup?: number;
}
export declare class ViewTableColumnAction extends ViewTableColumn implements v4.ViewTableColumnAction {
    afterExecution?: ActionAfterExecutionConfiguration;
    overflowGroup?: number;
}
/**
 * Sync class for Position
 */
export declare class Position implements v4.Position {
    anchor?: string;
    placement: v4.Placement;
}
/**
 * Sync class for ViewPosition
 */
export declare class ViewPosition implements v4.ViewPosition {
    anchor?: string;
    placement: v4.Placement;
}
/**
 * Sync class for TableCustomColumn
 */
export declare class TableCustomColumn implements v4.TableCustomColumn {
    position?: Position;
    header: string;
    width?: string;
    template: string;
    horizontalAlign?: v4.HorizontalAlign;
    availability?: v4.Availability;
    properties?: v4.ColumnPropertiesType;
    required?: boolean;
    importance?: Importance;
    tooltip?: string;
}
/**
 * Sync class for ViewTableCustomColumn
 */
export declare class ViewTableCustomColumn implements v4.ViewTableCustomColumn {
    position?: Position;
    header: string;
    width?: string;
    template: string;
    horizontalAlign?: v4.HorizontalAlign;
    availability?: v4.Availability;
    properties?: v4.ColumnPropertiesType;
    required?: boolean;
    importance?: Importance;
    tooltip?: string;
}
//# sourceMappingURL=TableColumn.d.ts.map