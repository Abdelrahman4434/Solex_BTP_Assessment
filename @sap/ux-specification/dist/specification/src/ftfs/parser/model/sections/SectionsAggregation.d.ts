import type { PageEditAggregationData } from '../ObjectAggregation';
import { ObjectAggregation } from '../ObjectAggregation';
import type { PageData, CreationFormOptions, ModelParserParams, PageAnnotations } from '../types';
import { AggregationCreationForm } from '../types';
import type { JSONSchema4 } from 'json-schema';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
type CustomSectionSchemaParserParams = ModelParserParams<ObjectAggregation> | undefined;
/**
 * Represents an aggregation for sections objects.
 */
export declare class SectionsAggregation extends ObjectAggregation {
    private customSections;
    private sections;
    private sortingApproach;
    allowedAnnotationCreationForms?: AggregationCreationForm[];
    sortableCollection: string | undefined;
    /**
     * Creates an instance of `SectionsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
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
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations?: PageAnnotations, parser?: CustomSectionSchemaParserParams): void;
    /**
     * Overwritten method which caled when properties and aggregation data was applied and updated.
     * Code checks if need to disable deletion of last annotation node.
     */
    protected onPropertiesUpdated(): void;
    /**
     * Method traverses custom section with recursion.
     * Reason why we need recursion is because in V4 - custom section can refference to each other.
     *
     * @param relatedFacet Facet id - method will traverso all section refferenced to passed id.
     * @param callback Traverse callback method.
     */
    private traverseCustomSections;
    /**
     * Factory method which creates aggregation object for passed custom section.
     *
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param parser Model parser parameters.
     * @param sectionData Custom section data.
     */
    private customSectionFactory;
    /**
     * Method corrects children section data.
     * Currently json schema for sections does not return labels for sections, but 'relatedFacet' schema data have it
     *   - we can map them and read label for 'relatedFacet'.
     */
    correctSectionData(): void;
    /**
     * Is section id matches related facet id.
     *
     * @param sectionId Section id.
     * @param relatedFacet Related facet id.
     * @returns True if section id matches passed related facet id.
     */
    isSectionMatchesRelatedFacet(sectionId?: string, relatedFacet?: string): boolean;
    /**
     * Determines the appropriate index at which a custom section should be inserted
     * in the existing sections list based on its relative position and related facet.
     * The function supports positioning the section before, after, or replacing an existing one.
     * If no related facet is found, the section is added at the end.
     *
     * @param customSectionData Custom section data object.
     * @returns The index in the sections array where the new custom section should be inserted.
     */
    private findSectionInsertPosition;
    /**
     * Finds the first section that matches the given related facet and returns its index and aggregation.
     *
     * @param relatedFacet The related facet identifier used to match against section IDs.
     * @returns An object containing the matching section's index and aggregation.
     */
    private findReferenceSection;
    /**
     * Method receives custom section data and determines position of custom section in flat array.
     * Also generates unique id if custom section has same values.
     *
     * @param customSectionData Section id.
     * @returns Custom section id.
     */
    private storeSection;
    /**
     * Method returns available section id for candidate section id.
     *
     * @param sectionId Candidate section id.
     * @returns Available section id.
     */
    getFreeSectionId(sectionId: string): string;
    /**
     * Checks whether the given position string matches any of the provided section positions.
     *
     * @param position A section position string (case-insensitive). Defaults to an empty string.
     * @param matchingPositions One or more section positions to check against.
     * @returns True if the position string includes any of the matching section positions; otherwise, false.
     */
    private checkRelatedPosition;
    /**
     * Method returns sorting/reorder approach - it can be different for V2 or V4.
     *
     * @returns Sorting approach.
     */
    private getSortingApproach;
    /**
     * Checks whether the section schema belongs to a Fiori Elements V4 application.
     *
     * @returns {boolean} True if the schema is for a V4 application.
     */
    private isV4;
    /**
     * Method provides creation options based on its related annotation node.
     * Overwritten, specificly for sections - we should check dialogsContext to determine if creation enabled for AnalyticalChart form.
     *
     * @param annotations Page annotations.
     * @returns Array of creation forms.
     */
    protected getNativeNodeCreationForms(annotations: PageAnnotations | undefined): CreationFormOptions[];
}
export {};
//# sourceMappingURL=SectionsAggregation.d.ts.map