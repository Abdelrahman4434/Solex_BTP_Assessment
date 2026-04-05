import type { ObjectAggregation } from '../ObjectAggregation';
export declare enum SortReferencePosition {
    After = "After",
    Before = "Before",
    Replace = "Replace"
}
export interface ReordableAggregations<T extends ObjectAggregation> {
    [key: string]: T;
}
export interface RelationPosition {
    anchor?: string | null;
    placement?: string | null;
    position?: SortReferencePosition;
}
export interface SiblingPosition<T extends ObjectAggregation> {
    id: string;
    order: number;
    aggregation: T;
}
export interface DefaultExtensionPosition {
    position?: {
        anchor?: string | null;
        placement?: string | null;
    };
}
export declare enum SortingApproach {
    Normal = "Normal",
    WithIds = "WithIds",
    WithIndices = "WithIndices"
}
//# sourceMappingURL=sort.d.ts.map