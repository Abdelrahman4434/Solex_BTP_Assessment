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
exports.ListHeader = exports.ListHeaderActions = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const decoration_1 = require("../../../common/decoration");
const Action_1 = require("./Action");
// ListHeaderActions
let ListHeaderActions = class ListHeaderActions {
};
exports.ListHeaderActions = ListHeaderActions;
__decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule) {
            processingRule.referenceAdaptation = {
                syncRuleProvider: Action_1.Share
            };
        }
    })
], ListHeaderActions.prototype, "Share", void 0);
exports.ListHeaderActions = ListHeaderActions = __decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule) {
            processingRule.element[ux_specification_types_1.SchemaTag.icon] = 'Export'; // do not use member of enum UiIcons in @sap-ux/ui-components to avoid unwanted dependency
        }
    })
], ListHeaderActions);
// ListHeader
let ListHeader = class ListHeader {
};
exports.ListHeader = ListHeader;
__decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule) {
            processingRule.referenceAdaptation = {
                syncRuleProvider: ListHeaderActions
            };
        }
    })
], ListHeader.prototype, "actions", void 0);
exports.ListHeader = ListHeader = __decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule) {
            processingRule.element[ux_specification_types_1.SchemaTag.icon] = 'Header'; // do not use member of enum UiIcons in @sap-ux/ui-components to avoid unwanted dependency
        }
    })
], ListHeader);
//# sourceMappingURL=ListHeader.js.map