"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualFiltersAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const VisualFilterAggregation_1 = require("./VisualFilterAggregation");
/**
 * Represents an aggregation for visual filters objects.
 */
class VisualFiltersAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.sortableList = true;
        this.childClass = VisualFilterAggregation_1.VisualFilterAggregation;
        this.i18nKey = 'VISUAL_FILTERS';
    }
}
exports.VisualFiltersAggregation = VisualFiltersAggregation;
//# sourceMappingURL=VisualFiltersAggregation.js.map