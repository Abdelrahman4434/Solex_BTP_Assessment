import { PageTypeV4, SchemaType } from '@sap/ux-specification-types';
import type { v4, ImportListReportV4Parameters } from '@sap/ux-specification-types';
import type { MetadataInstanceInterface } from '../../../common/decoration/factory';
/**
 * Adds manifest settings to the config.json of LR or ALP V4.
 *
 * @param importParameters  - object comprising all input data
 * @param config - the configuration to be filled
 * @param factory - factory, for generating the access to reflect-metadata
 * @param pageType - page type
 * @param routingId - page key in manifest
 * @param schemaType - allows distinction of LR and ALP scenario
 */
export declare function addSettings(importParameters: ImportListReportV4Parameters, config: v4.ListReportConfigV4, factory: MetadataInstanceInterface, pageType: PageTypeV4, routingId: string, schemaType: SchemaType): void;
/**
 * Creates the configuration file content for a list report V4.
 *
 * @param importParameters  - object comprising all input data
 * @param schemaType - specifies whether the schema is for a List Report or Analytical List Page
 * @returns - the configuration (JSON) for the list report
 */
export declare function createListReportConfig(importParameters: ImportListReportV4Parameters, schemaType: SchemaType): v4.ListReportConfigV4 | undefined;
//# sourceMappingURL=listReport.d.ts.map