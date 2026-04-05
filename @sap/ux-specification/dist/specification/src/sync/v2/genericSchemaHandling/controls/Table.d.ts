/**
 * @file This file contains the classes implementing the interfaces defined in the corresponding types file.
 * Note that the logic for dealing with the multi-table scenario is implemented in the sibling file MultiTable.ts.
 */
import type { smarttable } from 'sap/ui/comp/library';
import type * as Edm from '@sap-ux/vocabularies-types/Edm';
import type { ExtensionLogger } from '@sap/ux-specification-types';
import * as v2 from '@sap/ux-specification-types/src/v2/genericSchemaHandling/controls/Table';
import type { SapUiGenericAppPageSettings } from '@sap/ux-specification-types/src/common';
import type { LineItemInfo } from '../../generate/utils';
import type { MultiTableInfo } from './MultiTable';
/**
 * Specific params applicable to the current table passed to the ProcessingRuleAdapter.
 *
 * @property settings - the component settings from the manifest
 * @property tableType - the type of the table
 * @property tableId - the control id of the smart table
 * @property multiTableInfo - Information about multi-table scenario if applicable, undefined if quickVariantSelectionX is not defined in the manifest
 * @property lineItemInfo - the line item this table is built on. For the instance representing the multi-table case as a whole it is the line item which is used as fallback.
 * @property entityType - the entity type this table is built for. For the instance representing the multi-table case as a whole it is the entityType of the main entitySet.
 */
export type TableParams = {
    settings?: SapUiGenericAppPageSettings;
    tableType: v2.TableTypeV2Enum;
    tableId: string;
    multiTableInfo?: MultiTableInfo;
    lineItemInfo?: LineItemInfo;
    entityType: Edm.EntityType;
};
/**
 * Returns the default table type used for tables for the given entity type (i.e. the table type which will be used by Fiori Elements if no manifest setting for the table type is available).
 *
 * @param entityTypeDefinition - the entity type for which the table is created
 * @returns the default table type for the given entity type
 */
export declare function getDefaultTableType(entityTypeDefinition: Edm.EntityType): v2.TableTypeV2Enum;
/**
 * Checks whether a given table type is valid. Thereby undefined and empty string are also considered as valid (they represent the default table type).
 *
 * @param tableType - the table type to be checked
 * @param logger - would log an error if tableType is invalid
 * @returns - information whether the tableType is valid
 */
export declare function checkTableType(tableType: string | undefined, logger?: ExtensionLogger): boolean;
export declare class Table implements v2.Table {
    entitySet?: string;
    annotationPath?: string;
    showItemNavigationOnChart?: boolean;
    views?: v2.MultiViewsDefinition;
    quickVariantSelection?: v2.MultiViewsOnTable;
    showTablePersonalisation?: boolean;
    exportType?: smarttable.ExportType;
    useExportToExcel?: boolean;
}
//# sourceMappingURL=Table.d.ts.map