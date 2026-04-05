"use strict";
/**
 * @file This file contains helper functions for generating page specific schemas that are used in the context of manifest properties.
 * The functionality is implicitly tested by the more complex unit-tests for generic schema generation and generic import in test-folder unit/genericSchemaHandling.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.standardSyncRuleForManifestSettingsProperty = exports.DISALLOWED_WITHOUT_EXPLANATION = void 0;
exports.hasPropertyTypeError = hasPropertyTypeError;
exports.handleDisallowedProperty = handleDisallowedProperty;
exports.getSyncRuleForManifestProperty = getSyncRuleForManifestProperty;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const extensionLogger_1 = require("../../../extensionLogger");
const i18next_1 = __importDefault(require("i18next"));
const utils_1 = require("../utils");
/**
 * Type check for properties coming from the manifest.
 *
 * @param parent - the parent object in manifest which may contain the property.
 * @param propertyName - name of the property name to be checked
 * @param logger - a logger which may receive the error message in case a type error is detected
 * @param expectedType - the expected type of the value of the property (if it is not undefined)
 * @param mandatory - specifies handling of null and undefined: If parent is null this is always considered an error.
 * undefined value for parent or its specified property is considered an error when parameter mandatory is true.
 * null value for the specified property is considered an error when mandatory is true or the expected type is not 'object'.
 * @returns the information whether a type error was detected.
 */
function hasPropertyTypeError(parent, propertyName, logger, expectedType = 'string', mandatory = false) {
    let hasTypeError;
    if (parent === undefined) {
        hasTypeError = mandatory;
    }
    else if (parent === null || typeof parent !== 'object') {
        hasTypeError = true;
    }
    else {
        const propValue = parent[propertyName];
        if (propValue === undefined) {
            hasTypeError = mandatory;
        }
        else {
            hasTypeError = typeof propValue !== expectedType || (propValue === null && mandatory);
        }
    }
    if (hasTypeError) {
        (0, extensionLogger_1.log)(logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('TYPEERROR', { propertyName: propertyName, expectedType: expectedType })
        });
    }
    return hasTypeError;
}
/**
 * This symbol is used to indicate that a property is not allowed in the current context and that it should be hidden without any explanation.
 */
exports.DISALLOWED_WITHOUT_EXPLANATION = Symbol('Property is suppressed without explanation');
/**
 * Helper function to be called within processingRuleAdapters of syncRules.
 * The function should be called when a property defined in the generic schema is not valid
 * for the page the specific schema is currently generated for.
 * We distinguish two cases:
 * - The property is present in the manifest (although it should not)
 * - The property is not present in the manifest (as expected)
 * In the first case the corresponding property should still be present in the schema.
 * However, a warning message is added to the schema in order to make the user aware of this inconsistency.
 * In the second case the property should not be shown to the user. So, preferably we would
 * remove the property from the schema.
 * However, this is currently not possible due to a flaw in the undo/redo logic which results in schemas
 * being used to process the export that do not exactly fit to the current state of the config.
 * For these cases we need the manifest path which is stored with the definition of the property in the schema.
 * Therefore, we set the hidden flag of the property to true. This will be changed as soon as the undo/redo logic has been refactored.
 *
 * @param disallowedReason - The truthy description how the disallowed property should be handled
 * @param processingRule - the processingRule that should be adapted
 * @param value - the value of the property in the manifest
 * @param manifestPath - the path to the property in the manifest
 */
function handleDisallowedProperty(disallowedReason, processingRule, value, manifestPath) {
    delete processingRule.element.$ref;
    if (value === undefined || disallowedReason === exports.DISALLOWED_WITHOUT_EXPLANATION) {
        processingRule.element[ux_specification_types_1.SchemaTag.hidden] = true;
    }
    else {
        if (typeof value === 'object') {
            processingRule.element.type = 'object';
        }
        processingRule.element[ux_specification_types_1.SchemaTag.messages] = [
            {
                text: disallowedReason,
                deletable: true,
                type: ux_specification_types_1.PropertyMessageType.Warning
            }
        ];
    }
    processingRule.manifestPath = manifestPath;
}
/**
 * This function can be used to generate a SyncRule for a manifest property that may be omitted in the page specific schema
 * depending on the context of the page.
 *
 * @param property - the name of the property in the manifest the SyncRule should be generated for
 * @param analyze - provides the ManifestRule for the property
 * @param adapt - an optional function that can be used to adapt the schema element representing the manifest property
 * @param provideReferenceAdaptation - an optional function that can be used to provide the ReferenceAdaptationInfo for the manifest property
 * @param expectedType - the expected type of the value of the property (if it is not undefined)
 * @returns the SyncRule for the manifest property
 */
function getSyncRuleForManifestProperty(property, analyze, adapt, provideReferenceAdaptation, expectedType) {
    return {
        manifest: {},
        processingRuleAdapter: function (processingRule, schemaHandlingParams, generateParameters) {
            const { manifestPath, disallowedReason } = analyze(processingRule.element, schemaHandlingParams, generateParameters);
            if (disallowedReason === exports.DISALLOWED_WITHOUT_EXPLANATION) {
                delete processingRule.element;
                return; // Suppress the property even if it is present in the current manifest -> no further processing needed
            }
            // What is the state of the property in the current manifest?
            const { value, parent } = (0, utils_1.getManifestPropertyByPath)(generateParameters.manifest, manifestPath, property);
            if (disallowedReason) {
                handleDisallowedProperty(disallowedReason, processingRule, value, manifestPath);
                return;
            }
            // The property is applicable.
            // But it can still be that its current content does not have the correct type.
            // Type errors are logged. Note that the user can also see these errors.
            const hasTypeErrors = expectedType
                ? hasPropertyTypeError(parent, property, generateParameters.logger, expectedType)
                : false;
            if (hasTypeErrors && (expectedType === 'object' || typeof value === 'object')) {
                // either value in manifest is an object but should be scalar or it is scalar but should be an object.
                // This inconsistency must be removed in the text file of the manifest -> do not provide this property at all
                delete processingRule.element;
                return;
            }
            if (adapt) {
                adapt(processingRule.element, schemaHandlingParams, generateParameters, value);
            }
            processingRule.manifestPath = manifestPath;
            if (provideReferenceAdaptation) {
                processingRule.referenceAdaptation = provideReferenceAdaptation(schemaHandlingParams, generateParameters);
            }
        }
    };
}
/**
 * Common syncRule for all properties defined in the manifest on settings level without any special logic.
 */
exports.standardSyncRuleForManifestSettingsProperty = {
    manifest: {},
    processingRuleAdapter(processingRule, schemaHandlingParams) {
        processingRule.manifestPath = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath);
    }
};
//# sourceMappingURL=manifestPropertyUtils.js.map