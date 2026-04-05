/**
 * @file This file provides a function that generically analyzes the config for a page of a FE v2 app and adapts the manifest artifacts defining the page accordingly (function exportPage).
 * This process is also called 'export'.
 * Thereby, the page specific schema for this page is heavily used. It is assumed that this schema was generated using
 * the tools provided in file ../generate/schemaAdaptation.ts.
 * Moreover, it is assumed that the config was originally created by ../import/importPage.ts and then modified (e.g. by Fiori Tools) based on the page specific schema.
 * Unit tests for this class are located in test.unit.genericSchemaHandling.exportPageGeneric.test.ts.
 */
import type { ConversionExitProvider, ExtensionLogger, FileData, FileDataResult, Manifest, ManifestSettingsType } from '@sap/ux-specification-types';
import { ChangeIndicator } from '@sap/ux-specification-types';
import type { Definition } from 'typescript-json-schema';
/**
 * An instance of this type collects all information needed for function exportPage.
 *
 * @property appId - id of the app. Note that this should not be taken from the manifest, since the manifest may still contain a placeholder.
 * @property config - the config to be exported. Note: This instance has the same structure as the config returned by function getConfigForPage in importPage.ts.
 * However, the instance has gone through a process of serialization and deserialization, so that it does not contain the corresponding type information.
 * @property manifest - manifest of the FE v2 app
 * @property jsonSchema - the page specific schema for config
 * @property conversionExitProvider - provider for conversion exits assigned in jsonSchema
 * @property fragments - fragments in status before the export has started
 * @property logger - used for logging any problems that occur during the export
 */
export type ExportPageInParameters = {
    appId: string;
    config: object;
    manifest: Manifest;
    jsonSchema: Definition;
    conversionExitProvider?: ConversionExitProvider;
    fragments?: FileData[];
    logger?: ExtensionLogger;
};
/**
 * An instance of this type represents the information from a flex change that is relevant for the export process.
 *
 * @property controlId - the id of the control the flex change is defined for
 * @property controlType - the type of the control the flex change is defined for
 * @property propertyName - the name of the control property the flex change is defined for
 * @property isBinding - indicates whether the change sets a binding for the specified control property (in contrast to a fixed value)
 * @property newValue - the value (or binding) that is set for the specified control property. Note that a value of null
 * has a special meaning: It indicates that this control property should not have a flex change at all (thus an existing one should be deleted).
 */
export type FlexInfo = {
    controlId: string;
    controlType: string;
    propertyName: string;
    isBinding: boolean;
    newValue: ManifestSettingsType | null;
};
/**
 * An instance of this type represents the information delivered by function exportPage.
 *
 * @property manifest - the modified manifest
 * @property manifestChangeIndicator - information whether an update of the manifest has happened
 * @property flexList - flex info for all control properties that potentially can be modified via a flex change
 * @property fragments - fragments after the export including the relevant change information
 */
export type ExportPageResults = {
    manifest: Manifest;
    manifestChangeIndicator: ChangeIndicator;
    flexList: FlexInfo[];
    fragments: FileDataResult[];
};
/**
 * This function implements the generic export for a page.
 * More precisely it takes the current state of the app (manifest, flex changes, fragments), the page specific schema for a page within the app, and the
 * config for this page. It returns the information how the app should be adapted.
 * Thereby, we assume that the config was created by function getConfigForPage (in importPage.ts) from the current state of the page
 * and then potentially modified (e.g. by user interaction).
 *
 * @param inParameters - an object containing all information relevant for the export process
 * @returns the information about the updated state of the app
 */
export declare function exportPage(inParameters: ExportPageInParameters): ExportPageResults;
//# sourceMappingURL=exportPageGeneric.d.ts.map