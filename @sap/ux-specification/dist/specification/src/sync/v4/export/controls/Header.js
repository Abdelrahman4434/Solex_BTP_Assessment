"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = exports.HeaderActions = void 0;
const sync_rules_1 = require("../../sync-rules");
const common_1 = require("../../../common");
let HeaderActions = class HeaderActions extends sync_rules_1.Decorator {
    init() {
        super.init();
        // addEnumForActionAnchor(this.appSchema.get(), this.getClassName(), DefinitionName.CustomHeaderActionPosition);
    }
};
exports.HeaderActions = HeaderActions;
exports.HeaderActions = HeaderActions = __decorate([
    common_1.isViewNode,
    (0, common_1.description)('Actions')
], HeaderActions);
class Header extends sync_rules_1.Decorator {
}
exports.Header = Header;
//# sourceMappingURL=Header.js.map