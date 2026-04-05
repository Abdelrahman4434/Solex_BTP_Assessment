"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeModel = void 0;
const node_path_1 = require("node:path");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const ObjectAggregation_1 = require("./ObjectAggregation");
const SectionsAggregation_1 = require("./sections/SectionsAggregation");
const table_1 = require("./table");
const ArrayAggregation_1 = require("./ArrayAggregation");
const AggregationValidator_1 = require("./AggregationValidator");
const types_1 = require("./types");
const fields_1 = require("./fields");
const utils_1 = require("./utils");
const actions_1 = require("./actions");
const i18next_1 = __importDefault(require("i18next"));
const filter_fields_1 = require("./filter-fields");
const visual_filters_1 = require("./visual-filters");
const sections_1 = require("./sections");
const ToolbarAggregation_1 = require("./table/ToolbarAggregation");
const RootAggregation_1 = require("./RootAggregation");
const ChartAggregation_1 = require("./chart/ChartAggregation");
const views_1 = require("./views");
const MacrosRoot_1 = require("./macros/MacrosRoot");
const additionalObjects_1 = require("./additionalObjects");
const SectionsObjectAggregation_1 = require("./sections/SectionsObjectAggregation");
const annotations_1 = require("../annotations");
const JSON_SCHEMA_TYPE_ARRAY = 'array';
const JSON_SCHEMA_TYPE_OBJECT = 'object';
const MACROS_TABLE_DEFINITION_NAME = 'sap.fe.macros.Table';
const TABLE_PATHS = [
    ['table', 'quickVariantSelection', 'variants'],
    ['table', 'quickVariantSelectionX', 'variants']
];
const isTableNode = (name, path, parentAggregation) => {
    let parent = parentAggregation;
    const loops = name.split('/').length - 1;
    let i = 0;
    while (i < loops) {
        parent = parent?.parent;
        i++;
    }
    return path.endsWith(`table/${name}`) || (parent instanceof views_1.ViewAggregation && path.endsWith(`/${name}`));
};
const isCustomSectionAction = (path, parentAggregation, schema) => {
    const additionalProperties = schema?.additionalProperties;
    const hasCustomSectionActionRef = additionalProperties?.$ref?.includes('CustomSectionActionOP');
    return (!!hasCustomSectionActionRef && !!parentAggregation?.name && path.endsWith(`${parentAggregation.name}/actions`));
};
/**
 * Method checks if passed aggregation instance of passed macros control name.
 *
 * @param controlName SAPUI5 macros control name.
 * @param aggregation Aggregation object.
 * @returns Is passed aggregation instance of passed SAPUI5 control.
 */
const isInstanceOfUI5Control = (controlName, aggregation) => {
    return aggregation?.schema?.metadata?.controlName === controlName;
};
/**
 * Method checks if passed schema is instance of passed macros control name.
 *
 * @param controlName SAPUI5 macros control name.
 * @param schema Schema node to check.
 * @returns Is passed aggregation instance of passed SAPUI5 control.
 */
const isSchemaOfUI5Control = (controlName, schema) => {
    return schema?.metadata?.controlName === controlName;
};
const isSupportedUI5Aggregation = (controlName, schema) => {
    const additionalProperties = schema?.additionalProperties;
    return (schema?.metadata?.type === 'Aggregation' &&
        typeof additionalProperties === 'object' &&
        additionalProperties.$ref === `#/definitions/${controlName}`);
};
// Array of type specific aggregation resolution depending on path and context
const AGGREGATIONS_CONDITIONS = [
    {
        aggregation: SectionsObjectAggregation_1.SectionsObjectAggregation,
        fn: (path, parentAggregation, schema) => {
            const additionalProperties = schema?.additionalProperties;
            const hasCustomSectionsRef = additionalProperties?.$ref?.includes('ObjectPageCustomSectionFragment');
            return path === 'sections' && !!hasCustomSectionsRef;
        }
    },
    {
        aggregation: SectionsAggregation_1.SectionsAggregation,
        fn: (path) => path === 'sections'
    },
    {
        aggregation: table_1.ColumnsAggregation,
        fn: (path, parentAggregation, schema) => isTableNode('columns', path, parentAggregation) ||
            (isSupportedUI5Aggregation('sap.fe.macros.table.Column', schema) &&
                isInstanceOfUI5Control(MACROS_TABLE_DEFINITION_NAME, parentAggregation))
    },
    {
        aggregation: ToolbarAggregation_1.ToolbarAggregation,
        fn: (path, parentAggregation) => isTableNode('toolBar', path, parentAggregation)
    },
    {
        aggregation: fields_1.FieldsAggregation,
        fn: (path) => path.endsWith('form/fields')
    },
    {
        aggregation: additionalObjects_1.AdditionalObjectsAggregation,
        fn: (path) => path.endsWith('actions/RelatedApps/additionalSemanticObjects')
    },
    {
        aggregation: fields_1.ConnectedFieldsAggregation,
        fn: (path, parentAggregation, schema) => schema?.dataType === 'ConnectedFields'
    },
    {
        aggregation: actions_1.ActionsAggregation,
        fn: (path, parentAggregation, schema) => isCustomSectionAction(path, parentAggregation, schema) ||
            ['form/actions', 'header/actions', 'footer/actions'].some((entry) => path.endsWith(entry)) ||
            isTableNode('toolBar/actions', path, parentAggregation) ||
            (isSupportedUI5Aggregation('sap.fe.macros.table.Action', schema) &&
                isInstanceOfUI5Control(MACROS_TABLE_DEFINITION_NAME, parentAggregation))
    },
    {
        aggregation: filter_fields_1.FilterFieldsAggregation,
        fn: (path, parentAggregation) => path.endsWith('filterBar/selectionFields') ||
            (path.endsWith('/filterFields') && isInstanceOfUI5Control('sap.fe.macros.FilterBar', parentAggregation))
    },
    {
        aggregation: visual_filters_1.VisualFiltersAggregation,
        fn: (path) => path.endsWith('filterBar/visualFilters')
    },
    {
        aggregation: table_1.TableAggregation,
        fn: (path, parentAggregation, schema) => path === 'table' ||
            (path.endsWith('/table') && parentAggregation instanceof sections_1.SectionAggregation) ||
            isSchemaOfUI5Control(MACROS_TABLE_DEFINITION_NAME, schema)
    },
    {
        aggregation: sections_1.HeaderSectionsAggregation,
        fn: (path) => path.endsWith('header/sections')
    },
    {
        aggregation: RootAggregation_1.RootAggregation,
        fn: (path) => path === ''
    },
    {
        aggregation: ChartAggregation_1.ChartAggregation,
        fn: (path) => path === 'chart'
    },
    {
        aggregation: views_1.ViewsAggregation,
        fn: (path) => path.endsWith('table/views')
    },
    {
        aggregation: sections_1.SubSectionsAggregation,
        fn: (path, parentAggregation) => path.endsWith('/subsections') && parentAggregation instanceof sections_1.SectionAggregation
    }
];
// Schema properties which should be taken from deeper level as priority
// It is for case when one node have multiple $ref levels and multiple same 'property' keys persists,
// then default behavior is that most top properties have higher priority, but for some cases we need take it from deeper level.
const SCHEMA_DEEP_LEVEL_PROPS = ['annotationPath'];
/**
 * Page/application schema parsing model.
 * `TreeModel` is responsible for:
 * - Holding metadata about a page (type, schema, annotations, etc.).
 * - Storing both current (`data`) and original (`originalData`) page definitions.
 * - Managing the root aggregation tree (`root`) for further parsing and validation.
 * - Supporting schema traversal, validation, and exclusion rules.
 */
class TreeModel {
    /**
     * Creates an instance of TreeModel.
     *
     * @param name Page name.
     * @param page Page configuration object(generated from specification).
     * @param schema Page configuration schema(generated from specification).
     * @param annotations Page annotations.
     * @param pageType Page type.
     */
    constructor(name, page, schema, annotations, pageType) {
        this.root = this.prepareAggregation();
        // Definitions - used to look up when going through recursion
        this.definitions = {};
        // List of properties to exclude from traversing
        this.excludeProperties = ['$schema'];
        this.validator = new AggregationValidator_1.AggregationValidator();
        this.pendingNodes = [];
        // Separated and ordered schema parse methods
        this.schemaParsers = [
            // Prehandle schema - check for "const" property and create "enum" if it is missing in schema
            (params) => {
                // Apply single enum in case if there is "const" defined - it should enable handling for dropdown/combobox
                if (params.currentNode.const && !params.currentNode.enum) {
                    params.currentNode.enum = [params.currentNode.const];
                }
                return true;
            },
            // Validate schema node
            (params) => {
                const { currentNode } = params;
                if (currentNode.hidden) {
                    return false;
                }
                return true;
            },
            // Create property or aggregation objects
            (params) => {
                const { currentNode, name } = params;
                if (name === undefined) {
                    // Aggregation or property should not be created but continue parse schema
                    return true;
                }
                if (this.isAggregation(currentNode)) {
                    params.path = params.path.concat([
                        params.aggregation.type === types_1.AggregationType.Array ? Number.parseInt(name, 10) : name
                    ]);
                    const displayName = currentNode.displayName || name;
                    const type = currentNode.type === JSON_SCHEMA_TYPE_OBJECT ? types_1.AggregationType.Object : types_1.AggregationType.Array;
                    params.aggregation = params.aggregation.addAggregation(displayName, params.aggregation.aggregations[displayName] ||
                        this.prepareAggregation(params.path, currentNode, params.aggregation, type), params.path);
                    if (params.aggregation.type === types_1.AggregationType.Array) {
                        // Creation form schema data
                        params.aggregation.schema = currentNode;
                        this.updateFormSchema(params.aggregation);
                        this.copySchemaProperties(params.aggregation, currentNode, name);
                        // Do not continue parsing - arrays will be handled when data will be presented
                        return false;
                    }
                }
                else if (this.isProperty(currentNode)) {
                    this.updatePropertyFromSchema(name, params.aggregation, currentNode);
                }
                return true;
            },
            // Add annotation node if one exists
            (params) => {
                const { aggregation, currentNode } = params;
                let currentAnnotationNode = params.currentAnnotationNode;
                if (aggregation instanceof MacrosRoot_1.MacrosRootAggregation) {
                    currentAnnotationNode = this.originalData.annotations.nodes.find((node) => {
                        return 'nodeType' in node && node.nodeType === 'macros';
                    });
                    aggregation.annotationNodeId = currentAnnotationNode?.nodeId;
                }
                if (currentNode.metadata?.internalId && !currentAnnotationNode) {
                    let availableNodes = this.originalData.annotations.nodes;
                    availableNodes = availableNodes.filter((node) => {
                        return 'nodeType' in node && node.nodeType === 'macros';
                    });
                    currentAnnotationNode = params.currentAnnotationNode = this.getContextForMacrosNode(currentNode.metadata.internalId, availableNodes);
                }
                // Add annotation if one exists
                if (!currentNode.$ref && currentNode.annotationPath) {
                    // $ref nodes are processed later, so we need to skip them
                    let annotationNodes = [];
                    if (currentAnnotationNode && !(0, annotations_1.isTooComplex)(currentAnnotationNode)) {
                        annotationNodes = currentAnnotationNode.subnodes;
                    }
                    const matchedNode = (0, utils_1.getMatchingNode)(currentNode.annotationPath, this.originalData.annotations.nodes, annotationNodes, currentAnnotationNode?.annotationPath, aggregation.order);
                    if (matchedNode) {
                        params.currentAnnotationNode = matchedNode;
                        aggregation.annotationNodeId = matchedNode.nodeId;
                    }
                }
                return true;
            },
            // Handle schema references with recursion
            (params) => {
                for (const entry of Array.from(this.schemaReferenceParsers)) {
                    if (entry[1](params)) {
                        break;
                    }
                }
                return true;
            },
            // Handle some simple properties from schema definition - we need copy them as they can be defined in multiple places inside of schema object like:
            (params) => {
                const { aggregation, currentNode, name } = params;
                this.copySchemaProperties(aggregation, currentNode, name);
                return true;
            },
            // Handle additional properties
            (params) => {
                const { aggregation, currentNode, currentAnnotationNode, name, path, context } = params;
                if (typeof currentNode.additionalProperties === 'object') {
                    // Probably there would be other cases
                    aggregation.additionalProperties = this.prepareAggregation();
                    this.parseSchema(aggregation.additionalProperties, currentNode.additionalProperties, currentAnnotationNode, name, path, context);
                    if (this.isSchemaAtomic(currentNode.additionalProperties)) {
                        this.updateFormSchema(aggregation, name);
                    }
                }
                return true;
            },
            // Handle "patternProperties"
            (params) => {
                const { aggregation, currentNode, currentAnnotationNode, name, path, context } = params;
                if (typeof currentNode.patternProperties === 'object') {
                    // Adapted to current schema, but in thery it could be more complex scenario
                    aggregation.pattern = Object.keys(currentNode.patternProperties)[0];
                    currentNode.additionalProperties = currentNode.patternProperties[aggregation.pattern];
                    // Probably there would be other cases
                    aggregation.additionalProperties = this.prepareAggregation();
                    this.parseSchema(aggregation.additionalProperties, currentNode.patternProperties[aggregation.pattern], currentAnnotationNode, name, path, context);
                    // Creation form schema data
                    this.updateFormSchema(aggregation, name);
                }
                return true;
            },
            // Handle "required" properties
            (params) => {
                const { aggregation, currentNode } = params;
                if (currentNode.required && Array.isArray(currentNode.required)) {
                    for (const name of currentNode.required) {
                        const property = aggregation.properties[name];
                        if (property) {
                            property.required = true;
                        }
                    }
                }
                return true;
            },
            // Handle union types
            (params) => {
                const { aggregation, currentNode, name } = params;
                if (currentNode.displayName && name && currentNode.type === 'object') {
                    aggregation.addUnionName(currentNode.displayName, name);
                }
                return true;
            },
            // Handle "metadata" properties - currently used for building blocks
            (params) => {
                const { name = '', aggregation, currentNode, context } = params;
                const { metadata } = currentNode;
                const property = aggregation.properties[name];
                if (context.filePath && metadata) {
                    const { position } = metadata;
                    const locations = [];
                    if (position) {
                        locations.push({
                            fileUri: (0, node_path_1.join)(ux_specification_types_1.DirName.Webapp, context.filePath),
                            range: {
                                start: {
                                    line: position.startLine - 1,
                                    character: position.startColumn - 1
                                },
                                end: {
                                    line: position.endLine - 1,
                                    character: position.endColumn
                                }
                            },
                            relative: true,
                            type: ux_specification_types_1.ArtifactType.XMLProperty
                        });
                    }
                    if (property) {
                        property.locations = locations;
                    }
                    else if (aggregation.name === name) {
                        aggregation.locations = locations;
                    }
                }
                return true;
            },
            // Handle addable tables
            (params) => {
                const { path, name = '', aggregation } = params;
                if (path && TABLE_PATHS.some((targetPath) => (0, utils_1.isArrayEndsWith)(path, targetPath))) {
                    // Creation form schema data
                    this.updateFormSchema(aggregation, name);
                }
                return true;
            }
        ];
        // Map to handle reference properties of single schema definition
        // Currently supported - '$ref', 'anyOf', 'properties', 'items'
        this.schemaReferenceParsers = new Map([
            [
                '$ref',
                (params) => {
                    const { aggregation, currentNode, currentAnnotationNode, name, path, context } = params;
                    if (!currentNode.$ref) {
                        return false;
                    }
                    const data = this.definitions[currentNode.$ref] ? { ...this.definitions[currentNode.$ref] } : {};
                    for (const key of Object.keys(currentNode)) {
                        const isDeepLevelProp = SCHEMA_DEEP_LEVEL_PROPS.includes(key);
                        if (key !== '$ref' && !(isDeepLevelProp && data[key])) {
                            data[key] = currentNode[key];
                        }
                    }
                    this.parseSchema(aggregation, data, currentAnnotationNode, name, path, context);
                    return true;
                }
            ],
            [
                'anyOf',
                (params) => {
                    const { aggregation, currentNode, currentAnnotationNode, name, path, context } = params;
                    if (!currentNode.anyOf) {
                        return false;
                    }
                    for (const anyProperty of currentNode.anyOf) {
                        this.parseSchema(aggregation, anyProperty, currentAnnotationNode, name, path, context);
                    }
                    // Create properties variations for 'anyOf'
                    // Any of as array or object
                    if (Object.keys(currentNode.anyOf).length > 1 ||
                        (Array.isArray(currentNode.anyOf) && currentNode.anyOf.length > 1)) {
                        this.createAnyOfPropertiesVariations(currentNode.anyOf, params);
                    }
                    return true;
                }
            ],
            [
                'properties',
                (params) => {
                    const { aggregation, currentNode, currentAnnotationNode, path, context } = params;
                    if (!currentNode.properties) {
                        return false;
                    }
                    const propertyNames = Object.keys(currentNode.properties).filter((prop) => !this.excludeProperties.includes(prop));
                    const properties = currentNode.properties;
                    const hasPropertyIndex = propertyNames.some((propertyName) => currentNode.properties && currentNode.properties[propertyName]?.['propertyIndex'] !== undefined);
                    if (properties && propertyNames.length && hasPropertyIndex) {
                        // Sort properties - if schema have mark
                        propertyNames.sort(this.propertySorter.bind(this, properties));
                    }
                    for (const property of propertyNames) {
                        this.parseSchema(aggregation, currentNode.properties[property], currentAnnotationNode, property, path, context);
                    }
                    return true;
                }
            ],
            [
                'items',
                (params) => {
                    const { aggregation, currentNode, currentAnnotationNode, path, context } = params;
                    if (!currentNode.items) {
                        return false;
                    }
                    if (Array.isArray(currentNode.items)) {
                        // Maybe something different, when we will have more examples - currently adapted for available scenarios
                        // It can be enhanced with additional logic, but wait for more real examples
                        for (let i = 0; i < currentNode.items.length; i++) {
                            this.parseSchema(aggregation, currentNode.items[i], currentAnnotationNode, i.toString(), path, context);
                        }
                    }
                    else {
                        this.parseSchema(aggregation, currentNode.items, currentAnnotationNode, undefined, path, context);
                    }
                    return true;
                }
            ]
        ]);
        this.name = name;
        this.pageType = pageType;
        this.data = page;
        this.originalData = {
            page: structuredClone(this.data),
            annotations,
            schema
        };
        this.schema = JSON.parse(schema);
        this.init(annotations);
    }
    /**
     * Initialize model data - parse schema and current page object values.
     *
     * @param annotations Page annotations.
     */
    init(annotations) {
        // Store definitions with full path
        if (this.schema.definitions) {
            for (const name in this.schema.definitions) {
                this.definitions[`#/definitions/${name}`] = this.schema.definitions[name];
            }
        }
        // Populate tree
        const schema = JSON.parse(this.originalData.schema);
        this.root = this.prepareAggregation(undefined, {
            properties: schema.properties
        });
        this.parseSchema(this.root, schema, { subnodes: annotations.nodes }, undefined, [], {
            filePath: this.data.$filePath
        });
        // Populate additional/customized aggregations/sections
        this.readAdvancedPropertiesData(this.root, this.data);
        const parser = {
            definitions: this.schema.definitions,
            parse: this.parseSchema.bind(this),
            annotations
        };
        // Populate values
        this.root.updatePropertiesValues(this.data, this.data, this.pageType, [], annotations, parser);
        // Validate data
        this.validator.validate(this.root, this.data);
        // Update view nodes
        this.updateViewNodes(this.root);
        this.pendingNodes = [];
        // Post model initialization
        this.afterInit(annotations);
    }
    /**
     * Updates or creates an property in ObjectAggregation based on a JSON Schema node.
     *
     * @param name - The property name being updated.
     * @param aggregation - The aggregation object that holds property definitions.
     * @param currentNode - The JSON Schema node describing the property.
     */
    updatePropertyFromSchema(name, aggregation, currentNode) {
        if (!(name in aggregation.properties)) {
            // Simple property
            aggregation.properties[name] = aggregation.addProperty(name, currentNode);
            aggregation.properties[name].freeText = this.isFreeText(currentNode);
        }
        else if (currentNode.enum) {
            // Enum property - merge values from various variations
            let enumEntries = aggregation.properties[name].schema.enum;
            // Merge enum entries
            enumEntries = enumEntries ? enumEntries.concat(currentNode.enum) : currentNode.enum;
            // Unique enum entries
            aggregation.properties[name].schema.enum = enumEntries
                ? enumEntries.filter((item, pos) => enumEntries && enumEntries.indexOf(item) === pos)
                : [];
        }
    }
    /**
     * Method returns context of passed macros node ID used in getMatchingNode.
     *
     * @param currentMacrosNodeId Current macros node id.
     * @param annotationNodes All annotation nodes.
     * @returns Matched node context.
     */
    getContextForMacrosNode(currentMacrosNodeId, annotationNodes) {
        for (const i in annotationNodes) {
            const contextNode = annotationNodes[i];
            const subNodes = 'subnodes' in contextNode ? contextNode.subnodes : [];
            for (const j in subNodes) {
                if (subNodes[j].macroNodeId === currentMacrosNodeId) {
                    return contextNode;
                }
            }
        }
        return undefined;
    }
    /**
     * Method creates properties variants by handling array "anyOf" schema property.
     *
     * @param anyOf Array value of "anyOf" schema property.
     * @param params Schema parse params.
     */
    createAnyOfPropertiesVariations(anyOf, params) {
        const { aggregation, currentAnnotationNode, name, path, context } = params;
        for (const anyProperty of anyOf) {
            let tempAggregation = this.prepareAggregation();
            this.parseSchema(tempAggregation, anyProperty, currentAnnotationNode, name, path, context);
            let displayName = name;
            if (name && !tempAggregation.aggregations[name]) {
                const aggregationKeys = Object.keys(tempAggregation.aggregations);
                displayName = aggregationKeys.length > 0 ? aggregationKeys[0] : name;
            }
            let anyAggregation = aggregation;
            if (displayName) {
                anyAggregation = aggregation.aggregations[displayName];
                tempAggregation = tempAggregation.aggregations[displayName];
            }
            if (tempAggregation && anyAggregation) {
                anyAggregation.variants.push({
                    aggregations: tempAggregation.aggregations,
                    properties: tempAggregation.properties
                });
            }
        }
        // Check for free text
        if (name && aggregation.properties[name]) {
            aggregation.properties[name].freeText = this.isFreeText(anyOf);
        }
    }
    /**
     * Method uses recursion to parse schema and populate model with aggregations and properties for tree structure.
     *
     * @param aggregation Current aggregation.
     * @param currentNode Current schema node.
     * @param currentAnnotationNode Current annotation node.
     * @param name Name of aggregation.
     * @param path Array containing path to current aggregation.
     * @param context Object containing Parser context.
     */
    parseSchema(aggregation, currentNode, currentAnnotationNode, name, path, context) {
        const params = {
            aggregation,
            currentNode,
            currentAnnotationNode,
            name,
            path,
            context
        };
        for (const parse of this.schemaParsers) {
            const continueParsing = parse.call(this, params);
            if (!continueParsing) {
                break;
            }
        }
    }
    /**
     * Handle and copy some simple properties from schema definition - we need copy them as they can be defined in multiple places inside of schema object like:
     * 1. Outside of reference. Example - "name": { "$ref": "....", "description": "..." }
     * 2. Inside of reference.
     *
     * @param aggregation Current aggregation.
     * @param currentNode Current schema node.
     * @param name Name of aggregation.
     */
    copySchemaProperties(aggregation, currentNode, name) {
        if (name) {
            if (aggregation.properties[name]) {
                this.storeInnerProperties(aggregation.properties[name], [
                    'pattern',
                    'description',
                    'i18nClassification',
                    'artifactType',
                    'minimum',
                    'displayName',
                    'messages'
                ], currentNode);
            }
            else {
                const targetAggregation = aggregation.aggregations[name] || aggregation;
                this.storeInnerProperties(targetAggregation, ['description', 'isViewNode', 'artifactType', 'messages'], currentNode);
            }
        }
    }
    /**
     * Method checs is json schema node should be used for property.
     *
     * @param schema Schema node to check.
     * @returns Schema node should be used for property.
     */
    isProperty(schema) {
        return !schema.$ref && schema.type !== 'object' && schema.type !== 'array' && !schema.anyOf;
    }
    /**
     * Method checs is json schema node should be used for aggregation.
     *
     * @param schema Schema node to check.
     * @returns Schema node should be used for aggregation.
     */
    isAggregation(schema) {
        return (schema.type === JSON_SCHEMA_TYPE_OBJECT || schema.type === JSON_SCHEMA_TYPE_ARRAY) && !schema.$ref;
    }
    /**
     * Handles dynamic `additionalProperties` (or `additionalItems`) for an aggregation.
     * If `data` contains keys that are not part of the aggregation's defined
     * properties or child aggregations, this method tries to resolve them
     * against the schema's `additionalProperties` definition and creates
     * corresponding child aggregations dynamically.
     *
     * @param aggregation - Current aggregation node being processed.
     * @param data - Page data object containing potential additional properties.
     */
    handleAdditionalProperties(aggregation, data) {
        const knownKeys = [...Object.keys(aggregation.properties), ...Object.keys(aggregation.aggregations)];
        for (const name of Object.keys(data)) {
            if (!knownKeys.includes(name) && aggregation.additionalProperties) {
                const additionalProps = aggregation.schema
                    ? aggregation.schema.additionalProperties || aggregation.schema.additionalItems
                    : undefined;
                if (typeof additionalProps === 'object') {
                    this.parseSchema(aggregation, additionalProps, undefined, name, aggregation.path, {});
                    const child = aggregation.aggregations[name];
                    if (child?.isViewNode && child.description) {
                        // For dynamic aggregations, fallback to object key instead of static description
                        delete child.description;
                    }
                }
            }
        }
    }
    /**
     * Method uses recursion to populate aggregations/properties of aggregation by looping through 'additionalProperties' from schema.
     *
     * @param aggregation ObjectAggregation which would be populated.
     * @param data Page data - object contains latest page values.
     */
    readAdvancedPropertiesData(aggregation, data) {
        // Handle dynamic additional properties
        this.handleAdditionalProperties(aggregation, data);
        // Array handling
        if (aggregation && aggregation.type === types_1.AggregationType.Array && aggregation.schema) {
            const currentNode = aggregation.schema;
            const item = this.getSchemaArrayItem(currentNode);
            if (item && Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    this.parseSchema(aggregation, item, undefined, i.toString(), aggregation.path, {});
                }
            }
        }
        // Go through standard aggregation with recursion
        for (const rootName in aggregation.aggregations) {
            const names = aggregation.aggregations[rootName].union?.originalNames || [rootName];
            for (const name of names) {
                if (typeof data === 'object' && name in data) {
                    this.readAdvancedPropertiesData(aggregation.aggregations[rootName], data[name]);
                }
            }
        }
    }
    /**
     * Method uses recursion to populate 'aggregation' with values from page object.
     *
     * @param aggregation ObjectAggregation which would be populated.
     * @param data Page data - object contains latest page values.
     */
    readPropertiesData(aggregation, data) {
        const propertyKeys = Object.keys(aggregation.properties);
        for (const name in data) {
            if (propertyKeys.includes(name)) {
                aggregation.properties[name].value = data[name];
            }
        }
        // Go with recursion
        for (const name in aggregation.aggregations) {
            if (name in data) {
                this.readPropertiesData(aggregation.aggregations[name], data[name]);
            }
        }
    }
    /**
     * Method prepares simple aggregation object.
     *
     * @param path Path for aggregation.
     * @param schema Schema segment for new aggregation.
     * @param parentAggregation Parent aggregation.
     * @param type Aggregation type.
     * @returns Predefined aggregation object.
     */
    prepareAggregation(path, schema, parentAggregation, type = types_1.AggregationType.Object) {
        const fullPath = (path || []).join('/');
        // Check paths for non generic aggregations
        for (const aggregationCondition of AGGREGATIONS_CONDITIONS) {
            if (aggregationCondition.fn(fullPath, parentAggregation, schema)) {
                return new aggregationCondition.aggregation(undefined, schema);
            }
        }
        // Use parent aggregation to create child
        let aggregation;
        if (parentAggregation?.childClass) {
            aggregation = new parentAggregation.childClass(undefined, schema);
        }
        else {
            // Default generic aggregation
            const aggregationClass = type === types_1.AggregationType.Object ? ObjectAggregation_1.ObjectAggregation : ArrayAggregation_1.ArrayAggregation;
            aggregation = new aggregationClass(undefined, schema);
        }
        // Check additional properties
        if (path && TABLE_PATHS.some((targetPath) => (0, utils_1.isArrayEndsWith)(path, targetPath))) {
            aggregation.isTable = true;
        }
        return aggregation;
    }
    /**
     * Method to check if free text entry should be enabled for property.
     *
     * @param schema Schema node to check.
     * @returns Free text entry allowed.
     */
    isFreeText(schema) {
        const validate = (node) => {
            return node.type === 'string' && !node.enum;
        };
        return Array.isArray(schema) ? schema.some(validate) : validate(schema);
    }
    /**
     * Generic method receives array of properties and copies received properties from 'currentNode' into target 'obj'.
     *
     * @param targetObj Target object for store.
     * @param props Properties name to copy from 'currentNode' into 'targetObj'.
     * @param currentNode JSON Schema node.
     */
    storeInnerProperties(targetObj, props, currentNode) {
        for (const property of props) {
            if (currentNode[property] !== undefined || (property === 'i18nClassification' && property in currentNode)) {
                if (!this.isCorrectSchemaProperty(property, currentNode[property])) {
                    // schema property is not correct - throw error and do not store value, because it can give unpredictable behavior
                    this.logger.error(i18next_1.default.t('SCHEMA_PARSING_ERROR_UNEXPECTED_VALUE', {
                        name: property,
                        value: JSON.stringify(currentNode[property])
                    }));
                    return;
                }
                targetObj[property] = currentNode[property];
            }
        }
    }
    /**
     * Method returns schema item definition for array schema resolution.
     *
     * @param currentNode Current schema node.
     * @returns Array's schema definition or undefined if it does not exist.
     */
    getSchemaArrayItem(currentNode) {
        const item = !Array.isArray(currentNode.items) ? currentNode.items : currentNode.additionalItems;
        return typeof item === 'object' ? item : undefined;
    }
    /**
     * Method updates 'formSchema' property for array aggregation.
     *
     * @param aggregation Aggregation to handle.
     */
    updateArrayFormSchema(aggregation) {
        // Creation form currently supported by arrays
        const item = this.getSchemaArrayItem(aggregation.schema || {});
        if (typeof item === 'object') {
            const formSchema = this.prepareAggregation();
            aggregation.isAtomic = !!item.type;
            this.parseSchema(formSchema, item, undefined, aggregation.isAtomic ? '' : undefined, aggregation.path, {});
            if (Object.keys(formSchema.properties).length) {
                aggregation.formSchema = formSchema;
            }
        }
        if (!aggregation.formSchema || !Object.keys(aggregation.formSchema.properties).length) {
            // Array is not appendable
            aggregation.schemaCreationForms = [];
        }
    }
    /**
     * Method updates aggregation 'formSchema' property with schema object which will represent creation form.
     *
     * @param aggregation Aggregation to handle.
     * @param name Aggregation name in 'additionalProperties'.
     */
    updateFormSchema(aggregation, name) {
        if (aggregation instanceof ArrayAggregation_1.ArrayAggregation) {
            this.updateArrayFormSchema(aggregation);
        }
        else if (name && aggregation.additionalProperties?.aggregations[name]) {
            const formSchema = this.prepareAggregation();
            this.parseSchema(formSchema, aggregation.additionalProperties.aggregations[name].schema || {}, undefined, undefined, aggregation.path, {});
            if (Object.keys(formSchema.properties).length) {
                aggregation.formSchema = formSchema;
            }
        }
        else if (typeof aggregation.schema?.additionalProperties === 'object' &&
            this.isSchemaAtomic(aggregation.schema?.additionalProperties)) {
            aggregation.isAtomic = true;
            aggregation.isTable = true;
            const formSchema = this.prepareAggregation();
            this.parseSchema(formSchema, aggregation.schema.additionalProperties, undefined, '', aggregation.path, {});
            if (Object.keys(formSchema.properties).length) {
                aggregation.formSchema = formSchema;
            }
        }
    }
    /**
     * Method goes with recursion and marks all visible nodes for outline.
     *
     * @param aggregation Aggregation object.
     * @returns Returns visbility of aggregation.
     */
    updateViewNodes(aggregation) {
        for (const name in aggregation.aggregations) {
            const childAggregation = aggregation.aggregations[name];
            const isViewNode = this.updateViewNodes(childAggregation);
            if (isViewNode && !aggregation.isViewNode) {
                aggregation.isViewNode = true;
            }
        }
        return aggregation.isViewNode || false;
    }
    /**
     * Method validates property from JSON schema.
     * That method helps to avoid issues, when we are receiving incorrect schema.
     *
     * @param name Schema property name.
     * @param value Value of schema property.
     * @returns Is schema property valid.
     */
    isCorrectSchemaProperty(name, value) {
        let valid = true;
        switch (name) {
            case 'description':
            case 'pattern':
            case 'i18nClassification': {
                // Optional string - otherwise unexpected value
                valid = value === undefined || typeof value === 'string';
                break;
            }
            case 'isViewNode': {
                // Optional boolean - otherwise unexpected value
                valid = value === undefined || typeof value === 'boolean';
                break;
            }
        }
        return valid;
    }
    /**
     * Method to sort schema properties.
     * Spec provides custom property 'propertyIndex', which should be used for sorting.
     *
     * @param properties Object with properties.
     * @param name1 First property name.
     * @param name2 Second property name.
     * @returns Sort result.
     */
    propertySorter(properties, name1, name2) {
        const order1 = properties[name1].propertyIndex !== undefined ? properties[name1].propertyIndex : 0;
        const order2 = properties[name2].propertyIndex !== undefined ? properties[name2].propertyIndex : 0;
        if (order1 === order2) {
            return 0;
        }
        return order1 > order2 ? 1 : -1;
    }
    /**
     * Method handles post initialization.
     * Currently it is used for FPM custom pages to add additional root 'macros' node.
     *
     * @param annotations Page annotations.
     */
    afterInit(annotations) {
        if (this.pageType === ux_specification_types_1.PageType.FPMCustomPage) {
            const macros = new MacrosRoot_1.MacrosRootAggregation(undefined, undefined);
            // set file path
            if (typeof this.data.$filePath === 'string') {
                macros.setFilePath(this.data.$filePath);
                macros.annotationNodeId = annotations.nodes[0]?.nodeId;
            }
            macros.aggregations = this.root.aggregations;
            this.root.aggregations = {
                macros
            };
        }
    }
    /**
     * Method checks if passed schema is atomic type.
     * Atomic means that schema expects simple value as "string", "number" or "boolean".
     *
     * @param schema Schema to check.
     * @returns True if passed schema should be considered as atomic.
     */
    isSchemaAtomic(schema) {
        const atomicTypes = ['string', 'number', 'boolean'];
        return typeof schema === 'object' && typeof schema.type === 'string' && atomicTypes.includes(schema.type);
    }
}
exports.TreeModel = TreeModel;
//# sourceMappingURL=TreeModel.js.map