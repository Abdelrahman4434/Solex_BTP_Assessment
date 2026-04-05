import type { JSONSchema4 } from 'json-schema';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
import type { PageData, PageAnnotations } from '../types';
import { AggregationCreationForm } from '../types';
import { ObjectAggregation } from '../ObjectAggregation';
import type { PageEditAggregationData } from '../ObjectAggregation';
import { FilterFieldAggregation } from './FilterFieldAggregation';
export declare const VISUAL_FILTER_PROPERTY_NAME = "visualFilters";
/**
 * Represents an aggregation for filter fields objects.
 */
export declare class FilterFieldsAggregation extends ObjectAggregation {
    sortableList: boolean;
    allowedAnnotationCreationForms: AggregationCreationForm[];
    childClass: typeof FilterFieldAggregation;
    i18nKey: string;
    /**
     * Creates an instance of `FilterFieldsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Overwritten method for data update of object page actions
     * Method receives current values for actions and detects custom actions.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Annotations data.
     */
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations: PageAnnotations): void;
}
//# sourceMappingURL=FilterFieldsAggregation.d.ts.map