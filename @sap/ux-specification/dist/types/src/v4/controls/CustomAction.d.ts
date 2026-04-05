import type { CustomTableActionOP, ObjectPageToolBarAction } from './ObjectPageToolBar';
import type { CustomFormActionOP, FormAction } from './ObjectPageForm';
import type { ChartToolBarAction, CustomTableAction, ToolBarAction, ToolBarActionGroup, ViewCustomActionPosition, ViewTableCustomAction, ViewToolBarAction, ViewToolBarActionGroup } from './ToolBar';
import type { GroupableAction } from './Action';
export declare enum ActionPlacement {
    After = "After",
    Before = "Before"
}
export interface CustomActionPosition {
    /**
     * The key of another action or action menu to be used as a placement anchor.
     *
     * @artifactType Manifest
     */
    anchor?: string;
    /**
     * Defines the placement of the action or action menu relative to the placement anchor.
     *
     * @artifactType Manifest
     */
    placement: ActionPlacement;
}
export interface CustomActionElement extends GroupableAction {
    /**
     * List of action names from the manifest.
     *
     * @hidden true
     * @isViewNode false
     */
    menu?: string[];
    /**
     * Defines the position of the action relative to other actions or action menus.
     *
     * @artifactType Manifest
     */
    position?: CustomActionPosition;
    /**
     * The text that is displayed on the button. This is typically a binding to an i18n entry.
     *
     * @i18nClassification COL: Custom action text
     * @artifactType Manifest
     */
    text: string;
    /**
     * Determines if the action or action menu button is visible.
     *
     * @artifactType Manifest
     */
    visible?: boolean;
    /**
     * Defines if the action or action menu is enabled. The default value is true.
     *
     * @artifactType Manifest
     */
    enabled?: boolean;
}
/**
 * @isViewNode true
 */
export interface CustomActionMenuBase extends CustomActionElement {
    /**
     * List of action names from the manifest.
     *
     * @hidden true
     * @isViewNode false
     */
    menu: string[];
    /**
     * The default action for a menu button.
     *
     * @isViewNode false
     */
    defaultAction?: string;
    /**
     * List of actions.
     *
     * @hidden true
     * @isViewNode false
     */
    actions?: CustomActionMenuActionsBase;
    position?: CustomActionPositionOP;
}
/**
 * Action
 *
 * @isViewNode true
 */
export interface CustomAction extends CustomActionElement {
    /**
     * Relevant for extension actions; allows the definition of a target action handler.
     *
     * @artifactType Manifest
     */
    press: string;
}
export interface CustomActionPositionOP extends CustomActionPosition {
    /**
     * The key of another action or action menu to be used as a placement anchor.
     *
     * @artifactType Manifest
     */
    anchor?: string;
}
export interface CustomActionOP extends CustomAction {
    /**
     * Defines the position of the action relative to the anchor action or action menu.
     *
     * @artifactType Manifest
     */
    position?: CustomActionPositionOP;
}
/**
 * @isViewNode true
 */
export interface ObjectPageCustomActionMenu extends CustomActionMenuBase {
    /**
     * List of actions.
     *
     * @hidden true
     * @isViewNode false
     */
    actions?: ObjectPageCustomActionMenuActions;
}
/**
 * @isViewNode false
 */
export interface ObjectPageCustomActionMenuActions extends CustomActionMenuActionsBase {
    [id: string]: CustomTableActionOP | ObjectPageToolBarAction | FormAction | CustomFormActionOP;
}
/**
 * @isViewNode false
 */
export interface CustomActionMenuActionsBase {
    [id: string]: unknown;
}
/**
 * @isViewNode true
 */
export interface CustomActionMenu extends CustomActionMenuBase {
    /**
     * List of action names from the manifest.
     *
     * @hidden true
     * @isViewNode false
     */
    menu: string[];
    /**
     * List of actions.
     *
     * @hidden true
     * @isViewNode false
     */
    actions?: CustomActionMenuActions;
    position?: CustomActionPosition;
}
/**
 * @isViewNode false
 */
export interface CustomActionMenuActions {
    [id: string]: ToolBarAction | CustomTableAction | ToolBarActionGroup;
}
/**
 * @isViewNode true
 */
export interface ViewCustomActionMenu extends CustomActionMenuBase {
    /**
     * List of action names from the manifest.
     *
     * @hidden true
     * @isViewNode false
     */
    menu: string[];
    /**
     * List of actions.
     *
     * @hidden true
     * @isViewNode false
     */
    actions?: ViewCustomActionMenuActions;
    position?: ViewCustomActionPosition;
}
/**
 * @isViewNode false
 */
export interface ViewCustomActionMenuActions {
    [id: string]: ViewToolBarAction | ChartToolBarAction | ViewTableCustomAction | ViewToolBarActionGroup;
}
//# sourceMappingURL=CustomAction.d.ts.map