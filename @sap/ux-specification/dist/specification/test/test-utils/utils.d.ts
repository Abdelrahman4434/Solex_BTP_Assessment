import type { ExportResults, ExtensionLogger, FileData, LogMessage, Manifest } from '@sap/ux-specification-types';
import type { Definition } from 'typescript-json-schema';
export declare class Logger implements ExtensionLogger {
    logInfo: string[];
    logWarning: string[];
    logError: string[];
    private enrichLogMessage;
    constructor();
    info(message: string, meta?: LogMessage): void;
    warning(message: string, meta?: LogMessage): void;
    error(message: string, meta?: LogMessage): void;
    reset(): void;
}
export declare function createTestLogger(): Logger;
/**
 * Returns the content of a list of files that are indicated by a list of file paths
 */
export declare function retrieveFileContent(path: string): string;
export declare function prepareFileData(path: string): FileData;
export declare function getSTTAAnnotations(annotationSuffix?: string): FileData[];
export declare function getSDV4Annotations(): FileData[];
export declare function getSTTAAnnotationsProdMan2(): FileData[];
/**
 * Provides access to the manifest for the v2sttaProdMan2 project.
 * Thereby it is possible to get a modified manifest containing an extended multi-view multi-table setting.
 *
 * @param forMultiView - information whether the extended multi-view setting should be provided
 * @param: hasAlsoQuickVariantSelection - if true, the manifest will contain both quickVariantSelectionX and quickVariantSelection settings
 * @returns the manifest as specified
 */
export declare function getSTTAManifestProdMan2(forMultiView: boolean, hasAlsoQuickVariantSelection?: boolean): Manifest;
export declare function getALPAnnotations(): FileData[];
export declare function getALPVisualizationsAnnotations(): FileData[];
export declare function getExtensionsProdMan2(): FileData[];
export declare function getSEPMRAAnnotations(): FileData[];
export declare function getExtensionsForS2pMmPurSrcgprojMaintains1(specificFiles?: string[]): FileData[];
export declare function findFlexChangeBySelector(exportResult: ExportResults, selectorId: string, property: string): object;
/**
 * Function to find out the flexChange from a list. Uses global variable exportResult
 *
 * @param {string} property Property for which the flexChange is to be found
 * @returns {object} contents of the flexChange
 */
export declare function findFlexChange(exportResult: ExportResults, property: string): object;
/**
 * Method checks position properties in schema.
 * It also updates schema by removing offset properties from position as it is related to OS
 * Macros id (internalId) is also getting removed from macros metadata as it depends on uuid library.
 * At the end there will be line and column indexes, which could be stored in snapshots.
 *
 * @param {object} schema Schema to check and update.
 * @returns {boolean} Valid positions.
 */
export declare function checkPositions(schema: object): boolean;
/**
 * Method returns array of schema definition properties which sorted by 'propertyIndex' property.
 *
 * @param {SchemaDefinition} schemaDefinition Schema definition which contains properties.
 * @returns {string[]} Array of sorted properties by 'propertyIndex' property.
 */
export declare const getOrderedEntries: (schemaDefinition: Definition) => string[];
export declare function findManifestSettingV4(exportResult: ExportResults, pageName: string): object;
/**
 * Returns the definition of the referred type of a schema element.
 *
 * @param element - the schema element that may refer to another type
 * @param schema - the global schema
 * @returns the definition of the type the elements refers to, or undefined if it does not refer to any type
 */
export declare function getReferredTypeDefinition(element: Definition, schema: Definition): Definition | undefined;
//# sourceMappingURL=utils.d.ts.map