"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const i18next_1 = __importDefault(require("i18next"));
const types_1 = require("../types");
const utils_1 = require("../utils");
const ux_specification_types_1 = require("@sap/ux-specification-types");
/**
 * Represents an aggregation for column objects.
 */
class ColumnAggregation extends ObjectAggregation_1.ObjectAggregation {
    constructor() {
        super(...arguments);
        this.isViewNode = true;
        this.actions = [types_1.AggregationActions.Delete];
        this.sortableItem = types_1.SortingOptions.Enabled;
    }
    /**
     * Setter for title.
     *
     * @param title Title.
     */
    setTitle(title) {
        this.title = title;
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
     * Method validates column positioning by checking anchoring.
     */
    validateColumnPositioning() {
        const value = this.value && typeof this.value === 'object' ? this.value : {};
        const anchorEnum = this.aggregations.position?.schema?.properties?.anchor?.enum;
        const anchorOneOf = this.schema?.properties?.anchor?.oneOf;
        let anchorMatches = false;
        if (this.isMacrosNode()) {
            // validate column key
            (0, utils_1.validateMacrosExtension)(this, value);
            const relatedAnchors = anchorOneOf ?? [];
            // no positioning property for macros anchor
            const anchor = (0, utils_1.getProperty)(value, ['anchor']);
            anchorMatches = anchor
                ? relatedAnchors.some((relatedAnchor) => {
                    return relatedAnchor['const'] === anchor;
                })
                : true;
        }
        else {
            const relatedAnchors = anchorEnum ?? [];
            const anchor = (0, utils_1.getProperty)(value, ['position', 'anchor']);
            anchorMatches = anchor ? relatedAnchors.includes(anchor) : true;
        }
        // validate columns by checking related anchors
        (0, utils_1.validateExtension)(this, anchorMatches, i18next_1.default.t('PAGE_EDITOR_CUSTOM_EXTENSION_NO_ANCHOR'));
    }
    /**
     * Public method to mark section as custom section.
     *
     * @param params Parameters used to configure the custom column.
     * @param params.pageType Page type
     * @param params.originalIndex Original element index - data to store and use on reordering.
     * @param params.columnExtension Column extension type.
     * @param params.isExtensionTypeSupported Whether column extension type is supported.
     * @param params.i18nKey I18n custom key.
     * @param params.tableExtension Target table extension type.
     * @param params.isV4 Whether Custom column is for V4.
     * @param params.tabkey Tab/view key identificator.
     */
    markAsCustomColumn(params) {
        const { pageType, originalIndex, columnExtension, isExtensionTypeSupported, i18nKey, tableExtension = "ResponsiveTableColumnsExtension" /* TableColumnExtensionType.ResponsiveTableColumnsExtension */, isV4 = false, tabkey } = params;
        this.custom = true;
        this.actions = [types_1.AggregationActions.OpenSource];
        if (!this.isMacrosNode()) {
            this.actions.push(types_1.AggregationActions.Delete);
        }
        this.sortableItem =
            !isExtensionTypeSupported || tableExtension === columnExtension
                ? types_1.SortingOptions.Enabled
                : types_1.SortingOptions.Excluded;
        const columnExtensionText = columnExtension ?? 'Unknown';
        if (tabkey && pageType === ux_specification_types_1.PageType.ListReport) {
            this.additionalText = isExtensionTypeSupported
                ? i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_COLUMN_WITH_EXTENSION_TAB', {
                    tabkey,
                    extension: i18next_1.default.t(`PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_COLUMN_${columnExtensionText}`)
                })
                : i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_COLUMN_TAB', { tabkey });
        }
        else {
            this.additionalText = isExtensionTypeSupported
                ? i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_COLUMN_WITH_EXTENSION', {
                    extension: i18next_1.default.t(`PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_COLUMN_${columnExtensionText}`)
                })
                : i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_COLUMN');
        }
        this.originalIndex = originalIndex;
        this.i18nKey = i18nKey;
        if (isExtensionTypeSupported && tableExtension !== columnExtensionText) {
            // Column with different extension that target table
            this.state = types_1.ValidationState.Invalid;
            this.messages = [
                {
                    text: i18next_1.default.t('PAGE_EDITOR_CUSTOM_COLUMN_UNUSED_COLUMN', {
                        tableType: types_1.EXTENSION_TABLE_TYPE_MAP.get(tableExtension)
                    }),
                    type: types_1.PropertyMessageType.Info
                }
            ];
            this.inactive = true;
        }
        // anchor positioning is only supported for V4 columns
        if (isV4) {
            this.validateColumnPositioning();
        }
    }
    /**
     * Method parses object path key and returns field name / technical id.
     *
     * @returns Field name / technical id.
     */
    getTechnicalName() {
        return (0, utils_1.getTechnicalIdFromPath)(this.path);
    }
    /**
     * Overwritten method for aggregation update.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Annotation data.
     */
    updatePropertiesValues(data, page, pageType, path, annotations) {
        super.updatePropertiesValues(data, page, pageType, path, annotations);
        this.updateMoveProperties();
    }
    /**
     * Method updates column move settings according to column state.
     */
    updateMoveProperties() {
        if (this.isActionColumn() || this.isNavigationColumn()) {
            this.sortableCollection = !this.criticality || this.criticality === 'None' ? 'actions' : undefined;
            this.additionalText = i18next_1.default.t(`PAGE_EDITOR_OUTLINE_NODE_DESC_ACTION_COLUMN`);
        }
    }
    /**
     * Checks if this column represents an action column.
     *
     * @returns true if this is an action column.
     */
    isActionColumn() {
        return !!this.name?.startsWith(`${types_1.DATA_FIELD_ACTION}${types_1.ANNOTATION_TYPES_SEPARATOR}`);
    }
    /**
     * Checks if this column represents a navigation column.
     *
     * @returns true if this is a navigation column.
     */
    isNavigationColumn() {
        return !!this.name?.startsWith(`${types_1.DATA_FIELD_FOR_INTENT_BASED_NAVIGATION}${types_1.ANNOTATION_TYPES_SEPARATOR}`);
    }
}
exports.ColumnAggregation = ColumnAggregation;
//# sourceMappingURL=ColumnAggregation.js.map