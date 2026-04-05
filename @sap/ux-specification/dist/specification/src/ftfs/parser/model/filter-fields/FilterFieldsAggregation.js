"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterFieldsAggregation = exports.VISUAL_FILTER_PROPERTY_NAME = void 0;
const types_1 = require("../types");
const ObjectAggregation_1 = require("../ObjectAggregation");
const FilterFieldAggregation_1 = require("./FilterFieldAggregation");
exports.VISUAL_FILTER_PROPERTY_NAME = 'visualFilters';
/**
 * Represents an aggregation for filter fields objects.
 */
class FilterFieldsAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Creates an instance of `FilterFieldsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        this.sortableList = true;
        this.allowedAnnotationCreationForms = [types_1.AggregationCreationForm.NativeFilterFields];
        this.childClass = FilterFieldAggregation_1.FilterFieldAggregation;
        this.i18nKey = 'FILTER_FIELDS';
        const additionalProperties = schema?.additionalProperties;
        if (typeof additionalProperties === 'object' && additionalProperties.$ref && !this.isMacrosNode()) {
            this.schemaCreationForms = [
                {
                    name: types_1.AggregationCreationForm.CustomFilterField,
                    kind: types_1.SCHEMA_CREATION_FORM,
                    title: 'PAGE_EDITOR_OUTLINE_ADD_CUSTOM_FILTER_FIELDS_TITLE',
                    disabled: false
                }
            ];
        }
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
        this.formSchema = this.additionalProperties?.aggregations['selectionFields'];
        const filterFields = data || {};
        for (const id in filterFields) {
            const filterField = this.aggregations[id];
            if (filterField?.schema && !filterField.schema.annotationPath) {
                filterField.markAsCustomFilterField();
            }
        }
    }
}
exports.FilterFieldsAggregation = FilterFieldsAggregation;
//# sourceMappingURL=FilterFieldsAggregation.js.map