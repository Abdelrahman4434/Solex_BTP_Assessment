import type { ActionAfterExecutionConfiguration } from '../webapp/manifest/ManifestSettings';
import type { CustomAction, CustomActionPosition, CustomActionMenu, ViewCustomActionMenu } from './CustomAction';
import type { ActionPriority, GroupableAction } from './Action';
interface ActionAfterExecutionConfigurationToolBarLR extends ActionAfterExecutionConfiguration {
}
export declare enum SelectType {
    single = "single",
    multi = "multi"
}
export interface ToolBarActionBase {
    /**
     * Enables single selection for a bound action.
     */
    enableOnSelect?: SelectType;
    /**
     * Settings that control the behavior after creating a new entry.
     */
    afterExecution?: ActionAfterExecutionConfigurationToolBarLR;
}
/**
 * Action
 *
 * @isViewNode true
 */
export interface ToolBarAction extends ToolBarActionBase, GroupableAction {
}
export interface ToolBarActionGroup extends GroupableAction {
    [id: string]: ToolBarActionBase | number | ActionPriority;
}
export interface ViewToolBarActionGroup extends GroupableAction {
    [id: string]: ViewToolBarActionBase | number | ActionPriority;
}
export interface ViewToolBarActionBase {
    /**
     * Enables single selection for a bound action
     */
    enableOnSelect?: SelectType;
    /**
     * Settings that control the behavior after creating a new entry.
     */
    afterExecution?: ActionAfterExecutionConfigurationToolBarLR;
}
/**
 * Action
 *
 * @isViewNode true
 */
export interface ViewToolBarAction extends ViewToolBarActionBase, GroupableAction {
}
export interface ViewToolBarActionBase {
    /**
     * Enables single selection for a bound action
     */
    enableOnSelect?: SelectType;
    /**
     * Settings that control the behavior after creating a new entry.
     */
    afterExecution?: ActionAfterExecutionConfigurationToolBarLR;
}
/**
 * Action
 *
 * @isViewNode true
 */
export interface ViewToolBarAction extends ViewToolBarActionBase, GroupableAction {
}
export type ChartToolBarAction = GroupableAction;
/**
 * Action
 *
 * @isViewNode true
 */
export interface ViewToolBarAction extends ViewToolBarActionBase {
}
/**
 * Actions
 *
 * @isViewNode true
 */
export interface Actions {
    [key: string]: ToolBarAction | CustomTableAction | CustomActionMenu | ToolBarActionGroup;
}
/**
 * Actions
 *
 * @isViewNode true
 */
export interface ViewActions {
    [key: string]: ViewToolBarAction | ChartToolBarAction | ViewTableCustomAction | ViewCustomActionMenu | ViewToolBarActionGroup;
}
/**
 * Table Toolbar
 *
 * @isViewNode true
 */
export interface ToolBar {
    actions: Actions;
}
/**
 * Chart Toolbar
 *
 * @isViewNode true
 */
export interface ViewChartToolBar {
    actions: ViewActions;
}
export interface CustomTableAction extends CustomAction {
    /**
     * Indicates whether the action requires a selection of items.
     *
     * @artifactType XMLProperty
     */
    requiresSelection?: boolean;
}
export interface ViewCustomActionPosition extends CustomActionPosition {
    /**
     * The key of another action to be used as placement anchor.
     *
     * @artifactType Manifest
     */
    anchor?: string;
}
export interface ViewTableCustomAction extends CustomTableAction {
    /**
     * Defines the position of the action relative to other actions.
     *
     * @artifactType Manifest
     */
    position?: ViewCustomActionPosition;
}
export {};
//# sourceMappingURL=ToolBar.d.ts.map