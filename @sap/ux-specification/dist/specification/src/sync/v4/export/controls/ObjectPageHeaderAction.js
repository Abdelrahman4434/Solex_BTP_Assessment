"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPageHeaderCustomActionMenuActions = exports.ObjectPageHeaderCustomActionMenu = exports.CustomHeaderActionOP = exports.CustomHeaderActionOPBase = exports.CustomHeaderActionPositionOP = exports.ObjectPageHeaderActionGroup = exports.ObjectPageHeaderAction = exports.ObjectPageHeaderActionBase = exports.ActionAfterExecutionConfigurationObjectPageHeader = void 0;
const decorators_1 = require("../../../common/decoration/decorators");
const control_1 = require("../../../common/decoration/control");
const application_1 = require("../../application");
const HeaderAction_1 = require("./HeaderAction");
const actions_1 = require("../actions");
class ActionAfterExecutionConfigurationObjectPageHeader {
}
exports.ActionAfterExecutionConfigurationObjectPageHeader = ActionAfterExecutionConfigurationObjectPageHeader;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey) => (0, application_1.getHeaderActionsPath)(pageName, manifest, sectionId, columnKey) + '/afterExecution'
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/2c65f07f44094012a511d6bd83f50f2d')
], ActionAfterExecutionConfigurationObjectPageHeader.prototype, "navigateToInstance", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey) => (0, application_1.getHeaderActionsPath)(pageName, manifest, sectionId, columnKey) + '/afterExecution'
        }
    })
], ActionAfterExecutionConfigurationObjectPageHeader.prototype, "enableAutoScroll", void 0);
class ObjectPageHeaderActionBase {
}
exports.ObjectPageHeaderActionBase = ObjectPageHeaderActionBase;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageHeaderActionBase.prototype, "afterExecution", void 0);
class ObjectPageHeaderAction extends ObjectPageHeaderActionBase {
}
exports.ObjectPageHeaderAction = ObjectPageHeaderAction;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], ObjectPageHeaderAction.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ObjectPageHeaderAction.prototype, "priority", void 0);
class ObjectPageHeaderActionGroup {
}
exports.ObjectPageHeaderActionGroup = ObjectPageHeaderActionGroup;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getGroupedActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], ObjectPageHeaderActionGroup.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getGroupedActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ObjectPageHeaderActionGroup.prototype, "priority", void 0);
/**
 * Sync class for Position
 */
class CustomHeaderActionPositionOP extends HeaderAction_1.CustomHeaderActionPosition {
}
exports.CustomHeaderActionPositionOP = CustomHeaderActionPositionOP;
class CustomHeaderActionOPBase {
}
exports.CustomHeaderActionOPBase = CustomHeaderActionOPBase;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath,
            export: actions_1.exportActionMenuMenu
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderActionOPBase.prototype, "menu", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderActionOPBase.prototype, "text", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderActionOPBase.prototype, "position", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        },
        generate: control_1.addPatternForBindingChangeOfEnumOPV4
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderActionOPBase.prototype, "visible", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        },
        generate: control_1.addPatternForBindingChangeOfEnumOPV4
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderActionOPBase.prototype, "enabled", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], CustomHeaderActionOPBase.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], CustomHeaderActionOPBase.prototype, "priority", void 0);
class CustomHeaderActionOP extends CustomHeaderActionOPBase {
}
exports.CustomHeaderActionOP = CustomHeaderActionOP;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderActionOP.prototype, "press", void 0);
class ObjectPageHeaderCustomActionMenu extends CustomHeaderActionOPBase {
}
exports.ObjectPageHeaderCustomActionMenu = ObjectPageHeaderCustomActionMenu;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath,
            export: actions_1.exportActionMenuAction
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageHeaderCustomActionMenu.prototype, "actions", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath,
            export: actions_1.exportActionMenuDefaultAction
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageHeaderCustomActionMenu.prototype, "defaultAction", void 0);
class ObjectPageHeaderCustomActionMenuActions {
}
exports.ObjectPageHeaderCustomActionMenuActions = ObjectPageHeaderCustomActionMenuActions;
//# sourceMappingURL=ObjectPageHeaderAction.js.map