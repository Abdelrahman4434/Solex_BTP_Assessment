"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionalObjectAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
/**
 * Represents an aggregation for additional object.
 */
class AdditionalObjectAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.actions = [types_1.AggregationActions.Delete];
    }
    /**
     * Method returns display name of aggregation.
     * Is used as display name in outline.
     * Overwritten to avoid translation attempt and "startCase" format.
     *
     * @returns Display name of aggregation.
     */
    getDisplayName() {
        if (this.name) {
            return this.name;
        }
        return super.getDisplayName();
    }
}
exports.AdditionalObjectAggregation = AdditionalObjectAggregation;
//# sourceMappingURL=AdditionalObjectAggregation.js.map