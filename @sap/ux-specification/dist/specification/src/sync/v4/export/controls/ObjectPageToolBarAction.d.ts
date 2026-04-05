import type { v4 } from '@sap/ux-specification-types';
import type { FormAction } from './ObjectPageForm';
import type { CustomFormActionOP } from './ObjectPageFormAction';
export declare class ObjectPageToolBarActionBase implements v4.ObjectPageToolBarActionBase {
    enableOnSelect?: v4.SelectType;
}
export declare class ObjectPageToolBarAction extends ObjectPageToolBarActionBase implements v4.ObjectPageToolBarAction {
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class ObjectPageToolBarActionGroup implements v4.ObjectPageToolBarActionGroup {
    [key: string]: ObjectPageToolBarActionBase | number | v4.ActionPriority;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
/**
 * Sync class for Position
 */
export declare class CustomActionPositionOP implements v4.CustomActionPositionOP {
    anchor?: string;
    placement: v4.ActionPlacement;
}
export declare class CustomActionOPBase implements v4.CustomActionElement {
    menu: string[];
    text: string;
    position: CustomActionPositionOP;
    requiresSelection?: boolean;
    visible?: boolean;
    enabled?: boolean;
    overflowGroup?: number;
    priority?: v4.ActionPriority;
}
export declare class CustomTableActionOP extends CustomActionOPBase implements v4.CustomTableActionOP {
    press: string;
}
export declare class ObjectPageCustomActionMenu extends CustomActionOPBase implements v4.ObjectPageCustomActionMenu {
    actions?: ObjectPageCustomActionMenuActions;
    defaultAction?: string;
}
export declare class ObjectPageCustomActionMenuActions implements v4.ObjectPageCustomActionMenuActions {
    [id: string]: CustomTableActionOP | ObjectPageToolBarAction | FormAction | CustomFormActionOP;
}
export declare class ObjectPageToolBarActions implements v4.ObjectPageToolBarActions {
    [key: string]: ObjectPageToolBarAction | CustomTableActionOP | ObjectPageCustomActionMenu | ObjectPageToolBarActionGroup;
}
//# sourceMappingURL=ObjectPageToolBarAction.d.ts.map