/**
 * @file This file is used for manual tests and will only be used temporarily.
 * It is needed while the generic schema handling solution for v2 List Report is still in development but
 * the previous logic is actually used at runtime.
 * For this purpose the file exposes a handler class that is capable to perform the three important tasks provided to the PageMap by specification
 * (generation of page specific schema, import, and export).
 * The implementation of these three tasks is forwarded to the corresponding 'classical' implementation files.
 * For manual tests you can set useGenericSchemaHandling to true. Then these three tasks will be executed based on the schema class ListReportNew
 * and the generic schema handling logic.
 * Do not forget to set the variable back to false, before submitting any changes!
 *
 * Note: This file also exposes some of its helper functions so that they can also be used by the unit tests that test the new schema generation logic for v2 LR as well.
 */
import { type AccessorPath, type Manifest, type ExportListReportV2Parameters, type ExportListReportWithPathV2Parameters, type ExportResults, type GenerateAppSchemaParameters, type ImportListReportV2Parameters, type PageConfig, type UI5Version } from '@sap/ux-specification-types';
import type { Definition } from 'typescript-json-schema';
import { type GenericSchemaInfoProvider } from '../../generate/schemaAdaptation';
import { type ImportConfigInfo } from '../../import/importPage';
import { type FlexInfo } from '../../export/exportPageGeneric';
/**
 * Gives access to the new version of the generic schema for a v2 List Report Page as it has been persisted by the build process.
 *
 * @returns the schema definition of the v2 List Report Page
 */
export declare function getPersistentListReportNewSchema(): Definition;
/**
 * Creates a GenericSchemaInfoProvider that can be used to access the required schema information for a v2 List Report Page when the generic schema handling logic is used.
 * Note that this function is called in two scenarios:
 * 1. In runtime case it is called when useGenericSchemaHandling has been set to true and the Page Editor for a v2 List Report page is opened.
 * 2. Unit tests for the generic schema handling logic of v2 List Report call this via function getGenericPageInfoProvider4NewPages.
 * Depending on the scenario the current directory (__dirname) will either point to the dist folder or to the source folder of this file.
 *
 * @returns a GenericSchemaInfoProvider that gives access to the schema information for the new v2 list report page.
 */
export declare function createGenericSchemaInfoProvider(): GenericSchemaInfoProvider;
/**
 * This function provides the configuration information for a v2 List Report Page.
 * All other page types are currently not handled by this function.
 *
 * @param componentName - name of the template component describing the page. Should identify the v2 list report page.
 * @returns the instance provider needed to create instances of the types for the v2 List Report Page, resp. undefined when another page is specified
 */
export declare function getConfigInfo(componentName: string): ImportConfigInfo | undefined;
/**
 * Provides the manifest path to the root page (either LR or ALP) the manifest of a FE v2 app.
 
 * @param manifest the manifest of the FE v2 app
 * @returns the manifest path to the root page resp. undefined if no root page is defined in the manifest
 */
export declare function getPathForRootPage(manifest: Manifest): AccessorPath | undefined;
/**
 * Conversion form the FlexInfo representation of a flex change into its string representation.
 *
 * @param ui5Version - specifies the ui5 version the change is written for
 * @param manifest - manifest of the app the change is created for
 * @param flexInfo - description of the change to be converted
 * @returns - string representation of the flex change
 */
export declare function flexInfoToChangeString(ui5Version: UI5Version, manifest: Manifest, flexInfo: FlexInfo): string;
/**
 * Generates an app specific schema for the FE V2 ListReport from the generic schema.
 * Generic types are replaced by information from the app specific annotations.
 *
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @param {object} genericSchema - generic JSON schema of a list report
 * @returns appSchema - the application specific JSON schema
 */
export declare function generateListReportSchemaV2(generateParameters: GenerateAppSchemaParameters, genericSchema: Definition): object;
/**
 * Creates the configuration file content for a list report V2.
 *
 * @param importParameters  - object comprising all input data
 * @returns {v2.ListReportConfigV2 | undefined} - the configuration (JSON) for the list report
 */
export declare function createListReportConfig(importParameters: ImportListReportV2Parameters): PageConfig | undefined;
/**
 * Run through the given ListReport config and return respective manifest entry and flex changes.
 *
 * @param {ExportListReportV2Parameters} exportParameters - all API parameters needed for the export
 * @param ui5Version - SAP UI5 version
 * @param deletionRequest - if set to true, any manifest setting specified by entityPath gets deleted even if it comprises any unknown property
 * @returns ExportResults - The export result comprises the enhanced manifest as well as a list of flex changes.
 */
export declare function exportListReportPage(exportParameters: ExportListReportV2Parameters | ExportListReportWithPathV2Parameters, ui5Version: UI5Version, deletionRequest?: boolean): ExportResults;
//# sourceMappingURL=pageAccess.d.ts.map