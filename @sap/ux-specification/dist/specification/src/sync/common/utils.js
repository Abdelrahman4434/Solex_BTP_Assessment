"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayCombineMerge = exports.getSchemaFilePath = exports.deleteEmptyStructure = exports.setManifestSectionByPathV4 = exports.getManifestSectionByPathV4 = exports.prepareValueForPath = exports.getAnnotationPropertyValue = exports.createAnnotationPath = exports.arrayIncludes = exports.CONST_PROPERTY = exports.DEFAULT_CONTROL_PROPERTY = exports.V4_LIBS = exports.V4_TEMPLATES = exports.DEFINITION_LINK_PREFIX = void 0;
exports.parseAndMergeAndConvert = parseAndMergeAndConvert;
exports.evaluateCommonLabel = evaluateCommonLabel;
exports.getLabelForPropertyPath = getLabelForPropertyPath;
exports.getLabelForDataField = getLabelForDataField;
exports.getLabel = getLabel;
exports.getDescriptionForActionBasedDataFields = getDescriptionForActionBasedDataFields;
exports.getTitleForDataField = getTitleForDataField;
exports.prepareRef = prepareRef;
exports.getPageTypeV2 = getPageTypeV2;
exports.getPageTypeV4 = getPageTypeV4;
exports.findAlias = findAlias;
exports.getAnnotationFromMetaPath = getAnnotationFromMetaPath;
exports.getSectionFacet = getSectionFacet;
exports.getSchemaKeyOfLineItemRecord = getSchemaKeyOfLineItemRecord;
exports.getAnnotationPathUsingFullyQualifiedName = getAnnotationPathUsingFullyQualifiedName;
exports.getObjectPageHeaderFacets = getObjectPageHeaderFacets;
exports.getObjectPageFacets = getObjectPageFacets;
exports.getFEVersionFromManifest = getFEVersionFromManifest;
exports.getMainService = getMainService;
exports.getODataVersionFromManifest = getODataVersionFromManifest;
exports.determineV2Template = determineV2Template;
exports.determineV4PageTemplateType = determineV4PageTemplateType;
exports.determineV4Template = determineV4Template;
exports.getTemplateTypeFromManifest = getTemplateTypeFromManifest;
exports.addSectionTitle = addSectionTitle;
exports.addSectionDescription = addSectionDescription;
exports.addTargetTitleAndSectionDescription = addTargetTitleAndSectionDescription;
exports.addChartFacetID = addChartFacetID;
exports.createDefaultSection = createDefaultSection;
exports.getObjectPageFacetSection = getObjectPageFacetSection;
exports.generatePageId = generatePageId;
exports.findMatchingKeysByAdditionalProperties = findMatchingKeysByAdditionalProperties;
exports.getNextTargetDefinitions = getNextTargetDefinitions;
exports.getNextTargetDefinition = getNextTargetDefinition;
exports.convertEnumToCSV = convertEnumToCSV;
exports.convertActionKeyToStableId = convertActionKeyToStableId;
exports.getDefinitionKey = getDefinitionKey;
exports.getDefinitionsRef = getDefinitionsRef;
exports.getErrorMessage = getErrorMessage;
exports.isFeatureSupported = isFeatureSupported;
exports.updatePropertyIndices = updatePropertyIndices;
exports.getJSONPropertyByPath = getJSONPropertyByPath;
exports.removeNamespaces = removeNamespaces;
exports.replaceNamespaces = replaceNamespaces;
exports.getRefType = getRefType;
exports.compareTemplateNames = compareTemplateNames;
exports.convertSyncRulePathToJsonPath = convertSyncRulePathToJsonPath;
exports.appendJsonPathSegment = appendJsonPathSegment;
exports.addManifestPathsToProperties = addManifestPathsToProperties;
exports.jsonPathToArray = jsonPathToArray;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const i18next_1 = __importDefault(require("i18next"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const annotation_converter_1 = require("@sap-ux/annotation-converter");
const edmx_parser_1 = require("@sap-ux/edmx-parser");
const extensionLogger_1 = require("../../extensionLogger");
const decoration_1 = require("./decoration");
exports.DEFINITION_LINK_PREFIX = '#/definitions/';
exports.V4_TEMPLATES = [
    ux_specification_types_1.v4.FE_TEMPLATE_V4_LIST_REPORT,
    ux_specification_types_1.v4.FE_TEMPLATE_V4_ALP,
    ux_specification_types_1.v4.FE_TEMPLATE_V4_OBJECT_PAGE,
    ux_specification_types_1.v4.FE_TEMPLATE_V4_CUSTOM_PAGE
];
exports.V4_LIBS = ['sap.fe.core', 'sap.fe.templates'];
const CONTROL_PROPERTY = 'controlProperty';
exports.DEFAULT_CONTROL_PROPERTY = 'defaultControlProperty';
exports.CONST_PROPERTY = 'const';
const ENUM_PROPERTY = 'enum';
const arrayIncludes = (arr, target) => target.every((v) => arr.includes(v));
exports.arrayIncludes = arrayIncludes;
/**
 * Function returns annotation path for schema based on received params.
 *
 * @param entityTypeName - Entity type name.
 * @param term - Annotation term.
 * @param qualifier - Annotation qualifier.
 * @returns Annotation path based on received params
 */
const createAnnotationPath = (entityTypeName, term, qualifier) => {
    if (!entityTypeName) {
        return undefined;
    }
    let annotationPath = `/${entityTypeName}/@${term}`;
    if (qualifier) {
        annotationPath += `#${qualifier}`;
    }
    return annotationPath;
};
exports.createAnnotationPath = createAnnotationPath;
/**
 * Parses, merges, and converts a list of annotation files with aid of tools from annotation-vocabularies-tools.
 *
 * @param annotationFiles - The list of all annotation files, in JSON format
 * @param logger - Logger instance used for logging errors or messages during processing
 * @returns the complete service information
 */
function parseAndMergeAndConvert(annotationFiles, logger) {
    const parseResult = [];
    let converterOutput;
    if (annotationFiles) {
        annotationFiles.forEach(function (annotationData) {
            try {
                parseResult.push((0, edmx_parser_1.parse)(annotationData.fileContent, annotationData.dataSourceUri));
            }
            catch (error) {
                (0, extensionLogger_1.log)(logger, {
                    severity: "error" /* LogSeverity.Error */,
                    message: i18next_1.default.t('ANNOERR'),
                    location: { path: i18next_1.default.t('ANNOTATIONFILE', { file: annotationData.dataSourceUri }) }
                }, error);
                return converterOutput;
            }
        });
    }
    if (parseResult.length > 0) {
        const mergedParserResult = (0, edmx_parser_1.merge)(...parseResult);
        converterOutput = (0, annotation_converter_1.convert)(mergedParserResult);
    }
    return converterOutput;
}
const getAnnotationPropertyValue = (annotationProperty) => annotationProperty?.value || annotationProperty?.path;
exports.getAnnotationPropertyValue = getAnnotationPropertyValue;
/**
 * Checks for Common.Label and overwrites the label from it if present.
 *
 * @param {PropertyAnnotations} annotations - property annotations
 * @param {EntityType} entityType - entity type
 * @param {string} label - label, to be actualized
 * @returns label, derived from Common.Label or from property value
 */
function evaluateCommonLabel(annotations, entityType, label) {
    if (annotations?.Common?.Label) {
        if (typeof annotations.Common.Label === 'string') {
            label = annotations.Common.Label;
        }
        else if (annotations.Common.Label['type'] === 'Path') {
            const targetProperty = entityType && entityType.resolvePath(annotations.Common.Label['path']);
            if (targetProperty?.value) {
                label = targetProperty.value;
            }
            else if (typeof targetProperty?.Common?.Label === 'string') {
                label = targetProperty.annotations.Common.Label;
            }
        }
        else if (typeof annotations.Common?.Label?.toString() === 'string') {
            label = annotations.Common.Label.toString();
        }
    }
    return label;
}
/**
 * Determines the label for a property path.
 *
 * @param {PropertyPath} propertyPath - property path
 * @param {EntityType} entityType - entity type
 * @returns label, derived from Common.Label or from property value
 */
function getLabelForPropertyPath(propertyPath, entityType) {
    let label = propertyPath.value;
    if (propertyPath.$target) {
        label = evaluateCommonLabel(propertyPath.$target.annotations, entityType, label);
    }
    return label;
}
/**
 * Determines the label for a LineItem record.
 *
 * @param field - Line item record
 * @param entityType - entity type
 * @returns label, derived from Common.Label or from property value
 */
function getLabelForDataField(field, entityType) {
    let label, property;
    if (field['Value']) {
        if (typeof field['Value'] === 'string') {
            property = entityType && entityType.entityProperties.find((ep) => ep.name === field['Value']);
        }
        else {
            property = entityType && entityType.resolvePath(field['Value'].path);
            if (!property) {
                property = field['Value'].$target;
            }
        }
    }
    else if (field['Target'] && field['Target'].$target) {
        if (field['Target'].$target.Value) {
            property = field['Target'].$target.Value.$target;
        }
        else if (field['Target'].$target.Label) {
            label = field['Target'].$target.Label;
        }
    }
    if (property?.annotations?.Common?.Label) {
        label = evaluateCommonLabel(property.annotations, entityType, label);
    }
    return label;
}
/**
 * Function to resolve the dataField label.
 *
 * @param dataFieldLabel - Given dataField label; might be of type string, or an object in case of a path reference
 * @param entityType - the entity type as part of the AVT ConvertedMetadata
 * @returns undefined or the right string value
 */
function getLabel(dataFieldLabel, entityType) {
    if (typeof dataFieldLabel === 'string') {
        return dataFieldLabel;
    }
    else if (typeof dataFieldLabel === 'object' && dataFieldLabel.path) {
        const property = entityType && entityType.resolvePath(dataFieldLabel.path);
        if (!property || property.length === 0) {
            return undefined;
        }
        else {
            const singleProperty = property[0];
            if (singleProperty?.annotations?.Common?.Label) {
                const label = dataFieldLabel;
                return evaluateCommonLabel(singleProperty.annotations, entityType, label);
            }
        }
    }
    else {
        return undefined;
    }
}
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
function getDescriptionForActionBasedDataFields(dataFieldAbstract, dataFieldLabel) {
    const dataField = dataFieldAbstract;
    const actionName = typeof dataField.Action === 'string' ? dataField.Action : dataField.Action?.path;
    if (dataFieldLabel) {
        return typeof dataFieldLabel === 'string' ? dataFieldLabel : actionName;
    }
    else {
        return actionName;
    }
}
/**
 * Retrieves the title for a given data field.
 *
 * @param dataField - The data field object containing metadata.
 * @param entityType - The entity type as part of the AVT ConvertedMetadata.
 * @param dataFieldLabel - The label associated with the data field.
 * @returns The title for the data field as a string.
 */
function getTitleForDataField(dataField, entityType, dataFieldLabel) {
    const propertyCommonLabel = getLabelForDataField(dataField, entityType);
    return (dataFieldLabel ||
        propertyCommonLabel ||
        (dataField.Value.$target ? dataField.Value.$target.name : dataField.Value.value || dataField.Value.path));
}
/**
 * Prepare string for reference use in schema.
 *
 * @param refInput string to be character checked and replaced
 * @returns string with replaced characters
 */
//@typescript-eslint/no-wrapper-object-types turned off tor prevent conversion String > string; String is used by AVT
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
function prepareRef(refInput) {
    return refInput.replace('#', '::').replace(/\//g, ':2f');
}
/**
 * Return the page type for a given V2 page in manifest.
 *
 * @param name - page component name
 * @returns page type
 */
function getPageTypeV2(name) {
    if (name) {
        const templatePart = `${ux_specification_types_1.v2.FE_TEMPLATE_V2}.`;
        return name.split(templatePart)[1];
    }
}
/**
 * Return the page type for a given V4 page in manifest.
 *
 * @param v4Page - The V4 application page or routing target configuration
 * @returns page type
 */
function getPageTypeV4(v4Page) {
    const pageType = 'name' in v4Page && typeof v4Page.name === 'string' ? convertTemplateNameToPageTypeV4(v4Page.name) : undefined;
    if (pageType) {
        return pageType;
    }
    if (('viewId' in v4Page && v4Page.viewId) || ('viewName' in v4Page && v4Page.viewName)) {
        return ux_specification_types_1.PageTypeV4.CustomPage;
    }
}
/**
 * Retrieves the name of the target annotation based on the provided annotation object and a flag.
 *
 * @param targetAnnotation - The annotation object containing term and qualifier information.
 * @param keyForRelatedFacetKeys - A flag indicating whether to construct the key for related facet keys without the '@' symbol.
 * @returns The name of the target annotation as a string.
 */
function getTargetAnnotationName(targetAnnotation, keyForRelatedFacetKeys = false) {
    const termWithQualifier = `${targetAnnotation.term}#${targetAnnotation.qualifier}`;
    return `${!keyForRelatedFacetKeys ? '@' : ''}${targetAnnotation.qualifier ? termWithQualifier : targetAnnotation.term}`;
}
/**
 * Finds the alias for a given namespace in the references' section of the converted service metadata.
 *
 * @param {string} namespace - complete namespace, e.g. 'com.sap.vocabularies.UI.v1'
 * @param {ConvertedMetadata} oDataServiceAVT - combined service metadata, as returned by annotation vocabularies tools
 * @returns alias for the given namespace
 */
function findAlias(namespace, oDataServiceAVT) {
    if (!oDataServiceAVT) {
        return;
    }
    let aliasReference = oDataServiceAVT.references.find((reference) => {
        return reference.namespace === namespace;
    });
    if (!aliasReference) {
        aliasReference = oDataServiceAVT.references.find((reference) => {
            return reference.alias === namespace;
        });
    }
    if (!aliasReference) {
        aliasReference = oDataServiceAVT.references.find((reference) => {
            return (reference.alias.toUpperCase() ===
                namespace.split('SAP__')[namespace.split('SAP__').length - 1].toUpperCase());
        });
    }
    return aliasReference?.alias;
}
/**
 * Method returns annotation from passed meta path.
 *
 * @param metaPath - annotation meta path
 * @returns annotation name
 */
function getAnnotationFromMetaPath(metaPath) {
    return metaPath.substring(metaPath.lastIndexOf('.') + 1, metaPath.length);
}
/**
 * Determines the target annotation.
 *
 * @param navigationParts - parts of the target annotation path
 * @param entityType - entity type
 * @param {ConvertedMetadata} oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @returns the target annotation
 */
function determineTargetAnnotation(navigationParts, entityType, oDataServiceAVT) {
    const lastNavigationPart = navigationParts[navigationParts.length - 1];
    const annotation = getAnnotationFromMetaPath(lastNavigationPart);
    const alias = findAlias(lastNavigationPart.substring(0, lastNavigationPart.lastIndexOf('.')).replace('@', ''), oDataServiceAVT);
    return entityType?.annotations?.[alias]?.[annotation];
}
/**
 * Adjust key by considering navigation.
 *
 * @param key - given key
 * @param navigationParts - parts of the target annotation path
 * @param keyForRelatedFacetKeys - construct key for 'keyForRelatedFacetKeys' property(used to define custom sections) - we should not add '@' symbol there.
 * @returns adjusted key
 */
function adjustKey(key, navigationParts, keyForRelatedFacetKeys) {
    const uiClass = navigationParts[navigationParts.length - 1].split('#')[0];
    if (uiClass.includes('.LineItem')) {
        const pathParts = key.split('::');
        pathParts[pathParts.length - 1] = `${!keyForRelatedFacetKeys ? '@' : ''}${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
        key = pathParts.join('::');
    }
    else {
        key = uiClass.replace('@UI', `${!keyForRelatedFacetKeys ? '@' : ''}${ux_specification_types_1.UIVOCABULARY}`);
    }
    return key;
}
/**
 * Resolves the key and entity type of a reference facet, adjusting the key based on navigation and annotations.
 *
 * @param oDataServiceAVT - The converted metadata of the OData service.
 * @param key - The initial key for the facet.
 * @param entityType - The entity type associated with the facet.
 * @param propertyValue - The property value of the facet's target.
 * @param oDataVersion - The version of OData (v2 or v4).
 * @param keyForRelatedFacetKeys - A flag indicating whether to construct the key for related facet keys without the '@' symbol.
 * @returns An object containing the adjusted key, entity type, a flag to stop processing, and the namespace.
 */
function getKeyAndEntityTypeOfReferenceFacet(oDataServiceAVT, key, entityType, propertyValue, oDataVersion = ux_specification_types_1.FioriElementsVersion.v2, keyForRelatedFacetKeys = false) {
    let stopProcessing = false;
    let namespace;
    const navigationParts = propertyValue.split('/');
    const navigation = navigationParts.length > 1;
    if (navigation && entityType) {
        entityType = entityType.resolvePath(propertyValue.substring(0, propertyValue.lastIndexOf('/')))?.targetType;
    }
    key = adjustKey(key, navigationParts, keyForRelatedFacetKeys);
    const targetAnnotation = determineTargetAnnotation(navigationParts, entityType, oDataServiceAVT);
    if (targetAnnotation) {
        const separator = oDataVersion === ux_specification_types_1.FioriElementsVersion.v2 ? '::' : '#';
        key = getTargetAnnotationName(targetAnnotation, keyForRelatedFacetKeys).replace('#', separator);
        namespace = targetAnnotation.fullyQualifiedName?.split('@')[0];
    }
    else {
        stopProcessing = true;
        return { key, entityType, stopProcessing, namespace };
    }
    if (navigation) {
        const navSeparator = oDataVersion === ux_specification_types_1.FioriElementsVersion.v2 ? '::' : '/';
        navigationParts.pop();
        const navigationIDs = [...navigationParts].join(navSeparator);
        key = `${navigationIDs}${navSeparator}${key}`;
    }
    return { key, entityType, stopProcessing, namespace };
}
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
function getSectionFacet(facetDefinition, sourceEntityType, oDataServiceAVT, logger, oDataVersion = ux_specification_types_1.FioriElementsVersion.v2, keyForRelatedFacetKeys = false) {
    //Take facet ID as fallback
    const facetName = facetDefinition.fullyQualifiedName?.substring(facetDefinition.fullyQualifiedName?.lastIndexOf('@'));
    let key = facetDefinition.ID ? facetDefinition.ID.toString() : facetName;
    let namespace = facetDefinition.fullyQualifiedName?.split('@')[0];
    let entityType = sourceEntityType; //default
    //If reference facet: overwrite with target annotation if present
    if (facetDefinition.$Type !== "com.sap.vocabularies.UI.v1.CollectionFacet" /* UIAnnotationTypes.CollectionFacet */ && 'Target' in facetDefinition) {
        const propertyValue = (0, exports.getAnnotationPropertyValue)(facetDefinition.Target);
        if (!propertyValue) {
            (0, extensionLogger_1.log)(logger, {
                severity: "error" /* LogSeverity.Error */,
                message: i18next_1.default.t('NOTARGET', { target: facetDefinition.Target })
            });
            return;
        }
        const { key: newKey, entityType: newEntityType, stopProcessing, namespace: sectionNameSpace } = getKeyAndEntityTypeOfReferenceFacet(oDataServiceAVT, key, entityType, propertyValue, oDataVersion, keyForRelatedFacetKeys);
        if (stopProcessing) {
            return;
        }
        key = newKey;
        entityType = newEntityType;
        namespace = sectionNameSpace;
    }
    key = key.replace(/\//gi, '::');
    if (key) {
        return {
            key,
            ...(facetDefinition.Label && { label: facetDefinition.Label.toString() }),
            ...(facetDefinition.ID && { ID: facetDefinition.ID.toString() }),
            entityType,
            namespace
        };
    }
    else {
        return undefined;
    }
}
/**
 * Decodes encoded path element and returns it in form as used in manifest settings.
 *
 * @param {string} pathElement - path of the property in the manifest
 * @param {string} targetAnnotation - target annotation (optional)
 * @param {string} targetAnnotationEncoded - target annotation in its encoded form, as used in manifest settings (optional)
 * @returns returns decoded element (manifest setting key)
 */
function getDecodedPathElement(pathElement, targetAnnotation, targetAnnotationEncoded) {
    let decodedElement;
    if (targetAnnotationEncoded && targetAnnotationEncoded === pathElement) {
        decodedElement = targetAnnotation;
    }
    else {
        decodedElement = pathElement.replace(/\?\?/g, '/');
    }
    return decodedElement;
}
/**
 * Method prepares value as empty object or array based on passed path.
 * For array path should end with '[]'.
 *
 * @param {string} path - path of the property in the manifest
 * @returns prepared value based on passed path
 */
const prepareValueForPath = (path) => {
    if (path?.endsWith('[]')) {
        return [];
    }
    return {};
};
exports.prepareValueForPath = prepareValueForPath;
/**
 * Method find object by given path in format "sap.ui5/extends/extensions".
 * An empty object is created if the path element does not exist yet.
 * Exception: if an empty array is the next element  of the 'path' definition, an empty array is created instead of an empty object.
 *
 * @param {object} manifest - manifest that is being modified during export
 * @param {string} path - path of the property in the manifest
 * @param {string} targetAnnotation - target annotation (optional)
 * @param {string} targetAnnotationEncoded - target annotation in its encoded form, as used in manifest settings
 * @param {boolean} value - specific value to apply for unexisting property for given path
 * @param {boolean} [readOnly] - indicates if the function should create object/array if existing value not found by given path
 * @returns returns section of the manifest based on path
 */
const resolveManifestPath = (manifest, path, targetAnnotation, targetAnnotationEncoded, value, readOnly = false) => {
    if (!path) {
        return undefined;
    }
    let manifestSection = manifest;
    const pathElements = path.split('/');
    for (let index = 0; index < pathElements.length; index++) {
        const element = pathElements[index];
        if (element === '[]') {
            continue;
        }
        const decodedElement = getDecodedPathElement(element, targetAnnotation, targetAnnotationEncoded);
        if (value !== undefined && !readOnly && pathElements.length - 1 === index) {
            // Apply or overwrite if value passed
            manifestSection[decodedElement] = value;
        }
        else if (!manifestSection[decodedElement]) {
            if (readOnly) {
                return undefined;
            }
            manifestSection[decodedElement] = (0, exports.prepareValueForPath)(pathElements[index + 1]);
        }
        if (typeof manifestSection[decodedElement] === 'string' && (!value || index < pathElements.length - 1)) {
            manifestSection[decodedElement] = {};
        }
        else {
            manifestSection = manifestSection[decodedElement];
        }
    }
    return manifestSection;
};
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
const getManifestSectionByPathV4 = (manifest, path, targetAnnotation, targetAnnotationEncoded, readOnly = false) => {
    return resolveManifestPath(manifest, path, targetAnnotation, targetAnnotationEncoded, undefined, readOnly);
};
exports.getManifestSectionByPathV4 = getManifestSectionByPathV4;
/**
 * Method sets value for passed path in manifest.
 *
 * @param {object} manifest - manifest that is being modified during export
 * @param {string} path - path of the property in the manifest
 * @param {unknown} value - value to apply
 * @param {string} targetAnnotation - target annotation (optional)
 * @param {string} targetAnnotationEncoded - target annotation in its encoded form, as used in manifest settings
 */
const setManifestSectionByPathV4 = (manifest, path, value, targetAnnotation, targetAnnotationEncoded) => {
    resolveManifestPath(manifest, path, targetAnnotation, targetAnnotationEncoded, value);
};
exports.setManifestSectionByPathV4 = setManifestSectionByPathV4;
/**
 * Retrieves the schema key for a given line item record based on its type and properties.
 *
 * @param lineItemRecord - The line item record to process.
 * @returns The schema key as a string, or undefined if no key is determined.
 */
function getSchemaKeyOfLineItemRecord(lineItemRecord) {
    let schemaKey, target, value;
    switch (lineItemRecord.$Type) {
        case "com.sap.vocabularies.UI.v1.DataField" /* UIAnnotationTypes.DataField */:
            schemaKey = (0, exports.getAnnotationPropertyValue)(lineItemRecord.Value);
            break;
        case "com.sap.vocabularies.UI.v1.DataFieldWithUrl" /* UIAnnotationTypes.DataFieldWithUrl */:
            schemaKey =
                typeof lineItemRecord.Value === 'string'
                    ? lineItemRecord.Value
                    : (0, exports.getAnnotationPropertyValue)(lineItemRecord.Value);
            break;
        case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" /* UIAnnotationTypes.DataFieldForAnnotation */:
            target = lineItemRecord.Target.value;
            if (target) {
                schemaKey =
                    'DataFieldForAnnotation:::sTarget::' +
                        target
                            .replace('@UI', `@${ux_specification_types_1.UIVOCABULARY}`)
                            .replace('@Communication', '@com.sap.vocabularies.Communication.v1')
                            .replace('@Contact', '@com.sap.vocabularies.Contact.v1');
            }
            break;
        case "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */:
            if (lineItemRecord.Inline) {
                schemaKey = `DataFieldForAction:::sAction::${prepareRef(lineItemRecord.Action)}`;
            }
            break;
        case "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation" /* UIAnnotationTypes.DataFieldWithIntentBasedNavigation */:
            value = (0, exports.getAnnotationPropertyValue)(lineItemRecord.Value);
            schemaKey = `DataFieldWithIntentBasedNavigation:::sProperty::${value}:::sSemanticObject::${lineItemRecord.SemanticObject}:::sAction::${lineItemRecord.Action}`;
            break;
        case "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */:
            if (lineItemRecord.Inline) {
                schemaKey = `DataFieldForIntentBasedNavigation:::sSemanticObject::${lineItemRecord.SemanticObject}:::sAction::${prepareRef(lineItemRecord.Action)}`;
            }
            break;
        case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath" /* UIAnnotationTypes.DataFieldWithNavigationPath */:
            value = (0, exports.getAnnotationPropertyValue)(lineItemRecord.Value);
            target = (0, exports.getAnnotationPropertyValue)(lineItemRecord.Target);
            schemaKey = 'DataFieldWithNavigationPath:::sProperty::' + value + ':::sTarget::' + target;
            break;
        default:
            break;
    }
    return schemaKey;
}
/**
 * Determines if type of given annotation term is of UIAnnotationTerm.
 *
 * @param {string} path path in manifest
 * @param {string} alias for a given namespace
 * @param {EntityType} entityType - the entity type
 * @returns UI annotation term type
 */
function getUIAnnotationTerm(path, alias, entityType) {
    if (path.includes("com.sap.vocabularies.UI.v1.Chart" /* UIAnnotationTerms.Chart */) || path.includes(alias + '.Chart')) {
        return "com.sap.vocabularies.UI.v1.Chart" /* UIAnnotationTerms.Chart */;
    }
    else if (path.includes("com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */) || path.includes(alias + '.Identification')) {
        return "com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */;
    }
    else if ((entityType && path.includes("com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */)) || path.includes(alias + '.LineItem')) {
        return "com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */;
    }
    else if (path.includes("com.sap.vocabularies.UI.v1.FieldGroup" /* UIAnnotationTerms.FieldGroup */) || path.includes(alias + '.FieldGroup')) {
        return "com.sap.vocabularies.UI.v1.FieldGroup" /* UIAnnotationTerms.FieldGroup */;
    }
    else if (path.includes("com.sap.vocabularies.UI.v1.DataPoint" /* UIAnnotationTerms.DataPoint */) || path.includes(alias + '.DataPoint')) {
        return "com.sap.vocabularies.UI.v1.DataPoint" /* UIAnnotationTerms.DataPoint */;
    }
    else if (path.includes("com.sap.vocabularies.UI.v1.PresentationVariant" /* UIAnnotationTerms.PresentationVariant */) || path.includes(alias + '.PresentationVariant')) {
        return "com.sap.vocabularies.UI.v1.PresentationVariant" /* UIAnnotationTerms.PresentationVariant */;
    }
    else if (path.includes("com.sap.vocabularies.UI.v1.SelectionPresentationVariant" /* UIAnnotationTerms.SelectionPresentationVariant */) ||
        path.includes(alias + '.SelectionPresentationVariant')) {
        return "com.sap.vocabularies.UI.v1.SelectionPresentationVariant" /* UIAnnotationTerms.SelectionPresentationVariant */;
    }
    else {
        return undefined;
    }
}
/**
 * Determines if type of given annotation term is of CommunicationAnnotationTerm.
 *
 * @param {string} path path in manifest
 * @param {string} alias for a given namespace
 * @returns Communication annotation term type
 */
function getCommunicationAnnotationTerm(path, alias) {
    if (path.includes('com.sap.vocabularies.Communication.v1.Contact') || path.includes(alias + '.Contact')) {
        return "com.sap.vocabularies.Communication.v1.Contact" /* CommunicationAnnotationTerms.Contact */;
    }
    else if (path.includes('com.sap.vocabularies.Communication.v1.Address') || path.includes(alias + '.Address')) {
        return "com.sap.vocabularies.Communication.v1.Address" /* CommunicationAnnotationTerms.Address */;
    }
    else {
        return undefined;
    }
}
/**
 * Determines the type of given annotation term.
 *
 * @param {string} path path in manifest
 * @param {string} alias for a given namespace
 * @param {EntityType} entityType - the entity type
 * @returns annotation term type
 */
function getAnnotationTerm(path, alias, entityType) {
    return getUIAnnotationTerm(path, alias, entityType) || getCommunicationAnnotationTerm(path, alias);
}
/**
 * Evaluates the target annotation of a reference facet and actualizes the facets for the config.
 *
 * @param section - The section object in the app schema to be updated with annotation information.
 * @param annotationRecord - the actual annotation record
 * @param facets - list of facets in config format, to be updated
 * @param entityType - the entity type
 * @param oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 */
function evaluateTargetAnnotation(section, annotationRecord, facets, entityType, oDataServiceAVT) {
    const alias = findAlias(ux_specification_types_1.UIVOCABULARY, oDataServiceAVT);
    let path = section ? section.key : '';
    const targetEntityType = section.entityType;
    const annotationTerm = getAnnotationTerm(path, alias, entityType);
    switch (annotationTerm) {
        case "com.sap.vocabularies.UI.v1.Chart" /* UIAnnotationTerms.Chart */: {
            facets[path] = { base: ux_specification_types_1.FacetBase.Chart };
            facets[path].target = annotationRecord?.Target?.$target;
            facets[path].entityType = targetEntityType;
            facets[path].namespace = section.namespace;
            break;
        }
        case "com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */: {
            facets[path] = { base: ux_specification_types_1.FacetBase.Identification };
            facets[path].target = annotationRecord?.Target?.$target;
            facets[path].entityType = targetEntityType;
            facets[path].namespace = section.namespace;
            break;
        }
        case "com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */: {
            if (!path.includes("com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */) && path.includes('.LineItem')) {
                const pathParts = path.split('::');
                pathParts[pathParts.length - 1] = `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
                path = pathParts.join('::');
            }
            facets[path] = { base: ux_specification_types_1.FacetBase.LineItem };
            facets[path].target = annotationRecord?.Target?.$target;
            facets[path].entityType = targetEntityType;
            facets[path].namespace = section.namespace;
            break;
        }
        case "com.sap.vocabularies.UI.v1.FieldGroup" /* UIAnnotationTerms.FieldGroup */: {
            facets[path] = { base: ux_specification_types_1.FacetBase.Form };
            facets[path].target = annotationRecord?.Target?.$target;
            facets[path].entityType = targetEntityType;
            facets[path].namespace = section.namespace;
            break;
        }
        case "com.sap.vocabularies.UI.v1.DataPoint" /* UIAnnotationTerms.DataPoint */: {
            facets[path] = { base: ux_specification_types_1.FacetBase.DataPoint };
            facets[path].Label = annotationRecord?.Target?.$target['Title'];
            facets[path].target = annotationRecord?.Target?.$target;
            facets[path].entityType = targetEntityType;
            facets[path].namespace = section.namespace;
            break;
        }
        case "com.sap.vocabularies.UI.v1.PresentationVariant" /* UIAnnotationTerms.PresentationVariant */: {
            facets[path] = { base: ux_specification_types_1.FacetBase.PresentationVariant };
            facets[path].target = annotationRecord?.Target?.$target;
            facets[path].entityType = targetEntityType;
            facets[path].namespace = section.namespace;
            break;
        }
        case "com.sap.vocabularies.UI.v1.SelectionPresentationVariant" /* UIAnnotationTerms.SelectionPresentationVariant */: {
            facets[path] = { base: ux_specification_types_1.FacetBase.SelectionPresentationVariant };
            facets[path].target = annotationRecord?.Target?.$target;
            facets[path].entityType = targetEntityType;
            facets[path].namespace = section.namespace;
            break;
        }
        case "com.sap.vocabularies.Communication.v1.Contact" /* CommunicationAnnotationTerms.Contact */: {
            facets[path] = { base: ux_specification_types_1.FacetBase.Contact };
            facets[path].target = annotationRecord?.Target?.$target;
            facets[path].entityType = targetEntityType;
            facets[path].namespace = section.namespace;
            break;
        }
        case "com.sap.vocabularies.Communication.v1.Address" /* CommunicationAnnotationTerms.Address */: {
            facets[path] = { base: ux_specification_types_1.FacetBase.Address };
            facets[path].target = annotationRecord?.Target?.$target;
            facets[path].entityType = targetEntityType;
            facets[path].namespace = section.namespace;
            break;
        }
        default: {
            facets[path] = { base: ux_specification_types_1.FacetBase.Unknown };
        }
    }
    if (facets[path]) {
        facets[path].annotationPath = `/${annotationRecord.fullyQualifiedName.replace('@com.sap.vocabularies', ux_specification_types_1.VOCWITHSLASH)}`;
        if (annotationRecord.Label) {
            facets[path].Label = annotationRecord.Label;
        }
        // Add Facet ID
        if (annotationRecord.ID) {
            facets[path]['ID'] = annotationRecord.ID;
        }
        if (section && section.entityType) {
            facets[path].entityType = section.entityType;
        }
    }
}
/**
 * Method returns schema annotation path for passed fullyQualifiedName.
 *
 * @param {EntityType} entityType entity type.
 * @param {string} fullyQualifiedName fully qualifier name.
 * @returns {TemplateType} Schema annotation path.
 */
function getAnnotationPathUsingFullyQualifiedName(entityType, fullyQualifiedName) {
    return `/${entityType.fullyQualifiedName}/${fullyQualifiedName.split(entityType.fullyQualifiedName)[1]}`;
}
/**
 * Adds the information from facets to the config.
 *
 * @param annotationRecord - the actual annotation record
 * @param oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @param serviceName - name of the service of the app
 * @param entityType - The entity type to be used for resolving facets
 * @param facets - list of facets in config format, to be updated
 * @param oDataVersion - OData version
 * @param logger - Logger class for logging messages
 */
function addFacetToConfig(annotationRecord, oDataServiceAVT, serviceName, entityType, facets, oDataVersion = ux_specification_types_1.FioriElementsVersion.v2, logger) {
    const section = getSectionFacet(annotationRecord, entityType, oDataServiceAVT, logger, oDataVersion, false);
    if (section) {
        switch (annotationRecord.$Type) {
            case "com.sap.vocabularies.UI.v1.ReferenceFacet" /* UIAnnotationTypes.ReferenceFacet */: {
                evaluateTargetAnnotation(section, annotationRecord, facets, entityType, oDataServiceAVT);
                break;
            }
            case "com.sap.vocabularies.UI.v1.CollectionFacet" /* UIAnnotationTypes.CollectionFacet */: {
                const annotationPath = getAnnotationPathUsingFullyQualifiedName(entityType, annotationRecord.fullyQualifiedName);
                const facet = (facets[section.key] = {
                    base: ux_specification_types_1.FacetBase.CollectionFacet,
                    facets: {},
                    ID: section.ID,
                    annotationPath: annotationPath,
                    Label: section.label,
                    namespace: section.namespace
                });
                if (!facet.ID && oDataVersion === ux_specification_types_1.FioriElementsVersion.v4) {
                    (0, extensionLogger_1.log)(logger, {
                        severity: "error" /* LogSeverity.Error */,
                        message: i18next_1.default.t('NOID4SECTION', { facet: annotationRecord.fullyQualifiedName })
                    });
                }
                annotationRecord.Facets?.forEach((collectionItem) => {
                    addFacetToConfig(collectionItem, oDataServiceAVT, serviceName, entityType, facet.facets, oDataVersion, logger);
                });
                break;
            }
        }
    }
}
/**
 * Retrieve header facet configurations that can be used to generate ObjectPage schemas.
 *
 * @param entityType - The entity type to be used for resolving facets
 * @param oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @param oDataVersion - OData version
 * @param logger - Logger class for logging messages
 * @returns - header facet configurations
 */
function getObjectPageHeaderFacets(entityType, oDataServiceAVT, oDataVersion = ux_specification_types_1.FioriElementsVersion.v2, logger) {
    const facets = {};
    if (!entityType || !entityType.annotations) {
        return;
    }
    const alias = findAlias(ux_specification_types_1.UIVOCABULARY, oDataServiceAVT);
    const facetAnnotation = alias && entityType?.annotations?.[alias]?.HeaderFacets;
    if (facetAnnotation) {
        const lastDot = entityType && entityType.fullyQualifiedName.lastIndexOf('.');
        const serviceName = entityType && entityType.fullyQualifiedName.substring(0, lastDot);
        // Add facets to configuration
        facetAnnotation.forEach((item) => {
            addFacetToConfig(item, oDataServiceAVT, serviceName, entityType, facets, oDataVersion, logger);
        });
    }
    return facets;
}
/**
 * Retrieve facet configurations that can be used to generate ObjectPage schemas.
 *
 * @param entityType - The entity type to be used for resolving facets
 * @param oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @param {FioriElementsVersion} oDataVersion - OData version
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns - facet configurations
 */
function getObjectPageFacets(entityType, oDataServiceAVT, oDataVersion = ux_specification_types_1.FioriElementsVersion.v2, logger) {
    const facets = {};
    if (!entityType || !entityType.annotations) {
        return;
    }
    const alias = findAlias(ux_specification_types_1.UIVOCABULARY, oDataServiceAVT);
    const facetAnnotation = alias && entityType?.annotations[alias]?.Facets;
    if (facetAnnotation) {
        const lastDot = entityType && entityType.fullyQualifiedName.lastIndexOf('.');
        const serviceName = entityType && entityType.fullyQualifiedName.substring(0, lastDot);
        // Add facets to configuration
        facetAnnotation.forEach((item) => {
            addFacetToConfig(item, oDataServiceAVT, serviceName, entityType, facets, oDataVersion, logger);
        });
    }
    return facets;
}
/**
 * Returns the version of Fiori elements (v2/v4) from a given manifest.
 *
 * @param manifest - the manifest.json file
 * @returns FioriElementsVersion
 */
function getFEVersionFromManifest(manifest) {
    if ((manifest[ux_specification_types_1.ManifestSection.generic] && Object.keys(manifest[ux_specification_types_1.ManifestSection.generic]).length > 0) ||
        (manifest[ux_specification_types_1.ManifestSection.ovp] && Object.keys(manifest[ux_specification_types_1.ManifestSection.ovp]).length > 0)) {
        return ux_specification_types_1.FioriElementsVersion.v2;
    }
    else {
        const targets = manifest[ux_specification_types_1.ManifestSection.ui5]?.routing?.targets;
        const libs = manifest[ux_specification_types_1.ManifestSection.ui5]?.dependencies?.libs;
        if ((targets &&
            Object.keys(targets).find((targetKey) => {
                const name = typeof targets[targetKey].name === 'string' ? targets[targetKey].name : '';
                return exports.V4_TEMPLATES.indexOf(name) > -1 || convertTemplateNameToPageTypeV4(name);
            })) ||
            (libs && Object.keys(libs).find((lib) => exports.V4_LIBS.indexOf(lib) > -1))) {
            return ux_specification_types_1.FioriElementsVersion.v4;
        }
        else {
            return undefined;
        }
    }
}
/**
 * Get the main service name from the manifest.
 * LROP: by definition the service name can be read from the UI5 model with "" as name.
 * OVP: the main model needs to be read from the sap.ovp config and then the service can be derived.
 *
 * @param manifest - application manifest
 * @returns - main service name
 */
function getMainService(manifest) {
    const model = typeof manifest?.[ux_specification_types_1.ManifestSection.ovp]?.globalFilterModel === 'string'
        ? manifest[ux_specification_types_1.ManifestSection.ovp].globalFilterModel
        : '';
    return typeof manifest?.[ux_specification_types_1.ManifestSection.ui5]?.models?.[model]?.dataSource === 'string'
        ? manifest[ux_specification_types_1.ManifestSection.ui5].models[model].dataSource
        : undefined;
}
/**
 * Returns the oData version of the service (if any) from a given manifest.
 *
 * @param manifest - the manifest.json file
 * @returns the OData version
 */
function getODataVersionFromManifest(manifest) {
    const mainService = getMainService(manifest);
    if (!mainService) {
        return ux_specification_types_1.OdataVersion.v2;
    }
    const dataSource = manifest[ux_specification_types_1.ManifestSection.app].dataSources?.[mainService];
    return dataSource?.settings?.odataVersion?.startsWith('4') ? ux_specification_types_1.OdataVersion.v4 : ux_specification_types_1.OdataVersion.v2;
}
/**
 * Determines the template type of a V2 app.
 *
 * @param manifest - the manifest.json file
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns the template type
 */
function determineV2Template(manifest, logger) {
    let templateType;
    if (manifest[ux_specification_types_1.ManifestSection.generic]) {
        const v2Pages = manifest[ux_specification_types_1.ManifestSection.generic].pages;
        if (!v2Pages) {
            (0, extensionLogger_1.log)(logger, {
                severity: "error" /* LogSeverity.Error */,
                message: i18next_1.default.t('NOPAGES', { appId: manifest['sap.app']['id'] }),
                location: {
                    path: ux_specification_types_1.MANIFESTPATH,
                    range: [ux_specification_types_1.ManifestSection.generic]
                }
            });
            return;
        }
        for (const pageKey in v2Pages) {
            const v2Page = v2Pages[pageKey];
            if (getPageTypeV2(v2Page.component?.name) === ux_specification_types_1.PageTypeV2.AnalyticalListPage) {
                templateType = ux_specification_types_1.TemplateType.AnalyticalListPageV2;
                break;
            }
            else if (getPageTypeV2(v2Page.component?.name) === ux_specification_types_1.PageTypeV2.ListReport) {
                templateType = ux_specification_types_1.TemplateType.ListReportObjectPageV2;
                break;
            }
        }
    }
    else {
        if (!templateType) {
            (0, extensionLogger_1.log)(logger, {
                severity: "error" /* LogSeverity.Error */,
                message: i18next_1.default.t('NOTEMPLATE', { section: ux_specification_types_1.ManifestSection.generic }),
                location: {
                    path: ux_specification_types_1.MANIFESTPATH,
                    range: [ux_specification_types_1.ManifestSection.generic]
                }
            });
        }
    }
    return templateType;
}
/**
 * Determines the template type of a single page.
 *
 * @param v4Page - single page from routing targets
 * @returns {TemplateType | undefined} the template type
 */
function determineV4PageTemplateType(v4Page) {
    let templateType;
    const pageType = getPageTypeV4(v4Page);
    if (pageType === ux_specification_types_1.PageTypeV4.AnalyticalListPage) {
        templateType = ux_specification_types_1.TemplateType.AnalyticalListPageV4;
    }
    else if (pageType === ux_specification_types_1.PageTypeV4.ListReport) {
        const viewPath = v4Page.options?.settings?.views?.paths?.[0];
        if (viewPath && (viewPath[ux_specification_types_1.ALPViewType.Primary] || viewPath[ux_specification_types_1.ALPViewType.Secondary])) {
            templateType = ux_specification_types_1.TemplateType.AnalyticalListPageV4;
        }
        else {
            templateType = ux_specification_types_1.TemplateType.ListReportObjectPageV4;
        }
    }
    else if (pageType === ux_specification_types_1.PageTypeV4.ObjectPage) {
        templateType = ux_specification_types_1.TemplateType.ListReportObjectPageV4;
        //fixed now for FEOP scenario, bit continue to check if LR/ALP exists
    }
    else if ([ux_specification_types_1.PageTypeV4.CustomPage, ux_specification_types_1.PageTypeV4.FPMCustomPage].includes(pageType)) {
        templateType = ux_specification_types_1.TemplateType.FreestylePageV4;
    }
    return templateType;
}
/**
 * Determines the template type, based on the given manifest routing target entries of the app.
 *
 * @param v4Pages - pages from routing targets
 * @returns {TemplateType | undefined} the template type
 */
function determineV4TemplateFromPages(v4Pages) {
    let templateType;
    for (const pageKey in v4Pages) {
        const v4Page = v4Pages[pageKey];
        templateType = determineV4PageTemplateType(v4Page);
        if (templateType) {
            break;
        }
    }
    return templateType;
}
/**
 * Determines the template type of a V4 app.
 *
 * @param manifest - the manifest.json file
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns {TemplateType} the template type
 */
function determineV4Template(manifest, logger) {
    const v4Pages = manifest[ux_specification_types_1.ManifestSection.ui5].routing &&
        manifest[ux_specification_types_1.ManifestSection.ui5].routing.targets;
    // if there are no pages in routing targets, we use LROPV4 as default template type
    if (!v4Pages || Object.keys(v4Pages).length === 0) {
        (0, extensionLogger_1.log)(logger, {
            severity: "info" /* LogSeverity.Info */,
            message: i18next_1.default.t('NOPAGES', { appId: manifest['sap.app']['id'] }),
            location: {
                path: ux_specification_types_1.MANIFESTPATH,
                range: [ux_specification_types_1.ManifestSection.ui5, 'routing']
            }
        });
        return ux_specification_types_1.TemplateType.ListReportObjectPageV4;
    }
    // else try to determine template type from routing targets
    const templateType = determineV4TemplateFromPages(v4Pages);
    if (!templateType) {
        (0, extensionLogger_1.log)(logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('NOTEMPLATE', { section: ux_specification_types_1.ManifestSection.ui5 }),
            location: {
                path: ux_specification_types_1.MANIFESTPATH,
                range: [ux_specification_types_1.ManifestSection.ui5, 'routing', 'targets']
            }
        });
    }
    return templateType;
}
/**
 * Determines the template type, based on the given manifest entries of the app.
 *
 * @param manifest - the manifest.json file
 * @param {FioriElementsVersion} fioriElementsVersion - OData or FE version
 * @param {ExtensionLogger} logger - Logger class for logging messages
 * @returns {TemplateType} the template type
 */
function getTemplateTypeFromManifest(manifest, fioriElementsVersion, logger) {
    let templateType;
    if (manifest[ux_specification_types_1.ManifestSection.ovp]) {
        templateType = ux_specification_types_1.TemplateType.OverviewPageV2;
    }
    else if (fioriElementsVersion === ux_specification_types_1.FioriElementsVersion.v2) {
        templateType = determineV2Template(manifest, logger);
    }
    else if (fioriElementsVersion === ux_specification_types_1.FioriElementsVersion.v4) {
        templateType = determineV4Template(manifest, logger);
    }
    return templateType;
}
/**
 * Adds title to a section or header section in an app schema.
 *
 * @param facet - intermediate facet structure comprising annotation information
 * @param section - section in the app schema
 * @param facetKey - key of the facet
 */
function addSectionTitle(facet, section, facetKey) {
    if (facet?.ID) {
        section.title = ux_specification_types_1.FACETTITLEPREFIX + facet.ID;
        section[ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.id, value: facet.ID }];
    }
    else {
        section.title = facetKey.replace(/@com.sap/g, 'com.sap');
        section[ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.id, value: facetKey.replace(ux_specification_types_1.UIVOCABULARYALPHADOT, '') }];
    }
}
/**
 * Adds description to a section or header section in an app schema.
 *
 * @param facet - intermediate facet structure comprising annotation information
 * @param section - section in the app schema
 * @param facetKey - key of the facet
 */
function addSectionDescription(facet, section, facetKey) {
    if (facet?.Label) {
        section.description = facet.Label;
    }
    else if (facet?.ID) {
        section.description = facet.ID;
    }
    else {
        section.description = facetKey.substring(facetKey.lastIndexOf('.') + 1);
    }
}
/**
 * Adds target title or description to a section or header section in an app schema.
 *
 * @param facet - intermediate facet structure comprising annotation information
 * @param section - section in the app schema
 * @param facetKey - key of the facet
 */
function addTargetTitleAndSectionDescription(facet, section, facetKey) {
    addSectionTitle(facet, section, facetKey);
    addSectionDescription(facet, section, facetKey);
    if (facet?.Label) {
        return;
    }
    if (facet?.Title) {
        section.description = facet.Title;
    }
    else if (facet?.target?.['Title']) {
        section.description = facet.target['Title'];
    }
    else if (facet?.target?.['Label']) {
        section.description = facet.target['Label'];
    }
}
/**
 * Adds chart (S)PV header facet ID, in case chart has no title.
 *
 * @param facet - intermediate facet structure comprising annotation information
 * @param section - section in the app schema
 */
function addChartFacetID(facet, section) {
    if (facet?.ID && section.description?.startsWith('Chart#')) {
        section.description = facet.ID;
    }
}
/**
 * Creates a default object for a new section or subsection, and adds the ID as title if present.
 *
 * @param appSchema - The application-specific JSON schema.
 * @param facet - Facet configuration, to be analyzed.
 * @param facetKey - The key of the facet.
 * @returns the new section object
 */
function createDefaultSection(appSchema, facet, facetKey) {
    const section = {
        type: 'object',
        properties: {},
        additionalProperties: false
    };
    section[ux_specification_types_1.SchemaTag.isViewNode] = true;
    section[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    addTargetTitleAndSectionDescription(facet, section, facetKey);
    return section;
}
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
function getObjectPageFacetSection(entityType, oDataServiceAVT, logger, oDataVersion = ux_specification_types_1.FioriElementsVersion.v2, checkUnresolvableFacets = false) {
    const alias = findAlias(ux_specification_types_1.UIVOCABULARY, oDataServiceAVT);
    let sections = [];
    if (entityType) {
        const facetAnnotation = alias && entityType?.annotations?.[alias]?.Facets;
        if (facetAnnotation) {
            sections = facetAnnotation.reduce(function (result, item) {
                if (checkUnresolvableFacets && !item['ID'] && !('Target' in item && item['Target'])) {
                    return result;
                }
                const section = getSectionFacet(item, entityType, oDataServiceAVT, logger, oDataVersion, true);
                if (section) {
                    result.push(section);
                }
                return result;
            }, sections);
        }
        return sections;
    }
}
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
const deleteEmptyStructure = (manifest, path, deletionRequest, entityPathArray, targetAnnotation, targetAnnotationEncoded) => {
    if (!path) {
        return;
    }
    let manifestSection = manifest;
    const pathArray = path.split('/');
    pathArray.forEach(function (element) {
        let decodedElement = targetAnnotationEncoded && targetAnnotationEncoded === element
            ? targetAnnotation
            : element.replace(/\?\?/g, '/');
        if (!manifestSection[decodedElement]) {
            if (targetAnnotationEncoded === element) {
                decodedElement = targetAnnotationEncoded;
            }
            if (!manifestSection[decodedElement]) {
                return;
            }
        }
        if (Object.keys(manifestSection[decodedElement]).length === 0 ||
            //deletion explicitly requested by using entityPath
            (entityPathArray && entityPathArray[entityPathArray.length - 1] === decodedElement && deletionRequest)) {
            if (Array.isArray(manifestSection)) {
                manifestSection.splice(Number(decodedElement), 1);
            }
            else {
                delete manifestSection[decodedElement];
            }
            pathArray.pop();
            (0, exports.deleteEmptyStructure)(manifest, pathArray.join('/'), deletionRequest, entityPathArray, targetAnnotation, targetAnnotationEncoded);
            return;
        }
        manifestSection = manifestSection && manifestSection[decodedElement];
    });
};
exports.deleteEmptyStructure = deleteEmptyStructure;
/**
 * Method which returns generic schema file name.
 *
 * @param {SchemaType | PageTypeV2} schemaType Schema type or Page type.
 * @returns {string} File name of generic schema.
 */
const getGenericSchemaFileName = (schemaType) => {
    if (schemaType === ux_specification_types_1.SchemaType.FreestylePage) {
        return ux_specification_types_1.PageTypeV2.CustomPage;
    }
    if (schemaType === ux_specification_types_1.SchemaType.FPMCustomPage) {
        // FPM custom pages uses generic schema generated for building blocks
        return ux_specification_types_1.SchemaType.BuildingBlocks;
    }
    return `${schemaType}`;
};
/**
 * Method which returns schema file name and path depending on passed schema or page type.
 *
 * @param {SchemaType | PageTypeV2} schemaType Schema type or Page type.
 * @param {string} [pageId] target page id from manifest.json
 * @param viewId - The view ID for custom pages (optional).
 * @returns {SchemaFilePath} File path info.
 */
const getSchemaFilePath = (schemaType, pageId, viewId) => {
    const schemaFile = {
        filename: '',
        path: ''
    };
    switch (schemaType) {
        // Application schema
        case ux_specification_types_1.SchemaType.Application: {
            // File name
            schemaFile.filename = `App`;
            // Full path
            schemaFile.path = `./${ux_specification_types_1.DirName.Schemas}/${schemaFile.filename}`;
            break;
        }
        // List report and object page
        case ux_specification_types_1.SchemaType.ListReport:
        case ux_specification_types_1.SchemaType.ObjectPage: {
            // File name
            schemaFile.filename = pageId ? `${schemaType}_${pageId}` : getGenericSchemaFileName(schemaType);
            // Full path
            schemaFile.path = `../${ux_specification_types_1.DirName.Schemas}/${schemaFile.filename}`;
            break;
        }
        case ux_specification_types_1.PageTypeV4.FPMCustomPage:
        case ux_specification_types_1.SchemaType.FPMCustomPage: {
            // File name
            schemaFile.filename = viewId
                ? `${ux_specification_types_1.SchemaType.FPMCustomPage}_${viewId}`
                : getGenericSchemaFileName(ux_specification_types_1.SchemaType.FPMCustomPage);
            // Full path
            schemaFile.path = `../${ux_specification_types_1.DirName.Schemas}/${schemaFile.filename}`;
            break;
        }
        // Other page configs
        default: {
            // File name
            schemaFile.filename = getGenericSchemaFileName(schemaType);
            // Full path
            schemaFile.path = `../${ux_specification_types_1.DirName.Schemas}/${schemaFile.filename}`;
            break;
        }
    }
    schemaFile.path += '.json';
    return schemaFile;
};
exports.getSchemaFilePath = getSchemaFilePath;
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
function generatePageId(pageType, entitySet, viewId, pageName) {
    if (pageType === ux_specification_types_1.PageTypeV2.CustomPage) {
        const names = viewId && viewId.split('.');
        return names && names[names.length - 1] + 'Page';
    }
    const parts = [];
    parts.push(pageType);
    if (entitySet) {
        parts.push(entitySet);
    }
    else if (pageName) {
        parts.push(pageName.replace('|', '').replace(pageType, ''));
    }
    return parts.join('_');
}
/**
 * Method finds matching objects against passed interface of 'additionalProperties' and returns array of matching object keys.
 *
 * @param {Definition} appSchema - App-specific JSON schema.
 * @param {Definition} additionalProperties - Allowed additional properties.
 * @param {object} configObject -Container object to find matching childs.
 * @returns {string[]} Array of matching object keys
 */
function findMatchingKeysByAdditionalProperties(appSchema, additionalProperties, configObject) {
    let properties = additionalProperties?.properties;
    let required = additionalProperties?.required;
    if (!properties && additionalProperties?.$ref) {
        const reference = additionalProperties?.$ref;
        const definition = appSchema.definitions[reference.split(exports.DEFINITION_LINK_PREFIX)[1]];
        if (typeof definition === 'object') {
            properties = definition.properties;
            required = definition.required;
        }
    }
    if (!properties || Object.keys(properties).length === 0) {
        return [];
    }
    const result = [];
    required = required || [];
    // Merge new entries for creation into list
    for (const key in configObject) {
        const entry = configObject[key];
        // Check if interface of config entry matches additionalProperties - all required properties should exist in entry
        if (typeof entry === 'object' && required.every((property) => entry[property] !== undefined)) {
            result.push(key);
        }
    }
    return result;
}
/**
 * Populates a given array with definitions from an application's schema that match certain conditions defined by the current configuration object and element reference.
 *
 * @param element - The element containing a reference ($ref) to a specific definition within the application schema.
 * @param appSchema - The application's schema object containing all definitions.
 * @param currentConfigObject - The current configuration object which is evaluated against the schema definitions.
 * @param definitionArray - The array to which matching definitions are added based on the evaluation.
 * This function does not return any value but modifies the definitionArray parameter by adding appropriate definitions.
 */
function fillArrayFromAnyOfReference(element, appSchema, currentConfigObject, definitionArray) {
    const $ref = element.$ref;
    if (!$ref) {
        return;
    }
    const definitionKey = $ref.split(exports.DEFINITION_LINK_PREFIX)[1];
    const innerDefinition = appSchema.definitions[definitionKey];
    if (typeof innerDefinition === 'object' && typeof currentConfigObject === 'object') {
        // control property defines if we should add the definition to the array
        const controlProperty = innerDefinition[CONTROL_PROPERTY];
        if (controlProperty) {
            // the control property should be in the list of the properties of the schema
            // and the value in the control property should be equal to one defined in the schema
            const controlPropertyInDefinition = innerDefinition.properties[controlProperty];
            if (controlPropertyInDefinition &&
                controlPropertyInDefinition[exports.CONST_PROPERTY] &&
                controlPropertyInDefinition[exports.CONST_PROPERTY] === currentConfigObject[controlProperty]) {
                definitionArray.push({
                    key: definitionKey
                });
            }
            // the control property could be defined not only as a const, but also as an enum with one value
            // we should consider this case as well
            if (controlPropertyInDefinition &&
                Array.isArray(controlPropertyInDefinition[ENUM_PROPERTY]) &&
                controlPropertyInDefinition[ENUM_PROPERTY].length === 1 &&
                controlPropertyInDefinition[ENUM_PROPERTY][0] === currentConfigObject[controlProperty]) {
                definitionArray.push({
                    key: definitionKey
                });
            }
            // the control property could be defined as a default value for the schema
            if (currentConfigObject[controlProperty] === undefined && innerDefinition[exports.DEFAULT_CONTROL_PROPERTY]) {
                definitionArray.push({
                    key: definitionKey
                });
            }
        }
        else if (typeof innerDefinition.additionalProperties === 'object') {
            // Check if potential object already exists in schema properties
            const properties = Object.keys(innerDefinition.properties || {});
            const matchingKeys = findMatchingKeysByAdditionalProperties(appSchema, innerDefinition.additionalProperties, currentConfigObject);
            if (properties.some((property) => property in currentConfigObject) ||
                matchingKeys.length ||
                (Object.keys(currentConfigObject).length === 0 && properties.length)) {
                definitionArray.push({
                    key: definitionKey
                });
            }
        }
    }
}
/**
 * Ensures that the definition referenced by the given `element` is included in
 * `definitionArray` when it declares properties that are not yet represented by
 * any of the definitions already collected.
 *
 * This is used when resolving or validating `anyOf` branches:
 * if a referenced definition provides properties that do not appear in the
 * currently collected definitions (`definitionArray`), those missing properties
 * are added to the appropriate definition entry. If the definition itself is not
 * yet included, it is inserted into the array.
 *
 * @param element - The element containing a reference ($ref) to a specific definition within the application schema.
 * @param appSchema - The application's schema object containing all definitions.
 * @param currentConfigObject - The current configuration object which is evaluated against the schema definitions.
 * @param definitionArray - The array to which matching definitions are added based on the evaluation.
 */
function addMissingPropertyDefinitionForElement(element, appSchema, currentConfigObject, definitionArray) {
    const $ref = typeof element === 'object' ? element.$ref : undefined;
    const definitionKey = $ref ? getDefinitionKey($ref) : undefined;
    const innerDefinition = definitionKey ? appSchema.definitions?.[definitionKey] : undefined;
    if (typeof currentConfigObject !== 'object' ||
        typeof innerDefinition !== 'object' ||
        typeof innerDefinition.properties !== 'object') {
        return;
    }
    const candidateKeys = Object.keys(innerDefinition.properties);
    const missingProperties = [];
    for (const key of candidateKeys) {
        // Check whether any definition (referenced by definitionArray) already contains this property
        const definitionAlreadyHasKey = definitionArray.some((existingDefName) => {
            const definition = appSchema.definitions?.[existingDefName.key];
            return typeof definition === 'object' && !!definition.properties?.[key];
        });
        if (!definitionAlreadyHasKey) {
            missingProperties.push(key);
        }
    }
    if (missingProperties.length === 0) {
        return;
    }
    // If the same definitionKey already exists in definitionArray, merge missing properties into it.
    const existingIndex = definitionArray.findIndex((d) => d.key === definitionKey);
    if (existingIndex >= 0) {
        const existing = definitionArray[existingIndex];
        const existingProps = Array.isArray(existing.properties) ? existing.properties : [];
        const merged = Array.from(new Set([...missingProperties, ...existingProps]));
        definitionArray[existingIndex] = {
            ...existing,
            properties: merged
        };
    }
    else {
        // Otherwise unshift a new entry for this definition containing all missing properties
        definitionArray.unshift({
            key: definitionKey,
            properties: missingProperties
        });
    }
}
/**
 * Fills an array of next definitions from given references in the JSON schema.
 *
 * @param propertyDefinition - Definition of the current property in schema
 * @param currentConfigObject - Current object in the config JSON. Evaluated to get the right value of a controlling property,
 *                              for making the right choice in case of multiple options (anyOf)
 * @param appSchema - app-specific JSON schema
 * @returns an array of definitions to proceed with
 */
function fillArrayFromPropertyDefinition(propertyDefinition, currentConfigObject, appSchema) {
    const definitionArray = [];
    if (propertyDefinition.$ref) {
        definitionArray.push({
            key: propertyDefinition.$ref.split(exports.DEFINITION_LINK_PREFIX)[1]
        });
    }
    else if (propertyDefinition.anyOf) {
        if (currentConfigObject) {
            propertyDefinition.anyOf.forEach((element) => {
                fillArrayFromAnyOfReference(element, appSchema, currentConfigObject, definitionArray);
            });
            if (definitionArray.length) {
                propertyDefinition.anyOf.forEach((element) => {
                    // Add property definitions from this element that are not included in the root
                    // resolved definition but may exist in other referenced definitions.
                    addMissingPropertyDefinitionForElement(element, appSchema, currentConfigObject, definitionArray);
                });
            }
        }
        if (definitionArray.length === 0) {
            return undefined;
        }
    }
    return definitionArray;
}
/**
 * Determines the next definitions to be handled, based on the definition array.
 * It also creates the Metadata instance for the next definition, to subsequently access metadata like the syncRule.
 *
 * @param definitionArray - Array of definitions, as determined by fillArrayFromNextDefinition
 * @param appSchema - app-specific JSON schema
 * @param title - default title
 * @param currentConfigObject - Current object in the config JSON.
 * @param key - actual key
 * @param {MetadataInstanceInterface} factory - factory for creating metadata instances
 * @param pageType - page type
 * @param propertyDefinition - Definition of the current property in schema
 * @returns {NextDefinition} - Next target definition to process
 */
function determineNextDefinitionsFromDefinitionArray(definitionArray, appSchema, title, currentConfigObject, key, factory, pageType, propertyDefinition) {
    const nextDefinitions = [];
    if (definitionArray.length) {
        for (const definitionData of definitionArray) {
            const definition = definitionData.key;
            const nextDefinition = {
                configObject: undefined,
                targetDefinition: { ...appSchema['definitions'][definition] },
                title: ''
            };
            if (definitionData.properties) {
                // We should include only specific properties(anyOf case when some definitions can have properties which does not exist in other anyOf variant)
                const targetDefinition = { ...nextDefinition.targetDefinition };
                targetDefinition.properties = {};
                for (const property of definitionData.properties) {
                    targetDefinition.properties[property] = nextDefinition.targetDefinition.properties[property];
                }
                nextDefinition.targetDefinition = targetDefinition;
            }
            if (nextDefinition?.targetDefinition?.['$ref'] || nextDefinition?.targetDefinition?.['type'] === 'array') {
                nextDefinitions.push(getNextTargetDefinition(appSchema, title, currentConfigObject, nextDefinition.targetDefinition, key, factory, pageType));
                continue;
            }
            if (definitionArray.length > 1 && !definitionData.properties) {
                definitionArray.forEach((element) => {
                    if (element.key !== '') {
                        nextDefinition.targetDefinition['properties'] = {
                            ...nextDefinition.targetDefinition['properties'],
                            ...appSchema['definitions'][element.key]['properties']
                        };
                    }
                });
            }
            nextDefinition.title = nextDefinition?.targetDefinition?.['title']
                ? nextDefinition.targetDefinition['title']
                : title;
            const factoryKey = definition?.split('<')[0];
            const targetObject = currentConfigObject ? currentConfigObject : {};
            nextDefinition.configObject = factory.createInstance(pageType, factoryKey, targetObject, nextDefinition?.targetDefinition?.[CONTROL_PROPERTY]);
            nextDefinitions.push(nextDefinition);
        }
    }
    else {
        //e.g. sections ==> loop over all properties = subsections or other
        nextDefinitions.push({
            configObject: currentConfigObject,
            targetDefinition: propertyDefinition,
            title: key
        });
    }
    return nextDefinitions;
}
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
function getNextTargetDefinitions(appSchema, title, currentConfigObject, propertyDefinition, key, factory, pageType) {
    if (propertyDefinition['type'] === 'array') {
        return getNextTargetDefinitions(appSchema, title, currentConfigObject, propertyDefinition['items'], key, factory, pageType);
    }
    const definitionArray = fillArrayFromPropertyDefinition(propertyDefinition, currentConfigObject, appSchema);
    if (!definitionArray) {
        return undefined;
    }
    return determineNextDefinitionsFromDefinitionArray(definitionArray, appSchema, title, currentConfigObject, key, factory, pageType, propertyDefinition);
}
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
function getNextTargetDefinition(appSchema, title, currentConfigObject, propertyDefinition, key, factory, pageType) {
    const definitions = getNextTargetDefinitions(appSchema, title, currentConfigObject, propertyDefinition, key, factory, pageType);
    return definitions ? definitions[definitions.length - 1] : undefined;
}
/**
 * Custom array merge function called by deepmerge's merge function.
 *
 * @param {*} target Target array
 * @param {*} source Source array
 * @param {*} options options object provided by deepmerge's merge function
 * @returns {string[]} Combined array with unique elements from both target and source arrays.
 */
const arrayCombineMerge = (target, source, options) => {
    const destination = target.slice();
    source.forEach((item, index) => {
        if (typeof destination[index] === 'undefined') {
            destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
        }
        else if (options.isMergeableObject(item)) {
            destination[index] = (0, deepmerge_1.default)(target[index], item, options);
        }
        else if (target.indexOf(item) === -1) {
            destination.push(item);
        }
    });
    return destination;
};
exports.arrayCombineMerge = arrayCombineMerge;
/**
 * Converts an enum into a CSV.
 *
 * @param {object} manifestSection - manifestSection where the key exists
 * @param {object} configPart - Property as mentioned in config file
 * @param {string} key - Property to be exported to manifest
 */
function convertEnumToCSV(manifestSection, configPart, key) {
    manifestSection[key] = JSON.parse(JSON.stringify(configPart[key]));
    // convert enum array to joined string
    const field = configPart[key];
    manifestSection[key] = field.join();
}
/**
 * Converts an action ID from the internal format (schema, config) to the stable ID representation.
 *
 * @param actionId - the (unique) internal format of the action ID
 * @returns the converted action ID
 */
function convertActionKeyToStableId(actionId) {
    if (!actionId) {
        return '';
    }
    return (actionId.indexOf('??') > -1 ? actionId.split('??')[1] : actionId).replace(/@/g, '::');
}
/**
 * Method returns definition key for passed '$ref' property by removing 'definition' prefix.
 *
 * @param {string} $ref Definition reference.
 * @returns Definition key.
 */
function getDefinitionKey($ref) {
    return $ref?.split(exports.DEFINITION_LINK_PREFIX)[1];
}
/**
 * Method returns definition $ref' property for passed definition key.
 *
 * @param {string} key Definition key.
 * @returns Definition reference.
 */
function getDefinitionsRef(key) {
    return `#/definitions/${key}`;
}
/**
 * Returns the message property if the error is an instance of `Error` else a string representation of the error.
 *
 * @param error {Error | unknown} - the error instance
 * @returns {string} the error message
 */
function getErrorMessage(error) {
    return error instanceof Error ? error.message : String(error);
}
/**
 * Method checks if passed array of features contains required feature.
 *
 * @param {FeatureToggle[]} [featureToggles] Array of features.
 * @param {FeatureToggle} [feature] Feature to check if it is supported.
 * @returns {boolean} True if passed feature is supported.
 */
function isFeatureSupported(featureToggles, feature) {
    return featureToggles?.includes(feature);
}
/**
 * Method adds indices (propertyIndex property) to app-specific JSON schema properties.
 *
 * @param {Definition} [schema] App-specific JSON schema.
 * @param {string[]} [order] Order of properties.
 */
function updatePropertyIndices(schema, order) {
    order.forEach((propertyName, index) => {
        if (schema.properties[propertyName]) {
            schema.properties[propertyName]['propertyIndex'] = index;
        }
    });
}
/**
 * Method to get value for passed path in passed object.
 *
 * @param obj Object to check.
 * @param paths Path for searching property/value.
 * @returns Found value for passed path.
 */
function getJSONPropertyByPath(obj, paths) {
    let current = obj;
    for (const path of paths) {
        if (path === undefined) {
            continue;
        }
        if (typeof current === 'object' && path in current) {
            // found and continue
            current = current[path];
        }
        else {
            return undefined;
        }
    }
    return current;
}
/**
 * Method to remove namespaces.
 *
 * @param sId - The string identifier to process and remove namespaces from.
 * @returns {string} modified string without namespace
 */
function removeNamespaces(sId) {
    sId = sId.replace(ux_specification_types_1.UIVOCABULARYDOT, '');
    sId = sId.replace('com.sap.vocabularies.Communication.v1.', '');
    return sId;
}
/**
 * Method to replace namespaces with short hand form.
 *
 * @param {string } sId - The string identifier to process and replace namespaces with shorthand forms.
 * @returns {string} modified string with replaced namespaces
 */
function replaceNamespaces(sId) {
    sId = sId.replace(ux_specification_types_1.UIVOCABULARY, 'UI');
    sId = sId.replace('com.sap.vocabularies.Communication.v1', 'Communication');
    return sId;
}
/**
 * Checks whether a Definition contains a $ref attribute pointing to an 'internal' Definition.
 *
 * @param element - The Definition to be checked
 * @returns the name of the referred Definition, if it exists, otherwise undefined
 */
function getRefType(element) {
    const reference = element.$ref;
    if (typeof reference === 'string' && reference.startsWith(exports.DEFINITION_LINK_PREFIX)) {
        return reference.substring(exports.DEFINITION_LINK_PREFIX.length);
    }
}
/**
 * Converts a template name string from 'manifest.json' to a corresponding `PageTypeV4` enum value.
 *
 * @param {string} templateName - The name of the template to convert.
 * @returns {PageTypeV4 | undefined} The corresponding `PageTypeV4` enum value, or `undefined` if no match is found.
 */
function convertTemplateNameToPageTypeV4(templateName) {
    if (templateName === ux_specification_types_1.v4.FE_TEMPLATE_V4_CUSTOM_PAGE) {
        return ux_specification_types_1.PageTypeV4.FPMCustomPage;
    }
    if (templateName?.startsWith(`${ux_specification_types_1.v4.FE_NAMESPACE_V4}.`)) {
        const parts = templateName.split('.');
        const pageType = parts[parts.length - 1];
        if (pageType in ux_specification_types_1.PageTypeV4) {
            return ux_specification_types_1.PageTypeV4[pageType];
        }
    }
}
/**
 * Determines whether two template names match either directly or by resolving their corresponding page types.
 *
 * @param templateName1 The first template name to compare.
 * @param templateName2 The second template name to compare.
 * @returns Returns true if the template names match directly or their page types match; otherwise, false.
 */
function compareTemplateNames(templateName1, templateName2) {
    if (templateName1 === templateName2) {
        return true;
    }
    const pageType1 = convertTemplateNameToPageTypeV4(templateName1);
    return pageType1 ? pageType1 === convertTemplateNameToPageTypeV4(templateName2) : false;
}
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
function convertSyncRulePathToJsonPath(syncRulePath, targetAnnotation, targetAnnotationEncoded) {
    const pathParts = syncRulePath.split('/');
    let jsonPath = '$';
    let prevSegment = undefined;
    for (const segment of pathParts) {
        // Replace encoded annotation(like '::' -> '/') and '??' -> '/'
        const resolvedSegment = getDecodedPathElement(segment, targetAnnotation, targetAnnotationEncoded);
        jsonPath = appendJsonPathSegment(jsonPath, resolvedSegment, prevSegment);
        prevSegment = resolvedSegment;
    }
    return jsonPath;
}
const ESCAPE_CHAR = '\\';
/**
 * Appends a single segment to an existing JSONPath string.
 *
 * @param basePath - The existing JSONPath string (e.g., '$.data')
 * @param segment - The segment to append
 * @param prevSegment - The previous resolved segment, used to detect array placeholders
 * @returns A new JSONPath string with the segment appended
 */
function appendJsonPathSegment(basePath, segment, prevSegment) {
    // Array placeholder segments like "[]"
    if (segment === '[]') {
        // Wait for next segment
        return basePath;
    }
    if (prevSegment === '[]') {
        //Numeric array index
        const index = Number(segment);
        return !Number.isNaN(index) && Number.isInteger(index) ? `${basePath}[${index}]` : `${basePath}[:]`;
    }
    // Use dot notation only if the segment is a valid JS identifier
    if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(segment)) {
        return `${basePath}.${segment}`;
    }
    // Otherwise, use bracket notation with quotes
    const escapedSegment = segment.includes('"') || segment.includes(ESCAPE_CHAR)
        ? segment.replaceAll(ESCAPE_CHAR, ESCAPE_CHAR + ESCAPE_CHAR).replaceAll('"', ESCAPE_CHAR + '"')
        : segment;
    return `${basePath}["${escapedSegment}"]`;
}
/**
 * Finds the control class object for a given definition names from an array of control objects.
 *
 * @param controls - Array of control objects, each mapping definition names to class objects.
 * @param definitionNames - The names of the definition/class to look for.
 * @returns The control class object, or undefined if not found.
 */
function findClassControl(controls, definitionNames) {
    for (const definitionName of definitionNames) {
        if (!definitionName) {
            continue;
        }
        for (const control of controls) {
            if (control[definitionName]) {
                return control[definitionName];
            }
        }
    }
}
/**
 * Resolves the manifest rule path for a property, handling parent property chaining.
 *
 * @param rule - The sync rule object containing the manifest path function.
 * @param pathParams - Parameters for manifest path resolution.
 * @param parentProperty - Optional parent property resolution info.
 * @param propertyName - Optional, property name being resolved.
 * @returns The resolved manifest rule path as a string.
 */
function resolveManifestRulePath(rule, pathParams, parentProperty, propertyName) {
    let rulePath;
    const { cardKeys } = pathParams;
    // OVP card sync rule path method (check getCardSettingsPath) requires array like parameter e.g. ['cards', 'cardKey', <propertyName>]
    if (cardKeys) {
        const manifestPathParam = parentProperty?.name ? [...cardKeys, parentProperty.name] : [...cardKeys];
        if (propertyName) {
            manifestPathParam.push(propertyName);
        }
        rulePath = rule?.manifest?.path(manifestPathParam);
    }
    else {
        rulePath = rule?.manifest?.path(Array.isArray(pathParams.pageName) ? pathParams.pageName : [pathParams.pageName], pathParams.manifest, ...(pathParams.pathsParts ?? []));
        if (rulePath === parentProperty?.rulePath) {
            rulePath = `${rulePath}/${parentProperty.name}`;
        }
    }
    return rulePath;
}
/**
 * Sets the absolute manifest path for a property schema based on the sync rule and path parameters.
 *
 * @param propertySchema - The schema definition of the property to update.
 * @param propertyName - The name of the property.
 * @param rule - The sync rule containing manifest path logic.
 * @param pathParams - Parameters used for manifest path resolution.
 * @param parentProperty - Optional parent property resolution info.
 * @returns The resolved rule path as a string, or undefined if not applicable.
 */
function applyAbsoluteManifestPath(propertySchema, propertyName, rule, pathParams, parentProperty) {
    if (!rule?.manifest?.path) {
        return;
    }
    const rulePath = resolveManifestRulePath(rule, pathParams, parentProperty, propertyName);
    const exportPropertyKey = rule?.manifest?.key ?? propertyName;
    const propertyRulePath = `${rulePath}/${exportPropertyKey}`;
    propertySchema.manifestPath = convertSyncRulePathToJsonPath(propertyRulePath, pathParams.targetAnnotation, pathParams.targetAnnotationEncoded);
    return rulePath;
}
/**
 * Sets the relative manifest path for a property schema based on the root definition, sync rule, and path parameters.
 *
 * @param rootDefinition - The root schema definition for the current context.
 * @param propertySchema - The schema definition of the property to update.
 * @param propertyName - The name of the property.
 * @param rule - The sync rule containing manifest path logic (optional).
 * @param pathParams - Parameters used for manifest path resolution.
 * @param parentProperty - Optional parent property resolution info.
 */
function applyRelativeManifestPath(rootDefinition, propertySchema, propertyName, rule, pathParams, parentProperty) {
    let manifestPath;
    let exportPropertyKey = propertyName;
    if (rule) {
        const rulePath = resolveManifestRulePath(rule, pathParams, parentProperty, propertyName);
        exportPropertyKey = rule?.manifest?.key ?? propertyName;
        manifestPath = convertSyncRulePathToJsonPath(rulePath, pathParams.targetAnnotation, pathParams.targetAnnotationEncoded);
    }
    else if (parentProperty.absoluteManifestPath) {
        manifestPath = parentProperty.absoluteManifestPath;
    }
    if (manifestPath) {
        let segmentPath = '';
        if (!rootDefinition['manifestPath'] && parentProperty?.absoluteManifestPath === undefined) {
            rootDefinition['manifestPath'] = parentProperty?.relativeManifestPath ?? manifestPath;
        }
        else if (manifestPath.startsWith(rootDefinition['manifestPath']) &&
            manifestPath !== rootDefinition['manifestPath']) {
            segmentPath = manifestPath.slice(rootDefinition['manifestPath'].length);
            if (segmentPath.startsWith('.')) {
                segmentPath = segmentPath.slice(1);
            }
        }
        propertySchema.manifestPath = segmentPath ? `${segmentPath}.${exportPropertyKey}` : exportPropertyKey;
    }
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
function addManifestPathsToProperties(controls, appSchema, definitionName, definition, pathParams, parentProperty, handleRelative = false) {
    const rootDefinition = definition;
    let isRef = parentProperty?.reference ? parentProperty.reference : false;
    // If `definitionName` is undefined, attempt to resolve it from the definition's `$ref`
    if (definitionName === undefined && definition.$ref) {
        const innerDefinitionKey = getDefinitionKey(definition.$ref);
        const innerDefinition = appSchema.definitions[innerDefinitionKey];
        if (innerDefinition && (!innerDefinition.isViewNode || !parentProperty)) {
            definition = innerDefinition;
            definitionName = innerDefinitionKey;
        }
        isRef = true;
    }
    // Resolve root definition name in case if reference has syntax like `definitionName<annotation>`
    if (definitionName?.includes('<')) {
        definitionName = definitionName.split('<')[0];
    }
    const definitionsNames = [definitionName];
    if (!definition.properties && definition.$ref) {
        const innerDefinition = getDefinitionKey(definition.$ref);
        definition = appSchema.definitions?.[innerDefinition] ?? definition;
        isRef = true;
        if (!definition['isViewNode'] && definitionName !== innerDefinition) {
            definitionsNames.push(innerDefinition);
        }
    }
    const classControl = findClassControl(controls, definitionsNames);
    if (classControl) {
        for (const property in definition.properties ?? {}) {
            const rule = (0, decoration_1.getReflectMetadata)(classControl.prototype, property);
            const propertySchema = definition.properties[property];
            if (propertySchema.isViewNode) {
                continue;
            }
            const propertyPath = {
                name: property,
                reference: isRef
            };
            if (rule?.manifest?.path) {
                if (!pathParams.cardKeys && (!handleRelative || !isRef)) {
                    propertyPath.rulePath = applyAbsoluteManifestPath(propertySchema, property, rule, pathParams, parentProperty);
                    propertyPath.absoluteManifestPath = propertySchema.manifestPath;
                }
                else {
                    applyRelativeManifestPath(rootDefinition, propertySchema, property, rule, pathParams, parentProperty);
                    propertyPath.absoluteManifestPath = rootDefinition.manifestPath;
                }
            }
            else if (parentProperty) {
                propertyPath.relativeManifestPath = property;
            }
            // Recursively apply manifest paths to inner properties
            addManifestPathsToProperties(controls, appSchema, undefined, propertySchema, pathParams, propertyPath, handleRelative);
        }
    }
    else if (handleRelative && parentProperty?.absoluteManifestPath) {
        for (const property in definition.properties ?? {}) {
            const propertySchema = definition.properties[property];
            // Recursively apply manifest paths to inner properties
            applyRelativeManifestPath(rootDefinition, propertySchema, property, undefined, pathParams, parentProperty);
        }
    }
    // Recursively apply manifest paths to properties inside `anyOf` variants
    if (definition.anyOf) {
        for (const schemaVariant of definition.anyOf) {
            if (typeof schemaVariant === 'object') {
                addManifestPathsToProperties(controls, appSchema, undefined, schemaVariant, pathParams, parentProperty, parentProperty?.absoluteManifestPath ? true : handleRelative);
            }
        }
    }
    if (definition.items) {
        const items = Array.isArray(definition.items) ? definition.items : [definition.items];
        for (const schemaVariant of items) {
            if (typeof schemaVariant === 'object') {
                addManifestPathsToProperties(controls, appSchema, undefined, schemaVariant, pathParams, parentProperty, parentProperty?.absoluteManifestPath ? true : handleRelative);
            }
        }
    }
}
/**
 * Converts a JSONPath string into an array of accessors.
 * Note: This is a copy of a similar implementation in tools-suite. In future we should find a way to use one single implementation of this function.
 *
 * @param path - The JSONPath string to convert.
 * @returns An array of accessors representing the path.
 */
function jsonPathToArray(path) {
    if (!path.startsWith('$')) {
        throw new Error('Invalid JSONPath: must start with $');
    }
    const result = [];
    let i = 1; // skip '$'
    while (i < path.length) {
        const char = path[i];
        // Dot notation: .key
        if (char === '.') {
            i++;
            const start = i;
            while (i < path.length && /[A-Za-z0-9_$]/.test(path[i])) {
                i++;
            }
            result.push(path.slice(start, i));
            continue;
        }
        // Bracket notation: ['key'] or [0]
        if (char === '[') {
            i++;
            // Quoted key
            if (path[i] === '"' || path[i] === "'") {
                const quote = path[i++];
                const start = i;
                // Collect positions of escape characters within the quoted key
                const escapeCharPositions = [];
                while (i < path.length) {
                    if (path[i] === ESCAPE_CHAR) {
                        escapeCharPositions.push(i - start);
                        i++; // skip escaped character
                    }
                    else if (path[i] === quote) {
                        break; // end of quoted key
                    }
                    i++;
                }
                // Cut out the string representing of the quoted key
                const segment = path.slice(start, i);
                // segment may still contain escape characters, need to remove them.
                let currentStart = 0;
                let segmentReduced = '';
                for (const pos of escapeCharPositions) {
                    segmentReduced += segment.slice(currentStart, pos);
                    currentStart = pos + 1;
                }
                segmentReduced += segment.slice(currentStart);
                result.push(segmentReduced);
                i += 2; // skip closing quote + ]
                continue;
            }
            // Numeric index
            const start = i;
            while (i < path.length && path[i] !== ']') {
                i++;
            }
            const index = Number(path.slice(start, i));
            if (!Number.isNaN(index)) {
                result.push(index);
            }
            i++; // skip ]
            continue;
        }
        i++;
    }
    return result;
}
//# sourceMappingURL=utils.js.map