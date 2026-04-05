import type { JSONSchema4 } from 'json-schema';
import type { ObjectAggregation, PageEditAggregationData } from '../ObjectAggregation';
import type { ModelParserParams, PageData, PageAnnotations } from '../types';
import { SectionsObjectAggregation } from './SectionsObjectAggregation';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
/**
 * Represents an aggregation for sub-sections objects.
 */
export declare class SubSectionsAggregation extends SectionsObjectAggregation {
    /**
     * Creates an instance of `SubSectionsAggregation`.
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
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations?: PageAnnotations, parser?: ModelParserParams<ObjectAggregation>): void;
    /**
     * Public method checks if annotation sections are merged by 'sap.fe' in runtime.
     * There is two reordering approaches:
     * 1. When annotations sections are merged into one. There no any collection section in such case.
     * 2. When sections are separated. There is at least one collection section in such case.
     *
     * @returns Annotation sections are merged by 'sap.fe' in runtime.
     */
    isSectionsMerged(): boolean;
}
//# sourceMappingURL=SubSectionsAggregation.d.ts.map