/**
 * @file This file contains the classes implementing the interfaces defined in the corresponding types file.
 */
import type { ButtonType } from 'sap/m/library';
import type { URI } from 'sap/ui/core/library';
import type { ProcessingRule } from '@sap/ux-specification-types';
import type * as v2 from '@sap/ux-specification-types/src/v2/genericSchemaHandling/controls/Action';
import type { DataFieldForActionAbstractTypes } from '@sap-ux/vocabularies-types/vocabularies/UI';
import { DataFieldTarget } from '../../generate/utils';
import type { DataFieldInfo } from '../../generate/utils';
export declare class Share implements v2.Share {
    visible?: boolean;
}
/**
 * An instance of this type collects the information about an action.
 * Normally the action is based on a DataFieldForAction/DataFieldForIntentBasedNavigation.
 * Instances are created in processingRuleAdapter of property 'actions' of class Toolbar.
 *
 * @property action - the actual action (i.e. the data field) from the ui annotations (if it exists)
 * @property dataField - additional information about the data field which defines this action (if the data field exists)
 * @property isDetermining - true if this action is a determining action (i.e. it is placed in the footer toolbar)
 * @property isChart - true if this action is part of a chart toolbar
 * @property iconTabFilterKey - filled with the key of the view this action belongs to in case the action is part of a table in a multi view multi table setting
 * @property isViewNode - determines whether the action should be visualized as separate node in the page editor tree
 */
export type ActionInfo = {
    action?: DataFieldForActionAbstractTypes;
    dataField?: DataFieldInfo;
    isDetermining?: boolean;
    isChart?: boolean;
    iconTabFilterKey?: string;
    isViewNode: boolean;
};
export declare class Action implements v2.Action {
    tooltip?: string;
    icon?: URI;
    activeIcon?: URI;
    type?: ButtonType;
}
/**
 * This function returns the stable id of (the button realizing)an action.
 * Up to now only implemented for annotations based actions.
 *
 * @param actionInfo - information about the action
 * @returns the stable id of the button realizing the action. If no stable id can be generated for the button: undefined.
 */
export declare function getControlId4ActionInfo(actionInfo: ActionInfo): string;
export declare class Actions implements v2.Actions {
    [key: string]: v2.Action;
}
export declare class Toolbar implements v2.Toolbar {
    actions: v2.Actions;
}
/**
 * Helper function to be used in the processingRuleAdapter of a node possessing a child node of type Toolbar.
 *
 * @param processingRule - the processingRule to be adapted
 * @param target - location of the toolbar
 * @param dataFieldInfos - List of data fields contributing to the toolbar
 * @param isChart - Is the toolbar shown as a chart toolbar
 * @param iconTabFilterKey - Key identifying the view in multi-view case
 */
export declare function adaptProcessingRuleForToolbar(processingRule: ProcessingRule, target: DataFieldTarget, dataFieldInfos?: DataFieldInfo[], isChart?: boolean, iconTabFilterKey?: string): void;
//# sourceMappingURL=Action.d.ts.map