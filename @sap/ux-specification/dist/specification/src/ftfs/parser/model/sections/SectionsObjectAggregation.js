"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionsObjectAggregation = void 0;
const types_1 = require("../types");
const utils_1 = require("../utils");
const SectionsAggregation_1 = require("./SectionsAggregation");
const macros_1 = require("../macros");
/**
 * Represents an aggregation for sections objects.
 */
class SectionsObjectAggregation extends SectionsAggregation_1.SectionsAggregation {
    /**
     * Creates an instance of `SectionsObjectAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        const additionalProperties = schema?.additionalProperties;
        if (typeof additionalProperties === 'object' && additionalProperties.$ref) {
            this.schemaCreationForms = [
                {
                    name: types_1.AggregationCreationForm.CustomSection,
                    kind: types_1.SCHEMA_CREATION_FORM,
                    title: 'PAGE_EDITOR_OUTLINE_ADD_CUSTOM_SECTIONS_TITLE',
                    disabled: false
                }
            ];
        }
    }
    /**
     * Overwritten method for data update of object page sections
     * Method receives current values for sections - loops through custom sections object and appends existing/standard aggregations with custom section aggregations.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Page annotations.
     * @param parser Model parser parameters.
     */
    updatePropertiesValues(data, page, pageType, path, annotations, parser) {
        super.updatePropertiesValues(data, page, pageType, path, annotations, parser);
        this.formSchema = this.additionalProperties?.aggregations?.['sections'];
        const sections = data || {};
        // Remove obsolete aggregations
        this.removeObsoleteAggregations();
        for (const id in sections) {
            const section = this.aggregations[id];
            if (section?.schema && !section.schema.annotationPath) {
                section.markAsCustomSection();
                if (parser) {
                    this.parseBuildingBlocks({ parser, page, pageType }, section, id, sections, path);
                }
            }
        }
        const sortDisabled = this.isSectionsMerged();
        if (sortDisabled) {
            for (const id in this.aggregations) {
                if (this.aggregations[id].custom) {
                    this.aggregations[id].sortableItem = types_1.SortingOptions.Excluded;
                }
            }
        }
    }
    /**
     * Method removes aggregations that are not part of schema properties.
     */
    removeObsoleteAggregations() {
        const schemaSections = this.schema?.properties || {};
        for (const id in this.aggregations) {
            if (!(id in schemaSections)) {
                delete this.aggregations[id];
            }
        }
    }
    /**
     * Method parses building blocks for passed custom section.
     *
     * @param parseData Schema parse data and parser.
     * @param section Section to parse.
     * @param id Section id.
     * @param sections Sections data.
     * @param path Aggregation path.
     */
    parseBuildingBlocks(parseData, section, id, sections, path) {
        const { parser, page, pageType } = parseData;
        const fragmentData = sections[id];
        const { fragmentName } = fragmentData;
        // Get custom sections fragment from definitions schema
        const customSectionFragmentDefinition = parser?.definitions[`CustomExtensionFragment<${fragmentName}>`];
        // Check if custom section has controls aggregation
        if (customSectionFragmentDefinition && section.aggregations.controls) {
            // Create macros aggregation and add it to subsection
            const macrosAggregation = new macros_1.MacrosRootAggregation(undefined, customSectionFragmentDefinition);
            section.addAggregation('controls', macrosAggregation, path.concat(section.path[section.path.length - 1], 'controls'), 0, true);
            // parse schema using attached fragment file's macros schema definition
            parser.parse(macrosAggregation, customSectionFragmentDefinition, undefined, undefined, macrosAggregation.path, {
                filePath: customSectionFragmentDefinition.metadata?.filePath
            });
            // Update values of properties inside macros aggregation
            const value = 'value' in section && typeof section.value === 'object' ? section.value : {};
            const macrosConfigData = (0, utils_1.getProperty)(value || {}, ['controls']);
            if (macrosConfigData && typeof macrosConfigData === 'object') {
                macrosAggregation.updatePropertiesValues(macrosConfigData, page, pageType, path, parser?.annotations);
            }
        }
    }
    /**
     * Public method checks if annotation sections are merged by 'sap.fe' in runtime.
     *
     * @returns Annotation sections are merged by 'sap.fe' in runtime.
     */
    isSectionsMerged() {
        return false;
    }
}
exports.SectionsObjectAggregation = SectionsObjectAggregation;
//# sourceMappingURL=SectionsObjectAggregation.js.map