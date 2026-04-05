"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldsAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const FieldAggregation_1 = require("./FieldAggregation");
const types_1 = require("../types");
/**
 * Represents an aggregation for fields objects.
 */
class FieldsAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.sortableList = true;
        this.childClass = FieldAggregation_1.FieldAggregation;
        this.allowedAnnotationCreationForms = [
            types_1.AggregationCreationForm.NativeField,
            types_1.AggregationCreationForm.NativeContactField,
            types_1.AggregationCreationForm.NativeConnectedFields
        ];
        this.sortableCollection = 'fields';
        this.i18nKey = 'FIELDS';
    }
    /**
     * Refreshes internal data based on annotation node data.
     * Overwritten to keep child nodes order the same as they defined in connected fields template.
     *
     * @param annotations Page annotations.
     */
    updateAnnotationData(annotations) {
        super.updateAnnotationData(annotations);
        if (this.path[0] === 'header') {
            this.allowedAnnotationCreationForms.splice(this.allowedAnnotationCreationForms.indexOf(types_1.AggregationCreationForm.NativeConnectedFields));
        }
    }
}
exports.FieldsAggregation = FieldsAggregation;
//# sourceMappingURL=FieldsAggregation.js.map