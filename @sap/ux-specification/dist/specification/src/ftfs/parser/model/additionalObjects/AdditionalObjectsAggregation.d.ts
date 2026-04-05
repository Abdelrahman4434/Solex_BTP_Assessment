import type { JSONSchema4 } from 'json-schema';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
import { ObjectAggregation } from '../ObjectAggregation';
import type { PageEditAggregationData } from '../ObjectAggregation';
import type { PageData, PageAnnotations } from '../types';
import { AdditionalObjectAggregation } from './AdditionalObjectAggregation';
/**
 * Represents an aggregation for additional objects.
 */
export declare class AdditionalObjectsAggregation extends ObjectAggregation {
    sortableList: boolean;
    childClass: typeof AdditionalObjectAggregation;
    sortableCollection: string | undefined;
    i18nKey: string;
    /**
     * Creates an instance of `AdditionalObjectsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Method adds aggregation object.
     * Overwritten to mark standard action.
     *
     * @param name Name of aggregation.
     * @param aggregation Aggregation to add.
     * @param path Array of path to aggregation.
     * @param order Order index.
     * @param overwrite Overwrite existing aggregation.
     * @returns Added aggregation.
     */
    addAggregation(name: string, aggregation: ObjectAggregation, path: Parser.PropertyPath, order?: number, overwrite?: boolean): ObjectAggregation;
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
//# sourceMappingURL=AdditionalObjectsAggregation.d.ts.map