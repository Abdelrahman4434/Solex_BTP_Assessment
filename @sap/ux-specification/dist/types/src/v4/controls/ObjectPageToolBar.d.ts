import type { CustomActionPositionOP, ObjectPageCustomActionMenu } from './CustomAction';
import type { ActionPriority, GroupableAction } from './Action';
import type { SelectType, CustomTableAction } from './ToolBar';
export interface ObjectPageToolBarActionBase {
    /**
     * Enables single selection for a bound action.
     */
    enableOnSelect?: SelectType;
}
/**
 * Action
 *
 * @isViewNode true
 */
export interface ObjectPageToolBarAction extends ObjectPageToolBarActionBase, GroupableAction {
}
export interface CustomTableActionOP extends CustomTableAction {
    /**
     * Defines the position of the action relative to the anchor action.
     *
     * @artifactType Manifest
     */
    position?: CustomActionPositionOP;
}
export interface ObjectPageToolBarActionGroup extends GroupableAction {
    [id: string]: ObjectPageToolBarActionBase | number | ActionPriority;
}
/**
 * Actions
 *
 * @isViewNode true
 */
export interface ObjectPageToolBarActions {
    [key: string]: ObjectPageToolBarAction | CustomTableActionOP | ObjectPageCustomActionMenu | ObjectPageToolBarActionGroup;
}
/**
 * Toolbar
 *
 * @isViewNode true
 */
export interface ObjectPageToolBar {
    actions: ObjectPageToolBarActions;
}
//# sourceMappingURL=ObjectPageToolBar.d.ts.map