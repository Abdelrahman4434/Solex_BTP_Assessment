"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditionalObjectsAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
const AdditionalObjectAggregation_1 = require("./AdditionalObjectAggregation");
/**
 * Represents an aggregation for additional objects.
 */
class AdditionalObjectsAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Creates an instance of `AdditionalObjectsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        this.sortableList = false;
        this.childClass = AdditionalObjectAggregation_1.AdditionalObjectAggregation;
        this.i18nKey = 'ADDITIONALOBJECTS';
        // Custom creation form - check schema if supported
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
     * Overwritten to mark standard action.
     *
     * @param name Name of aggregation.
     * @param aggregation Aggregation to add.
     * @param path Array of path to aggregation.
     * @param order Order index.
     * @param overwrite Overwrite existing aggregation.
     * @returns Added aggregation.
     */
    addAggregation(name, aggregation, path, order, overwrite) {
        // Required for generic deletion(non annotation based deletion)
        aggregation.custom = true;
        return super.addAggregation(name, aggregation, path, order, overwrite);
    }
    /**
     * Overwritten method for data update of object page actions
     * Method receives current values for actions and detects custom actions.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Annotations data.
     */
    updatePropertiesValues(data, page, pageType, path, annotations) {
        super.updatePropertiesValues(data, page, pageType, path, annotations);
        if (this.name) {
            this.formSchema = this.additionalProperties?.aggregations[this.name];
        }
    }
}
exports.AdditionalObjectsAggregation = AdditionalObjectsAggregation;
//# sourceMappingURL=AdditionalObjectsAggregation.js.map