"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const utils_1 = require("./utils");
/**
 * Represents an aggregation for table toolbar objects.
 */
class ToolbarAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Refreshes node locations based on the annotation node data.
     *
     * @param annotations All page annotation nodes.
     * @param currentUINode Current annotation node.
     */
    updateLocations(annotations, currentUINode) {
        super.updateLocations(annotations, currentUINode);
        (0, utils_1.updateTableChildNodeLocations)(this);
    }
}
exports.ToolbarAggregation = ToolbarAggregation;
//# sourceMappingURL=ToolbarAggregation.js.map