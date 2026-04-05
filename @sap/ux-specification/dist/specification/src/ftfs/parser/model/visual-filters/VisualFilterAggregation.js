"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualFilterAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
/**
 * Represents an aggregation for visual filter objects.
 */
class VisualFilterAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.sortableCollection = 'visualFilters';
        this.actions = [types_1.AggregationActions.Delete];
        this.isViewNode = true;
    }
}
exports.VisualFilterAggregation = VisualFilterAggregation;
//# sourceMappingURL=VisualFilterAggregation.js.map