"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseSchema = traverseSchema;
exports.parseXML = parseXML;
exports.getCustomExtensionFragmentDefinitionKey = getCustomExtensionFragmentDefinitionKey;
exports.getRootElement = getRootElement;
const xml_js_1 = require("xml-js");
const ast_1 = require("@xml-tools/ast");
const parser_1 = require("@xml-tools/parser");
const i18next_1 = __importDefault(require("i18next"));
const ux_specification_types_1 = require("@sap/ux-specification-types");
const utils_1 = require("../../common/utils");
const extensionLogger_1 = require("../../../extensionLogger");
/**
 * Method finds element by XML path.
 *
 * @param {Element} element Element to look in.
 * @param {MacrosXMLPath} path XML path to search.
 * @returns {Element | undefined} Element is returned if element found by passed path.
 */
function findElementByXMLPath(element, path) {
    let currentElement = element;
    for (const subPath of path) {
        const elements = currentElement?.elements?.filter((element) => element.type !== 'comment');
        currentElement = elements?.[subPath.index];
    }
    return currentElement;
}
/**
 * Method ensures that inner object exists for passed property name.
 *
 * @param {object} obj Object to check and update.
 * @param {string} name Property name in object to check and update.
 * @returns {boolean} True if object created.
 */
function ensureObjectExists(obj, name) {
    if (!obj[name]) {
        obj[name] = {};
        return true;
    }
    return false;
}
/**
 * Method gets properties from full schema definitions using current schema $ref property.
 *
 * @param {SchemaDefinition} fullSchema Full schema object.
 * @param {string} $ref $ref property of current schema object.
 * @returns {Definition} The properties extracted from the schema definition referenced by $ref.
 */
function getPropertiesFromRef(fullSchema, $ref) {
    let properties = {};
    const key = (0, utils_1.getDefinitionKey)($ref);
    if (fullSchema.definitions && fullSchema.definitions[key]) {
        const definition = fullSchema.definitions[key];
        if (typeof definition === 'object' && definition.properties) {
            properties = definition.properties;
        }
    }
    return properties;
}
/**
 * Method traverses schema for default aggregation.
 *
 * @param {TraverseData} traverseData Traverse data object.
 * @param {TraverseCallback} callback Callbck to handle export or import.
 * @param {MacrosSchemaMetadata} metadata Metadata with default aggregation.
 * @param {TraverseCallback} [onElementDeleteCallback]  - Callback invoked when an element is deleted during traversal.
 * @returns {boolean} Is changes applied during export or import.
 */
function traverseDefaultAggregation(traverseData, callback, metadata, onElementDeleteCallback) {
    const { defaultAggregation } = metadata;
    const { schema, element, contextPath, config = {}, fullSchema, parentElement } = traverseData;
    const { properties = {} } = schema;
    const differs = ensureObjectExists(config, defaultAggregation);
    const contextConfig = config[defaultAggregation];
    return (traverseSchema({
        fullSchema,
        schema: properties[defaultAggregation],
        element: element,
        contextPath: contextPath,
        config: contextConfig,
        parent: traverseData,
        data: traverseData.data,
        parentElement
    }, callback, onElementDeleteCallback) || differs);
}
/**
 * Method checks if passed schema is eligable for default aggregation handling.
 *
 * @param {Definition} properties Schema properties which can contain default aggregation.
 * @param {MacrosSchemaMetadata} [metadata] Metadata with default aggregation.
 * @returns {boolean} True if passed schema is eligable for default aggregation handling.
 */
function isDefaultAggregationAppliable(properties, metadata) {
    return (metadata?.defaultAggregation && properties[metadata.defaultAggregation]?.['metadata']?.['path']?.length === 0);
}
/**
 * Method traverses schema together with XML element.
 *
 * @param {TraverseData} traverseData Traverse data object.
 * @param {TraverseCallback} callback Callbck to handle export or import.
 * @param {TraverseCallback} [onElementDeleteCallback]  - Callback invoked when an element is deleted during traversal.
 * @returns {boolean} Is changes applied during export or import.
 */
function traverseSchema(traverseData, callback, onElementDeleteCallback) {
    const { schema, element, contextPath, config = {}, fullSchema } = traverseData;
    let differs = false;
    let { properties = {} } = schema;
    const { metadata = {} } = schema;
    if (schema.$ref && !schema.properties) {
        properties = getPropertiesFromRef(fullSchema, schema.$ref);
    }
    if (schema['metadata']?.['path']?.length && traverseData.removed === true) {
        differs = onElementDeleteCallback?.(traverseData, schema, traverseData.config, element.name) ?? differs;
    }
    for (const name in properties) {
        const property = properties[name];
        let shouldTraverse = typeof property === 'object';
        // Handle default aggregation
        if (shouldTraverse &&
            metadata?.defaultAggregation === name &&
            isDefaultAggregationAppliable(properties, metadata)) {
            // Special hook to apply default aggregation
            differs = traverseDefaultAggregation(traverseData, callback, metadata, onElementDeleteCallback) || differs;
            shouldTraverse = false;
        }
        if (!shouldTraverse) {
            continue;
        }
        // Check if object contains "metadata" to map with XML element
        if (property['metadata']?.['path']?.length) {
            const path = property['metadata']['path'];
            const checkPath = path.slice(contextPath.length);
            // Find target element at the end of the path
            const targetElement = findElementByXMLPath(element, checkPath);
            // Find the parent element (one level up from target) for deletion operations
            // Parent is needed when elements become empty after attribute removal and need to be deleted from their container
            const parentElement = findElementByXMLPath(element, checkPath.slice(0, -1));
            const originalConfig = { ...config };
            differs = ensureObjectExists(config, name) || differs;
            const contextConfig = config[name];
            differs =
                traverseSchema({
                    fullSchema: traverseData.fullSchema,
                    schema: property,
                    element: targetElement,
                    contextPath: path,
                    config: contextConfig,
                    removed: originalConfig[name] === undefined,
                    parent: traverseData,
                    data: traverseData.data,
                    parentElement
                }, callback, onElementDeleteCallback) || differs;
        }
        else {
            differs = callback(traverseData, property, config, name) || differs;
        }
    }
    return differs;
}
/**
 * Parses the provided XML file and returns a parsed object.
 *
 * @param xmlFile - The XML file to be parsed.
 * @param providePositions - If true, the parsing result will include element and attribute positions.
 * @param logger - Optional logger instance for logging messages.
 * @returns The parsed XML as an Element or XMLDocument, or undefined if parsing fails.
 */
function parseXML(xmlFile, providePositions, logger) {
    let element;
    try {
        if (providePositions) {
            const { cst, tokenVector } = (0, parser_1.parse)(xmlFile.fileContent);
            const xmlDocument = (0, ast_1.buildAst)(cst, tokenVector);
            if (!xmlDocument.rootElement) {
                // Throw exception than invalid xml string provided
                throw new Error('Invalid XML');
            }
            element = xmlDocument;
        }
        else {
            element = (0, xml_js_1.xml2js)(xmlFile.fileContent);
        }
    }
    catch (error) {
        (0, extensionLogger_1.log)(logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('XMLPARSEFAILURE', { error: (0, utils_1.getErrorMessage)(error) }),
            location: {
                path: xmlFile.dataSourceUri
            }
        });
    }
    return element;
}
/**
 * Resolves definition key for custom extension fragment.
 *
 * @param {string} fragmentName Name of the fragment.
 * @returns {string} Definition key for custom extension fragment.
 */
function getCustomExtensionFragmentDefinitionKey(fragmentName) {
    return `${ux_specification_types_1.DefinitionName.CustomExtensionFragment}<${fragmentName}>`;
}
/**
 * Method find first renderable element for passed definition element.
 *
 * @param element Definition element.
 * @returns First renderable element.
 */
function getRootElement(element) {
    return element.elements?.find((root) => root.type !== 'comment');
}
//# sourceMappingURL=macros.js.map