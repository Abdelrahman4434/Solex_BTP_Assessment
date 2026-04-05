import type { ImportListReportV2Parameters, CommonImportParameters } from '@sap/ux-specification-types';
import { v2 } from '@sap/ux-specification-types';
import type { Definition } from 'typescript-json-schema';
/**
 * Imports flex changes for columns and table.
 *
 * @param importParameters  - object comprising all input data
 * @param lineItemsDefinition - the relevant line items' definition in the schema
 * @param listReportConfig - LR config, to be filled
 */
export declare function importFlexChangesOfTableAndColumns(importParameters: CommonImportParameters, lineItemsDefinition: Definition, listReportConfig: v2.ListReportConfigV2): void;
/**
 * Creates the configuration file content for a list report V2.
 *
 * @param importParameters  - object comprising all input data
 * @returns {v2.ListReportConfigV2 | undefined} - the configuration (JSON) for the list report
 */
export declare function createListReportConfig(importParameters: ImportListReportV2Parameters): v2.ListReportConfigV2 | undefined;
//# sourceMappingURL=listReport.d.ts.map