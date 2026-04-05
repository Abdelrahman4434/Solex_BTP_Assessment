"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomFormActionOP = void 0;
const decorators_1 = require("../../../common/decoration/decorators");
const application_1 = require("../../application");
const ObjectPageToolBarAction_1 = require("./ObjectPageToolBarAction");
class CustomFormActionOP extends ObjectPageToolBarAction_1.CustomActionOPBase {
}
exports.CustomFormActionOP = CustomFormActionOP;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomFormActionOP.prototype, "press", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], CustomFormActionOP.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getActionsPathForOP
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], CustomFormActionOP.prototype, "priority", void 0);
//# sourceMappingURL=ObjectPageFormAction.js.map