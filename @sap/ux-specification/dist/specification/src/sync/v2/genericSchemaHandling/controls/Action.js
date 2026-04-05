"use strict";
/**
 * @file This file contains the classes implementing the interfaces defined in the corresponding types file.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toolbar = exports.Actions = exports.Action = exports.Share = void 0;
exports.getControlId4ActionInfo = getControlId4ActionInfo;
exports.adaptProcessingRuleForToolbar = adaptProcessingRuleForToolbar;
const decoration_1 = require("../../../common/decoration");
const common_1 = require("../../../common");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const utils_1 = require("../../generate/utils");
const stableIdUtils_1 = require("../../generate/stableIdUtils");
class Share {
}
exports.Share = Share;
__decorate([
    (0, decoration_1.syncRule)({
        flex: { controlType: () => ux_specification_types_1.ControlType.Button },
        processingRuleAdapter: (processingRule) => {
            processingRule.controlId = 'template::Share';
        }
    })
], Share.prototype, "visible", void 0);
/**
 * Common syncRule for all properties of an action, since they all have artifactType FlexChange and all belong to the same control.
 */
const syncRuleForAction = {
    flex: {
        controlType: () => ux_specification_types_1.ControlType.Button
    },
    processingRuleAdapter(processingRule, schemaHandlingParams) {
        const actionDetail = schemaHandlingParams.specificParams;
        if (actionDetail.controlId) {
            processingRule.controlId = actionDetail.controlId;
        }
        else {
            delete processingRule.element; // properties of an action without stable id cannot be modified by flex changes
        }
    }
};
// Action
// An instance of this class represents one action residing in one toolbar or a column.
// Its processingRuleAdapter function relies on the fact that an instance of ActionInfo
// is provided in schemaHandlingParams.specificParams providing more details on the action.
// Note that all properties of an action have ArtifactType 'FlexChange'. Thereby the control is always the button representing the action.
let Action = class Action {
};
exports.Action = Action;
__decorate([
    (0, decoration_1.syncRule)(syncRuleForAction)
], Action.prototype, "tooltip", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForAction)
], Action.prototype, "icon", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForAction)
], Action.prototype, "activeIcon", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForAction)
], Action.prototype, "type", void 0);
exports.Action = Action = __decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const actionInfo = schemaHandlingParams.specificParams;
            const element = processingRule.element;
            element[ux_specification_types_1.SchemaTag.isViewNode] = actionInfo.isViewNode;
            if (actionInfo.action) {
                element.description = actionInfo.dataField.description;
                element[ux_specification_types_1.SchemaTag.keys] = [
                    {
                        name: 'Action',
                        value: actionInfo.action.Action
                    }
                ];
                if (actionInfo.dataField.message) {
                    element[ux_specification_types_1.SchemaTag.messages] = [actionInfo.dataField.message];
                }
            }
            else {
                // todo
            }
            const actionDetail = {
                controlId: (0, stableIdUtils_1.getStableIdForDatafieldActionButton)(actionInfo)
            };
            processingRule.referenceAdaptation = {
                specificParams: actionDetail
            };
        }
    })
], Action);
/**
 * This function returns the stable id of (the button realizing)an action.
 * Up to now only implemented for annotations based actions.
 *
 * @param actionInfo - information about the action
 * @returns the stable id of the button realizing the action. If no stable id can be generated for the button: undefined.
 */
function getControlId4ActionInfo(actionInfo) {
    if (actionInfo.dataField) {
        return (0, stableIdUtils_1.getStableIdForDatafieldActionButton)(actionInfo);
    }
    return 'todo'; // todo: handle standard buttons
}
// Actions
// An instance of this class represents a list of actions residing in one toolbar.
// Note that the list of properties to be used for this class is dynamic (depending on the list of actions valid for the current toolbar)
let Actions = class Actions {
};
exports.Actions = Actions;
exports.Actions = Actions = __decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const actionsInfo = schemaHandlingParams.specificParams;
            const actionInfos = actionsInfo.actions;
            const element = processingRule.element;
            // Build the collection of properties for element based on the list of actions available (i.e. actionsInfo.actions)
            const properties = {}; // Initialization
            // In addition to the map property -> Definition which will be used as element.properties we need a ProcessingRulesAdapter
            // that knows how to process each of of these properties.
            // To achieve this we need to make the ActionInfo available for each of these properties. This is the purpose of actionInfoMap:
            const actionInfoMap = {};
            actionInfos.forEach(function (actionInfo, i) {
                const propertyDefinition = {
                    $ref: common_1.DEFINITION_LINK_PREFIX + 'Action'
                };
                propertyDefinition[ux_specification_types_1.SchemaTag.propertyIndex] = i;
                const property = getControlId4ActionInfo(actionInfo);
                properties[property] = propertyDefinition;
                actionInfoMap[property] = actionInfo;
            });
            element.properties = properties;
            element.additionalProperties = false;
            element[ux_specification_types_1.SchemaTag.icon] = 'Export'; // do not use member of enum UiIcons in @sap-ux/ui-components to avoid unwanted dependency
            const processingRulesAdapter = function (property, processingRule) {
                const actionInfo = actionInfoMap[property];
                // Forward the handling of the property to class Action:
                processingRule.referenceAdaptation = {
                    suffix: (0, common_1.prepareRef)(property), // ensure that a specific copy of type Action will be created in the specific schema
                    syncRuleProvider: Action,
                    specificParams: actionInfo
                };
            };
            processingRule.referenceAdaptation = {
                processingRulesAdapter
            };
        }
    })
], Actions);
class Toolbar {
}
exports.Toolbar = Toolbar;
__decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const toolbarInfo = schemaHandlingParams.specificParams;
            const actionsInfo = {
                actions: toolbarInfo.dataFields.map(function (dataFieldInfo) {
                    // All data fields which are placed in a toolbar are instances of DataFieldForActionAbstractTypes which justifies the following type cast
                    const action = dataFieldInfo.dataField;
                    return {
                        dataField: dataFieldInfo,
                        action,
                        isDetermining: toolbarInfo.target === utils_1.DataFieldTarget.Footer,
                        isChart: toolbarInfo.isChart,
                        iconTabFilterKey: toolbarInfo.iconTabFilterKey,
                        isViewNode: true
                    };
                })
            };
            processingRule.referenceAdaptation = {
                suffix: toolbarInfo.target + (0, stableIdUtils_1.getSuffixFromIconTabFilterKey)(toolbarInfo.iconTabFilterKey),
                syncRuleProvider: Actions,
                specificParams: actionsInfo
            };
        }
    })
], Toolbar.prototype, "actions", void 0);
/**
 * Helper function to be used in the processingRuleAdapter of a node possessing a child node of type Toolbar.
 *
 * @param processingRule - the processingRule to be adapted
 * @param target - location of the toolbar
 * @param dataFieldInfos - List of data fields contributing to the toolbar
 * @param isChart - Is the toolbar shown as a chart toolbar
 * @param iconTabFilterKey - Key identifying the view in multi-view case
 */
function adaptProcessingRuleForToolbar(processingRule, target, dataFieldInfos, isChart, iconTabFilterKey) {
    if (isChart || !dataFieldInfos) {
        delete processingRule.element; // no toolbar
        return; // todo: How can the toolbar of a chart be determined?
    }
    // Determine the data fields  which contribute to the specified toolbar
    const actionFields = dataFieldInfos.filter(function (datafieldInfo) {
        return datafieldInfo.target === target;
    });
    const toolBarInfo = {
        dataFields: actionFields,
        target,
        isChart,
        iconTabFilterKey
    };
    processingRule.referenceAdaptation = {
        suffix: target + (0, stableIdUtils_1.getSuffixFromIconTabFilterKey)(toolBarInfo.iconTabFilterKey), // ensure that a specific type is created for this toolbar
        specificParams: toolBarInfo,
        syncRuleProvider: Toolbar
    };
}
//# sourceMappingURL=Action.js.map