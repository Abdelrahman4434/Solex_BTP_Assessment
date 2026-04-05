"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionsAggregation = void 0;
const i18next_1 = __importDefault(require("i18next"));
const ObjectAggregation_1 = require("../ObjectAggregation");
const SectionAggregation_1 = require("./SectionAggregation");
const types_1 = require("../types");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const utils_1 = require("../utils");
const sort_1 = require("../utils/sort");
const macros_1 = require("../macros");
// Some interface of custom sections data - that interface should be on spec, but I can not use as it is V2/V4 specific
const CUSTOM_PROPERTY_NAME = 'custom';
/**
 * Represents an aggregation for sections objects.
 */
class SectionsAggregation extends ObjectAggregation_1.ObjectAggregation {
    /**
     * Creates an instance of `SectionsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        // Array of end result ordered sections
        this.customSections = [];
        this.sections = [];
        this.sortingApproach = sort_1.SortingApproach.Normal;
        this.allowedAnnotationCreationForms = undefined;
        this.sortableCollection = 'sections';
        // Child objects as section aggregation
        this.childClass = SectionAggregation_1.SectionAggregation;
        if (schema?.properties?.custom) {
            // Custom creation form
            this.schemaCreationForms = [
                {
                    name: types_1.AggregationCreationForm.CustomSection,
                    kind: types_1.SCHEMA_CREATION_FORM,
                    title: 'PAGE_EDITOR_OUTLINE_ADD_CUSTOM_SECTIONS_TITLE',
                    disabled: false
                }
            ];
        }
        // Sortable
        this.sortableList = true;
        // i18n key
        this.i18nKey = 'SECTIONS';
    }
    /**
     * Overwritten method for data update of object page sections
     * Method receives current values for sections - loops custom sections array and appends existing/standard aggregations with custom section aggregations.
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
        // Hold custom section aggregation
        this.formSchema = this.aggregations[CUSTOM_PROPERTY_NAME];
        this.sortingApproach = this.getSortingApproach();
        delete this.aggregations[CUSTOM_PROPERTY_NAME];
        // Some code which can be removed when schema will return information about section label
        // Correct section title using labels - section schema does not return that information, but that information is in related facets
        this.correctSectionData();
        // Handle custom columns
        if (this.formSchema) {
            this.customSections = data && CUSTOM_PROPERTY_NAME in data ? data[CUSTOM_PROPERTY_NAME] : [];
            if (this.customSections.length) {
                // Array with backend sections
                this.sections = Object.keys(this.aggregations);
                // Loop sections and create all related/associated custom sections
                const sections = [...this.sections];
                for (const i in sections) {
                    const targetSection = this.aggregations[sections[i]];
                    this.traverseCustomSections(targetSection.getSectionId() || sections[i], this.customSectionFactory.bind(this, page, pageType, path, parser));
                }
                // Detect orphan section - maybe we could mark with warning info them
                const orphanSections = this.customSections.filter((customSectionData) => {
                    for (const key in this.aggregations) {
                        const aggregation = this.aggregations[key];
                        if (aggregation['data'] === customSectionData) {
                            return false;
                        }
                    }
                    return true;
                });
                for (const orphanSection of orphanSections) {
                    this.customSectionFactory(page, pageType, path, parser, orphanSection);
                }
                // Use correct ordering
                const aggregations = this.aggregations;
                this.aggregations = {};
                let order = 0;
                for (const section of this.sections) {
                    this.aggregations[section] = aggregations[section];
                    this.aggregations[section].order = order;
                    order++;
                }
            }
        }
    }
    /**
     * Overwritten method which caled when properties and aggregation data was applied and updated.
     * Code checks if need to disable deletion of last annotation node.
     */
    onPropertiesUpdated() {
        if (this.customSections.length && !this.isV4()) {
            // Ensure that last native column is not deletable for v2
            (0, utils_1.ensureLastNodeIsUndeletable)(this, 'SECTION_UNDELETABLE_LAST_NATIVE_NODE');
        }
    }
    /**
     * Method traverses custom section with recursion.
     * Reason why we need recursion is because in V4 - custom section can refference to each other.
     *
     * @param relatedFacet Facet id - method will traverso all section refferenced to passed id.
     * @param callback Traverse callback method.
     */
    traverseCustomSections(relatedFacet, callback) {
        const relatedSections = this.customSections.filter((customSection) => {
            return this.isSectionMatchesRelatedFacet(customSection.relatedFacet, relatedFacet);
        });
        const useRecursion = this.sortingApproach === sort_1.SortingApproach.WithIds;
        for (const relatedSection of relatedSections) {
            callback(relatedSection);
            if (useRecursion && 'id' in relatedSection) {
                // V4 logic - go with recursion, because facets can refference to other custom section.
                this.traverseCustomSections(relatedSection['id'], callback);
            }
        }
    }
    /**
     * Factory method which creates aggregation object for passed custom section.
     *
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param parser Model parser parameters.
     * @param sectionData Custom section data.
     */
    customSectionFactory(page, pageType, path, parser, sectionData) {
        if (!this.formSchema) {
            return;
        }
        const index = this.customSections.indexOf(sectionData);
        // Create instance for Custom section aggregation by copying form schema
        const customSection = this.formSchema.getCopy(SectionAggregation_1.SectionAggregation);
        customSection.markAsCustomSection(sectionData, this.i18nKey);
        if (parser) {
            const fragmentData = sectionData;
            const { fragmentName } = fragmentData;
            // Get custom sections fragment from definitions schema
            const customSectionFragmentDefinition = parser?.definitions[`CustomExtensionFragment<${fragmentName}>`];
            // Check if custom section has controls aggregation
            if (customSectionFragmentDefinition && customSection.aggregations.controls) {
                const macrosAggregation = new macros_1.MacrosRootAggregation(undefined, customSectionFragmentDefinition);
                customSection.addAggregation('controls', macrosAggregation, customSection.path, undefined, true);
                // parseSchema with schema to fragment file from definitions
                parser.parse(customSection.aggregations.controls, customSectionFragmentDefinition, undefined, undefined, path, {
                    filePath: customSectionFragmentDefinition.metadata?.filePath
                });
            }
        }
        customSection.updatePropertiesValues(sectionData, page, pageType, path, parser?.annotations);
        customSection.setTitle(sectionData.title);
        customSection.position = sectionData.relativePosition;
        const customSectionId = this.storeSection(sectionData);
        // Store in aggregation
        this.addAggregation(customSectionId, customSection, this.path.concat([CUSTOM_PROPERTY_NAME, index]));
        // Sync anchor property
        for (const name of ObjectAggregation_1.CUSTOM_EXTENSION_ANCHOR_PROPERTIES) {
            const property = customSection.properties[name];
            if (property) {
                property.schema = (0, utils_1.updateAnchorSchema)(customSection, property.schema);
            }
        }
        // validate extension by checking related facets
        const relatedFacets = this.formSchema.properties.relatedFacet?.schema.oneOf
            ? this.formSchema.properties.relatedFacet?.schema.oneOf
            : [];
        const facetMatches = this.isV4() && !sectionData.relatedFacet
            ? true
            : relatedFacets.some((facet) => facet.const === sectionData.relatedFacet);
        (0, utils_1.validateExtension)(customSection, facetMatches, i18next_1.default.t('PAGE_EDITOR_CUSTOM_SECTION_NO_FACET'));
    }
    /**
     * Method corrects children section data.
     * Currently json schema for sections does not return labels for sections, but 'relatedFacet' schema data have it
     *   - we can map them and read label for 'relatedFacet'.
     */
    correctSectionData() {
        const relatedFacets = this.formSchema?.properties.relatedFacet?.schema.oneOf
            ? this.formSchema.properties.relatedFacet.schema.oneOf
            : [];
        for (const key in this.aggregations) {
            const section = this.aggregations[key];
            if (section.custom) {
                continue;
            }
            if (this.isV4()) {
                section.useDescriptionAsId = true;
            }
            if (section.description) {
                section.setTitle(section.description);
            }
            const sectionId = section.getSectionId() || key;
            const facet = relatedFacets.find((facet) => this.isSectionMatchesRelatedFacet(sectionId, facet.const));
            if (facet?.description) {
                section.setTitle(facet.description);
                section.setId(facet.const);
            }
        }
    }
    /**
     * Is section id matches related facet id.
     *
     * @param sectionId Section id.
     * @param relatedFacet Related facet id.
     * @returns True if section id matches passed related facet id.
     */
    isSectionMatchesRelatedFacet(sectionId = '', relatedFacet = '') {
        // At some point maybe we would not need it, but currently schema does not return same ids as custom section's facets
        return sectionId.replace(/@/g, '') === relatedFacet.replace(/@/g, '');
    }
    /**
     * Determines the appropriate index at which a custom section should be inserted
     * in the existing sections list based on its relative position and related facet.
     * The function supports positioning the section before, after, or replacing an existing one.
     * If no related facet is found, the section is added at the end.
     *
     * @param customSectionData Custom section data object.
     * @returns The index in the sections array where the new custom section should be inserted.
     */
    findSectionInsertPosition(customSectionData) {
        const { relativePosition, relatedFacet } = customSectionData;
        const isAfterOrReplace = this.checkRelatedPosition(relativePosition, ux_specification_types_1.v2.SectionPosition.AfterFacet, ux_specification_types_1.v2.SectionPosition.ReplaceFacet);
        // Find first matching reference section
        const foundSection = this.findReferenceSection(relatedFacet);
        // Check if any reference section exists
        if (!foundSection) {
            return this.sections.length;
        }
        const isReplace = this.checkRelatedPosition(relativePosition, ux_specification_types_1.v2.SectionPosition.ReplaceFacet);
        const isBefore = this.checkRelatedPosition(relativePosition, ux_specification_types_1.v2.SectionPosition.BeforeFacet);
        const checkPositions = isReplace
            ? [ux_specification_types_1.v2.SectionPosition.ReplaceFacet]
            : [ux_specification_types_1.v2.SectionPosition.AfterFacet, ux_specification_types_1.v2.SectionPosition.ReplaceFacet];
        let insertIndex = foundSection.index;
        // Continue searching for insert position
        if (isAfterOrReplace && this.sortingApproach === sort_1.SortingApproach.Normal) {
            for (let j = insertIndex + 1; j < this.sections.length; j++) {
                const tempAgg = this.aggregations[this.sections[j]];
                if (tempAgg?.custom &&
                    tempAgg.position &&
                    this.checkRelatedPosition(tempAgg.position, ...checkPositions)) {
                    insertIndex++;
                }
                else {
                    break;
                }
            }
        }
        return insertIndex + (isBefore ? 0 : 1);
    }
    /**
     * Finds the first section that matches the given related facet and returns its index and aggregation.
     *
     * @param relatedFacet The related facet identifier used to match against section IDs.
     * @returns An object containing the matching section's index and aggregation.
     */
    findReferenceSection(relatedFacet) {
        for (let i = 0; i < this.sections.length; i++) {
            const key = this.sections[i];
            const aggregation = this.aggregations[key];
            const sectionId = aggregation?.getSectionId?.() ?? key;
            if (sectionId && this.isSectionMatchesRelatedFacet(sectionId, relatedFacet)) {
                return {
                    index: i,
                    aggregation
                };
            }
        }
    }
    /**
     * Method receives custom section data and determines position of custom section in flat array.
     * Also generates unique id if custom section has same values.
     *
     * @param customSectionData Section id.
     * @returns Custom section id.
     */
    storeSection(customSectionData) {
        // Determine the insertion index based on relative position and related facet
        const position = this.findSectionInsertPosition(customSectionData);
        // Generate a unique section ID from provided ID or title
        const customSectionId = this.getFreeSectionId('id' in customSectionData && typeof customSectionData.id === 'string'
            ? customSectionData.id
            : customSectionData.title);
        // Insert the custom section into the list
        this.sections.splice(position, 0, customSectionId);
        // Mark the referenced section as replaced (if applicable)
        const referenceSection = this.findReferenceSection(customSectionData.relatedFacet);
        if (referenceSection?.aggregation &&
            this.checkRelatedPosition(customSectionData.relativePosition, ux_specification_types_1.v2.SectionPosition.ReplaceFacet)) {
            referenceSection.aggregation.markAsReplaced(customSectionData.title);
        }
        return customSectionId;
    }
    /**
     * Method returns available section id for candidate section id.
     *
     * @param sectionId Candidate section id.
     * @returns Available section id.
     */
    getFreeSectionId(sectionId) {
        // Find available id
        let counter = 1;
        // If section id is undefined - use 'missingId' key.
        const originalSectionId = sectionId ?? 'missingId';
        sectionId = originalSectionId;
        const keys = Object.keys(this.aggregations).filter((key) => {
            return this.sections.indexOf(key) === -1;
        });
        const sectionIds = [...this.sections, ...keys];
        while (sectionIds.includes(sectionId)) {
            sectionId = originalSectionId + counter;
            counter++;
        }
        return sectionId;
    }
    /**
     * Checks whether the given position string matches any of the provided section positions.
     *
     * @param position A section position string (case-insensitive). Defaults to an empty string.
     * @param matchingPositions One or more section positions to check against.
     * @returns True if the position string includes any of the matching section positions; otherwise, false.
     */
    checkRelatedPosition(position = '', ...matchingPositions) {
        const positionQuery = new Map([
            [ux_specification_types_1.v2.SectionPosition.AfterFacet, 'after'],
            [ux_specification_types_1.v2.SectionPosition.BeforeFacet, 'before'],
            [ux_specification_types_1.v2.SectionPosition.ReplaceFacet, 'replace']
        ]);
        position = position.toLowerCase();
        for (const checkPosition of matchingPositions) {
            const query = positionQuery.get(checkPosition);
            if (query && position.includes(query)) {
                return true;
            }
        }
        return false;
    }
    /**
     * Method returns sorting/reorder approach - it can be different for V2 or V4.
     *
     * @returns Sorting approach.
     */
    getSortingApproach() {
        if (this.isV4()) {
            return sort_1.SortingApproach.WithIds;
        }
        return sort_1.SortingApproach.Normal;
    }
    /**
     * Checks whether the section schema belongs to a Fiori Elements V4 application.
     *
     * @returns {boolean} True if the schema is for a V4 application.
     */
    isV4() {
        return !!this.formSchema?.properties.id;
    }
    /**
     * Method provides creation options based on its related annotation node.
     * Overwritten, specificly for sections - we should check dialogsContext to determine if creation enabled for AnalyticalChart form.
     *
     * @param annotations Page annotations.
     * @returns Array of creation forms.
     */
    getNativeNodeCreationForms(annotations) {
        if (!annotations) {
            return [];
        }
        const forms = super.getNativeNodeCreationForms(annotations);
        const chartForm = forms.find((form) => form.name === types_1.AggregationCreationForm.AnalyticalChart);
        if (chartForm && !chartForm.disabled) {
            chartForm.disabled = !annotations.dialogsContext?.analyticalChartSupport?.creationEnabled;
            if (annotations.dialogsContext?.analyticalChartSupport?.creationTooltip) {
                chartForm.disabledTitle = annotations.dialogsContext.analyticalChartSupport.creationTooltip;
            }
        }
        return forms;
    }
}
exports.SectionsAggregation = SectionsAggregation;
//# sourceMappingURL=SectionsAggregation.js.map