"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomHeaderAction = exports.CustomHeaderActionPosition = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const decorators_1 = require("../../../common/decoration/decorators");
const control_1 = require("../../../common/decoration/control");
const application_1 = require("../../application");
const DecoratorClass_1 = require("../../sync-rules/DecoratorClass");
const utils_1 = require("../../utils");
/**
 * Sync class for Position
 */
class CustomHeaderActionPosition {
}
exports.CustomHeaderActionPosition = CustomHeaderActionPosition;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey) => (0, application_1.getHeaderActionsPath)(pageName, manifest, sectionId, columnKey) + '/position'
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderActionPosition.prototype, "anchor", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName, manifest, sectionId, columnKey) => (0, application_1.getHeaderActionsPath)(pageName, manifest, sectionId, columnKey) + '/position'
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderActionPosition.prototype, "placement", void 0);
let CustomHeaderAction = class CustomHeaderAction extends DecoratorClass_1.Decorator {
    init() {
        super.init();
        (0, utils_1.addHeaderFooterCustomActionDefinition)(this.appSchema.get(), this.page.target, this.logger, this.getClassName(), ux_specification_types_1.DefinitionName.HeaderActions);
        (0, utils_1.addEnumForActionAnchor)(this.appSchema.get(), ux_specification_types_1.DefinitionName.HeaderActions, ux_specification_types_1.DefinitionName.CustomHeaderActionPosition);
    }
};
exports.CustomHeaderAction = CustomHeaderAction;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderAction.prototype, "text", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderAction.prototype, "position", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderAction.prototype, "press", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        },
        generate: control_1.addPatternForBindingChangeOfEnumLR
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderAction.prototype, "visible", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        },
        generate: control_1.addPatternForBindingChangeOfEnumLR
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], CustomHeaderAction.prototype, "enabled", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.142.0'
    })
], CustomHeaderAction.prototype, "overflowGroup", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getHeaderActionsPath
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], CustomHeaderAction.prototype, "priority", void 0);
exports.CustomHeaderAction = CustomHeaderAction = __decorate([
    decorators_1.isViewNode,
    (0, decorators_1.description)('Custom Action')
], CustomHeaderAction);
//# sourceMappingURL=HeaderAction.js.map