import type { v4 } from '@sap/ux-specification-types';
import { type ToolBarAction, type CustomTableAction, type ToolBarActionGroup, CustomTableActionBase } from './ToolBarAction';
export declare class Actions implements v4.Actions {
    [key: string]: ToolBarAction | CustomTableAction | CustomActionMenu | ToolBarActionGroup;
}
export declare class ToolBar implements v4.ToolBar {
    actions: Actions;
}
export declare class CustomActionMenu extends CustomTableActionBase implements v4.CustomActionMenu {
    actions?: CustomActionMenuActions;
    defaultAction?: string;
}
export declare class CustomActionMenuActions implements v4.CustomActionMenuActions {
    [id: string]: ToolBarAction | CustomTableAction | ToolBarActionGroup;
}
//# sourceMappingURL=ToolBar.d.ts.map