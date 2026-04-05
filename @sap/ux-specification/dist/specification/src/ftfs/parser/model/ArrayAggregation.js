"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayAggregation = void 0;
const types_1 = require("./types");
const i18next_1 = __importDefault(require("i18next"));
const ObjectAggregation_1 = require("./ObjectAggregation");
/**
 * Represents an aggregation for array object.
 */
class ArrayAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Creates an instance of `ArrayAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        this.type = types_1.AggregationType.Array;
        this.schemaCreationForms = [
            {
                name: types_1.AggregationCreationForm.Generic,
                kind: types_1.SCHEMA_CREATION_FORM,
                title: 'PAGE_EDITOR_OUTLINE_ADD_GENERIC_TITLE',
                disabled: false
            }
        ];
    }
    /**
     * Method adds aggregation object.
     * Overwritten to modify array's children.
     *
     * @param name Name of aggregation.
     * @param aggregation Aggregation to add.
     * @param path Array of path to aggregation.
     * @param order Order index.
     * @returns Added aggregation.
     */
    addAggregation(name, aggregation, path, order) {
        super.addAggregation(name, aggregation, path, order);
        // Array items are sortable and deletable
        this.sortableList = true;
        aggregation.sortableItem = types_1.SortingOptions.Enabled;
        aggregation.actions = [types_1.AggregationActions.Delete];
        // Set main title
        if (aggregation.schema && !aggregation.schema.title) {
            // Apply custom title as node label for array element
            aggregation.schema.title = i18next_1.default.t('PAGE_EDITOR_OUTLINE_ARRAY_ITEM', {
                name: Number.parseInt(name, 10) + 1
            });
        }
        aggregation.custom = true;
        return aggregation;
    }
    /**
     * Public method which recursively updates aggregation's properties with values from passed data object.
     * Overwritten to update children aggregations depending on data.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     */
    updatePropertiesValues(data, page, pageType, path) {
        // Base update
        super.updatePropertiesValues(data, page, pageType, path);
        if (!Array.isArray(data)) {
            return;
        }
        // Update 'additionalText' property for child aggregations
        for (let i = 0; i < data.length; i++) {
            const aggregation = this.aggregations[i];
            if (!aggregation) {
                continue;
            }
            let additionalText;
            if (this.isAtomic) {
                additionalText = data[i];
            }
            else {
                const primaryKey = this.getPrimaryKey(aggregation);
                additionalText = primaryKey ? data[i][primaryKey] : undefined;
            }
            if (typeof additionalText !== 'object') {
                aggregation.additionalText = additionalText;
            }
        }
    }
    /**
     * Private method resolves primary property of aggregation.
     * Logic is that we look for certain properties like 'id', 'key', etc. If those properties do not exist, then we take first string property.
     *
     * @param aggregation Aggregation to add.
     * @returns Property name.
     */
    getPrimaryKey(aggregation) {
        // Get additional text for item array
        // Start with predefined most common properties
        const primaryProperties = ['id', 'title', 'key', 'name'];
        const schemaProperties = aggregation.schema ? aggregation.schema.properties || {} : {};
        let primaryProperty;
        for (const property of primaryProperties) {
            if (property in schemaProperties) {
                primaryProperty = property;
                break;
            }
        }
        // No match, then use very first string property
        for (const property in schemaProperties) {
            if (schemaProperties[property].type === 'string') {
                primaryProperty = property;
                break;
            }
        }
        return primaryProperty;
    }
}
exports.ArrayAggregation = ArrayAggregation;
//# sourceMappingURL=ArrayAggregation.js.map