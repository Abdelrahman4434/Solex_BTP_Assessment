"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewAggregation = void 0;
const i18next_1 = __importDefault(require("i18next"));
const ObjectAggregation_1 = require("../ObjectAggregation");
const types_1 = require("../types");
/**
 * Represents an aggregation for view objects.
 */
class ViewAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Creates an instance of `ViewAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        this.actions = [];
        this.sortableItem = types_1.SortingOptions.Enabled;
        this.sortableCollection = 'views';
        if (schema?.key && !schema.annotationPath && !schema.properties?.['annotationPath']) {
            // Custom view - generate annotation path, because it is not provided by schema
            schema.annotationPath = `${types_1.CUSTOM_VIEW_PREFIX}${schema.key})`;
        }
    }
    /**
     * Method returns display name of aggregation without applying i18n translation.
     * Overwritten for column handling.
     *
     * @returns Display name of aggregation.
     */
    getRawDisplayName() {
        return this.title || super.getRawDisplayName();
    }
    /**
     * Public method to mark view as custom action.
     */
    markAsCustomView() {
        this.custom = true;
        this.actions = [types_1.AggregationActions.Delete, types_1.AggregationActions.OpenSource];
        this.sortableItem = types_1.SortingOptions.Enabled;
        this.additionalText = i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_VIEW');
        this.i18nKey = this.parent?.i18nKey;
        if (this.properties.label?.value) {
            this.title = this.properties.label.value;
        }
    }
    /**
     * Overwritten method for data update of list report view.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Annotations data.
     */
    updatePropertiesValues(data, page, pageType, path, annotations) {
        super.updatePropertiesValues(data, page, pageType, path, annotations);
        // Update icon
        if (this.isTableView()) {
            this.icon = 'Table';
        }
        else if (this.isChartView()) {
            this.icon = 'Chart';
        }
        else {
            this.icon = 'Sections';
        }
        // validate annotation path property
        if (this.isAnnotationView() && !this.schema?.['annotationPath'] && this.properties['annotationPath']) {
            // set warning for annotation path property
            this.properties['annotationPath'].messages = [
                {
                    type: types_1.PropertyMessageType.Warning,
                    text: i18next_1.default.t('PAGE_EDITOR_PROPERTIES_VIEW_NO_ANNOTATION_PATH')
                }
            ];
        }
    }
    /**
     * Method returns true if view aggregation is table view.
     *
     * @returns True if view is table view.
     */
    isTableView() {
        return 'columns' in this.aggregations;
    }
    /**
     * Method returns true if view aggregation is chart view.
     *
     * @returns True if view is chart view.
     */
    isChartView() {
        return !('columns' in this.aggregations) && 'toolBar' in this.aggregations;
    }
    /**
     * Method returns true if aggregation is annotation view.
     *
     * @returns True if view is annotation view.
     */
    isAnnotationView() {
        return ((!this.custom && 'annotationPath' in this.properties) ||
            (!this.custom && this.schema?.annotationPath && !this.schema?.annotationPath.startsWith(types_1.CUSTOM_VIEW_PREFIX)));
    }
}
exports.ViewAggregation = ViewAggregation;
//# sourceMappingURL=ViewAggregation.js.map