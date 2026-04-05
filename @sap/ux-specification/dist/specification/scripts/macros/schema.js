"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROPERTY_SEMANTICS = exports.UI5_TO_JSON_SCHEMA_TYPE_MAP = void 0;
exports.generateSchema = generateSchema;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const ux_specification_types_2 = require("@sap/ux-specification-types");
const types_1 = require("./types");
const corrections_1 = require("./corrections");
const common_1 = require("../../src/sync/common");
/**
 * Mapping of interface definitions to their implementing classes.
 * Used to resolve interface $refs to concrete implementations that contain the actual properties.
 */
const INTERFACE_TO_IMPLEMENTATION_MAP = new Map([
    ['sap.fe.macros.table.ITableColumn', 'sap.fe.macros.table.Column'],
    ['sap.fe.macros.table.ITableActionOrGroup', 'sap.fe.macros.table.Action'],
    ['sap.fe.macros.table.ITableAction', 'sap.fe.macros.table.Action']
]);
exports.UI5_TO_JSON_SCHEMA_TYPE_MAP = new Map([['int', 'number']]);
/**
 * Semantic classification patterns for properties
 * Used to determine if a property should be visible (isViewNode = true/false)
 */
exports.PROPERTY_SEMANTICS = {
    AGGREGATIONS: [/^(columns?|actions?|items?|content|filters?)/i, /buttonGroups/]
};
/**
 * Method checks if passed type is atomic type like 'boolean', 'string', 'number', etc.
 *
 * @param {string} type Type to check.
 * @returns {boolean} Is atomic type.
 */
function isAtomicType(type) {
    return (['string', 'number', 'integer', 'boolean', 'object', 'array', 'null', 'any'].includes(type) ||
        exports.UI5_TO_JSON_SCHEMA_TYPE_MAP.has(type));
}
/**
 * Method returns base/skeleton schema.
 *
 * @returns {SchemaDefinition} JSON schema.
 */
function getRootSchema() {
    const hiddenProperty = { type: 'string', hidden: true };
    return {
        type: 'object',
        metadata: {
            namespaces: []
        },
        properties: {
            $filePath: hiddenProperty,
            $schema: hiddenProperty
        },
        additionalProperties: false,
        definitions: {},
        $schema: 'http://json-schema.org/draft-07/schema#'
    };
}
/**
 * Method formats description text before storing it into schema.
 * Currently method removes HTML markup from text.
 *
 * @param {string} [description] Description to format.
 * @returns {string} Formatted description.
 */
function formatDescription(description) {
    if (description) {
        // Replace combination of HTML break and new line with single line
        description = description.replace(/<br\/>\n/g, '\n');
        // Replace remaining separate HTML break with new line
        description = description.replace(/<br\/>/g, '\n');
        // Remove HTML markup
        return description.replace(/<[^>]*>?/g, '');
    }
    return '';
}
/**
 * Method prepares schema definition object.
 *
 * @param {MacrosPropertyType} metadataType Metadata property type.
 * @param {string} [description] Description of definition.
 * @param {string} defaultAggreation Default aggregation.
 * @param {string} symbolName  Name of the symbol.
 * @returns {SchemaDefinition} JSON schema for definition.
 */
function prepareDefinition(metadataType, description, defaultAggreation, symbolName) {
    if (description) {
        // Remove html markup from description
        description = formatDescription(description);
    }
    // For main control definitions (classes), default to true as they are primary UI building blocks
    // But exclude configuration objects (*Options classes)
    const isViewNode = !symbolName.endsWith('Options');
    const definition = {
        description,
        isViewNode,
        type: 'object',
        properties: {},
        additionalProperties: false,
        metadata: {
            path: [],
            type: metadataType
        }
    };
    if (defaultAggreation) {
        definition.metadata.defaultAggregation = defaultAggreation;
    }
    return definition;
}
/**
 * Method prepares schema object for passed type.
 *
 * @param {string} type Type of target property or object.
 * @returns {SchemaDefinition} JSON schema.
 */
function getSchemaForType(type) {
    const schema = {};
    if (isAtomicType(type)) {
        schema.type = exports.UI5_TO_JSON_SCHEMA_TYPE_MAP.has(type)
            ? exports.UI5_TO_JSON_SCHEMA_TYPE_MAP.get(type)
            : type;
    }
    else {
        const implementationType = INTERFACE_TO_IMPLEMENTATION_MAP.get(type);
        if (implementationType) {
            type = implementationType;
        }
        schema.$ref = `#/definitions/${type}`;
    }
    return schema;
}
/**
 * Method prepares schema object for passed types.
 *
 * @param [type] Type(s) of target property or object.
 * @param [propertyTypes] Types of target property or object.
 * @returns JSON schema.
 */
function getTypes(type, propertyTypes) {
    let result = [];
    if (type) {
        result = Array.isArray(type) ? type : type.split('|').map((subType) => subType.trim());
    }
    else if (propertyTypes) {
        result = propertyTypes.map((propertyType) => propertyType.value);
    }
    return result.map((propertyType) => {
        return getSchemaForType(propertyType);
    });
}
/**
 * Method prepares schema property object for passed generic property.
 *
 * @param {UI5Property} property SAPUI5 property.
 * @param {MacrosPropertyType} metadataType Metadata property type.
 * @param {string} [type] Type of target property or object.
 * @param {UI5PropertyType[]} [types] Types of target property or object.
 * @returns {SchemaDefinition} JSON schema.
 */
function prepareSchemaProperty(property, metadataType, type, types) {
    const schemaTypes = getTypes(type, types);
    // modify bindable number property type by adding another type (string) with binding syntax pattern
    if (type === 'number' && 'bindable' in property && property.bindable) {
        schemaTypes.push({
            type: 'string',
            pattern: "^{[A-Za-z0-9{}&$!@#%? _|,<>'()[\\]\\/:=.]+}$"
        });
    }
    // Define result
    const propertySchema = schemaTypes.length === 1
        ? { ...schemaTypes[0] }
        : {
            anyOf: schemaTypes
        };
    propertySchema.description = formatDescription(property.description);
    propertySchema['artifactType'] = ux_specification_types_1.ArtifactType.XMLProperty;
    if (property.disabled) {
        propertySchema.disabled = true;
    }
    if (property.visibility === types_1.UI5Visibility.hidden) {
        propertySchema.hidden = true;
    }
    propertySchema.metadata = {
        type: metadataType
    };
    return propertySchema;
}
/**
 * Method returns allowed values for passed ui5 property.
 *
 * @param {UI5Property} property SAPUI5 property.
 * @returns {string[] | undefined} Array of allowed values.
 */
function getAllowedValues(property) {
    if (property.allowedValues) {
        return property.allowedValues;
    }
    return property['ui5-metadata']?.['sap.fe']?.allowedValues;
}
/**
 * Method prepares schema object for passed SAPUI5 property.
 *
 * @param {UI5Property} property SAPUI5 property.
 * @returns {SchemaDefinition} JSON schema.
 */
function prepareProperty(property) {
    const propertySchema = prepareSchemaProperty(property, ux_specification_types_2.MacrosPropertyType.Property, property.type, property.types);
    const allowedValues = getAllowedValues(property);
    if (allowedValues && propertySchema.type === 'string') {
        (0, common_1.addEnumToSchema)(allowedValues, propertySchema, property.multiSelect);
    }
    return propertySchema;
}
/**
 * Method prepares schema object for passed SAPUI5 event.
 *
 * @param {UI5Property} property SAPUI5 event.
 * @returns {SchemaDefinition} JSON schema.
 */
function prepareEvent(property) {
    return prepareSchemaProperty(property, ux_specification_types_2.MacrosPropertyType.Event, 'string');
}
/**
 * Method prepares schema object for passed SAPUI5 aggregation.
 *
 * @param aggregation SAPUI5 aggregation.
 * @param defaultAggregation The default aggregation name for the parent class.
 * @returns JSON schema.
 */
function prepareAggregations(aggregation, defaultAggregation) {
    const schemaTypes = getTypes(aggregation.type);
    const isViewNode = (defaultAggregation && aggregation.name === defaultAggregation) ||
        exports.PROPERTY_SEMANTICS.AGGREGATIONS.some((pattern) => pattern.test(aggregation.name));
    return {
        type: 'object',
        additionalProperties: schemaTypes.length ? schemaTypes[0] : { anyOf: schemaTypes },
        isViewNode,
        metadata: {
            path: [],
            type: ux_specification_types_2.MacrosPropertyType.Aggregation,
            aggregationCardinality: aggregation.cardinality === '0..1'
                ? ux_specification_types_2.MacrosAggregatioCardinality.Single
                : ux_specification_types_2.MacrosAggregatioCardinality.Multiple
        }
    };
}
/**
 * Method applies available macros namespaces for storing inside root schema metadata.
 *
 * @param {MacrosAPI} api SAPUI5 "sap.fe.macros" api.
 * @param {SchemaDefinition} schema JSON schema for "sap.fe.macros" api.
 */
function applyNamespaces(api, schema) {
    for (const symbol of api.symbols) {
        if (symbol.kind === types_1.SYMBOL_KIND_NAMESPACE && symbol.name.startsWith('sap.fe.macros')) {
            schema.metadata.namespaces.push(symbol.name);
        }
    }
}
/**
 * Collects metadata (properties and aggregations) from a class symbol and all of its base classes by walking up the inheritance chain.
 *
 * @param {ClassSymbol} symbol The class symbol whose metadata should be retrieved.
 * @param {ClassSymbol[]} allSymbols A list of all class symbols, used to resolve the full inheritance chain.
 * @returns {{ properties: UI5Property[], aggregations: UI5Aggregation[] }}
 *          An object containing merged properties and aggregations accumulated from
 *          the class and its inheritance hierarchy.
 */
function getMetadata(symbol, allSymbols) {
    const result = {
        properties: [],
        aggregations: []
    };
    // variable is used to prevent infinite loops
    const visited = new Set();
    let currentSymbol = symbol;
    while (currentSymbol && !visited.has(currentSymbol.name)) {
        visited.add(currentSymbol.name);
        const { properties = [], aggregations = [] } = currentSymbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY] ?? {};
        // Add properties without duplicates
        for (const property of properties) {
            if (!result.properties.some((existingProperty) => existingProperty.name === property.name)) {
                result.properties.push(property);
            }
        }
        // Add aggregations without duplicates
        for (const aggregation of aggregations) {
            if (!result.aggregations.some((existingAggregation) => existingAggregation.name === aggregation.name)) {
                result.aggregations.push(aggregation);
            }
        }
        // Go to next base class in inheritance chain
        currentSymbol = currentSymbol.extends ? allSymbols.find((s) => s.name === currentSymbol.extends) : undefined;
    }
    return result;
}
/**
 * Method generates generic schema for passed "sap.fe.macros" api.
 *
 * @param {MacrosAPI} api SAPUI5 "sap.fe.macros" api.
 * @returns {SchemaDefinition} JSON schema for "sap.fe.macros" api.
 */
function generateSchema(api) {
    // Apply corrections for macros API - there is some missing information in api.json
    (0, corrections_1.applyCorrections)(api);
    const schema = getRootSchema();
    const { definitions } = schema;
    // Handle classes
    const classSymbols = api.symbols.filter((symbol) => symbol.kind === types_1.SYMBOL_KIND_CLASS);
    for (const symbol of classSymbols) {
        const definition = prepareDefinition(ux_specification_types_2.MacrosPropertyType.Control, symbol.description, symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY]?.defaultAggregation, symbol.name);
        definitions[symbol.name] = definition;
        const events = symbol.events || [];
        const { properties, aggregations } = getMetadata(symbol, classSymbols);
        // Handle properties
        for (const property of properties) {
            definition.properties[property.name] = prepareProperty(property);
        }
        // Handle aggregations
        const defaultAggregation = symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY]?.defaultAggregation;
        for (const aggregation of aggregations) {
            definition.properties[aggregation.name] = prepareAggregations(aggregation, defaultAggregation);
        }
        // Handle events
        for (const event of events) {
            definition.properties[event.name] = prepareEvent(event);
        }
    }
    // Handle namespaces
    applyNamespaces(api, schema);
    // Handle typedefs
    const typedefSymbols = api.symbols.filter((symbol) => symbol.kind === types_1.SYMBOL_KIND_TYPEDEF);
    for (const symbol of typedefSymbols) {
        const definition = prepareDefinition(ux_specification_types_2.MacrosPropertyType.Control, symbol.description, symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY]?.defaultAggregation, symbol.name);
        definitions[symbol.name] = definition;
        const properties = symbol.properties || [];
        for (const property of properties) {
            definition.properties[property.name] = prepareProperty(property);
        }
    }
    return schema;
}
//# sourceMappingURL=schema.js.map