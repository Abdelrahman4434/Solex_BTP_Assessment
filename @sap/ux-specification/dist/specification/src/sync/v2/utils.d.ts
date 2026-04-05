import type { AccessorPath, ConversionExitProvider, ExtensionLogger, FileData, Manifest, ManifestSettingsType } from '@sap/ux-specification-types';
import type { Definition, DefinitionOrBoolean } from 'typescript-json-schema';
import type { ManifestPathParams, ManifestPropertyResolution } from '../common';
/**
 * Returns the manifest path to (a section within) the settings for a page.
 *
 * @param pagePath - the manifest path to the definition of the page
 * @param suffix - a path specifying a section within the settings
 * @returns the manifest path to the specified section within the settings of the page
 */
export declare function getManifestPathToPageSettings(pagePath: AccessorPath, suffix?: AccessorPath): AccessorPath;
/**
 * Helper function to extract information from the manifest.
 *
 * @param manifest - the manifest containing the information
 * @param manifestPath - pointer to the object in the manifest containing the property to be checked
 * @param property - the property below the specified path that should be extracted. If it is faulty, no value will be extracted.
 * @returns - hasPath: information whether the specified path can be followed in the manifest and the target is an object (which is not null)
 * - value: The value of the specified property if the path can be followed and the corresponding object possesses the specified property, otherwise undefined
 * - parent: the not-null object found at the specified path (parent object of the property), otherwise undefined. Note that modifying the properties of this object will also change manifest.
 */
export declare function getManifestPropertyByPath(manifest: Manifest, manifestPath: AccessorPath, property?: string): {
    hasPath: boolean;
    value: ManifestSettingsType | undefined;
    parent: object | undefined;
};
/**
 * Type guard that checks whether a given optional instance of DefinitionOrBoolean is indeed a Definition.
 *
 * @param obj the instance to be tested
 * @returns whether obj is indeed a (truthy) Definition
 */
export declare function isDefinition(obj: DefinitionOrBoolean | undefined): obj is Definition;
/**
 * This function should be used to add a conversion exit to the definition of a property in an app specific schema.
 * The function can be called within the implementation of function processingRuleAdapter as part of the SyncRule of a manifest based property.
 *
 * @param element - the definition of the property to which the conversion exit should be added
 * @param conversionExit - the name of the conversion exit. Note that the ConversionExitProviders being used by the generic import and export processes must be able
 * to find the implementations of the conversion exits by this name.
 * @param params - parameters that should be passed to the conversion exit functions when they are called by the generic import and export processes.
 * Note that the format of this value must be in sync with the format expected by the conversion exit implementation.
 */
export declare function addConversionExit(element: Definition, conversionExit: string, params?: unknown): void;
/**
 * This function is called by the generic import and export processes in order to perform a value conversion for a property for which a conversion exit has been assigned in the page specific schema.
 * It executes the specified conversion exit.
 *
 * @param isDirectionAppToConfig - flag indicating whether the conversion is from app to config or vice versa
 * @param conversionExitProvider - should be able to provide the implementation of the conversion exit specified in the property definition
 * @param propertyDefinition - the definition of the property in the page specific schema. This function will only be called when it contains an assignment of a conversion exit which should have been added by addConversionExit.
 * @param value - the value to be converted
 * @param fragments - the fragments of the app. In the configToApp case the entries are actually of type FileDataResult and the function may also modify the list.
 * @param oldValue - the old value of the property in the manifest. Only relevant in the configToApp case.
 * @param logger - may be used to log messages during the conversion. Only relevant in the appToConfig case.
 * @returns the converted value
 */
export declare function executeConversionExit(isDirectionAppToConfig: boolean, conversionExitProvider: ConversionExitProvider | undefined, propertyDefinition: Definition, value: unknown, fragments?: FileData[], oldValue?: unknown, logger?: ExtensionLogger): unknown;
/**
 * Returns whether an object should be considered as an empty object.
 *
 * @param obj - the object to be checked
 * @returns whether the object should be considered empty
 */
export declare function isEmpty(obj: object | null | undefined): boolean;
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param appSchema - Full schema.
 * @param definitionName - The name of the definition/class whose properties are being processed.
 *   If `undefined`, the function attempts to resolve the definition name from the `$ref` property of the provided definition.
 * @param definition - The definition object containing property schemas.
 * @param pathParams - Additional context required to compute manifest paths.
 * @param control - Control containing sync rules to detect 'manifestPath'
 * @param parentProperty - Information about the parent property used when resolving.
 *   nested or inherited manifest paths (e.g. parent property name and resolved rule path).
 * @param handleRelative - A flag indicating whether to use relative paths for definition properties.
 */
export declare function addManifestPathsToProperties(appSchema: Definition, definitionName: string | undefined, definition: Definition, pathParams: ManifestPathParams, control?: {
    [key: string]: {
        prototype: object;
    };
}, parentProperty?: ManifestPropertyResolution, handleRelative?: boolean): void;
/**
 * Returns the manifest path for a given page based on the provided path parameters.
 *
 * @param {ManifestPathParams} pathParams - Parameters containing page information for path resolution.
 * @returns {string | undefined} The resolved manifest path as a string, or undefined if not applicable.
 */
export declare function getPageManifestPath(pathParams: ManifestPathParams): string | undefined;
//# sourceMappingURL=utils.d.ts.map