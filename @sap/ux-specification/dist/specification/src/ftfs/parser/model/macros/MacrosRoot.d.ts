import type { JSONSchema4 } from 'json-schema';
import { ObjectAggregation } from '../ObjectAggregation';
import type { PageEditAggregationData } from '../ObjectAggregation';
/**
 * Represents an aggregation for macros objects.
 */
export declare class MacrosRootAggregation extends ObjectAggregation {
    filePath?: string;
    /**
     * Creates an instance of `MacrosRootAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Public method returns display name of aggregation.
     *
     * @returns Display name of building blocks node.
     */
    getDisplayName(): string;
    /**
     * Method stores passed file path as source of macros node.
     *
     * @param filePath File path to set.
     */
    setFilePath(filePath: string): void;
}
//# sourceMappingURL=MacrosRoot.d.ts.map