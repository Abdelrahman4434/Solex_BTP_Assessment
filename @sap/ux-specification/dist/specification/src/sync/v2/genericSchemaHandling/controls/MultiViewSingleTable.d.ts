/**
 * @file This file is a helper class for its sibling class Table.ts. It provides the logic needed to support the multi-view single-table scenario.
 */
import { type SyncRule } from '@sap/ux-specification-types';
import type * as v2 from '@sap/ux-specification-types/src/v2/genericSchemaHandling/controls/Table';
export declare class ViewOnTable implements v2.ViewOnTable {
    key: string;
    annotationPath: string;
}
export declare class MultiViewsOnTable implements v2.MultiViewsOnTable {
    showCounts?: boolean;
    variants: {
        [key: string]: v2.ViewOnTable;
    };
}
/**
 * Provides the syncRule for the quickVariantSelection property of a table.
 *
 * @returns the syncRule
 */
export declare function getSyncRuleForQuickVariantSelection(): SyncRule;
//# sourceMappingURL=MultiViewSingleTable.d.ts.map