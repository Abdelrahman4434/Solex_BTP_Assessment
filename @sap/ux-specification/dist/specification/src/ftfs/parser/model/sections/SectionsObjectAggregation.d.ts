import type { JSONSchema4 } from 'json-schema';
import type { ObjectAggregation, PageEditAggregationData } from '../ObjectAggregation';
import type { ModelParserParams, PageData, PageAnnotations } from '../types';
import { SectionsAggregation } from './SectionsAggregation';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
/**
 * Represents an aggregation for sections objects.
 */
export declare class SectionsObjectAggregation extends SectionsAggregation {
    /**
     * Creates an instance of `SectionsObjectAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
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
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations?: PageAnnotations, parser?: ModelParserParams<ObjectAggregation>): void;
    /**
     * Method removes aggregations that are not part of schema properties.
     */
    private removeObsoleteAggregations;
    /**
     * Method parses building blocks for passed custom section.
     *
     * @param parseData Schema parse data and parser.
     * @param section Section to parse.
     * @param id Section id.
     * @param sections Sections data.
     * @param path Aggregation path.
     */
    private parseBuildingBlocks;
    /**
     * Public method checks if annotation sections are merged by 'sap.fe' in runtime.
     *
     * @returns Annotation sections are merged by 'sap.fe' in runtime.
     */
    isSectionsMerged(): boolean;
}
//# sourceMappingURL=SectionsObjectAggregation.d.ts.map