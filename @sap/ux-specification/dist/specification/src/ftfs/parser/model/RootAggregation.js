"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootAggregation = void 0;
const ObjectAggregation_1 = require("./ObjectAggregation");
const types_1 = require("./types");
const i18next_1 = __importDefault(require("i18next"));
/**
 * Represents an aggregation for root level object in page/application schema.
 */
class RootAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.allowedAnnotationCreationForms = [types_1.AggregationCreationForm.AnalyticalChart];
        this.name = 'root';
    }
    /**
     * Method provides creation options based on its related annotation node.
     * Overwritten, return array which was calculated on annotation data refresh.
     *
     * @returns Array of creation forms.
     */
    getDefaultNativeCreationForms() {
        return this.annotationCreationForms;
    }
    /**
     * Refreshes internal data based on latest annotation node data.
     *
     * @param annotations Page annotations.
     */
    updateAnnotationData(annotations) {
        this.annotationCreationForms = [];
        super.updateAnnotationData(annotations);
        // Check annotation creations forms
        const isChartAdded = !!this.aggregations['chart']?.isViewNode;
        const isViewsEnabled = !!(this.aggregations['table']?.aggregations['views']?.isViewNode && !isChartAdded);
        if (isViewsEnabled && annotations?.dialogsContext?.analyticalChartSupport !== undefined) {
            const form = {
                name: types_1.AggregationCreationForm.AnalyticalChart,
                title: annotations.dialogsContext.analyticalChartSupport.creationTooltip,
                disabled: !annotations.dialogsContext.analyticalChartSupport.creationEnabled,
                kind: types_1.ANNOTATION_CREATION_FORM,
                visualizationIcon: 'Add',
                buttonText: i18next_1.default.t('ADD_CHART'),
                buttonId: 'add-chart'
            };
            if (form.disabled) {
                form.disabledTitle = form.title;
            }
            this.annotationCreationForms.push(form);
        }
    }
}
exports.RootAggregation = RootAggregation;
//# sourceMappingURL=RootAggregation.js.map