"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsAggregation = exports.ActionType = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
const ActionAggregation_1 = require("./ActionAggregation");
// Remove when latest '@sap/ux-specification-types' is released
var ActionType;
(function (ActionType) {
    ActionType["Annotation"] = "Annotation";
    ActionType["Copy"] = "Copy";
    ActionType["Criticality"] = "Criticality";
    ActionType["Custom"] = "Custom";
    ActionType["Standard"] = "Standard";
    ActionType["StandardWithoutAnnotation"] = "StandardWithoutAnnotation";
})(ActionType || (exports.ActionType = ActionType = {}));
/**
 * Represents an aggregation for actions container object.
 */
class ActionsAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Creates an instance of `ActionsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        this.sortableList = true;
        this.childClass = ActionAggregation_1.ActionAggregation;
        this.allowedAnnotationCreationForms = [types_1.AggregationCreationForm.NativeAction, types_1.AggregationCreationForm.NativeNavigation];
        this.sortableCollection = 'actions';
        this.i18nKey = 'ACTIONS';
        // Custom creation form - check schema if supported
        if (schema?.properties && this.schema?.additionalProperties && this.schema?.metadata?.type !== 'Aggregation') {
            this.schemaCreationForms = [
                {
                    name: types_1.AggregationCreationForm.CustomAction,
                    kind: types_1.SCHEMA_CREATION_FORM,
                    title: 'PAGE_EDITOR_OUTLINE_ADD_CUSTOM_ACTIONS_TITLE',
                    disabled: false
                }
            ];
        }
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
        aggregation = super.addAggregation(name, aggregation, path, order, overwrite);
        if (aggregation instanceof ActionAggregation_1.ActionAggregation && aggregation.name) {
            switch (aggregation.schema?.actionType) {
                case ActionType.Standard: {
                    aggregation.markAsStandardAction();
                    break;
                }
                case ActionType.Copy: {
                    aggregation.sortableItem = types_1.SortingOptions.Readonly;
                    break;
                }
            }
        }
        return aggregation;
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
        this.formSchema = this.additionalProperties?.aggregations['actions'];
        const actions = data || {};
        for (const id in actions) {
            const action = this.aggregations[id];
            if (action?.name && action.schema?.actionType === 'Standard') {
                action.markAsStandardAction();
            }
            else if (action?.schema && (action.schema.actionType === 'Custom' || !action.schema.annotationPath)) {
                action.markAsCustomAction();
            }
        }
    }
    /**
     * Method provides creation options based on its related annotation node.
     *
     * @param annotations Page annotations.
     * @returns Array of creation forms.
     */
    getNativeNodeCreationForms(annotations) {
        if (this.parent) {
            if (this.parent.name === 'footer') {
                this.allowedAnnotationCreationForms = [types_1.AggregationCreationForm.NativeAction];
            }
        }
        return super.getNativeNodeCreationForms(annotations);
    }
}
exports.ActionsAggregation = ActionsAggregation;
//# sourceMappingURL=ActionsAggregation.js.map