import type { v4 } from '@sap/ux-specification-types';
import { Decorator } from '../../sync-rules';
export declare class ActionAfterExecutionConfigurationToolBarLR implements v4.ActionAfterExecutionConfiguration {
    navigateToInstance?: boolean;
    enableAutoScroll?: boolean;
}
export declare class ToolBarActionBase implements v4.ToolBarActionBase {
    enableOnSelect?: v4.SelectType;
    afterExecution?: ActionAfterExecutionConfigurationToolBarLR;
}
export declare class ToolBarAction extends ToolBarActionBase implements v4.ToolBarAction {
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class ToolBarActionGroup implements v4.ToolBarActionGroup {
    [key: string]: ToolBarActionBase | number | v4.ActionPriority;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class ViewToolBarActionGroup implements v4.ViewToolBarActionGroup {
    [key: string]: ViewToolBarActionBase | number | v4.ActionPriority;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class ViewToolBarActionBase extends Decorator implements v4.ViewToolBarActionBase {
    enableOnSelect?: v4.SelectType;
    afterExecution?: ActionAfterExecutionConfigurationToolBarLR;
}
export declare class ViewToolBarAction extends ViewToolBarActionBase implements v4.ViewToolBarAction {
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
/**
 * Sync class for Position
 */
export declare class CustomActionPosition implements v4.CustomActionPosition {
    anchor?: string;
    placement: v4.ActionPlacement;
}
export declare class CustomTableActionBase implements v4.CustomActionElement {
    menu: string[];
    text: string;
    position: CustomActionPosition;
    requiresSelection?: boolean;
    visible?: boolean;
    enabled?: boolean;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class CustomTableAction extends CustomTableActionBase implements v4.CustomTableAction {
    press: string;
}
/**
 * Sync class for Position
 */
export declare class ViewCustomActionPosition implements v4.ViewCustomActionPosition {
    anchor?: string;
    placement: v4.ActionPlacement;
}
export declare class ViewTableCustomActionBase implements v4.CustomActionElement {
    menu: string[];
    text: string;
    position: CustomActionPosition;
    requiresSelection?: boolean;
    visible?: boolean;
    enabled?: boolean;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class ViewTableCustomAction extends ViewTableCustomActionBase implements v4.ViewTableCustomAction {
    press: string;
}
export declare class ViewCustomActionMenu extends ViewTableCustomActionBase implements v4.ViewCustomActionMenu {
    actions?: ViewCustomActionMenuActions;
    defaultAction?: string;
}
export declare class ViewCustomActionMenuActions implements v4.ViewCustomActionMenuActions {
    [id: string]: ToolBarAction | CustomTableAction | ToolBarActionGroup;
}
//# sourceMappingURL=ToolBarAction.d.ts.map