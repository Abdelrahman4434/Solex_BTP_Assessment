"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomActionMenuActions = exports.CustomActionMenu = exports.ToolBar = exports.Actions = void 0;
const ToolBarAction_1 = require("./ToolBarAction");
const common_1 = require("../../../common");
const application_1 = require("../../application");
const actions_1 = require("../actions");
class Actions {
}
exports.Actions = Actions;
class ToolBar {
}
exports.ToolBar = ToolBar;
class CustomActionMenu extends ToolBarAction_1.CustomTableActionBase {
}
exports.CustomActionMenu = CustomActionMenu;
__decorate([
    (0, common_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR,
            export: actions_1.exportActionMenuAction
        }
    }),
    (0, common_1.validity)({
        since: '1.84.0'
    })
], CustomActionMenu.prototype, "actions", void 0);
__decorate([
    (0, common_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForLR,
            export: actions_1.exportActionMenuDefaultAction
        }
    }),
    (0, common_1.validity)({
        since: '1.84.0'
    })
], CustomActionMenu.prototype, "defaultAction", void 0);
class CustomActionMenuActions {
}
exports.CustomActionMenuActions = CustomActionMenuActions;
//# sourceMappingURL=ToolBar.js.map