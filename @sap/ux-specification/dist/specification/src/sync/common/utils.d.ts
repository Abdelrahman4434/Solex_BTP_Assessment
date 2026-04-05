import type { Definition } from 'typescript-json-schema';
import type { MetadataInstanceInterface } from './decoration/factory';
import type { Manifest, ExtensionLogger, FacetConfig, FacetConfigs, FacetSection, FileData, SchemaFilePath, FeatureToggle, AccessorPath } from '@sap/ux-specification-types';
import { TemplateType, v4, FioriElementsVersion, OdataVersion, PageTypeV2, PageTypeV4, SchemaType } from '@sap/ux-specification-types';
import type { DataField, DataFieldAbstractTypes, DataFieldForActionAbstractTypes, FacetTypes } from '@sap-ux/vocabularies-types/vocabularies/UI';
import type { ConvertedMetadata, EntityType, PropertyPath, PropertyAnnotationValue } from '@sap-ux/vocabularies-types';
import type { PropertyAnnotations } from '@sap-ux/vocabularies-types/vocabularies/Edm_Types';
export declare const DEFINITION_LINK_PREFIX = "#/definitions/";
export declare const V4_TEMPLATES: string[];
export declare const V4_LIBS: string[];
export declare const DEFAULT_CONTROL_PROPERTY = "defaultControlProperty";
export declare const CONST_PROPERTY = "const";
export declare const arrayIncludes: (arr: string[], target: string[]) => boolean;
/**
 * Function returns annotation path for schema based on received params.
 *
 * @param entityTypeName - Entity type name.
 * @param term - Annotation term.
 * @param qualifier - Annotation qualifier.
 * @returns Annotation path based on received params
 */
export declare const createAnnotationPath: (entityTypeName: string, term: string, qualifier?: string) => string | undefined;
/**
 * Parses, merges, and converts a list of annotation files with aid of tools from annotation-vocabularies-tools.
 *
 * @param annotationFiles - The list of all annotation files, in JSON format
 * @param logger - Logger instance used for logging errors or messages during processing
 * @returns the complete service information
 */
export declare function parseAndMergeAndConvert(annotationFiles: FileData[], logger: ExtensionLogger): ConvertedMetadata;
export declare const getAnnotationPropertyValue: (annotationProperty: DataField["Value"]) => string;
/**
 * Checks for Common.Label and overwrites the label from it if present.
 *
 * @param {PropertyAnnotations} annotations - property annotations
 * @param {EntityType} entityType - entity type
 * @param {string} label - label, to be actualized
 * @returns label, derived from Common.Label or from property value
 */
export declare function evaluateCommonLabel(annotations: PropertyAnnotations, entityType: EntityType, label: string): string;
/**
 * Determines the label for a property path.
 *
 * @param {PropertyPath} propertyPath - property path
 * @param {EntityType} entityType - entity type
 * @returns label, derived from Common.Label or from property value
 */
export declare function getLabelForPropertyPath(propertyPath: PropertyPath, entityType: EntityType): string;
/**
 * Determines the label for a LineItem record.
 *
 * @param field - Line item record
 * @param entityType - entity type
 * @returns label, derived from Common.Label or from property value
 */
export declare function getLabelForDataField(field: DataFieldAbstractTypes, entityType: EntityType): string;
/**
 * Function to resolve the dataField label.
 *
 * @param dataFieldLabel - Given dataField label; might be of type string, or an object in case of a path reference
 * @param entityType - the entity type as part of the AVT ConvertedMetadata
 * @returns undefined or the right string value
 */
export declare function getLabel(dataFieldLabel: any, entityType: EntityType): string;
/**
 * Generates a description for action-based data fields using the provided data field information
 * and its corresponding label.
 *
 * @param {DataFieldForActionAbstractTypes} dataFieldAbstract - Abstract representation of the data field
 * with action-based properties.
 * @param {string} dataFieldLabel - The label associated with the data field, which may influence
 * the generated description.
 * @returns {string} The description derived from the data field label or action name.
 */
export declare function getDescriptionForActionBasedDataFields(dataFieldAbstract: DataFieldForActionAbstractTypes, dataFieldLabel: string): any;
/**
 * Retrieves the title for a given data field.
 *
 * @param dataField - The data field object containing metadata.
 * @param entityType - The entity type as part of the AVT ConvertedMetadata.
 * @param dataFieldLabel - The label associated with the data field.
 * @returns The title for the data field as a string.
 */
export declare function getTitleForDataField(dataField: DataField, entityType: EntityType, dataFieldLabel: string): string;
/**
 * Prepare string for reference use in schema.
 *
 * @param refInput string to be character checked and replaced
 * @returns string with replaced characters
 */
export declare function prepareRef(refInput: string | PropertyAnnotationValue<String>): string;
/**
 * Return the page type for a given V2 page in manifest.
 *
 * @param name - page component name
 * @returns page type
 */
export declare function getPageTypeV2(name: string): PageTypeV2 | undefined;
/**
 * Return the page type for a given V4 page in manifest.
 *
 * @param v4Page - The V4 application page or routing target configuration
 * @returns page type
 */
export declare function getPageTypeV4(v4Page: v4.SapUiAppPageV4 | v4.SapUi5RoutingTargetCustomPageV4): PageTypeV4 | undefined;
/**
 * Finds the alias for a given namespace in the references' section of the converted service metadata.
 *
 * @param {string} namespace - complete namespace, e.g. 'com.sap.vocabularies.UI.v1'
 * @param {ConvertedMetadata} oDataServiceAVT - combined service metadata, as returned by annotation vocabularies tools
 * @returns alias for the given namespace
 */
export declare function findAlias(namespace: string, oDataServiceAVT: ConvertedMetadata): string | undefined;
/**
 * Method returns annotation from passed meta path.
 *
 * @param metaPath - annotation meta path
 * @returns annotation name
 */
export declare function getAnnotationFromMetaPath(metaPath: string): string;
/**
 * Resolve page section(get key and label->description).
 *
 * @param facetDefinition - the actual annotation record
 * @param sourceEntityType - The source entity type to be used for resolving facets
 * @param oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @param logger - Logger class for logging messages
 * @param oDataVersion - OData version
 * @param keyForRelatedFacetKeys - construct key for 'keyForRelatedFacetKeys' property(used to define custom sections) - we should not add '@' symbol there.
 * @returns - object comprising the relevant facet information
 */
export declare function getSectionFacet(facetDefinition: FacetTypes, sourceEntityType: EntityType, oDataServiceAVT: ConvertedMetadata, logger?: ExtensionLogger, oDataVersion?: FioriElementsVersion, keyForRelatedFacetKeys?: boolean): FacetSection | undefined;
/**
 * Method prepares value as empty object or array based on passed path.
 * For array path should end with '[]'.
 *
 * @param {string} path - path of the property in the manifest
 * @returns prepared value based on passed path
 */
export declare const prepareValueForPath: (path?: string) => Array<unknown> | object;
/**
 * Finds the alias for a given namespace in the references' section of the converted service metadata.
 * An empty object is created if the path element does not exist yet.
 * Exception: if an empty array is the next element  of the 'path' definition, an empty array is created instead of an empty object.
 *
 * @param {object} manifest - manifest that is being modified during export
 * @param {string} path - path of the property in the manifest
 * @param {string} targetAnnotation - target annotation (optional)
 * @param {string} targetAnnotationEncoded - target annotation in its encoded form, as used in manifest settings
 * @param {boolean} [readOnly] - indicates if the function should create object/array if existing value not found by given path
 * @returns returns section of the manifest based on path, generates an empty object in case it does not exists
 */
export declare const getManifestSectionByPathV4: (manifest: object, path: string, targetAnnotation?: string, targetAnnotationEncoded?: string, readOnly?: boolean) => object | undefined;
/**
 * Method sets value for passed path in manifest.
 *
 * @param {object} manifest - manifest that is being modified during export
 * @param {string} path - path of the property in the manifest
 * @param {unknown} value - value to apply
 * @param {string} targetAnnotation - target annotation (optional)
 * @param {string} targetAnnotationEncoded - target annotation in its encoded form, as used in manifest settings
 */
export declare const setManifestSectionByPathV4: (manifest: object, path: string, value: unknown, targetAnnotation?: string, targetAnnotationEncoded?: string) => void;
/**
 * Retrieves the schema key for a given line item record based on its type and properties.
 *
 * @param lineItemRecord - The line item record to process.
 * @returns The schema key as a string, or undefined if no key is determined.
 */
export declare function getSchemaKeyOfLineItemRecord(lineItemRecord: DataFieldAbstractTypes): string;
/**
 * Method returns schema annotation path for passed fullyQualifiedName.
 *
 * @param {EntityType} entityType entity type.
 * @param {string} fullyQualifiedName fully qualifier name.
 * @returns {TemplateType} Schema annotation path.
 */
export declare function getAnnotationPathUsingFullyQualifiedName(entityType: EntityType, fullyQualifiedName: string): string;
/**
 * Retrieve header facet configurations that can be used to generate ObjectPage schemas.
 *
 * @param entityType - The entity type to be used for resolving facets
 * @param oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @param oDataVersion - OData version
 * @param logger - Logger class for logging messages
 * @returns - header facet configurations
 */
export declare function getObjectPageHeaderFacets(entityType: EntityType, oDataServiceAVT: ConvertedMetadata, oDataVersion?: FioriElementsVersion, logger?: ExtensionLogger): FacetConfigs | undefined;
/**
 * Retrieve facet configurations that can be used to generate ObjectPage schemas.
 *
 * @param entityType - The entity type to be used for resolving facets
 * @param oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @param {FioriElementsVersion} oDataVersion - OData version
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns - facet configurations
 */
export declare function getObjectPageFacets(entityType: EntityType, oDataServiceAVT: ConvertedMetadata, oDataVersion?: FioriElementsVersion, logger?: ExtensionLogger): FacetConfigs | undefined;
/**
 * Returns the version of Fiori elements (v2/v4) from a given manifest.
 *
 * @param manifest - the manifest.json file
 * @returns FioriElementsVersion
 */
export declare function getFEVersionFromManifest(manifest: Manifest): FioriElementsVersion | undefined;
/**
 * Get the main service name from the manifest.
 * LROP: by definition the service name can be read from the UI5 model with "" as name.
 * OVP: the main model needs to be read from the sap.ovp config and then the service can be derived.
 *
 * @param manifest - application manifest
 * @returns - main service name
 */
export declare function getMainService(manifest: Manifest): string | undefined;
/**
 * Returns the oData version of the service (if any) from a given manifest.
 *
 * @param manifest - the manifest.json file
 * @returns the OData version
 */
export declare function getODataVersionFromManifest(manifest: Manifest): OdataVersion;
/**
 * Determines the template type of a V2 app.
 *
 * @param manifest - the manifest.json file
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns the template type
 */
export declare function determineV2Template(manifest: Manifest, logger: ExtensionLogger): TemplateType | undefined;
/**
 * Determines the template type of a single page.
 *
 * @param v4Page - single page from routing targets
 * @returns {TemplateType | undefined} the template type
 */
export declare function determineV4PageTemplateType(v4Page: v4.SapUiAppPageV4): TemplateType | undefined;
/**
 * Determines the template type of a V4 app.
 *
 * @param manifest - the manifest.json file
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns {TemplateType} the template type
 */
export declare function determineV4Template(manifest: Manifest, logger: ExtensionLogger): TemplateType | undefined;
/**
 * Determines the template type, based on the given manifest entries of the app.
 *
 * @param manifest - the manifest.json file
 * @param {FioriElementsVersion} fioriElementsVersion - OData or FE version
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns {TemplateType} the template type
 */
export declare function getTemplateTypeFromManifest(manifest: Manifest, fioriElementsVersion: FioriElementsVersion, logger: ExtensionLogger): TemplateType | undefined;
/**
 * Adds title to a section or header section in an app schema.
 *
 * @param facet - intermediate facet structure comprising annotation information
 * @param section - section in the app schema
 * @param facetKey - key of the facet
 */
export declare function addSectionTitle(facet: FacetConfig, section: Definition, facetKey: string): void;
/**
 * Adds description to a section or header section in an app schema.
 *
 * @param facet - intermediate facet structure comprising annotation information
 * @param section - section in the app schema
 * @param facetKey - key of the facet
 */
export declare function addSectionDescription(facet: FacetConfig, section: Definition, facetKey: string): void;
/**
 * Adds target title or description to a section or header section in an app schema.
 *
 * @param facet - intermediate facet structure comprising annotation information
 * @param section - section in the app schema
 * @param facetKey - key of the facet
 */
export declare function addTargetTitleAndSectionDescription(facet: FacetConfig, section: Definition, facetKey: string): void;
/**
 * Adds chart (S)PV header facet ID, in case chart has no title.
 *
 * @param facet - intermediate facet structure comprising annotation information
 * @param section - section in the app schema
 */
export declare function addChartFacetID(facet: FacetConfig, section: Definition): void;
/**
 * Creates a default object for a new section or subsection, and adds the ID as title if present.
 *
 * @param appSchema - The application-specific JSON schema.
 * @param facet - Facet configuration, to be analyzed.
 * @param facetKey - The key of the facet.
 * @returns the new section object
 */
export declare function createDefaultSection(appSchema: Definition, facet: FacetConfig, facetKey: string): Definition;
/**
 * Retrieve page section data(so far id/key and label/description).
 *
 * @param {EntityType} entityType The actual entityType
 * @param {ConvertedMetadata} oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @param {FioriElementsVersion} oDataVersion - OData version
 * @param {boolean} [checkUnresolvableFacets] - Check and avoid facets and sections without ID and Target.
 * @returns - Array of facets or sections
 */
export declare function getObjectPageFacetSection(entityType: EntityType, oDataServiceAVT: ConvertedMetadata, logger?: ExtensionLogger, oDataVersion?: FioriElementsVersion, checkUnresolvableFacets?: boolean): FacetSection[];
/**
 * Cleans empty sub-structures from the export result for manifest.
 *
 * @param {object} manifest - manifest.json part of the export result
 * @param {string} path  - path in the manifest
 * @param {boolean} deletionRequest - if set to true, any manifest setting specified by entityPath gets deleted even if it comprises any unknown property
 * @param {string[]} entityPathArray (optional) - array of elements, describing a path to a subsection of the config.
 *                                                If specified, only elements from this subsection are getting deleted
 * @param {string} targetAnnotation (optional) - target annotation (optional, in case of sections, subsections)
 * @param {string} targetAnnotationEncoded (optional) - encoded version of the target annotation, as represented in the manifest
 */
export declare const deleteEmptyStructure: (manifest: object, path: string, deletionRequest: boolean, entityPathArray?: string[], targetAnnotation?: string, targetAnnotationEncoded?: string) => void;
/**
 * Method which returns schema file name and path depending on passed schema or page type.
 *
 * @param {SchemaType | PageTypeV2} schemaType Schema type or Page type.
 * @param {string} [pageId] target page id from manifest.json
 * @param viewId - The view ID for custom pages (optional).
 * @returns {SchemaFilePath} File path info.
 */
export declare const getSchemaFilePath: (schemaType: SchemaType | PageTypeV2 | PageTypeV4, pageId?: string, viewId?: string) => SchemaFilePath;
/**
 * Method which generates id of page according to passed parameters
 *
 * @param appVersion - Fiori Elements version - V2 or V4
 * @param pageType - Page type
 * @param entitySet - Entity Set
 * @param viewId - Custom page's viewId (optional)
 * @param pageName - Page name in manifest. Used if entitySet is empty
 * @returns {string} Generated page id
 */
/**
 * Generates a unique page ID based on the provided parameters.
 *
 * @param pageType - The type of the page (e.g., ListReport, ObjectPage, etc.).
 * @param entitySet - The entity set associated with the page.
 * @param viewId - The view ID for custom pages (optional).
 * @param pageName - The name of the page in the manifest (used if entitySet is empty).
 * @returns The generated page ID as a string.
 */
export declare function generatePageId(pageType: PageTypeV2 | PageTypeV4, entitySet: string, viewId?: string, pageName?: string): string;
export type NextDefinition = {
    configObject?: object;
    targetDefinition?: object;
    title?: string;
};
/**
 * Method finds matching objects against passed interface of 'additionalProperties' and returns array of matching object keys.
 *
 * @param {Definition} appSchema - App-specific JSON schema.
 * @param {Definition} additionalProperties - Allowed additional properties.
 * @param {object} configObject -Container object to find matching childs.
 * @returns {string[]} Array of matching object keys
 */
export declare function findMatchingKeysByAdditionalProperties(appSchema: Definition, additionalProperties: Definition, configObject: object): string[];
/**
 * Recursive function to determine the next config parts, next definitions in the app schema and the title.
 *
 * @param appSchema - app-specific JSON schema
 * @param title - default title
 * @param currentConfigObject - current part of the configuration that gets traversed
 * @param propertyDefinition - definition of a given property in the app schema
 * @param key - actual key
 * @param {MetadataInstanceInterface} factory - factory for creating metadata instances
 * @param pageType - page type
 * @returns {NextDefinition} - Next target definition to process
 */
export declare function getNextTargetDefinitions(appSchema: object, title: string, currentConfigObject: object, propertyDefinition: object, key: string, factory: MetadataInstanceInterface, pageType: PageTypeV2 | PageTypeV4): NextDefinition[] | undefined;
/**
 * Recursive function to determine the next config part, next definition in the app schema and the title.
 *
 * @param appSchema - app-specific JSON schema
 * @param title - default title
 * @param currentConfigObject - current part of the configuration that gets traversed
 * @param propertyDefinition - definition of a given property in the app schema
 * @param key - actual key
 * @param {MetadataInstanceInterface} factory - factory for creating metadata instances
 * @param pageType - page type
 * @returns {NextDefinition} - Next target definition to process
 */
export declare function getNextTargetDefinition(appSchema: object, title: string, currentConfigObject: object, propertyDefinition: object, key: string, factory: MetadataInstanceInterface, pageType: PageTypeV2 | PageTypeV4): NextDefinition | undefined;
/**
 * Custom array merge function called by deepmerge's merge function.
 *
 * @param {*} target Target array
 * @param {*} source Source array
 * @param {*} options options object provided by deepmerge's merge function
 * @returns {string[]} Combined array with unique elements from both target and source arrays.
 */
export declare const arrayCombineMerge: (target: any, source: any, options: any) => string[];
/**
 * Converts an enum into a CSV.
 *
 * @param {object} manifestSection - manifestSection where the key exists
 * @param {object} configPart - Property as mentioned in config file
 * @param {string} key - Property to be exported to manifest
 */
export declare function convertEnumToCSV(manifestSection: any, configPart: any, key: string): void;
/**
 * Converts an action ID from the internal format (schema, config) to the stable ID representation.
 *
 * @param actionId - the (unique) internal format of the action ID
 * @returns the converted action ID
 */
export declare function convertActionKeyToStableId(actionId: string): string;
/**
 * Method returns definition key for passed '$ref' property by removing 'definition' prefix.
 *
 * @param {string} $ref Definition reference.
 * @returns Definition key.
 */
export declare function getDefinitionKey($ref: string): string;
/**
 * Method returns definition $ref' property for passed definition key.
 *
 * @param {string} key Definition key.
 * @returns Definition reference.
 */
export declare function getDefinitionsRef(key: string): string;
/**
 * Returns the message property if the error is an instance of `Error` else a string representation of the error.
 *
 * @param error {Error | unknown} - the error instance
 * @returns {string} the error message
 */
export declare function getErrorMessage(error: Error | unknown): string;
/**
 * Method checks if passed array of features contains required feature.
 *
 * @param {FeatureToggle[]} [featureToggles] Array of features.
 * @param {FeatureToggle} [feature] Feature to check if it is supported.
 * @returns {boolean} True if passed feature is supported.
 */
export declare function isFeatureSupported(featureToggles?: FeatureToggle[], feature?: FeatureToggle): boolean;
/**
 * Method adds indices (propertyIndex property) to app-specific JSON schema properties.
 *
 * @param {Definition} [schema] App-specific JSON schema.
 * @param {string[]} [order] Order of properties.
 */
export declare function updatePropertyIndices(schema: Definition, order: string[]): void;
/**
 * Method to get value for passed path in passed object.
 *
 * @param obj Object to check.
 * @param paths Path for searching property/value.
 * @returns Found value for passed path.
 */
export declare function getJSONPropertyByPath(obj: object, paths: Array<string | number>): unknown;
/**
 * Method to remove namespaces.
 *
 * @param sId - The string identifier to process and remove namespaces from.
 * @returns {string} modified string without namespace
 */
export declare function removeNamespaces(sId: string): string;
/**
 * Method to replace namespaces with short hand form.
 *
 * @param {string } sId - The string identifier to process and replace namespaces with shorthand forms.
 * @returns {string} modified string with replaced namespaces
 */
export declare function replaceNamespaces(sId: string): string;
/**
 * Checks whether a Definition contains a $ref attribute pointing to an 'internal' Definition.
 *
 * @param element - The Definition to be checked
 * @returns the name of the referred Definition, if it exists, otherwise undefined
 */
export declare function getRefType(element: Definition): string | undefined;
/**
 * Determines whether two template names match either directly or by resolving their corresponding page types.
 *
 * @param templateName1 The first template name to compare.
 * @param templateName2 The second template name to compare.
 * @returns Returns true if the template names match directly or their page types match; otherwise, false.
 */
export declare function compareTemplateNames(templateName1: string, templateName2: any): boolean;
/**
 * Converts a slash-delimited sync rule path into a JSONPath string.
 *
 * Each path segment is appended to the JSONPath using:
 * - dot notation for valid JavaScript identifiers
 * - bracket notation for segments containing special characters
 *
 * Optionally replaces an encoded annotation segment with its decoded form
 * (for example, converting `::` back to `/`).
 *
 * @param syncRulePath - Slash-delimited path string (e.g. "spec/template/metadata/annotations")
 * @param targetAnnotation - Decoded annotation value to substitute into the path
 * @param targetAnnotationEncoded - Encoded annotation value to match and replace in the path
 * @returns A JSONPath string representing the provided sync rule path
 */
export declare function convertSyncRulePathToJsonPath(syncRulePath: string, targetAnnotation?: string, targetAnnotationEncoded?: string): string;
/**
 * Appends a single segment to an existing JSONPath string.
 *
 * @param basePath - The existing JSONPath string (e.g., '$.data')
 * @param segment - The segment to append
 * @param prevSegment - The previous resolved segment, used to detect array placeholders
 * @returns A new JSONPath string with the segment appended
 */
export declare function appendJsonPathSegment(basePath: string, segment: string, prevSegment?: string): string;
export interface ManifestPathParams {
    pageName?: string | string[];
    manifest?: Manifest;
    pathsParts?: unknown[];
    targetAnnotation?: string;
    targetAnnotationEncoded?: string;
    sectionId?: string;
    columnKey?: string;
    configObject?: object;
    originalIds?: string[];
    cardKeys?: string[];
    viewConfig?: {
        key?: string;
        entitySet?: string;
    };
}
/**
 * Internal helper interface used while traversing a schema to resolve `manifestPath`.
 */
export interface ManifestPropertyResolution {
    /**
     * Name of the parent property in the schema.
     */
    name: string;
    /**
     * Manifest path derived from the sync rule.
     */
    rulePath?: string;
    /**
     * Indication that schema reference was resolved.
     */
    reference?: boolean;
    /**
     * Absolute manifest path to root definition.
     */
    absoluteManifestPath?: string;
    /**
     * Relative manifest path to root definition.
     */
    relativeManifestPath?: string;
}
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param controls - Array of control classes which contains sync rules.
 * @param appSchema - Full schema.
 * @param definitionName - The name of the definition/class whose properties are being processed.
 *   If `undefined`, the function attempts to resolve the definition name from the `$ref` property of the provided definition.
 * @param definition - The definition object containing property schemas.
 * @param pathParams - Additional context required to compute manifest paths.
 * @param parentProperty - Information about the parent property used when resolving.
 *   nested or inherited manifest paths (e.g. parent property name and resolved rule path).
 * @param handleRelative - A flag indicating whether to use relative paths for definition properties.
 */
export declare function addManifestPathsToProperties(controls: Array<{
    [key: string]: {
        prototype: object;
    };
}>, appSchema: Definition, definitionName: string | undefined, definition: Definition, pathParams: ManifestPathParams, parentProperty?: ManifestPropertyResolution, handleRelative?: boolean): void;
/**
 * Converts a JSONPath string into an array of accessors.
 * Note: This is a copy of a similar implementation in tools-suite. In future we should find a way to use one single implementation of this function.
 *
 * @param path - The JSONPath string to convert.
 * @returns An array of accessors representing the path.
 */
export declare function jsonPathToArray(path: string): AccessorPath;
//# sourceMappingURL=utils.d.ts.map