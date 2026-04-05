import type { JSONSchema4 } from 'json-schema';
import { SectionsObjectAggregation } from './SectionsObjectAggregation';
import type { PageEditAggregationData } from '../ObjectAggregation';
import type { PageData, PageAnnotations } from '../types';
import { AggregationCreationForm } from '../types';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
/**
 * Represents an aggregation for header sections objects.
 */
export declare class HeaderSectionsAggregation extends SectionsObjectAggregation {
    allowedAnnotationCreationForms?: AggregationCreationForm[];
    /**
     * Creates an instance of `HeaderSectionsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Overwritten method for data update of object page header sections
     * Method receives current values for sections - loops custom sections array and appends existing/standard aggregations with custom section aggregations.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Page annotations.
     */
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations?: PageAnnotations): void;
}
//# sourceMappingURL=HeaderSectionsAggregation.d.ts.map