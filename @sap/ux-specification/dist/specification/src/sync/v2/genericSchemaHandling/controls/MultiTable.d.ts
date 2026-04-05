/**
 * @file This file is a helper class for its sibling class Table.ts. It provides the logic needed to support the multi-view multi-table scenario (in LR and ALP).
 */
import type * as Edm from '@sap-ux/vocabularies-types/Edm';
import type { SyncRule } from '@sap/ux-specification-types';
import * as v2 from '@sap/ux-specification-types/src/v2/genericSchemaHandling/controls/Table';
import { type LineItemInfo } from '../../generate/utils';
/**
 * This type is used to collect information about the usage of different table types in multi-view multi-table scenarios.
 *
 * @property responsive - number of views using responsive table
 * @property nonResponsive - number of views using non-responsive table
 */
export type TableTypeUsage = {
    responsive: number;
    nonResponsive: number;
};
/**
 * An instance of this type represents one view in a multi-view multi-table page.
 * The instances are created in function getVariantInfo.
 *
 * @property accessor - the property name in manifest which is used to address the variant
 * @property iconTabFilterKey - escaped version of the key in variantDefinition
 * @property variantDefinition - the definition of the view from the manifest
 * @property isChart - is this view a chart?
 * @property tableType - the table type which will be used for this view (if it is not a chart). Todo: Can we use type TableTypeV2Enum here?
 * @property smartControlId - the control id of the smart control representing this view
 * @property description - human readable description of this view
 * @property lineItemInfo - the line item this table is built on
 * @property entitySetDefinition - definition of the entity set shown by this view
 * @property entityTypeDefinition - definition of the entity type for the entity set
 */
export type VariantInfo = {
    accessor: string;
    iconTabFilterKey: string;
    variantDefinition: object;
    isChart: boolean;
    tableType?: v2.TableTypeV2Enum;
    smartControlId: string;
    description: string;
    lineItemInfo?: LineItemInfo;
    entitySetDefinition?: Edm.EntitySet;
    entityTypeDefinition?: Edm.EntityType;
};
/**
 * Instances of this type are used when dealing with multi-view multi-table pages.
 * In that scenario they are used for two purposes:
 * a) One instance represents the general settings defined for all views (created in function processingRuleAdapter for property table of class ListReportNew and enhanced later).
 * b) For each view there is one instance representing it. This is also true if the view actually displays a chart (which will be considered as a 'special table' in this context).
 * These instances are created in the processingRuleAdapter of class MultiViewsVariants.
 *
 * @property variantInfo - undefined in scenario a). In scenario b) it contains information about the view represented.
 * @property possibleEntitySets - has identical values for all instances used in a multi-view multi-table page. Contains the list of all entity sets that can be used for a view.
 * @property usedTableTypes - has identical values for all instances used in a multi-view multi-table page. Contains the information which table type is currently used how often.
 */
export type MultiTableInfo = {
    variantInfo?: VariantInfo;
    possibleEntitySets?: string[];
    usedTableTypes: TableTypeUsage;
};
export declare class MultiViewsVariants implements v2.MultiViewsVariants {
    [key: string]: v2.Table;
}
export declare class MultiViewsDefinition implements v2.MultiViewsDefinition {
    enableAutoBinding?: boolean;
    showCounts?: boolean;
    variants: {
        [key: string]: v2.MultiViewsVariants;
    };
}
/**
 * Expose SyncRules for those properties of class Table that are only relevant in the multi-view multi-table scenario.
 *
 * @param property - name of the property
 * @returns the SyncRule for the given property (if the property is relevant in multi-view multi-table scenario), undefined otherwise
 */
export declare function getSyncRuleForMultiTableManifestProperty(property: string): SyncRule | undefined;
//# sourceMappingURL=MultiTable.d.ts.map