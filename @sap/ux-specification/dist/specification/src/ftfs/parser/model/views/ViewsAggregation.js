"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewsAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
const ViewAggregation_1 = require("./ViewAggregation");
const i18next_1 = __importDefault(require("i18next"));
const utils_1 = require("../utils");
/**
 * Represents an aggregation for views objects.
 */
class ViewsAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.sortableList = true;
        this.childClass = ViewAggregation_1.ViewAggregation;
        this.allowedAnnotationCreationForms = [
            types_1.AggregationCreationForm.TableView,
            types_1.AggregationCreationForm.AnalyticalChartView,
            types_1.AggregationCreationForm.CustomViewV4
        ];
        this.sortableCollection = 'views';
        this.sortableConfigOnly = true;
        // i18n key
        this.i18nKey = 'VIEWS';
    }
    /**
     * Refreshes internal data based on latest annotation node data.
     *
     * @param annotations Page annotations.
     */
    updateAnnotationData(annotations) {
        super.updateAnnotationData(annotations);
        if (annotations) {
            this.toggleChartForm(this.annotationCreationForms, annotations);
            for (const view in this.aggregations) {
                const viewAggregation = this.aggregations[view];
                const deleteAction = this.getViewDeleteAction(viewAggregation, annotations);
                const actions = viewAggregation.actions || [];
                actions.push(deleteAction);
                viewAggregation.actions = actions;
            }
        }
    }
    /**
     * Overwritten method for data update of list report views container node.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Annotations data.
     */
    updatePropertiesValues(data, page, pageType, path, annotations) {
        super.updatePropertiesValues(data, page, pageType, path, annotations);
        this.formSchema = this.additionalProperties?.aggregations['views'];
        // Custom creation form - check schema if supported
        if (this.formSchema?.properties?.template) {
            this.schemaCreationForms = [
                {
                    name: types_1.AggregationCreationForm.CustomViewV4,
                    kind: types_1.SCHEMA_CREATION_FORM,
                    title: 'PAGE_EDITOR_OUTLINE_ADD_CUSTOM_VIEW_TITLE',
                    disabled: false
                }
            ];
        }
        const views = data || {};
        if (Object.keys(views).length !== 0) {
            for (const id in views) {
                const viewAggregation = this.aggregations[id];
                if (viewAggregation?.schema &&
                    !viewAggregation?.schema.properties?.['annotationPath'] &&
                    (!viewAggregation.schema.annotationPath ||
                        viewAggregation.schema.annotationPath.startsWith(types_1.CUSTOM_VIEW_PREFIX))) {
                    viewAggregation.markAsCustomView();
                }
            }
        }
    }
    /**
     * Determines the delete action configuration for a given view aggregation.
     *
     * @param viewAggregation - The view aggregation to evaluate.
     * @param annotations - The current page annotations context.
     * @returns The delete action configuration for the view.
     */
    getViewDeleteAction(viewAggregation, annotations) {
        const id = viewAggregation.annotationNodeId;
        let disableViewDeletion = true;
        const annotationViewsCount = this.getAnnotationViewCount();
        if (id) {
            disableViewDeletion = (0, utils_1.isArrayEqual)(annotations.dialogsContext?.suppressTableViewDeletionNodeId || [], id);
        }
        else if (annotationViewsCount > 1 || (annotationViewsCount === 1 && viewAggregation.custom)) {
            // Allow annotation view deletion if there are at least two annotation views, else deletion only available for custom views
            disableViewDeletion = false;
        }
        return {
            type: types_1.AggregationActions.Delete,
            disabled: disableViewDeletion,
            title: i18next_1.default.t(disableViewDeletion ? 'TABLE_VIEW_DELETE_DISABLED_TOOLTIP' : 'PAGE_EDITOR_OUTLINE_DELETE_TOOLTIP')
        };
    }
    /**
     * Enables/Disables the chart form based on the annotations.
     *
     * @param forms Array of creation forms
     * @param annotations Page annotations
     */
    toggleChartForm(forms, annotations) {
        const chartForm = forms.find((form) => form.name === types_1.AggregationCreationForm.AnalyticalChartView);
        if (chartForm && annotations.dialogsContext?.analyticalChartSupport) {
            if (!annotations.dialogsContext.analyticalChartSupport.addToMultiViewEnabled) {
                chartForm.disabled = true;
                chartForm.disabledTitle = annotations.dialogsContext.analyticalChartSupport.addToMultiViewTooltip;
            }
            else {
                chartForm.disabled = false;
                delete chartForm.disabledTitle;
            }
        }
    }
    /**
     * Method returns count of annotations views.
     *
     * @returns Count of annotations views.
     */
    getAnnotationViewCount() {
        let count = 0;
        for (const view in this.aggregations) {
            const aggregation = this.aggregations[view];
            if (aggregation instanceof ViewAggregation_1.ViewAggregation && aggregation.isAnnotationView()) {
                count++;
            }
        }
        return count;
    }
}
exports.ViewsAggregation = ViewsAggregation;
//# sourceMappingURL=ViewsAggregation.js.map