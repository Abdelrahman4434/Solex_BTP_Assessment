import type { PageData } from './types';
import { AggregationType } from './types';
import type { JSONSchema4 } from 'json-schema';
import type { PageEditAggregationData } from './ObjectAggregation';
import { ObjectAggregation } from './ObjectAggregation';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
/**
 * Represents an aggregation for array object.
 */
export declare class ArrayAggregation extends ObjectAggregation {
    readonly type = AggregationType.Array;
    /**
     * Creates an instance of `ArrayAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Method adds aggregation object.
     * Overwritten to modify array's children.
     *
     * @param name Name of aggregation.
     * @param aggregation Aggregation to add.
     * @param path Array of path to aggregation.
     * @param order Order index.
     * @returns Added aggregation.
     */
    addAggregation(name: string, aggregation: ObjectAggregation, path: Parser.PropertyPath, order?: number): ObjectAggregation;
    /**
     * Public method which recursively updates aggregation's properties with values from passed data object.
     * Overwritten to update children aggregations depending on data.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     */
    updatePropertiesValues(data: PageData | undefined, page: PageConfig, pageType: PageType, path: Parser.PropertyPath): void;
    /**
     * Private method resolves primary property of aggregation.
     * Logic is that we look for certain properties like 'id', 'key', etc. If those properties do not exist, then we take first string property.
     *
     * @param aggregation Aggregation to add.
     * @returns Property name.
     */
    private getPrimaryKey;
}
//# sourceMappingURL=ArrayAggregation.d.ts.map