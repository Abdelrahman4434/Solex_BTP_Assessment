import { type Element } from 'xml-js';
import type { ExportFPMCustomPageV4Parameters, ExportResults, ExtensionLogger, SchemaDefinition } from '@sap/ux-specification-types';
import type { ExtensionFileData } from '../types';
import type { TransferParameterTypeV4 } from './types';
/**
 * Tracks deletion operations during export traversal.
 */
export interface ExportTraverseSchemaData {
    nodesToDelete?: Array<{
        element: Element;
        parent: Element;
    }>;
}
/**
 * Populates export results with data from extension.
 *
 * @param {ExtensionFileData} extensionData Extension data from parsed XML file.
 * @param {ExportResults} exportResults Export results API parameters needed for the export.
 * @param {object} config Extension of page config object.
 * @param {SchemaDefinition} jsonSchema Extesion definition schema.
 * @param {string} extensionType Extension type - view or fragment.
 * @param {ExtensionLogger | undefined} logger Logger class for logging messages.
 */
export declare function getExtensionExportResult(extensionData: ExtensionFileData, exportResults: ExportResults, config: object, jsonSchema: SchemaDefinition, extensionType: 'view' | 'fragment', logger?: ExtensionLogger): void;
/**
 * Run through the given FPM Custom Page config and return respective XML View result.
 * If no changes in config, then view is not returned.
 *
 * @param exportParameters All API parameters needed for the export.
 * @param defaultExportResult Default export result.
 * @returns Object comprising the updated xml view
 */
export declare const exportFPMCustomPageConfig: (exportParameters: ExportFPMCustomPageV4Parameters, defaultExportResult: ExportResults) => ExportResults;
/**
 * Runs through the given config and pushes changed fragments into export results.
 *
 * @param {TransferParameterTypeV4} transferParameters List of transfer parameters passed from API.
 * @param {string} fragmentName Full name of the fragment.
 * @param {object} config Current (sub)object of the configuration file.
 */
export declare const exportXMLFragmentConfig: (transferParameters: TransferParameterTypeV4, fragmentName: string, config: object) => void;
//# sourceMappingURL=fpmCustomPage.d.ts.map