import type { ChangeDefinition, CommonImportParameters } from '@sap/ux-specification-types';
import { v2 } from '@sap/ux-specification-types';
import type { ExtensionLogger } from '../../..';
/**
 * Determines a V2 object page in the manifest, based on the given entity set.
 *
 * @param v2Pages - manifest['sap.ui.generic.app'].pages
 * @param entitySet - current entityset
 * @param pageKeys - list of page keys, to be filled
 * @returns v2Page - page as specified in the manifest
 */
export declare function findObjectPageV2(v2Pages: v2.SapUiAppPagesV2, entitySet: string, pageKeys: string[]): v2.SapUiAppPageV2 | undefined;
/**
 * Determines a V2 list report page in the manifest.
 *
 * @param v2Pages - manifest['sap.ui.generic.app'].pages
 * @param pageKeys - list of page keys, to be filled
 * @returns v2Page - page as specified in the manifest
 */
export declare function findListReportPageV2(v2Pages: v2.SapUiAppPagesV2, pageKeys: string[]): v2.SapUiAppPageV2 | undefined;
/**
 * Validate the given page definition from manifest.
 *
 * @param importParameters  - object comprising all API input data
 * @returns {v2.SapUiAppPagesV2 | undefined} Pages definition in manifest if found
 */
export declare function getV2Pages(importParameters: CommonImportParameters): v2.SapUiAppPagesV2 | undefined;
/**
 * Validate the given page definition from manifest.
 *
 * @param v2Page - manifest page
 * @param logger - logger for writing the check results
 * @param entitySet - the given entiset from the API call
 */
export declare function checkV2Page(v2Page: v2.SapUiAppPageV2, logger: ExtensionLogger, entitySet: string): void;
/**
 * Determines a V2 analytical list page in the manifest.
 *
 * @param v2Pages - manifest['sap.ui.generic.app'].pages
 * @param pageKeys - list of page keys, to be filled
 * @param logger - logger for writing error messages if the analytical list page is not found
 * @returns v2Page - page as specified in the manifest
 */
export declare function findAnalyticalListPage(v2Pages: v2.SapUiAppPagesV2, pageKeys: string[], logger?: ExtensionLogger): v2.SapUiAppPageV2 | undefined;
/**
 * Method checks if passed extension key is associated to custom section with passed entity.
 *
 * @param {string} extensionKey - Extension key.
 * @param {string} entity - Entity to check in extension.
 * @returns {boolean} Is extension key relates to custom section and associated to passed entity.
 */
export declare function isAssociatedCustomSection(extensionKey: string, entity: string): boolean;
/**
 * Method which finds custom section extensions in manifest for passed entitySet.
 *
 * @param manifest - manifest.
 * @param entitySet - Entity set to lookup while searching custom section extensions.
 * @returns {object} Found object with custom sections
 */
export declare function findCustomSectionExtensions(manifest: object, entitySet: string): object;
/**
 * Removes empty properties in the config.json of Analytical List Page V2 | ListReport Page V2.
 *
 * @param config - the configuration to be checked
 */
export declare function removeEmptySettings(config: v2.AnalyticalListPageConfigV2 | v2.ListReportConfigV2): void;
/**
 * Determines whether a flex change matches the specified template and entity set.
 *
 * The match is performed against the first segment of the `controlId`
 * (before the `--` separator).
 *
 * Instead of comparing the full control ID (for example
 * `appId::template::entitySet`), this function intentionally checks only
 * whether the control ID **ends with** `::template::entitySet`.
 *
 * This is a deliberate simplification to avoid resolving the application ID.
 *
 * @param change - Flex change definition containing the control ID to evaluate.
 * @param template - Template identifier that must be included in the control ID.
 * @param entitySet - Entity set that must be included in the control ID.
 * @returns `true` if the flex change matches the template and entity set; otherwise `false`.
 */
export declare function flexChangeMatchesTemplateAndEntitySet(change: ChangeDefinition, template: string, entitySet: string): boolean;
/**
 * Filters a list of flex change strings by template name and entity set.
 *
 * @param flex - Array of flex change strings to be filtered.
 * @param template - Template identifier that must be included in the control ID.
 * @param entitySet - Entity set that must be included in the control ID.
 * @returns An array of flex change strings matching the given template and entity set.
 */
export declare function filterFlexChanges(flex: string[], template: string, entitySet: string): string[];
//# sourceMappingURL=utils.d.ts.map