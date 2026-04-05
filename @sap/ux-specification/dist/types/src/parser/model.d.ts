import type { PageType } from '../common';
import type { JSONSchema4 } from 'json-schema';
export type PropertyPath = Array<string | number>;
export interface TreeAggregations {
    [key: string]: TreeAggregation;
}
export interface TreeModel {
    name: string;
    pageType?: PageType;
    schema: JSONSchema4;
    root: TreeAggregation;
}
export interface TreeAggregation {
    path: PropertyPath;
    aggregations: TreeAggregations;
}
//# sourceMappingURL=model.d.ts.map