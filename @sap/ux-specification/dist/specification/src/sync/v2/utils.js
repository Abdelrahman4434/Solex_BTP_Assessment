"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getManifestPathToPageSettings = getManifestPathToPageSettings;
exports.getManifestPropertyByPath = getManifestPropertyByPath;
exports.isDefinition = isDefinition;
exports.addConversionExit = addConversionExit;
exports.executeConversionExit = executeConversionExit;
exports.isEmpty = isEmpty;
exports.addManifestPathsToProperties = addManifestPathsToProperties;
exports.getPageManifestPath = getPageManifestPath;
/**
 * @file This file contains helper functions for generic schema handling.
 * The functionality is implicitly tested by the more complex unit-tests for generic schema generation and generic import in test-folder unit/genericSchemaHandling.
 */
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../common");
const v2controls = __importStar(require("./export/controls"));
const pages = __importStar(require("./export/pages"));
const application_1 = require("./application");
const controlsWithSyncRules = {};
for (const control in v2controls) {
    if (typeof v2controls[control] === 'function') {
        controlsWithSyncRules[control] = v2controls[control];
    }
}
/**
 * Returns the manifest path to (a section within) the settings for a page.
 *
 * @param pagePath - the manifest path to the definition of the page
 * @param suffix - a path specifying a section within the settings
 * @returns the manifest path to the specified section within the settings of the page
 */
function getManifestPathToPageSettings(pagePath, suffix = []) {
    const settingsPath = pagePath.concat(['component', 'settings']);
    return settingsPath.concat(suffix);
}
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
function getManifestPropertyByPath(manifest, manifestPath, property) {
    let manifestSection = manifest; // Current position in the manifest when stepping down
    const hasPath = 
    // Traverse down the manifest (in manifestSection) step by step along the specified path
    manifestPath.every(function (accessor) {
        if (!manifestSection ||
            typeof manifestSection !== 'object' ||
            (Array.isArray(manifestSection) && typeof accessor !== 'number')) {
            // In order to perform another step down our current position must be a (not-null) object.
            // If this is even an array we only accept numbers as accessors.
            // When this condition is not fulfilled, we stop stepping down.
            return false;
        }
        manifestSection = manifestSection[accessor]; // execute the step down
        return true;
    }) &&
        typeof manifestSection === 'object' &&
        manifestSection !== null; // Finally check whether we still have reached a not-null object
    return {
        hasPath,
        value: hasPath && property ? manifestSection[property] : undefined,
        parent: hasPath ? manifestSection : undefined
    };
}
/**
 * Type guard that checks whether a given optional instance of DefinitionOrBoolean is indeed a Definition.
 *
 * @param obj the instance to be tested
 * @returns whether obj is indeed a (truthy) Definition
 */
function isDefinition(obj) {
    return obj !== null && typeof obj === 'object';
}
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
function addConversionExit(element, conversionExit, params) {
    const conversionExitDef = {
        name: conversionExit
    };
    if (params !== undefined) {
        conversionExitDef['params'] = params;
    }
    element[ux_specification_types_1.SchemaTag.conversionExit] = conversionExitDef;
}
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
function executeConversionExit(isDirectionAppToConfig, conversionExitProvider, propertyDefinition, value, fragments, oldValue, logger) {
    const conversionExitDef = propertyDefinition[ux_specification_types_1.SchemaTag.conversionExit];
    const conversionExitName = conversionExitDef?.['name'];
    const conversionExit = conversionExitProvider ? conversionExitProvider(conversionExitName) : undefined;
    if (!conversionExit) {
        return value; // should not happen, as all conversion exits added to the schema should also have implementations in the ConversionExitProvider. Just added for robustness.
    }
    const conversionExitParams = conversionExitDef['params'];
    return isDirectionAppToConfig
        ? conversionExit.appToConfig(value, conversionExitParams, fragments ?? [], propertyDefinition, logger)
        : conversionExit.configToApp(value, conversionExitParams, (fragments ?? []), propertyDefinition, oldValue);
}
/**
 * Returns whether an object should be considered as an empty object.
 *
 * @param obj - the object to be checked
 * @returns whether the object should be considered empty
 */
function isEmpty(obj) {
    return !obj || Object.keys(obj).every((key) => obj[key] === undefined);
}
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
function addManifestPathsToProperties(appSchema, definitionName, definition, pathParams, control, parentProperty, handleRelative = false) {
    const controls = control ? [control, controlsWithSyncRules, pages] : [controlsWithSyncRules, pages];
    (0, common_1.addManifestPathsToProperties)(controls, appSchema, definitionName, definition, pathParams, parentProperty, handleRelative);
}
/**
 * Returns the manifest path for a given page based on the provided path parameters.
 *
 * @param {ManifestPathParams} pathParams - Parameters containing page information for path resolution.
 * @returns {string | undefined} The resolved manifest path as a string, or undefined if not applicable.
 */
function getPageManifestPath(pathParams) {
    if (Array.isArray(pathParams.pageName)) {
        const syncPath = (0, application_1.getAppRootSettingOBJPath)(pathParams.pageName);
        return (0, common_1.convertSyncRulePathToJsonPath)(syncPath);
    }
}
//# sourceMappingURL=utils.js.map