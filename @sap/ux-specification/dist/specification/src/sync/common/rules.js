"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LR_POPIN_LAYOUT_FOR_NON_RESPONSIVE_TABLE = exports.LR_ANALYTICAL_CONFIGURATION_FOR_NON_ANALYTICAL_TABLE = exports.LR_CREATION_MODE_FOR_NON_CREATION_DIALOG_MODE = exports.LR_CREATION_MODE_FOR_NON_TREE_TABLE = exports.LR_CREATION_MODE_FOR_ANALYTICAL_TABLE = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const v4_1 = require("@sap/ux-specification-types/src/v4");
const generate_1 = require("./generate");
const i18next_1 = __importDefault(require("i18next"));
const listReport_1 = require("../v4/generate/list-report/listReport");
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the Table class in src/sync/v4/export/controls/Table.ts.
 * The creationMode property is now hidden via `@hide(when(custom.table.type, 'AnalyticalTable'))`.
 */
exports.LR_CREATION_MODE_FOR_ANALYTICAL_TABLE = {
    name: ux_specification_types_1.RuleName.LRCreationModeForAnalyticalTable,
    match: (context) => {
        return getTableType(context) === v4_1.TableTypeV4.AnalyticalTable;
    },
    process: (context) => {
        const { schema, parameters: { tableDefinition } } = context;
        const tableSettings = getTableSettings(context);
        if (tableSettings.creationMode) {
            for (const prop of Object.keys(schema.properties)) {
                processNotAllowedProperty(context, 'PROPERTY_NOT_ALLOWED_FOR_TABLE_TYPE', prop, ux_specification_types_1.PropertyName.creationMode, true);
            }
        }
        else {
            delete tableDefinition.properties[ux_specification_types_1.PropertyName.creationMode];
        }
    }
};
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the TableCreationModeLR class in src/sync/v4/export/controls/Table.ts.
 * The createInPlace and isCreateEnabled properties are now hidden via decorators.
 */
exports.LR_CREATION_MODE_FOR_NON_TREE_TABLE = {
    name: ux_specification_types_1.RuleName.LRCreationModeForNonTreeTable,
    match: (context) => {
        return getTableType(context) !== v4_1.TableTypeV4.TreeTable;
    },
    process: (context) => {
        processNotAllowedProperty(context, 'PROPERTY_NOT_ALLOWED_FOR_NON_TREE_TABLE_TYPE', ux_specification_types_1.PropertyName.createInPlace, ux_specification_types_1.PropertyName.createInPlace, true);
        processNotAllowedProperty(context, 'PROPERTY_NOT_ALLOWED_FOR_NON_TREE_TABLE_TYPE', ux_specification_types_1.PropertyName.isCreateEnabled, ux_specification_types_1.PropertyName.isCreateEnabled, true);
    }
};
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the TableCreationModeLR class in src/sync/v4/export/controls/Table.ts.
 * The creationFields property is now hidden via `@hide(notWhen(custom.table.creationMode.name, 'CreationDialog'))`.
 */
exports.LR_CREATION_MODE_FOR_NON_CREATION_DIALOG_MODE = {
    name: ux_specification_types_1.RuleName.LRCreationModeForNonCreationDialogMode,
    match: (context) => {
        const tableSettings = getTableSettings(context);
        return tableSettings?.creationMode?.name !== ux_specification_types_1.v4.TableCreationModeType.CreationDialog;
    },
    process: (context) => {
        processNotAllowedProperty(context, 'ENTITY_IS_ALLOWED_ONLY_FOR_CREATION_DIALOG_MODE', ux_specification_types_1.PropertyName.creationFields);
    }
};
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the Table class in src/sync/v4/export/controls/Table.ts.
 * The analyticalConfiguration property is now hidden via `@hide(notWhen(custom.table.type, 'AnalyticalTable'))`.
 */
exports.LR_ANALYTICAL_CONFIGURATION_FOR_NON_ANALYTICAL_TABLE = {
    name: ux_specification_types_1.RuleName.LRAnalyticalConfigurationForNonAnalyticalTable,
    match: (context) => {
        return getTableType(context) !== v4_1.TableTypeV4.AnalyticalTable;
    },
    process: (context) => {
        const { schema, parameters: { tableDefinition } } = context;
        const tableSettings = getTableSettings(context);
        if (tableSettings?.analyticalConfiguration) {
            for (const prop of Object.keys(schema.properties)) {
                processNotAllowedProperty(context, 'PROPERTY_NOT_ALLOWED_FOR_TABLE_TYPE', prop, ux_specification_types_1.PropertyName.analyticalConfiguration, true);
            }
        }
        else {
            delete tableDefinition.properties[ux_specification_types_1.PropertyName.analyticalConfiguration];
        }
    }
};
/**
 * @deprecated This rule has been replaced by decorator-based approach using @hide and @message decorators
 * on the Table class in src/sync/v4/export/controls/Table.ts.
 * The popinLayout property is now hidden via `@hide(notWhen(custom.table.type, 'ResponsiveTable'))`.
 */
exports.LR_POPIN_LAYOUT_FOR_NON_RESPONSIVE_TABLE = {
    name: ux_specification_types_1.RuleName.LRPopinLayoutForNonResponsiveTable,
    match: (context) => {
        return getTableType(context) !== v4_1.TableTypeV4.ResponsiveTable;
    },
    process: (context) => {
        const { schema, parameters: { tableDefinition } } = context;
        const tableSettings = getTableSettings(context);
        if (tableSettings?.popinLayout) {
            if (schema) {
                processNotAllowedProperty(context, 'PROPERTY_NOT_ALLOWED_FOR_TABLE_TYPE', ux_specification_types_1.PropertyName.popinLayout, ux_specification_types_1.PropertyName.popinLayout, true);
            }
        }
        else {
            delete tableDefinition.properties['popinLayout'];
        }
    }
};
/**
 * Retrieves the table settings from the provided context.
 *
 * @param {RuleContext} context - The context object containing page information and parameters.
 * @returns {any} The table settings extracted from the context, or undefined if not found.
 */
function getTableSettings(context) {
    const { page, parameters: { lineItemRef } } = context;
    const tableSettings = page.options?.settings?.controlConfiguration?.[lineItemRef ?? '']?.[ux_specification_types_1.PropertyName.tableSettings];
    return tableSettings;
}
/**
 * Retrieves the table type based on the provided context.
 *
 * @param {RuleContext} context - The context information containing page details and parameters.
 * @returns {string} The determined table type. Defaults to `TableTypeV4.ResponsiveTable` if not explicitly set.
 */
function getTableType(context) {
    const tableSettings = getTableSettings(context);
    const tableType = tableSettings?.type ?? listReport_1.DEFAULT_TABLE_TYPE;
    return tableType;
}
/**
 * Processes a property that is not allowed in the given context by either
 * adding a message to the schema definition or deleting the property from the schema.
 *
 * @param {RuleContext} context - The context providing information such as the schema and settings.
 * @param {string} message - The message used for notifying or logging about the invalid property.
 * @param {string | PropertyName} [propertyName] - The name of the property being processed.
 * @param {string | PropertyName} [propertyToDisplay] - The name of the property to display in messages. Defaults to `propertyName` if not provided.
 * @param {boolean} [usePropertyName] - Whether to use propertyName for i18n message resolution.
 */
function processNotAllowedProperty(context, message, propertyName, propertyToDisplay, usePropertyName = false) {
    const { schema } = context;
    const tableSettings = getTableSettings(context);
    if (tableSettings?.creationMode?.[propertyName] !== undefined ||
        tableSettings?.analyticalConfiguration?.[propertyName] !== undefined ||
        (propertyName === ux_specification_types_1.PropertyName.popinLayout && tableSettings?.[propertyName] !== undefined)) {
        const def = (schema.properties && Object.keys(schema.properties).length > 0 ? schema?.properties?.[propertyName] : schema);
        if (def) {
            if (usePropertyName) {
                (0, generate_1.addMessageToSchema)(def, {
                    text: i18next_1.default.t(message, {
                        propertyName: propertyToDisplay ?? propertyName,
                        tableType: getTableType(context)
                    }),
                    deletable: true
                });
            }
            else {
                (0, generate_1.addMessageToSchema)(def, {
                    text: i18next_1.default.t(message, {
                        entityName: propertyToDisplay ?? propertyName,
                        tableType: getTableType(context)
                    }),
                    deletable: true
                });
            }
        }
    }
    else {
        delete schema.properties[propertyName];
    }
}
//# sourceMappingURL=rules.js.map