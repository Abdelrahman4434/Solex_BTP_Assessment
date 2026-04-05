import type { v4 } from '@sap/ux-specification-types';
import type { Importance } from 'sap/uxap/library';
export declare class ActionAfterExecutionConfigurationOP implements v4.ActionAfterExecutionConfiguration {
    navigateToInstance?: boolean;
    enableAutoScroll?: boolean;
}
export declare class ObjectPageTableColumn implements v4.ObjectPageTableColumn {
    width?: string;
    availability?: v4.Availability;
    widthIncludingColumnHeader?: boolean;
}
export declare class ObjectPageTableColumnAction extends ObjectPageTableColumn implements v4.ObjectPageTableColumnAction {
}
export declare class PositionOP implements v4.PositionOP {
    anchor?: string;
    placement: v4.Placement;
}
export declare class TableCustomColumnOP implements v4.TableCustomColumnOP {
    position?: PositionOP;
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
//# sourceMappingURL=ObjectPageTableColumn.d.ts.map