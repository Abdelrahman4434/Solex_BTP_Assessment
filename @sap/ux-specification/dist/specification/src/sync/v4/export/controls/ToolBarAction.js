"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewCustomActionMenuActions = exports.ViewCustomActionMenu = exports.ViewTableCustomAction = exports.ViewTableCustomActionBase = exports.ViewCustomActionPosition = exports.CustomTableAction = exports.CustomTableActionBase = exports.CustomActionPosition = exports.ViewToolBarAction = exports.ViewToolBarActionBase = exports.ViewToolBarActionGroup = exports.ToolBarActionGroup = exports.ToolBarAction = exports.ToolBarActionBase = exports.ActionAfterExecutionConfigurationToolBarLR = void 0;
const decorators_1 = require("../../../common/decoration/decorators");
const application_1 = require("../../application");
const control_1 = require("../../../common/decoration/control");
const actions_1 = require("../actions");
const sync_rules_1 = require("../../sync-rules");
class ActionAfterExecutionConfigurationToolBarLR {
}
exports.ActionAfterExecutionConfigurationToolBarLR = ActionAfterExecutionConfigurationToolBarLR;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey, targetAnnotation) => (0, application_1.getActionsPathForLR)(pageName, manifest, sectionId, columnKey, targetAnnotation) + '/afterExecution'
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/2c65f07f44094012a511d6bd83f50f2d')
], ActionAfterExecutionConfigurationToolBarLR.prototype, "navigateToInstance", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey, targetAnnotation) => (0, application_1.getActionsPathForLR)(pageName, manifest, sectionId, columnKey, targetAnnotation) + '/afterExecution'
        }
    })
], ActionAfterExecutionConfigurationToolBarLR.prototype, "enableAutoScroll", void 0);
class ToolBarActionBase {
}
exports.ToolBarActionBase = ToolBarActionBase;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    })
], ToolBarActionBase.prototype, "enableOnSelect", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    })
], ToolBarActionBase.prototype, "afterExecution", void 0);
class ToolBarAction extends ToolBarActionBase {
}
exports.ToolBarAction = ToolBarAction;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], ToolBarAction.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ToolBarAction.prototype, "priority", void 0);
class ToolBarActionGroup {
}
exports.ToolBarActionGroup = ToolBarActionGroup;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getGroupedActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], ToolBarActionGroup.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getGroupedActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ToolBarActionGroup.prototype, "priority", void 0);
class ViewToolBarActionGroup {
}
exports.ViewToolBarActionGroup = ViewToolBarActionGroup;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getGroupedActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], ViewToolBarActionGroup.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getGroupedActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ViewToolBarActionGroup.prototype, "priority", void 0);
class ViewToolBarActionBase extends sync_rules_1.Decorator {
}
exports.ViewToolBarActionBase = ViewToolBarActionBase;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    })
], ViewToolBarActionBase.prototype, "enableOnSelect", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    })
], ViewToolBarActionBase.prototype, "afterExecution", void 0);
class ViewToolBarAction extends ViewToolBarActionBase {
}
exports.ViewToolBarAction = ViewToolBarAction;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], ViewToolBarAction.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ViewToolBarAction.prototype, "priority", void 0);
/**
 * Sync class for Position
 */
class CustomActionPosition {
}
exports.CustomActionPosition = CustomActionPosition;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey, targetAnnotation) => (0, application_1.getActionsPathForLR)(pageName, manifest, sectionId, columnKey, targetAnnotation) + '/position'
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionPosition.prototype, "anchor", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey, targetAnnotation) => (0, application_1.getActionsPathForLR)(pageName, manifest, sectionId, columnKey, targetAnnotation) + '/position'
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomActionPosition.prototype, "placement", void 0);
class CustomTableActionBase {
}
exports.CustomTableActionBase = CustomTableActionBase;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR,
            export: actions_1.exportActionMenuMenu
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomTableActionBase.prototype, "menu", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomTableActionBase.prototype, "text", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomTableActionBase.prototype, "position", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomTableActionBase.prototype, "requiresSelection", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        },
        generate: control_1.addPatternForBindingChangeOfEnumLR
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomTableActionBase.prototype, "visible", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        },
        generate: control_1.addPatternForBindingChangeOfEnumLR
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomTableActionBase.prototype, "enabled", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], CustomTableActionBase.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], CustomTableActionBase.prototype, "priority", void 0);
class CustomTableAction extends CustomTableActionBase {
}
exports.CustomTableAction = CustomTableAction;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomTableAction.prototype, "press", void 0);
/**
 * Sync class for Position
 */
class ViewCustomActionPosition {
}
exports.ViewCustomActionPosition = ViewCustomActionPosition;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionPositionPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewCustomActionPosition.prototype, "anchor", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionPositionPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewCustomActionPosition.prototype, "placement", void 0);
class ViewTableCustomActionBase {
}
exports.ViewTableCustomActionBase = ViewTableCustomActionBase;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView,
            export: actions_1.exportActionMenuMenu
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewTableCustomActionBase.prototype, "menu", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewTableCustomActionBase.prototype, "text", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewTableCustomActionBase.prototype, "position", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewTableCustomActionBase.prototype, "requiresSelection", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        },
        generate: control_1.addPatternForBindingChangeOfEnumLR
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewTableCustomActionBase.prototype, "visible", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        },
        generate: control_1.addPatternForBindingChangeOfEnumLR
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewTableCustomActionBase.prototype, "enabled", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], ViewTableCustomActionBase.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], ViewTableCustomActionBase.prototype, "priority", void 0);
class ViewTableCustomAction extends ViewTableCustomActionBase {
}
exports.ViewTableCustomAction = ViewTableCustomAction;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewTableCustomAction.prototype, "press", void 0);
class ViewCustomActionMenu extends ViewTableCustomActionBase {
}
exports.ViewCustomActionMenu = ViewCustomActionMenu;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView,
            export: actions_1.exportActionMenuAction
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewCustomActionMenu.prototype, "actions", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForView,
            export: actions_1.exportActionMenuDefaultAction
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], ViewCustomActionMenu.prototype, "defaultAction", void 0);
class ViewCustomActionMenuActions {
}
exports.ViewCustomActionMenuActions = ViewCustomActionMenuActions;
//# sourceMappingURL=ToolBarAction.js.map