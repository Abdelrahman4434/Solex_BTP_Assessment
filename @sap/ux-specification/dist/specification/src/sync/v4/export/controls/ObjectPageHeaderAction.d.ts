import type { v4 } from '@sap/ux-specification-types';
import { CustomHeaderActionPosition } from './HeaderAction';
import { type RelatedApps } from '@sap/ux-specification-types/src/v4';
export declare class ActionAfterExecutionConfigurationObjectPageHeader implements v4.ActionAfterExecutionConfigurationObjectPageHeader {
    navigateToInstance?: boolean;
    enableAutoScroll?: boolean;
}
export declare class ObjectPageHeaderActionBase implements v4.ObjectPageHeaderActionBase {
    afterExecution?: ActionAfterExecutionConfigurationObjectPageHeader;
}
export declare class ObjectPageHeaderAction extends ObjectPageHeaderActionBase implements v4.ObjectPageHeaderAction {
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class ObjectPageHeaderActionGroup implements v4.ObjectPageHeaderActionGroup {
    [key: string]: ObjectPageHeaderActionBase | number | v4.ActionPriority;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
/**
 * Sync class for Position
 */
export declare class CustomHeaderActionPositionOP extends CustomHeaderActionPosition {
}
export declare class CustomHeaderActionOPBase implements v4.CustomActionElement {
    menu: string[];
    text: string;
    position?: CustomHeaderActionPositionOP;
    visible?: boolean;
    enabled?: boolean;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class CustomHeaderActionOP extends CustomHeaderActionOPBase implements v4.CustomHeaderActionOP {
    press: string;
}
export declare class ObjectPageHeaderCustomActionMenu extends CustomHeaderActionOPBase implements v4.ObjectPageHeaderCustomActionMenu {
    actions?: ObjectPageHeaderCustomActionMenuActions;
    defaultAction?: string;
}
export declare class ObjectPageHeaderCustomActionMenuActions implements v4.ObjectPageHeaderCustomActionMenuActions {
    [id: string]: ObjectPageHeaderAction | CustomHeaderActionOP | RelatedApps | ObjectPageHeaderActionGroup;
}
//# sourceMappingURL=ObjectPageHeaderAction.d.ts.map