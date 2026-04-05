"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const utils_1 = require("../utils");
/**
 * Represents an aggregation for table objects.
 */
class TableAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Method parses object path key and returns table source entity name(target).
     *
     * @returns Table source entity name(target).
     */
    getTechnicalName() {
        const key = this.parent ? (0, utils_1.getTechnicalIdFromPath)(this.parent.path, true) : undefined;
        return key || super.getTechnicalName();
    }
}
exports.TableAggregation = TableAggregation;
//# sourceMappingURL=TableAggregation.js.map