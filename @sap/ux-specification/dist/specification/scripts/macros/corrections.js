"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.macrosCorrection = exports.MACROS_ENUM_ENTRIES_MAP = void 0;
exports.getEnumEntriesFromMap = getEnumEntriesFromMap;
exports.applyCorrections = applyCorrections;
const types_1 = require("./types");
const ux_specification_types_1 = require("@sap/ux-specification-types");
/**
 * Map defining enum entries for macro controls and their properties.
 *
 * Structure:
 * - First key: control name
 * - Second key: property name
 * - Value: describing dependent values and enum entries
 */
exports.MACROS_ENUM_ENTRIES_MAP = {
    'sap.fe.macros.richtexteditor.ButtonGroup': {
        buttons: {
            dependentProperty: 'name',
            values: {
                'font-style': ['bold', 'italic', 'underline', 'strikethrough'],
                font: ['fontfamily', 'fontsize', 'forecolor', 'backcolor'],
                clipboard: ['cut', 'copy', 'paste'],
                structure: ['bullist', 'numlist', 'outdent', 'indent'],
                undo: ['undo', 'redo'],
                insert: ['image', 'emoticons'],
                link: ['link', 'unlink'],
                'text-align': ['alignleft', 'aligncenter', 'alignright', 'alignjustify'],
                table: ['table'],
                styleselect: ['styleselect']
            }
        }
    }
};
/**
 * Returns the enum entries for a given control and property.
 * If a dependent value is provided and exists in the map, only the enum entries
 * associated with that dependent value are returned.
 * Otherwise, all enum entries for the property are returned as a flat array.
 *
 * @param control - The macro control class name
 * @param property - The property name of the control
 * @param dependentValue - Optional value of the dependent property
 * @returns An array of enum entry strings, or `undefined` if the control or property is not found
 */
function getEnumEntriesFromMap(control, property, dependentValue) {
    const controlEntry = exports.MACROS_ENUM_ENTRIES_MAP[control];
    const propertyEntry = controlEntry?.[property];
    if (!propertyEntry) {
        return;
    }
    const values = propertyEntry.values;
    if (dependentValue && values[dependentValue]) {
        // Return specific entries matching value of dependent property
        return values[dependentValue];
    }
    // Merge and return all entries
    const result = [];
    for (const name in values) {
        result.push(...values[name]);
    }
    return result;
}
const creationModeProperty = {
    name: 'creationMode',
    bindable: true,
    description: '<p>A set of options that can be configured.</p>',
    group: 'Misc',
    methods: [],
    type: 'sap.fe.macros.table.TableCreationOptions',
    visibility: types_1.UI5Visibility.public,
    defaultValue: ''
};
exports.macrosCorrection = {
    'sap.fe.macros.Page': {
        defaultAggregation: 'items'
    },
    'sap.fe.macros.Table': {
        defaultAggregation: 'columns',
        removeAggregations: ['noData', 'creationMode'],
        properties: [creationModeProperty]
    },
    'sap.fe.macros.table.Table': {
        removeAggregations: ['noData', 'creationMode'],
        properties: [creationModeProperty]
    },
    'sap.fe.macros.table.Column': {
        removeAggregations: ['exportSettings']
    },
    'sap.fe.macros.TreeTable': {
        removeAggregations: ['noData', 'creationMode'],
        properties: [{ ...creationModeProperty, type: 'sap.fe.macros.table.TreeTableCreationOptions' }]
    },
    'sap.fe.macros.table.TreeTable': {
        removeAggregations: ['noData', 'creationMode'],
        properties: [{ ...creationModeProperty, type: 'sap.fe.macros.table.TreeTableCreationOptions' }]
    },
    'sap.fe.macros.ActionGroup': {
        defaultAggregation: 'actions',
        aggregations: [
            {
                name: 'actions',
                singularName: 'action',
                type: 'sap.fe.macros.table.Action',
                cardinality: '0..n',
                visibility: types_1.UI5Visibility.public,
                description: 'Table actions',
                methods: [],
                linkEnabled: true
            }
        ],
        properties: [
            {
                defaultValue: '',
                description: 'The text that will be displayed for this action group',
                group: 'Misc',
                methods: [],
                name: 'text',
                types: [
                    {
                        value: 'string'
                    }
                ],
                visibility: types_1.UI5Visibility.public
            },
            {
                defaultValue: '',
                description: 'Defines where this action group should be placed relative to the defined anchor',
                group: 'Misc',
                methods: [],
                name: 'placement',
                types: [
                    {
                        value: 'string'
                    }
                ],
                visibility: types_1.UI5Visibility.public
            },
            {
                defaultValue: '',
                description: 'Reference to the key of another action or action group already displayed in the toolbar to properly place this one',
                group: 'Misc',
                methods: [],
                name: 'anchor',
                types: [
                    {
                        value: 'string'
                    }
                ],
                visibility: types_1.UI5Visibility.public
            },
            {
                defaultValue: '',
                description: 'Unique identifier of the ActionGroup',
                group: 'Misc',
                methods: [],
                name: 'key',
                types: [
                    {
                        value: 'string'
                    }
                ],
                visibility: types_1.UI5Visibility.public
            }
        ],
        metadata: {
            kind: types_1.SYMBOL_KIND_CLASS,
            name: 'sap.fe.macros.ActionGroup',
            basename: 'ActionGroup',
            resource: '',
            module: '',
            static: true,
            visibility: types_1.UI5Visibility.public,
            description: 'Definition of a actions group to be used inside the table toolbar',
            displayName: 'sap.fe.macros.ActionGroup',
            title: 'class sap.fe.macros.ActionGroup',
            subTitle: ''
        }
    },
    'sap.fe.macros.richtexteditor.ButtonGroup': {
        properties: [
            {
                name: 'visible',
                extend: true,
                // Correct from string to boolean while fix is not applied from fe team
                type: 'boolean'
            },
            {
                name: 'name',
                extend: true,
                type: 'string',
                disabled: true
            },
            {
                name: 'id',
                extend: true,
                type: 'string',
                visibility: types_1.UI5Visibility.hidden
            }
        ]
    },
    'sap.fe.macros.controls.BaseAction': {
        properties: [
            {
                name: 'text',
                extend: true,
                // Correct from any to string while fix is not applied from fe team
                type: 'string'
            },
            {
                name: 'visible',
                extend: true,
                // Correct from any to boolean while fix is not applied from fe team
                type: 'boolean'
            }
        ]
    },
    'sap.fe.macros.RichTextEditor': {
        properties: [
            {
                name: 'required',
                extend: true,
                // Correct from any to boolean while fix is not applied from fe team
                type: 'boolean'
            },
            {
                name: 'value',
                extend: true,
                // Correct from any to string while fix is not applied from fe team
                type: 'string'
            }
        ]
    }
};
const placementEnum = [ux_specification_types_1.v4.Placement.After, ux_specification_types_1.v4.Placement.Before];
const enumsEntries = {
    'sap.fe.macros.FilterField': {
        placement: {
            options: placementEnum
        }
    },
    'sap.fe.macros.table.Column': {
        placement: {
            options: placementEnum
        }
    },
    'sap.fe.macros.Table': {
        variantManagement: {
            options: ['None', 'Page', 'Control']
        }
    },
    'sap.fe.macros.richtexteditor.ButtonGroup': {
        buttons: {
            options: getEnumEntriesFromMap('sap.fe.macros.richtexteditor.ButtonGroup', 'buttons'),
            multiSelect: true
        },
        name: {
            options: Object.keys(exports.MACROS_ENUM_ENTRIES_MAP['sap.fe.macros.richtexteditor.ButtonGroup'].buttons.values)
        }
    }
};
/**
 * Method returns node with "properties" and "aggregation" for passed symbol.
 * If node does not contains "properties" or "aggregation", then it prepares empty objects.
 *
 * @param {ClassSymbol | TypedefSymbol} symbol Symbol from SAPUI5 api.
 * @returns {APICorrection} Correction object which contains "properties" and "aggregation" properties.
 */
function getNode(symbol) {
    let node;
    if (symbol.kind === types_1.SYMBOL_KIND_CLASS) {
        if (!symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY]) {
            symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY] = {
                aggregations: [],
                properties: [],
                stereotype: ''
            };
        }
        node = symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY];
    }
    else {
        node = symbol;
    }
    if (!node.aggregations) {
        node.aggregations = [];
    }
    if (!node.properties) {
        node.properties = [];
    }
    return node;
}
/**
 * Method applies correction for passed node.
 *
 * @param {APICorrection} node Original node to update with corrections.
 * @param {APICorrection} correction Correction to apply - "properties" and "aggregation" are applied.
 */
function applyCorrectionForNode(node, correction) {
    for (const aggregation of correction.aggregations || []) {
        if (!node.aggregations.some((existingAggregation) => existingAggregation.name === aggregation.name)) {
            node.aggregations.push(aggregation);
        }
    }
    for (const aggregation of correction.removeAggregations || []) {
        const aggregationIndex = node.aggregations.findIndex((existingAggregation) => existingAggregation.name === aggregation);
        if (aggregationIndex !== -1) {
            node.aggregations.splice(aggregationIndex, 1);
        }
    }
    for (const property of correction.properties || []) {
        const propertyIndex = node.properties.findIndex((existingProperty) => existingProperty.name === property.name);
        // add missing properties or extend existing
        if (propertyIndex !== -1 && 'extend' in property && property.extend) {
            node.properties[propertyIndex] = {
                ...node.properties[propertyIndex],
                ...property
            };
        }
        else if (propertyIndex === -1) {
            node.properties.push(property);
        }
    }
    if (node.defaultAggregation !== correction.defaultAggregation) {
        node.defaultAggregation = correction.defaultAggregation;
    }
}
/**
 * Method applies correction for enum entries.
 *
 * @param {MacrosAPI} api "sap.fe.macros" api object.
 */
function applyCorrectionForEnums(api) {
    for (const name in enumsEntries) {
        const symbol = api.symbols.find((apiSymbol) => apiSymbol.name === name);
        if (![types_1.SYMBOL_KIND_TYPEDEF, types_1.SYMBOL_KIND_CLASS].includes(symbol?.kind)) {
            continue;
        }
        const properties = enumsEntries[name];
        for (const name in properties) {
            let property;
            if (symbol?.kind === types_1.SYMBOL_KIND_TYPEDEF) {
                property = symbol.properties.find((ui5Property) => ui5Property.name === name);
            }
            else if (symbol?.kind === types_1.SYMBOL_KIND_CLASS) {
                property = symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY].properties.find((ui5Property) => ui5Property.name === name);
            }
            if (property) {
                property.allowedValues = properties[name].options;
                property.multiSelect = properties[name].multiSelect;
            }
        }
    }
}
/**
 * Method applies correction for missing id property in controls.
 *
 * @param {MacrosAPI} api "sap.fe.macros" api object.
 */
function applyCorrectionForIds(api) {
    for (const symbol of api.symbols) {
        if (symbol.kind !== types_1.SYMBOL_KIND_CLASS) {
            continue;
        }
        if (!symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY].properties) {
            symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY].properties = [];
        }
        const properties = symbol[types_1.CLASS_SYMBOL_METADATA_PROPERTY].properties;
        const id = properties.find((property) => property.name === 'id');
        const description = 'Unique id of control';
        if (!id) {
            properties.push({
                name: 'id',
                bindable: true,
                description,
                group: 'Misc',
                methods: [],
                type: 'string',
                visibility: types_1.UI5Visibility.public,
                defaultValue: ''
            });
        }
        else if (!id.description) {
            id.description = description;
        }
    }
}
/**
 * Method applies missing aggregations and properties for "sap.fe.macros" api object.
 * We notice that api object of "sap.fe.macros" is missing some aggregation and properties information
 * - in result we apply missing data on top of received api object.
 *
 * @param {MacrosAPI} api "sap.fe.macros" api object.
 */
function applyCorrections(api) {
    // Apply missing classes
    for (const name in exports.macrosCorrection) {
        const symbol = api.symbols.find((apiSymbol) => apiSymbol.name === name);
        if (!symbol && exports.macrosCorrection[name].metadata) {
            api.symbols.push({
                ...exports.macrosCorrection[name].metadata
            });
        }
    }
    // Apply missing aggregation and properties
    for (const symbol of api.symbols) {
        const correction = exports.macrosCorrection[symbol.name];
        if (!correction || symbol.kind === types_1.SYMBOL_KIND_NAMESPACE) {
            continue;
        }
        const node = getNode(symbol);
        applyCorrectionForNode(node, correction);
    }
    // Enum entries
    applyCorrectionForEnums(api);
    // Missing ids in api.json
    applyCorrectionForIds(api);
}
//# sourceMappingURL=corrections.js.map