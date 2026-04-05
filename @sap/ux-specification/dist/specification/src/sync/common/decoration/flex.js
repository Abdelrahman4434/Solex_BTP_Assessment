"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToFlexChange = exportToFlexChange;
const flexUtils_1 = require("../flexUtils");
/**
 * Exports a change definition to a flex change string.
 *
 * @param change - The change definition to be exported.
 * @param manifest - The manifest containing metadata for the change.
 * @returns The serialized flex change string.
 */
function exportToFlexChange(change, manifest) {
    return (0, flexUtils_1.createChangeString)(change, manifest);
}
//# sourceMappingURL=flex.js.map