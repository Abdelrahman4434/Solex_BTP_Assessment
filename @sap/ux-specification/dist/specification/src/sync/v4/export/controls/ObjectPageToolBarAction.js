"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectPageToolBarActions = exports.ObjectPageCustomActionMenuActions = exports.ObjectPageCustomActionMenu = exports.CustomTableActionOP = exports.CustomActionOPBase = exports.CustomActionPositionOP = exports.ObjectPageToolBarActionGroup = exports.ObjectPageToolBarAction = exports.ObjectPageToolBarActionBase = void 0;
const decorators_1 = require("../../../common/decoration/decorators");
const application_1 = require("../../application");
const control_1 = require("../../../common/decoration/control");
const actions_1 = require("../actions");
class ObjectPageToolBarActionBase {
}
exports.ObjectPageToolBarActionBase = ObjectPageToolBarActionBase;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    })
], ObjectPageToolBarActionBase.prototype, "enableOnSelect", void 0);
class ObjectPageToolBarAction extends ObjectPageToolBarActionBase {
}
exports.ObjectPageToolBarAction = ObjectPageToolBarAction;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], ObjectPageToolBarAction.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ObjectPageToolBarAction.prototype, "priority", void 0);
class ObjectPageToolBarActionGroup {
}
exports.ObjectPageToolBarActionGroup = ObjectPageToolBarActionGroup;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getGroupedActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], ObjectPageToolBarActionGroup.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getGroupedActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ObjectPageToolBarActionGroup.prototype, "priority", void 0);
/**
 * Sync class for Position
 */
class CustomActionPositionOP {
}
exports.CustomActionPositionOP = CustomActionPositionOP;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey) => (0, application_1.getActionsPathForOP)(pageName, manifest, sectionId, columnKey) + '/position'
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionPositionOP.prototype, "anchor", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey) => (0, application_1.getActionsPathForOP)(pageName, manifest, sectionId, columnKey) + '/position'
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionPositionOP.prototype, "placement", void 0);
class CustomActionOPBase {
}
exports.CustomActionOPBase = CustomActionOPBase;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP,
            export: actions_1.exportActionMenuMenu
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionOPBase.prototype, "menu", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionOPBase.prototype, "text", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionOPBase.prototype, "position", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionOPBase.prototype, "requiresSelection", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        },
        generate: control_1.addPatternForBindingChangeOfEnumOPV4
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionOPBase.prototype, "visible", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        },
        generate: control_1.addPatternForBindingChangeOfEnumOPV4
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionOPBase.prototype, "enabled", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], CustomActionOPBase.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], CustomActionOPBase.prototype, "priority", void 0);
class CustomTableActionOP extends CustomActionOPBase {
}
exports.CustomTableActionOP = CustomTableActionOP;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomTableActionOP.prototype, "press", void 0);
class ObjectPageCustomActionMenu extends CustomActionOPBase {
}
exports.ObjectPageCustomActionMenu = ObjectPageCustomActionMenu;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP,
            export: actions_1.exportActionMenuAction
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageCustomActionMenu.prototype, "actions", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP,
            export: actions_1.exportActionMenuDefaultAction
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ObjectPageCustomActionMenu.prototype, "defaultAction", void 0);
class ObjectPageCustomActionMenuActions {
}
exports.ObjectPageCustomActionMenuActions = ObjectPageCustomActionMenuActions;
class ObjectPageToolBarActions {
}
exports.ObjectPageToolBarActions = ObjectPageToolBarActions;
//# sourceMappingURL=ObjectPageToolBarAction.js.map