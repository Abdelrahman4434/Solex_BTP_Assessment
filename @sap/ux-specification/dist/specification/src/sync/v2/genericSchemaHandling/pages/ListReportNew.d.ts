/**
 * @file This file hosts the entry point for generating the schema of a v2 List Report Page.
 * The schema is yet incomplete and is normally ignored by the runtime.
 * For manual tests it can be made active by switching useGenericSchemaHandling in pageAccess.ts to true.
 */
import type * as Edm from '@sap-ux/vocabularies-types/Edm';
import type { EntityTypeAnnotations_UI } from '@sap-ux/vocabularies-types/vocabularies/UI_Edm';
import type { SapUiGenericAppPageSettings } from '@sap/ux-specification-types';
import type { ListReportNewConfigV2 } from '@sap/ux-specification-types/src/v2/genericSchemaHandling/pages/ListReportNewConfigV2';
import { TableTypeV2Enum } from '@sap/ux-specification-types/src/v2/genericSchemaHandling/controls/Table';
import { ListHeader } from '../controls/ListHeader';
import { ListReportFilterBar } from '../controls/FilterBar';
import { Table } from '../controls/Table';
import type { Toolbar } from '../controls/Action';
import type { LineItemInfo } from '../../generate/utils';
/**
 * An instance of this type collects top-level information about a List Report page.
 * It will be created by the processingRuleAdapter of ListReport and passed as specificParams to
 * the processingRuleAdapters of the child controls.
 *
 * @property settings - the component settings from the manifest
 * @property entityType - Metadata of the entity type of the (main) entity set of this LR page
 * @property uIAnnotations - The ui annotations valid for this page
 * @property tableType - The type of the table used on this LR page
 * @property lineItemInfo - Information about the line item configured for this LR page (if any)
 */
export type LRSchemaHandlingParams = {
    settings?: SapUiGenericAppPageSettings;
    entityType: Edm.EntityType;
    uIAnnotations: EntityTypeAnnotations_UI;
    tableType: TableTypeV2Enum;
    lineItemInfo?: LineItemInfo;
};
export declare class ListReportNew implements ListReportNewConfigV2 {
    fitContent?: boolean;
    header?: ListHeader;
    filterBar?: ListReportFilterBar;
    table?: Table;
    footer?: Toolbar;
}
//# sourceMappingURL=ListReportNew.d.ts.map