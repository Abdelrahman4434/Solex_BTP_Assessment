"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModel = getModel;
const model_1 = require("./model");
__exportStar(require("./model"), exports);
/**
 * Method initializes and returns model.
 *
 * @param schema JSON schema.
 * @param data Page or application config.
 * @param pageType Page type.
 * @param annotation Page annotations.
 * @returns Initialized model.
 */
function getModel(schema, data, pageType, annotation) {
    return new model_1.TreeModel('Root', data, schema, annotation ?? {
        dynamicNodes: {},
        nodes: []
    }, pageType);
}
//# sourceMappingURL=index.js.map