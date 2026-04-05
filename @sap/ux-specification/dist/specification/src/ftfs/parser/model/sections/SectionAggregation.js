"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
const i18next_1 = __importDefault(require("i18next"));
const types_1 = require("../types");
/**
 * Represents an aggregation for section objects.
 */
class SectionAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Creates an instance of `SectionAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        this.actions = [types_1.AggregationActions.Delete];
        this.isViewNode = true;
        this.sortableCollection = 'sections';
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
     * Setter for id.
     *
     * @param id Title.
     */
    setId(id) {
        this.id = id;
    }
    /**
     * Method returns display name of aggregation without applying i18n translation.
     * Overwritten for section handling.
     *
     * @returns Display name of aggregation.
     */
    getRawDisplayName() {
        return this.title || this.getSectionId() || super.getRawDisplayName();
    }
    /**
     * Public method to read/determine section id.
     *
     * @param fallback Resolve id with V4 fallback solution by reading label/description.
     * @returns Section id.
     */
    getSectionId(fallback = true) {
        if (this.schema) {
            if (this.schema.title?.startsWith(types_1.FacetTitlePrefix)) {
                const parts = this.schema.title.split(types_1.FacetTitlePrefix);
                if (parts.length > 1) {
                    return parts[parts.length - 1];
                }
                return parts[0];
            }
            else if (fallback && this.useDescriptionAsId && this.schema.description) {
                // V4 specific part - if facet ID does not exist then id is label
                return this.schema.description;
            }
        }
        if (this.data && 'id' in this.data) {
            return this.data['id'];
        }
        return undefined;
    }
    /**
     * Public method to mark section as replaced with other section.
     *
     * @param replacedWith Section replaced with.
     */
    markAsReplaced(replacedWith) {
        this.inactive = true;
        this.additionalText = i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_SECTION_REPLACED_WITH', {
            section: replacedWith
        });
    }
    /**
     * Public method to mark section as custom section.
     *
     * @param data Configuration of section(segment of page config).
     * @param i18nKey I18n custom key.
     * @param goCodeAction Go to code action.
     */
    markAsCustomSection(data, i18nKey, goCodeAction) {
        this.custom = true;
        this.actions = [types_1.AggregationActions.Delete, goCodeAction || types_1.AggregationActions.OpenSource];
        this.sortableItem = types_1.SortingOptions.Enabled;
        this.additionalText = i18next_1.default.t('PAGE_EDITOR_OUTLINE_NODE_DESC_CUSTOM_SECTION');
        this.data = data;
        this.i18nKey = i18nKey;
    }
    /**
     * Method parses object path key and returns field name / technical id.
     *
     * @returns Section id.
     */
    getTechnicalName() {
        return this.getSectionId();
    }
    /**
     * Protected method which returns name with additional formatting by removing 'SAP_ANNOTATION_NAMESPACE' from full name/id.
     *
     * @returns Name of aggregation.
     */
    getFormattedName() {
        let name = this.name;
        const replaceQuery = `${types_1.SAP_ANNOTATION_NAMESPACE}.`;
        if (name?.includes(replaceQuery)) {
            name = name.replace(replaceQuery, '');
        }
        return name;
    }
}
exports.SectionAggregation = SectionAggregation;
//# sourceMappingURL=SectionAggregation.js.map