/**
 * @file This file contains helper functions for generating page specific schemas that are used in the context of manifest properties.
 * The functionality is implicitly tested by the more complex unit-tests for generic schema generation and generic import in test-folder unit/genericSchemaHandling.
 */
import type { Definition } from 'typescript-json-schema';
import type { SyncRule, GenerateAppSchemaParameters, ProcessingRule, AccessorPath, SchemaHandlingParams, ReferenceAdaptationInfo } from '@sap/ux-specification-types';
import type { ExtensionLogger } from '../../..';
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
export declare function hasPropertyTypeError(parent: unknown, propertyName: string, logger?: ExtensionLogger, expectedType?: string, mandatory?: boolean): boolean;
/**
 * This symbol is used to indicate that a property is not allowed in the current context and that it should be hidden without any explanation.
 */
export declare const DISALLOWED_WITHOUT_EXPLANATION: unique symbol;
/**
 * An instance of this type describes whether a property is allowed in the current context or not.
 * A faulty instance of this type expresses that the property is allowed in the current context.
 * A non-faulty string instance expresses that the property is not allowed in the current context.
 * Moreover, it contains the human readable reason why the property is not allowed.
 * The special value DISALLOWED_WITHOUT_EXPLANATION indicates that the property is not allowed in the current context
 * and that it should be hidden without any explanation.
 */
export type DisallowedSpecification = string | typeof DISALLOWED_WITHOUT_EXPLANATION;
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
export declare function handleDisallowedProperty(disallowedReason: DisallowedSpecification, processingRule: ProcessingRule, value: unknown, manifestPath: AccessorPath): void;
/**
 * Instances of this type are used during page specific schema generation. They specify how to deal with a specific manifest property.
 * Instances of this type should be provided by instances of type ManifestAnalyzer (passed to function getSyncRuleForManifestProperty).
 *
 * @property manifestPath - specifies where the content for this property should be located within the manifest
 * @property disallowedReason - faulty when the property is valid for the page. Otherwise describes how to deal with the disallowed property if it is present in the manifest.
 */
export type ManifestRule = {
    manifestPath: AccessorPath;
    disallowedReason?: DisallowedSpecification;
};
/**
 * An instance of this type provides a possibility to obtain a ManifestRule. ManifestAnalyzers should be provided by users of function getSyncRuleForManifestProperty.
 *
 * @param element - the element in the schema representing the property to be analyzed
 * @param schemaHandlingParams - information provided by the hierarchy level above of the schema generation process
 * @param generateParameters - input parameters for the schema generation process
 * @returns a ManifestRule which specifies how to deal with the manifest property
 */
export type ManifestAnalyzer = (element: Definition, schemaHandlingParams: SchemaHandlingParams, generateParameters: GenerateAppSchemaParameters) => ManifestRule;
/**
 * An instance of this type is called within an instance of type ElementAdapter.
 * Thereby, the schema element it is working on represents a manifest property.
 * The function is called with the same parameters as an instance of type ElementAdapter.
 * The only difference is that the function is called with an additional parameter 'value' which contains the value of the property in the manifest.
 * The task of this function is to adapt the schema element for the page specific schema (if such an adaptation is necessary).
 *
 * @param element - same as in type ElementAdapter. It represents a manifest property.
 * @param schemaHandlingParams - same as in type ElementAdapter
 * @param generateParameters - same as in type ElementAdapter
 * @param value - the value of the property in the manifest
 * @returns a ProcessingRule which specifies how to deal with the manifest property
 */
export type ElementAdapterExtended = (element: Definition, schemaHandlingParams: SchemaHandlingParams, generateParameters: GenerateAppSchemaParameters, value: unknown) => void;
/**
 * An instance of this type is called within an instance of type ElementAdapter.
 * Thereby, the schema element it is working on represents a manifest property.
 * The function is called with the same parameters as an instance of type ElementAdapter.
 * The only difference is that the parameter 'element' is not passed to the function.
 * The task of this function is to provide the ReferenceAdaptationInfo which should be included
 * in the ProcessingRule provided by the ElementAdapter (if an adaptation of the reference is necessary).
 *
 * @param schemaHandlingParams - same as in type ElementAdapter
 * @param generateParameters - same as in type ElementAdapter
 * @returns the ReferenceAdaptationInfo to be included in the ProcessingRule if necessary
 */
export type ReferenceAdaptationProvider = (schemaHandlingParams: SchemaHandlingParams, generateParameters: GenerateAppSchemaParameters) => ReferenceAdaptationInfo | undefined;
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
export declare function getSyncRuleForManifestProperty(property: string, analyze: ManifestAnalyzer, adapt?: ElementAdapterExtended, provideReferenceAdaptation?: ReferenceAdaptationProvider, expectedType?: string): SyncRule;
/**
 * Common syncRule for all properties defined in the manifest on settings level without any special logic.
 */
export declare const standardSyncRuleForManifestSettingsProperty: SyncRule;
//# sourceMappingURL=manifestPropertyUtils.d.ts.map