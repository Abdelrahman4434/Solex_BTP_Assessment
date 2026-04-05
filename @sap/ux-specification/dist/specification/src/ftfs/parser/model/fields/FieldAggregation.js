"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
const utils_1 = require("../utils");
/**
 * Represents an aggregation for field objects.
 */
class FieldAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.actions = [types_1.AggregationActions.Delete];
        this.sortableItem = types_1.SortingOptions.Enabled;
        this.isViewNode = true;
        this.sortableCollection = 'fields';
    }
    /**
     * Method returns display name of aggregation without applying i18n translation.
     * Overwritten for column handling.
     *
     * @returns Display name of aggregation.
     */
    getRawDisplayName() {
        const displayName = super.getRawDisplayName();
        if (!displayName) {
            // Fallback when no label presented
            const fieldName = this.getTechnicalName();
            if (fieldName) {
                return fieldName;
            }
        }
        return displayName;
    }
    /**
     * Method parses object path key and returns field name / technical id.
     *
     * @returns Field name / technical id.
     */
    getTechnicalName() {
        return (0, utils_1.getTechnicalIdFromPath)(this.path);
    }
}
exports.FieldAggregation = FieldAggregation;
//# sourceMappingURL=FieldAggregation.js.map