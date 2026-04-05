"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMacrosSchemaDefinition = generateMacrosSchemaDefinition;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const utils_1 = require("../../../common/utils");
const macros_1 = require("../../utils/macros");
const annotations_1 = require("./annotations");
const extensions_1 = require("./extensions");
const i18n_1 = require("../../../../i18n/i18n");
const i18next_1 = __importDefault(require("i18next"));
const extensionLogger_1 = require("../../../../extensionLogger");
const uuid_1 = require("uuid");
const utils_2 = require("./utils");
const corrections_1 = require("../../../../../scripts/macros/corrections");
const MACROS_NAMESPACE = 'sap.fe.macros';
/**
 * Method returns full element name by concating name and namespace.
 *
 * @param {XMLElement} element Parsed XML element.
 * @returns {string} Full name of element including namespace.
 */
function getElementName(element) {
    const { ns, name } = element;
    if (ns) {
        return `${ns}:${name}`;
    }
    return name;
}
/**
 * Method checks if passed XML element is defined within passed namespace.
 *
 * @param {XMLElement} element Parsed XML element.
 * @param {string[]} namespacePrefixes Used namespace prefixes.
 * @returns {boolean} Is element defined within passed namespace.
 */
function isElementWithNamespace(element, namespacePrefixes) {
    const { ns = '' } = element;
    if (!namespacePrefixes) {
        return !ns;
    }
    else {
        return namespacePrefixes.includes(ns);
    }
}
/**
 * Method returns all dependecies defined in passed core SAPUI5 XML element.
 *
 * @param {XMLElement} coreElement Parsed XML element.
 * @returns {UI5Depenencies} Object with dependencies.
 */
function getDependencies(coreElement) {
    const dependencies = {};
    const coreAttributes = coreElement.attributes || [];
    for (const attr of coreAttributes) {
        const { key, value } = attr;
        let accesor = '';
        const namespaceConst = 'xmlns:';
        if (key.startsWith(namespaceConst)) {
            accesor = key.substring(namespaceConst.length);
        }
        dependencies[value] = accesor;
    }
    return dependencies;
}
/**
 * Method finds available name for properties in schema's properties.
 *
 * @param {string} name Original property name.
 * @param {{ [k: string]: SchemaDefinition }} properties Object with existing properties.
 * @returns {string} Available name in properties.
 */
function findAvailableName(name, properties) {
    let availableName = name;
    let index = 2;
    while (availableName in properties) {
        availableName = `${name}${index}`;
        index++;
    }
    return availableName;
}
/**
 * Method prepares schema 'properties' for passed schema by resolving '$ref' property.
 *
 * @param {SchemaDefinition} schema Schema node to update.
 * @param {SchemaDefinition} fullSchema Full schema object which contains definitions.
 */
function prepareSchemaProperties(schema, fullSchema) {
    schema.properties = {};
    if (schema.$ref) {
        const key = (0, utils_1.getDefinitionKey)(schema.$ref);
        const definition = fullSchema.definitions[key];
        if (typeof definition === 'object' && definition.properties) {
            schema.type = definition.type;
            schema.isViewNode = definition.isViewNode;
            schema.properties = JSON.parse(JSON.stringify(definition.properties));
            // Copy additionalProperties for aggregation schemas (needed for custom extension handling)
            if (definition.additionalProperties) {
                schema.additionalProperties = JSON.parse(JSON.stringify(definition.additionalProperties));
            }
        }
        delete schema.$ref;
    }
}
/**
 * Method handles attributes of xml node and stores range position to schema.
 *
 * @param {XMLElement} node Parsed XML element.
 * @param {SchemaDefinition} schema Schema object containing properties matching to element attributes.
 * @param {SchemaDefinition} fullSchema Full schema object which contains definitions.
 */
function handleAttributes(node, schema, fullSchema) {
    if (!schema.properties) {
        prepareSchemaProperties(schema, fullSchema);
    }
    const properties = schema.properties;
    for (const attr of node.attributes) {
        const property = properties[attr.key];
        if (property && property.metadata) {
            property.metadata.position = attr.position;
        }
    }
    // Apply corrections in schema to property/attribute
    const controlName = schema.metadata?.controlName ?? '';
    const controlCorrectionEntry = corrections_1.MACROS_ENUM_ENTRIES_MAP[controlName] ?? {};
    for (const name in controlCorrectionEntry) {
        const property = properties[name];
        // Update enum entries based on dependent property value
        const dependentProperty = controlCorrectionEntry?.[name]?.dependentProperty;
        if (dependentProperty) {
            const dependencyValue = node.attributes.find((attribute) => attribute.key === dependentProperty);
            if (dependencyValue?.value) {
                property.enum = (0, corrections_1.getEnumEntriesFromMap)(controlName, name, dependencyValue.value);
            }
        }
    }
}
/**
 * Method adds custom ID property for macros control type in schema.
 *
 * @param {MacrosSchemaMetadata} metadata Macros metadata.
 */
function applyIdForMacros(metadata) {
    if (metadata.type === ux_specification_types_1.MacrosPropertyType.Control) {
        metadata.internalId = (0, uuid_1.v4)();
    }
}
/**
 * Method calls annotation handler for passed macros control.
 *
 * @param {string} macrosControl Full macros control namespace. Like 'sap.fe.macros.Table'.
 * @param {string} options Handler options.
 * @param {ExtensionLogger} [logger] Logger.
 */
function callAnnotationHandler(macrosControl, options, logger) {
    try {
        annotations_1.macrosHandlers[macrosControl]?.(options);
    }
    catch {
        (0, extensionLogger_1.log)(logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('MACROS_ANNOTATION_ERROR', { control: macrosControl })
        });
    }
}
/**
 * Method updates/syncs passed schema's metadata with metadata from passed reference.
 *
 * @param {MacrosSchemaMetadata} metadata Metadata to update/sync.
 * @param {SchemaDefinition} schema Reference schema.
 * @param {string} refName Reference schema name. In case of ui5 control schema - name is control name.
 */
function updateMetadataByReference(metadata, schema, refName) {
    if (!metadata.type) {
        metadata.type = schema.metadata.type;
    }
    if (schema.metadata.defaultAggregation) {
        metadata.defaultAggregation = schema.metadata.defaultAggregation;
    }
    if (metadata.type === ux_specification_types_1.MacrosPropertyType.Control) {
        metadata.controlName = refName;
    }
}
/**
 * Builds a list of possible fully qualified reference names for a given XML element.
 *
 * @param node The XML element being processed.
 * @param name The control or reference name to append to each namespace.
 * @param params Parse context containing schema metadata, dependencies, and the path stack.
 * @returns List of possible fully qualified reference names.
 */
function getPosibleRefNames(node, name, params) {
    const namespaces = params.schema.metadata.namespaces ? [...params.schema.metadata.namespaces] : [];
    const dependencies = params.dependencies;
    const preferredNamespaces = [MACROS_NAMESPACE];
    // Resolve namespace of control
    if (node.ns) {
        for (const ns in dependencies) {
            if (node.ns === dependencies[ns]) {
                preferredNamespaces.push(ns);
                break;
            }
        }
    }
    // Find context control like case when action defined within table using same general macros namespace
    for (let i = params.path.length - 1; i >= 0; i--) {
        let name = params.path[i].name;
        // if it has a namespace, take part after colon
        if (name.includes(':')) {
            name = name.split(':')[1];
        }
        // check if control name - control name starts with uppercase
        if (/^[A-Z]/.test(name)) {
            const ns = `${MACROS_NAMESPACE}.${name.toLowerCase()}`;
            if (namespaces.includes(ns)) {
                preferredNamespaces.push(ns);
                break;
            }
        }
    }
    return [...new Set([...preferredNamespaces, ...namespaces])].map((ns) => `${ns}.${name}`);
}
/**
 * Method adds control or complex property to schema's properties.
 *
 * @param {XMLElement} node Parsed XML element.
 * @param {SchemaDefinition} schema Schema object to update with new property.
 * @param {XMLParseParams} params XML parsing params.
 * @param {string} name Property name.
 * @returns {string} Added property name.
 */
function addControlToSchema(node, schema, params, name) {
    const fullSchema = params.schema;
    if (!schema.properties) {
        prepareSchemaProperties(schema, fullSchema);
    }
    const schemaProperty = schema.properties[name];
    const type = schemaProperty?.metadata?.type;
    const defaultAggregation = schemaProperty?.metadata?.defaultAggregation;
    const metadata = {
        path: params.path,
        type,
        position: node.position
    };
    (0, utils_2.addDisplayInfoForBuildingBlock)(node, name, metadata);
    if (defaultAggregation) {
        metadata.defaultAggregation = defaultAggregation;
    }
    const objectKey = schemaProperty?.metadata?.path?.length ? findAvailableName(name, schema.properties) : name;
    let refs = [];
    if (schemaProperty?.$ref) {
        refs.push((0, utils_1.getDefinitionKey)(schemaProperty.$ref));
    }
    else {
        refs = getPosibleRefNames(node, name, params);
    }
    let handled = false;
    for (const ref of refs) {
        const refDefinition = fullSchema.definitions?.[ref];
        if (typeof refDefinition !== 'object') {
            continue;
        }
        updateMetadataByReference(metadata, refDefinition, ref);
        const { description, icon } = (0, utils_2.getViewNodeDescriptionAndIcon)(node, name);
        const newDefinition = {
            $ref: (0, utils_1.getDefinitionsRef)(ref),
            description,
            ...(icon ? { icon } : {}),
            propertyIndex: params.index,
            metadata
        };
        handleAttributes(node, newDefinition, fullSchema);
        schema.properties[objectKey] = newDefinition;
        handled = true;
        // Call annotation handler
        callAnnotationHandler(ref, {
            ...params,
            node,
            schema: newDefinition,
            rootSchema: params.schema
        }, params.logger);
        break;
    }
    applyIdForMacros(metadata);
    if (!handled) {
        if (!schemaProperty?.properties) {
            // Unknown definition
            const newDefinition = {
                properties: {},
                isViewNode: true,
                type: 'object',
                description: name,
                propertyIndex: params.index,
                metadata
            };
            schema.properties[objectKey] = newDefinition;
        }
        else {
            schemaProperty.metadata = metadata;
        }
    }
    return objectKey;
}
/**
 * Method helps to populate used definition keys by looking in passed schema properties.
 *
 * @param {SchemaDefinition} schema Schema to check for properties.
 * @param {string[] | undefined} usedDefinitionKeys Parameter populates used definition keys in macros schema.
 */
function populateUsedDefinitionKeys(schema, usedDefinitionKeys) {
    const properties = schema.properties;
    if (properties) {
        for (const i in properties) {
            const property = properties[i];
            const refs = [];
            if (property.$ref) {
                refs.push(property.$ref);
            }
            if (typeof property.additionalProperties === 'object' && property.additionalProperties?.$ref) {
                refs.push(property.additionalProperties.$ref);
            }
            for (const ref of refs) {
                const definitionKey = (0, utils_1.getDefinitionKey)(ref);
                if (definitionKey && usedDefinitionKeys.indexOf(definitionKey) === -1) {
                    usedDefinitionKeys.push(definitionKey);
                }
            }
            populateUsedDefinitionKeys(property, usedDefinitionKeys);
        }
    }
}
/**
 * Mapping of interface definitions to their implementing classes.
 * Used to resolve interface $refs to concrete implementations for element name matching.
 */
const INTERFACE_TO_IMPLEMENTATION_MAP = new Map([
    ['sap.fe.macros.table.ITableColumn', ['Column', 'ColumnOverride']],
    ['sap.fe.macros.table.ITableActionOrGroup', ['Action', 'ActionOverride', 'ActionGroup', 'ActionGroupOverride']]
]);
/**
 * Method checks if passed node is addable to passed schema by checking "additionalProperties".
 *
 * @param {XMLElement} node XML element.
 * @param {DefinitionOrBoolean} [schema] JSON schema.
 * @returns {boolean} True if node is addable for schema's additionalProperties.
 */
function isElementAddableToSchema(node, schema) {
    if (typeof schema === 'object' &&
        typeof schema.additionalProperties === 'object' &&
        schema.additionalProperties.$ref) {
        const ref = schema.additionalProperties.$ref;
        const definitionKey = (0, utils_1.getDefinitionKey)(ref);
        const parts = definitionKey.split('.');
        // `sap.ui.core.Control` allows to insert any control
        if (definitionKey === 'sap.ui.core.Control' || parts[parts.length - 1] === node.name) {
            return true;
        }
    }
    return false;
}
/**
 * Method returns default aggregation information if schema contains default aggregation.
 *
 * @param {XMLElement} node Parsed XML element.
 * @param {SchemaDefinition} schema Schema object to check for default aggregation.
 * @returns {DefaultAggregationData} Default aggregation information.
 */
function getDefaultAggregation(node, schema) {
    const defaultAggregation = schema.metadata?.defaultAggregation;
    if (defaultAggregation && !(0, utils_2.getNodeByName)(node, defaultAggregation)) {
        const defaultAggregationSchema = schema.properties[defaultAggregation];
        if (typeof defaultAggregationSchema === 'object') {
            return {
                schema: defaultAggregationSchema,
                name: defaultAggregation
            };
        }
    }
    return undefined;
}
/**
 * Handles subelements of an XML node.
 *
 * @param {XMLElement[]} subElements of a parent node.
 * @param {SchemaDefinition} schema Schema object to update with new property.
 * @param {XMLParseParams} params XML parsing params.
 * @param {string[] | undefined} usedDefinitionKeys Parameter populates used definition keys in macros schema.
 */
function handleSubElementsOfXMLNode(subElements, schema, params, usedDefinitionKeys) {
    const uniqueKeys = {};
    for (let index = 0; index < subElements.length; index++) {
        const element = subElements[index];
        const isUnique = !uniqueKeys[element.name];
        uniqueKeys[element.name] = true;
        handleXMLNode(element, schema, {
            ...params,
            isUnique,
            index,
            path: [
                ...params.path,
                {
                    name: getElementName(element),
                    index
                }
            ]
        }, usedDefinitionKeys);
    }
}
/**
 * Method adds property to schema's properties.
 *
 * @param {XMLElement} node Parsed XML element.
 * @param {SchemaDefinition} schema Schema object to update with new property.
 * @param {XMLParseParams} params XML parsing params.
 * @param {string[] | undefined} usedDefinitionKeys Parameter populates used definition keys in macros schema.
 */
function handleXMLNode(node, schema, params, usedDefinitionKeys) {
    const postProcesses = [];
    const { macrosPrefixes } = params;
    const parentSchema = schema?.$ref ? params.schema.definitions?.[(0, utils_1.getDefinitionKey)(schema.$ref)] : schema;
    if (isElementWithNamespace(node, macrosPrefixes) ||
        (typeof parentSchema === 'object' && parentSchema.properties?.[node.name])) {
        const defaultAggregation = schema.metadata?.defaultAggregation;
        if (defaultAggregation && isElementAddableToSchema(node, schema.properties[defaultAggregation])) {
            schema = schema.properties[defaultAggregation];
        }
        const names = node.name.split(':');
        const name = addControlToSchema(node, schema, params, names[names.length - 1]);
        // Go deeper in schema
        if (!schema.properties[name]) {
            return;
        }
        else {
            schema = schema.properties[name];
        }
    }
    const { subElements = [] } = node;
    const definitionName = schema?.metadata ? schema.metadata.controlName : undefined;
    if (usedDefinitionKeys &&
        definitionName &&
        params.schema.definitions[definitionName] &&
        usedDefinitionKeys.indexOf(definitionName) === -1) {
        usedDefinitionKeys.push(definitionName);
        // search deeper for macros definitions
        populateUsedDefinitionKeys(schema, usedDefinitionKeys);
    }
    const defaultAggregation = getDefaultAggregation(node, schema);
    if (defaultAggregation) {
        postProcesses.push({ node, schema: defaultAggregation.schema, name: defaultAggregation.name });
    }
    handleSubElementsOfXMLNode(subElements, schema, params, usedDefinitionKeys);
    postProcesses.push({ node, schema });
    // Post process schema
    for (const postProcess of postProcesses) {
        (0, extensions_1.handleExtensions)(postProcess.node, postProcess.schema, params.schema, postProcess.name);
    }
}
/**
 * Method returns available macros namespace prefixes.
 *
 * @param {SchemaDefinition} genericSchema Generic schema of "sap.fe.macros".
 * @param {UI5Depenencies} dependencies Used dependencies.
 * @returns {string[]} Available macros namespace prefixes.
 */
function getMacrosPrefixes(genericSchema, dependencies) {
    const macrosPrefixes = [];
    // populate available namespace prefixes
    if (genericSchema?.metadata?.namespaces) {
        genericSchema.metadata.namespaces.forEach((prefix) => {
            if (prefix in dependencies) {
                macrosPrefixes.push(dependencies[prefix]);
            }
        });
    }
    return macrosPrefixes;
}
/**
 * Method generates schema for passed XML content.
 *
 * @param {SchemaDefinition} genericSchema Generic schema of "sap.fe.macros".
 * @param {ExtensionFileData} xmlFile Object with xml file.
 * @param {ConvertedMetadata} serviceAVT OData metadata.
 * @param {ExtensionLogger} [logger] - Logger class for logging messages.
 * @returns {SchemaDefinition} Generated schema for passed XML content.
 */
function generateMacrosSchemaDefinition(genericSchema, xmlFile, serviceAVT, logger) {
    const viewDocument = (0, macros_1.parseXML)(xmlFile.file, true, logger);
    const usedDefinitionKeys = [];
    if (!viewDocument) {
        return undefined;
    }
    (0, i18n_1.initI18n)();
    // define default schema without any definitions and properties
    let schema = {
        type: 'object',
        properties: {},
        definitions: {},
        additionalProperties: false,
        $schema: 'http://json-schema.org/draft-07/schema#'
    };
    if (!genericSchema) {
        (0, extensionLogger_1.log)(logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('NOGENERICSCHEMA', { pageType: 'FPM Custom Page' })
        });
        return;
    }
    const coreElement = viewDocument.rootElement;
    const dependencies = getDependencies(coreElement);
    const macrosPrefixes = getMacrosPrefixes(genericSchema, dependencies);
    if (macrosPrefixes.length) {
        // Macros supported
        schema = JSON.parse(JSON.stringify(genericSchema));
        const uniqueKeys = {};
        for (let index = 0; index < coreElement.subElements.length; index++) {
            const element = coreElement.subElements[index];
            const isUnique = !uniqueKeys[element.name];
            uniqueKeys[element.name] = true;
            handleXMLNode(element, schema, {
                macrosPrefixes,
                schema,
                dependencies,
                index,
                isUnique,
                path: [
                    {
                        name: getElementName(element),
                        index
                    }
                ],
                serviceAVT,
                connectionContext: xmlFile.connection,
                logger
            }, usedDefinitionKeys);
        }
        // clean unused definitions from macros schema
        for (const i in schema.definitions) {
            if (schema.definitions[i]['metadata'] && !usedDefinitionKeys.includes(i)) {
                delete schema.definitions[i];
            }
        }
    }
    return schema;
}
//# sourceMappingURL=generator.js.map