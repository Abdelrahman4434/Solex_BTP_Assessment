"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterFieldAggregation = void 0;
const i18next_1 = __importDefault(require("i18next"));
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
const utils_1 = require("../utils");
/**
 * Represents an aggregation for filter field objects.
 */
class FilterFieldAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.actions = [types_1.AggregationActions.Delete];
        this.sortableItem = types_1.SortingOptions.Enabled;
        this.isViewNode = true;
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
        const key = this.path[this.path.length - 1];
        if (key) {
            const separator = '::';
            const parts = key.toString().split(separator);
            const fieldName = parts[parts.length - 1];
            if (fieldName) {
                return fieldName;
            }
        }
    }
    /**
     * Public method to mark filter field as custom filter field.
     */
    markAsCustomFilterField() {
        this.custom = true;
        this.actions = [types_1.AggregationActions.OpenSource];
        if (!this.isMacrosNode()) {
            this.actions.push(types_1.AggregationActions.Delete);
        }
        this.sortableItem = types_1.SortingOptions.Enabled;
        this.additionalText = i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_FILTER_FIELD');
        this.i18nKey = this.parent?.i18nKey;
        if (this.isMacrosNode()) {
            // validate custom filterfield key
            (0, utils_1.validateMacrosExtension)(this);
        }
        // Validate anchor
        const anchor = this.properties.anchor;
        if (anchor?.value) {
            // Validate anchor if value exists
            const validEntries = anchor.schema.oneOf || [];
            if (!validEntries.some((entry) => entry.const === anchor.value)) {
                (0, utils_1.validateExtension)(this, false, i18next_1.default.t('PAGE_EDITOR_CUSTOM_EXTENSION_NO_ANCHOR'));
            }
        }
    }
    /**
     * Method adds property object.
     * Overwritten to disable "property" property - it is done till we clarify how to handle it correctly.
     *
     * @param name Name of property.
     * @param schema Schema object of property.
     * @returns Instance of new property.
     */
    addProperty(name, schema) {
        const property = super.addProperty(name, schema);
        if (name === 'property') {
            property.disabled = true;
        }
        return property;
    }
}
exports.FilterFieldAggregation = FilterFieldAggregation;
//# sourceMappingURL=FilterFieldAggregation.js.map