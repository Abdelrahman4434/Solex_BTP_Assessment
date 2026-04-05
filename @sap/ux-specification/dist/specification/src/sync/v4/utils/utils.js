"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUALIFIER_SEPARATOR = exports.FIELD_SEPARATOR = exports.DATA_FIELD_FOR_ACTION_GROUP = void 0;
exports.addExtensionToArray = addExtensionToArray;
exports.addEnumForProperties = addEnumForProperties;
exports.addCustomColumnDefinition = addCustomColumnDefinition;
exports.addActionRecordToSchema = addActionRecordToSchema;
exports.addGroupActionRecordToSchema = addGroupActionRecordToSchema;
exports.addLineItemActionDefinition = addLineItemActionDefinition;
exports.addLineItemRecordToSchema = addLineItemRecordToSchema;
exports.appendLineItemsToSchema = appendLineItemsToSchema;
exports.addLineItemsTypeToSchema = addLineItemsTypeToSchema;
exports.addFragmentEnumForAnchor = addFragmentEnumForAnchor;
exports.addEnumForActionAnchor = addEnumForActionAnchor;
exports.addEnumForEnableMassEdit = addEnumForEnableMassEdit;
exports.initializeCreationModeSchema = initializeCreationModeSchema;
exports.addOneOfForCreationFields = addOneOfForCreationFields;
exports.findPageV4 = findPageV4;
exports.alignSchemaWithTemplateType = alignSchemaWithTemplateType;
exports.addCustomActionDefinition = addCustomActionDefinition;
exports.addHeaderFooterCustomActionDefinition = addHeaderFooterCustomActionDefinition;
exports.parseDefinitionName = parseDefinitionName;
exports.getManifestPage = getManifestPage;
exports.getPageCustomExtensionFile = getPageCustomExtensionFile;
exports.getPageCustomViewFile = getPageCustomViewFile;
exports.addCustomSectionDefinition = addCustomSectionDefinition;
exports.addCustomFilterFieldDefinition = addCustomFilterFieldDefinition;
exports.importSingleActionSettingsOfReference = importSingleActionSettingsOfReference;
exports.importGroupActionSettingsOfReference = importGroupActionSettingsOfReference;
exports.importManifestBasedActionMenuSettingsOfReference = importManifestBasedActionMenuSettingsOfReference;
exports.importActionSettingsOfReference = importActionSettingsOfReference;
exports.addCustomFieldDefinition = addCustomFieldDefinition;
exports.addManifestPathsToProperties = addManifestPathsToProperties;
exports.getPageManifestPath = getPageManifestPath;
const utils_1 = require("../../common/utils");
const StableIdHelper_1 = require("./StableIdHelper");
const common_1 = require("../../common");
const i18next_1 = __importDefault(require("i18next"));
const __1 = require("../../..");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const path_1 = require("path");
const DataFieldStrategy_1 = require("../../common/DataFieldStrategy");
const utils_2 = require("../import/utils");
const src_1 = require("@sap/ux-specification-types/src");
const objectPage_1 = require("../generate/objectPage");
const v4controls = __importStar(require("../export/controls"));
const pages = __importStar(require("../export/pages"));
const application_1 = require("../application");
exports.DATA_FIELD_FOR_ACTION_GROUP = 'DataFieldForActionGroup';
const UI_ANNOTATION_KEY = 'UI';
exports.FIELD_SEPARATOR = '::';
exports.QUALIFIER_SEPARATOR = '#';
const ACTION_TYPE = 'actionType';
const strategyTypeMap = new Map([
    ['', "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */],
    ['DataFieldForAction', "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */],
    ['DataFieldForActionGroup', "com.sap.vocabularies.UI.v1.DataFieldForActionGroup" /* UIAnnotationTypes.DataFieldForActionGroup */],
    ['CustomMenu', ux_specification_types_1.CustomUIAnnotationTypes.ManifestBasedActionMenu]
]);
const OP_ACTION_MENU_DEFINITION = {
    actionMenuDefinitionName: ux_specification_types_1.DefinitionName.ObjectPageCustomActionMenu,
    actionMenuActionsDefinitionName: ux_specification_types_1.DefinitionName.ObjectPageCustomActionMenuActions
};
const OP_HEADER_ACTION_MENU_DEFINITION = {
    actionMenuDefinitionName: ux_specification_types_1.DefinitionName.ObjectPageHeaderCustomActionMenu,
    actionMenuActionsDefinitionName: ux_specification_types_1.DefinitionName.ObjectPageHeaderCustomActionMenuActions
};
const LR_ACTION_MENU_DEFINITION = {
    actionMenuDefinitionName: ux_specification_types_1.DefinitionName.CustomActionMenu,
    actionMenuActionsDefinitionName: ux_specification_types_1.DefinitionName.CustomActionMenuActions
};
const LR_ACTION_VIEW_MENU_DEFINITION = {
    actionMenuDefinitionName: ux_specification_types_1.DefinitionName.ViewCustomActionMenu,
    actionMenuActionsDefinitionName: ux_specification_types_1.DefinitionName.ViewCustomActionMenuActions
};
const actionMenuDefinitionNameMap = new Map([
    [ux_specification_types_1.DefinitionName.CustomTableActionOP, OP_ACTION_MENU_DEFINITION],
    [ux_specification_types_1.DefinitionName.CustomFormActionOP, OP_ACTION_MENU_DEFINITION],
    [ux_specification_types_1.DefinitionName.CustomTableAction, LR_ACTION_MENU_DEFINITION],
    [ux_specification_types_1.DefinitionName.CustomHeaderActionOP, OP_HEADER_ACTION_MENU_DEFINITION],
    [ux_specification_types_1.DefinitionName.ViewCustomAction, LR_ACTION_VIEW_MENU_DEFINITION]
]);
/**
 * Returns a comparator function to sort objects by their property index.
 *
 * @returns A comparator function that compares two objects based on their property index.
 */
function sortByPropertyIndex() {
    return ([_key1, value1], [_key2, value2]) => value1[ux_specification_types_1.SchemaTag.propertyIndex] - value2[ux_specification_types_1.SchemaTag.propertyIndex];
}
/**
 * Sort function for properties in schema definitions.
 *
 * @param definition - definition which contains list of properties, unsorted
 * @returns - list of properties, sorted by property index
 */
function sortPropertiesRecords(definition) {
    definition = typeof definition === 'object' ? definition : {};
    const unsortedObjArr = [...Object.entries(definition.properties)];
    if (!definition.properties || Object.keys(definition.properties).length === 0) {
        return unsortedObjArr;
    }
    return unsortedObjArr.sort(sortByPropertyIndex());
}
/**
 * Method receives extension object and returns title/text.
 *
 * @param extension - custom extension object from manifest.
 * @returns Title/text of custom extension.
 */
function getExtensionText(extension) {
    let text;
    if (typeof extension === 'object') {
        if ('header' in extension) {
            text = extension.header;
        }
        else if ('text' in extension) {
            text = extension.text;
        }
        else if ('title' in extension) {
            text = extension.title;
        }
        else if ('label' in extension) {
            text = extension.label;
        }
    }
    else if (typeof extension === 'string') {
        text = extension;
    }
    return text;
}
/**
 * Adds a custom extension to the right position of a sorted array.
 *
 * @param extension - custom extension
 * @param sortedExtensionsArray - array of all entries(annotation entries and extensions), to be enhanced
 * @param targetIndex - index of the anchor entry
 * @param extId - ID of the new custom extension
 * @param newExtensionReference - schema reference of the new extension
 * @param newExtensionReference.$ref - The reference to the schema definition for the new extension.
 * @param newExtensionReference.description - A description of the new extension.
 */
function addExtensionToSortedArray(extension, sortedExtensionsArray, targetIndex, extId, newExtensionReference) {
    const placement = extension.position?.placement || ux_specification_types_1.v4.Placement.After;
    if (placement === ux_specification_types_1.v4.Placement.Before) {
        sortedExtensionsArray.splice(targetIndex, 0, [extId, newExtensionReference]);
    }
    else {
        sortedExtensionsArray.splice(targetIndex + 1, 0, [extId, newExtensionReference]);
    }
}
/**
 * Adds remaining custom extensions that might self-reference and were not added in previous steps.
 *
 * @param {CustomExtensions} remainingExtensions - list of custom extensions that are left for post-processing
 * @param {string} extId - current id of remaining extensions
 * @param {CustomExtension} extension - current extension of remaining custom extensions
 * @param {[string, unknown]} sortedExtArray - sorted array of annotation-based extensions, to be updated
 * @param newCustomExt - description based on extension in manifest
 * @param newCustomExt.$ref - The reference to the schema definition for the new extension.
 * @param newCustomExt.description - A description of the new custom extension.
 * @param newCustomExt.keys - An array of key objects, each containing a name and value for the custom extension.
 */
function addRemainingTargetByBefore(remainingExtensions, extId, extension, sortedExtArray, newCustomExt) {
    const targetRemainingIndex = Object.entries(remainingExtensions)
        .filter(([key]) => key !== extId)
        .findIndex(([_key, entry]) => entry.position?.placement === 'Before' && entry.position?.anchor === extension.position?.anchor);
    if (targetRemainingIndex === -1) {
        sortedExtArray.splice(sortedExtArray.length, 0, [extId, newCustomExt]);
        delete remainingExtensions[extId];
    }
}
/**
 * Returns custom extension details like $ref, description, keys and action type.
 *
 * @param extension - custom extensions config
 * @param extensionDefinitionName - custom extension definition name, different in LR and OP
 * @param extId - custom extension id
 * @param actionType - action type
 * @returns Custom extension details
 */
function getExtensionDetails(extension, extensionDefinitionName, extId, actionType) {
    const refDefinition = extensionDefinitionName.includes(ux_specification_types_1.DefinitionName.ObjectPageCustomSectionFragment)
        ? `${extensionDefinitionName}<${extId}>`
        : extensionDefinitionName;
    const description = getExtensionText(extension);
    return {
        $ref: `${utils_1.DEFINITION_LINK_PREFIX}${refDefinition}`,
        description,
        keys: [{ name: ux_specification_types_1.SchemaKeyName.key, value: `${extId}` }],
        ...(actionType !== undefined && { actionType })
    };
}
/**
 * Post-processing of custom extensions that are left after the first loop of adding extensions, i.e. custom extensions referring to other custom extensions.
 *
 * @param {CustomExtensions} remainingExtensions - An object containing the remaining extensions to process.
 * @param {string} extensionDefinitionName - The name of the extension definition to refer to.
 * @param {[string, unknown][]} sortedExtArray - A sorted array of existing extensions represented as key-value pairs.
 * @param {ExtensionLogger} logger - The logger used for logging errors and warnings during the adjustment process.
 * @param {boolean} [forceAdd=false] - Flag indicating whether to force adding extensions even if proper anchor/placement is not found.
 */
function adjustCustomExtReferringToCustomExt(remainingExtensions, extensionDefinitionName, sortedExtArray, logger, forceAdd = false) {
    const initialRemaining = Object.entries(remainingExtensions).length;
    for (const extId of Object.keys(remainingExtensions)) {
        // make sure that we do not add the same extension twice
        const isAlreadyAdded = sortedExtArray.find((element) => element[0] === extId) !== undefined;
        if (isAlreadyAdded) {
            delete remainingExtensions[extId];
            continue;
        }
        const extension = remainingExtensions[extId];
        // Detect description based on extension in manifest
        const newCustomExt = getExtensionDetails(extension, extensionDefinitionName, extId, ux_specification_types_1.ActionType.Custom);
        if (extension.position?.anchor && extension.position?.placement) {
            const targetIndex = sortedExtArray.findIndex((element) => element[0] === extension.position.anchor);
            if (targetIndex > -1) {
                addExtensionToSortedArray(extension, sortedExtArray, targetIndex, extId, newCustomExt);
                delete remainingExtensions[extId];
            }
            else if (extId === extension.position.anchor ||
                Object.keys(remainingExtensions).indexOf(extension.position.anchor) === -1) {
                (0, __1.log)(logger, {
                    severity: "error" /* LogSeverity.Error */,
                    message: i18next_1.default.t('INVALIDANCHOR', { id: extId, anchor: extension.position.anchor }),
                    location: {
                        path: ux_specification_types_1.MANIFESTPATH,
                        range: [ux_specification_types_1.ManifestSection.ui5]
                    }
                });
                sortedExtArray.splice(sortedExtArray.length, 0, [extId, newCustomExt]);
                delete remainingExtensions[extId];
            }
            else if (forceAdd) {
                addRemainingTargetByBefore(remainingExtensions, extId, extension, sortedExtArray, newCustomExt);
            }
        }
        else if (forceAdd) {
            addExtensionToSortedArray(extension, sortedExtArray, sortedExtArray.length, extId, newCustomExt);
            delete remainingExtensions[extId];
        }
    }
    const endRemaining = Object.entries(remainingExtensions).length;
    if (endRemaining > 0 && initialRemaining !== endRemaining) {
        adjustCustomExtReferringToCustomExt(remainingExtensions, extensionDefinitionName, sortedExtArray, logger);
    }
    else if (endRemaining > 0) {
        adjustCustomExtReferringToCustomExt(remainingExtensions, extensionDefinitionName, sortedExtArray, logger, true);
    }
}
/**
 * Returns anchor for extension. Priority:
 * 1. 'anchor' property in extension;
 * 2. When 'anchor' is not defined in extension and does calculation based placement and current list of extension and annotation entries.
 *
 * @param extension - extension in manifest
 * @param sortedExtensionsArray - sorted array of annotation-based nodes, to be enhanced by extensions
 * @returns Anchor for extension
 */
function getExtensionAnchor(extension, sortedExtensionsArray) {
    // Default placement is After
    const placement = extension.position?.placement || ux_specification_types_1.v4.Placement.After;
    let anchor = extension.position?.anchor;
    if (!anchor) {
        // Simulate runtime behavior - if there no anchor, then logic uses first or last annotation node
        // In some cases last extension can be previously inserted extension - in such case we still need use annotation node
        const index = placement === ux_specification_types_1.v4.Placement.Before ? 0 : sortedExtensionsArray.length - 1;
        anchor = sortedExtensionsArray[index] ? sortedExtensionsArray[index][0] : undefined;
    }
    return anchor;
}
/**
 * Preprocesses and returns list of local extension ids that needs to be skipped from addition.
 *
 * @param {CustomExtensions} localExtensions - list of extensions in manifest
 * @param {[string, unknown][]} annotationEntries - sorted array of annotation-based nodes, to be enhanced by extensions
 * @returns List of local extensions that has no annotation based anchor
 */
function getLocalExtensionsToSkip(localExtensions, annotationEntries) {
    // collect local extensions that has no annotation based anchor
    const ignoredIds = [];
    for (const extensionId in localExtensions) {
        const anchor = localExtensions[extensionId].position?.anchor;
        const hasAnnotationAnchor = annotationEntries.some((annotationEntry) => annotationEntry[0] === anchor);
        if (anchor && !hasAnnotationAnchor) {
            ignoredIds.push(extensionId);
        }
    }
    return ignoredIds;
}
/**
 * Method returns position of passed extension using calculation for merged annotation nodes approach.
 * Currently is used for custom subsections - annotation merges subsection if there is no any child collecation facet.
 *
 * @param extension - custom extension
 * @param extensions - list of extensions in manifest
 * @param sortedExtensionsArray - array of all entries(annotation entries and extensions), to be enhanced
 * @returns Index of extension using merged annotation nodes approach.
 */
function getExtensionIndexByMergedApproach(extension, extensions, sortedExtensionsArray) {
    const placement = extension.position?.placement || ux_specification_types_1.v4.Placement.After;
    const originalAnchor = extension.position?.anchor;
    if (originalAnchor) {
        // Custom extension is anchored to any extension
        return sortedExtensionsArray.length;
    }
    // Custom extension is not anchored to any extension
    // Inner method to find next available index before or after annotation node
    const findNextIndex = (index, condition) => {
        for (const sortExtension of sortedExtensionsArray) {
            const innerExtension = extensions[sortExtension[0]];
            if (condition(innerExtension)) {
                // Condition is fulfilled - no need to increase index
                break;
            }
            // Increase index and check next ordered extension
            index++;
        }
        return index;
    };
    let index = 0;
    if (placement === ux_specification_types_1.v4.Placement.Before) {
        // Special case when no anchor but placement is "Before" - then rendered as very first
        // Find index before first annotation node
        index = findNextIndex(0, (innerExtension) => !innerExtension);
    }
    else {
        // Special case when no anchor but placement is "After" - then rendered right after last annotation node
        index = findNextIndex(-1, (innerExtension) => !!(innerExtension &&
            // Ignore extension without anchor but with position "Before"
            (innerExtension?.position?.anchor || innerExtension?.position?.placement !== ux_specification_types_1.v4.Placement.Before)));
    }
    return index > -1 ? index : 0;
}
/**
 *
 * @param extension - custom extension
 * @param extensions - list of extensions in manifest
 * @param sortedExtensionsArray - array of all entries(annotation entries and extensions), to be enhanced
 * @param anchor - target anchor to check
 * @param ignoreAnnotationAnchors - calculation should ignore anchors referenced to annotation nodes. Used when annotations sections are merged
 * @returns Index of extension using merged annotation nodes approach.
 */
function getExtensionIndex(extension, extensions, sortedExtensionsArray, anchor, ignoreAnnotationAnchors = false) {
    return !ignoreAnnotationAnchors
        ? sortedExtensionsArray.findIndex((element) => element[0] === anchor)
        : getExtensionIndexByMergedApproach(extension, extensions, sortedExtensionsArray);
}
/**
 * Error handler for invalid extensions.
 *
 * @param logger - logger for error messages
 * @param extensionId - ID of the extension
 * @param sortedExtensionsArray - sorted array of annotation-based nodes, to be enhanced by extensions
 * @param newExtensionReference - schema reference that had been prepared before
 * @param newExtensionReference.$ref - The reference to the schema definition for the new extension.
 * @param newExtensionReference.description - A description of the new extension.
 * @param newExtensionReference.keys - An array of key objects, each containing a name and value for the custom extension.
 * @param newExtensionReference.actionType - The action type associated with the new extension.
 * @param localExtensions - list of extensions for processing
 */
function handleInvalidExtension(logger, extensionId, sortedExtensionsArray, newExtensionReference, localExtensions) {
    (0, __1.log)(logger, {
        severity: "error" /* LogSeverity.Error */,
        message: i18next_1.default.t('INVALIDEXTENSION', { id: extensionId }),
        location: {
            path: ux_specification_types_1.MANIFESTPATH
        }
    });
    sortedExtensionsArray.push([extensionId, newExtensionReference]);
    delete localExtensions[extensionId];
}
/**
 * Adds extension entries to a sorted array of extensions based on specific rules,
 * including using anchors, callbacks, and custom templates.
 *
 * @param {CustomExtensions} extensions - The object containing custom extensions to be added to the array.
 * @param {ActionDetails[]} sortedExtensionsArray - The array of sorted extensions to which new extensions will be added.
 * @param {string} extensionDefinitionName - The definition name associated with the extensions being added.
 * @param {TemplatePropertyName | TemplatePropertyName[]} [templatePropertyName=TemplatePropertyName.Template] -
 * The property name(s) to check for existence in an extension; used to determine compatibility.
 * @param {ExtensionLogger} [logger] - An optional logger to handle logging of invalid extensions or other events.
 * @param {boolean} [ignoreAnnotationAnchors=false] - A flag to indicate whether extension anchors should be ignored.
 * @returns {ActionDetails[]} The updated sorted extensions array, including newly added and valid extensions.
 */
function addExtensionToArray(extensions, sortedExtensionsArray, extensionDefinitionName, templatePropertyName = ux_specification_types_1.TemplatePropertyName.Template, logger, ignoreAnnotationAnchors = false) {
    templatePropertyName = Array.isArray(templatePropertyName) ? templatePropertyName : [templatePropertyName];
    const annotationEntries = [...sortedExtensionsArray];
    const localExtensions = { ...extensions };
    const localExtensionsToSkip = getLocalExtensionsToSkip(localExtensions, annotationEntries);
    if (!localExtensions) {
        return [];
    }
    for (const extensionId of Object.keys(localExtensions)) {
        const extension = localExtensions[extensionId];
        if (localExtensionsToSkip?.includes(extensionId)) {
            continue;
        }
        const newExtensionReference = getExtensionDetails(extension, extensionDefinitionName, extensionId, ux_specification_types_1.ActionType.Custom);
        if (typeof extension !== 'object') {
            handleInvalidExtension(logger, extensionId, sortedExtensionsArray, newExtensionReference, localExtensions);
            continue;
        }
        const hasUnsupportedExtensionType = templatePropertyName.every((propertyName) => !(propertyName in extension));
        if (hasUnsupportedExtensionType) {
            // Skip regular entries(columns, actions, etc.)
            delete localExtensions[extensionId];
            continue;
        }
        const anchor = getExtensionAnchor(extension, annotationEntries);
        if (anchor) {
            const targetIndex = getExtensionIndex(extension, extensions, sortedExtensionsArray, anchor, ignoreAnnotationAnchors);
            if (targetIndex > -1) {
                addExtensionToSortedArray(extension, sortedExtensionsArray, targetIndex, extensionId, newExtensionReference);
                delete localExtensions[extensionId];
            }
        }
        else {
            // Empty array - no any anchor to reference to
            sortedExtensionsArray.push([extensionId, newExtensionReference]);
            delete localExtensions[extensionId];
        }
    }
    if (Object.keys(localExtensions).length > 0) {
        //Second loop is necessary for custom columns that refer to custom columns
        adjustCustomExtReferringToCustomExt(localExtensions, extensionDefinitionName, sortedExtensionsArray, logger, false);
    }
    return sortedExtensionsArray;
}
/**
 * Returns column names for enum.
 *
 * @param lineItems - current lineItems definition, with all records.
 * @returns Column names.
 */
function getColumnsEnum(lineItems) {
    const columnEnum = [];
    for (const key of Object.keys(lineItems)) {
        if (key.indexOf(exports.FIELD_SEPARATOR) > -1) {
            columnEnum.push(key.substring(key.indexOf(exports.FIELD_SEPARATOR) + 2));
        }
    }
    return columnEnum;
}
/**
 * Removes the field prefix from a given key based on the defined FIELD_SEPARATOR.
 *
 * @param {string} key - The string key that contains a prefix and a value separated by FIELD_SEPARATOR.
 * @returns {string} The key without its prefix, retaining the portion after the FIELD_SEPARATOR.
 */
function removeDataFieldPrefix(key) {
    const [_, ...value] = key.split(exports.FIELD_SEPARATOR);
    return value.join(exports.FIELD_SEPARATOR);
}
/**
 * Extracts and processes the columns defined in the given lineItems or Definition object,
 * returning an array of CreationFieldOneOfOption.
 *
 * @param {Definition} [columns] - An object containing column definitions where keys represent field identifiers
 *                                     and values are field metadata.
 * @returns {CreationFieldOneOfOption[]} An array of field options, each containing field-specific metadata.
 */
function getCreationFieldOptions(columns = {}) {
    const columnOneOfEnum = [];
    // Extracts fields from line item properties, excluding field groups (they are handled separately)
    for (const key of Object.keys(columns)) {
        const columnName = removeDataFieldPrefix(key);
        if (columnName && !columnName.includes(src_1.CreationFieldType.FieldGroup)) {
            columnOneOfEnum.push({
                const: columnName,
                description: columns[key].description,
                groupType: src_1.CreationFieldType.Field
            });
        }
    }
    return columnOneOfEnum;
}
/**
 * Extracts field group options from the annotations of the provided entity type.
 *
 * @param {EntityType} [entityType] The entity type which contains annotations from which field groups are derived.
 * @returns {CreationFieldOneOfOption[]} An array of field group options extracted from the entity type annotations.
 */
function getFieldGroupsFromEntityType(entityType) {
    const uiAnnotations = entityType?.annotations?.[UI_ANNOTATION_KEY] ?? {};
    const annotationKeys = Object.keys(uiAnnotations);
    const fieldGroupKeys = annotationKeys.filter((key) => key.startsWith(`${src_1.CreationFieldType.FieldGroup}${exports.QUALIFIER_SEPARATOR}`));
    return fieldGroupKeys.map((key) => {
        const { term, qualifier, Label: label } = uiAnnotations[key];
        const option = {
            const: `${term}${exports.FIELD_SEPARATOR}${qualifier}`,
            groupType: src_1.CreationFieldType.FieldGroup
        };
        if (label) {
            option.description = label;
        }
        return option;
    });
}
/**
 * Adds enum values to the properties definition of a custom column.
 *
 * @param lineItems - current lineItems definition, with all records.
 * @param customColumnDefinition - current custom column definition, in the app schema
 */
function addEnumForProperties(lineItems, customColumnDefinition) {
    customColumnDefinition.properties.properties.items['enum'] = getColumnsEnum(lineItems.properties);
}
/**
 * Adds the propertyIndex to each column and adds the enum values for properties of custom columns.
 *
 * @param sortedColumnsArray - sorted array of all columns
 * @param {Definition} appSchema - app specific JSON schema
 * @param lineItems - content of the line item annotation
 * @param {DefinitionName} customColumnDefinitionName - custom column definition name, distinguishes LR from OP
 */
function addColumnPropertyIndexAndEnum(sortedColumnsArray, appSchema, lineItems, customColumnDefinitionName = ux_specification_types_1.DefinitionName.CustomColumn) {
    if (customColumnDefinitionName === ux_specification_types_1.DefinitionName.CustomColumn ||
        customColumnDefinitionName.indexOf(ux_specification_types_1.DefinitionName.ViewCustomColumn) > -1) {
        //Table custom column: Add enum for properties
        const customColumnDefinition = appSchema.definitions[customColumnDefinitionName];
        addEnumForProperties(lineItems, customColumnDefinition);
    }
    //Add property index
    for (let index = 0; index < sortedColumnsArray.length; index++) {
        const column = sortedColumnsArray[index][1];
        column[ux_specification_types_1.SchemaTag.propertyIndex] = index;
    }
}
/**
 * Common function for enhancing the LineItems definition of app schema by custom columns.
 *
 * @param appSchema - app-specific JSON schema
 * @param v4Page - actual page in the manifest
 * @param logger - logger for error messages
 * @param customColumnDefinitionName - custom column definition name, distinguishes LR from OP
 * @param sectionId - identifier of the current object page section in schema
 * @param sectionIdInManifest - identifier of the current object page section in manifest
 */
function addCustomColumnDefinition(appSchema, v4Page, logger, customColumnDefinitionName = ux_specification_types_1.DefinitionName.CustomColumn, sectionId, sectionIdInManifest) {
    const lineItemId = sectionId || ux_specification_types_1.DefinitionName.LineItems;
    const lineItems = appSchema.definitions[lineItemId];
    if (!lineItems) {
        return;
    }
    //sort line items
    let sortedColumnsArray = sortPropertiesRecords(lineItems);
    const id = sectionIdInManifest ? sectionIdInManifest.replace(/::/g, '/') : `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
    const columns = v4Page.options?.settings?.controlConfiguration?.[id]?.['columns'];
    if (columns) {
        sortedColumnsArray = addExtensionToArray(columns, sortedColumnsArray, customColumnDefinitionName, undefined, logger);
    }
    //Adjust propertyIndex and add properties' enum
    addColumnPropertyIndexAndEnum(sortedColumnsArray, appSchema, lineItems, customColumnDefinitionName);
    const sortedColumnsAsObject = {};
    sortedColumnsArray.forEach(([key, value]) => (sortedColumnsAsObject[key] = value));
    appSchema.definitions[lineItemId].properties = sortedColumnsAsObject;
}
/**
 * Determines the appropriate action definition name based on the provided line item data and record type.
 *
 * @param {LineItemDataForSchema} data - The schema data for the line item, including its identifier and metadata.
 * @param {DataFieldAbstractTypes} lineItemRecord - The record representing a data field or action within the line item.
 * @param {boolean} isInnerAction - Whether the action belongs to the action group.
 * @returns {DefinitionName} The determined action definition name based on the provided data and group type.
 */
function determineActionDefinitionName(data, lineItemRecord, isInnerAction) {
    const isGrouped = lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForActionGroup" /* UIAnnotationTypes.DataFieldForActionGroup */;
    let actionDefinitionName;
    if (data.lineItemId.startsWith(ux_specification_types_1.DefinitionName.LineItemsOfView)) {
        actionDefinitionName = isGrouped
            ? ux_specification_types_1.DefinitionName.ViewToolBarActionGroup
            : isInnerAction
                ? ux_specification_types_1.DefinitionName.ViewToolBarActionBase
                : ux_specification_types_1.DefinitionName.ViewToolBarAction;
    }
    else if (data.lineItemId.startsWith(ux_specification_types_1.DefinitionName.LineItems)) {
        actionDefinitionName = isGrouped
            ? ux_specification_types_1.DefinitionName.ToolBarActionGroup
            : isInnerAction
                ? ux_specification_types_1.DefinitionName.ToolBarActionBase
                : ux_specification_types_1.DefinitionName.ToolBarAction;
    }
    else {
        actionDefinitionName = isGrouped
            ? ux_specification_types_1.DefinitionName.ObjectPageToolBarActionGroup
            : isInnerAction
                ? ux_specification_types_1.DefinitionName.ObjectPageToolBarActionBase
                : ux_specification_types_1.DefinitionName.ObjectPageToolBarAction;
    }
    return actionDefinitionName;
}
/**
 * Adds the schema tags 'keys' and 'target' to the schema definition of an action.
 *
 * @param {SchemaDefinition} actionDefinition - current action definition in the app schema
 * @param {DataFieldForActionAbstractTypes} lineItemRecord - actual record of the line item collection
 * @param {string} actionId - ID of the action, according to the lineItem definition
 */
function addTargetAndKeysOfAction(actionDefinition, lineItemRecord, actionId) {
    actionDefinition[ux_specification_types_1.SchemaTag.keys] = [];
    if (lineItemRecord[ux_specification_types_1.SchemaKeyName.semanticObject]) {
        actionDefinition[ux_specification_types_1.SchemaTag.keys].push({
            name: ux_specification_types_1.SchemaKeyName.semanticObject,
            value: lineItemRecord[ux_specification_types_1.SchemaKeyName.semanticObject]
        });
    }
    const { key, ns } = (0, common_1.getActionKey)(actionId, true);
    actionDefinition[ux_specification_types_1.SchemaTag.keys].push({ name: ux_specification_types_1.SchemaKeyName.action, value: key });
    if (ns) {
        actionDefinition[ux_specification_types_1.SchemaTag.target] = ns;
    }
}
/**
 * Adds an action record to a schema definition based on the provided line item definition parameters.
 * This involves defining action-specific properties, references, and metadata, and updating the schema accordingly.
 *
 * @param {AddLineItemDefinitionParams} lineItemDefinitionParams - The parameters describing the line item definition, including data, actions, path, record, and index.
 * @param {boolean} [createRef] - A flag indicating whether to create a reference for the action definition.
 * @param {boolean} isInnerAction - Whether the action belongs to the action group.
 */
function addActionRecordToSchema(lineItemDefinitionParams, createRef = true, isInnerAction = false) {
    const { lineItemData: data, actions: actionsDefinition, lineItemPath, lineItemRecord, index: recordIndex } = lineItemDefinitionParams;
    // Action but not inline action
    if (lineItemRecord.Determining === true) {
        return;
    }
    //no footer bar -> toolbar action
    const actionDefinitionName = determineActionDefinitionName(data, lineItemRecord, isInnerAction);
    const description = (0, common_1.getDataFieldDescription)(lineItemRecord, data.entityType);
    const prefix = lineItemRecord.$Type.split(`${ux_specification_types_1.UIVOCABULARY}.`)[1];
    const actionId = typeof lineItemRecord.Action === 'string' ? lineItemRecord.Action : lineItemRecord.Action['path'];
    const propertyKey = (0, StableIdHelper_1.replaceSpecialChars)(actionId);
    const actionDefinition = (actionsDefinition.properties[`${prefix}::${propertyKey}`] = {
        description
    });
    if (createRef) {
        actionDefinition.$ref = (0, common_1.getUniqueFacetDefinitionLink)(actionDefinitionName, (0, common_1.prepareRef)(propertyKey), data.appSchema, lineItemPath);
    }
    else {
        actionDefinition.properties = {};
        actionDefinition.type = 'object';
        actionDefinition.isViewNode = true;
    }
    actionDefinition[ux_specification_types_1.SchemaTag.propertyIndex] = recordIndex;
    actionDefinition[ux_specification_types_1.SchemaTag.dataType] = (0, common_1.determineDataType)(lineItemRecord);
    //keys
    addTargetAndKeysOfAction(actionDefinition, lineItemRecord, actionId);
    actionDefinition[ux_specification_types_1.SchemaTag.annotationType] = lineItemRecord.$Type;
    if (createRef) {
        // Using previously computed ref instead of generating new one to support action duplication
        const previouslyComputedRef = actionDefinition.$ref.replace(utils_1.DEFINITION_LINK_PREFIX, '');
        const action = (0, common_1.parseSchemaDefinition)(actionDefinitionName, previouslyComputedRef, data.appSchema, false);
        action[ux_specification_types_1.SchemaTag.annotationPath] = `${lineItemPath}/${recordIndex}`;
    }
    else {
        actionDefinition[ux_specification_types_1.SchemaTag.annotationPath] = `${lineItemPath}/${recordIndex}`;
    }
}
/**
 * Adds a group action record to the schema based on the given parameters. This involves determining
 * action definitions, creating or referencing schema properties, and setting metadata fields.
 *
 * @param {AddLineItemDefinitionParams} lineItemDefinitionParams - Parameters that define the line item, including data, record, path, index, and actions.
 * @param {boolean} [createRef] - Indicates whether to create a reference for the action definition or to use an inline object.
 */
function addGroupActionRecordToSchema(lineItemDefinitionParams, createRef = true) {
    const { lineItemData, lineItemRecord, lineItemPath, index, actions } = lineItemDefinitionParams;
    //no footer bar -> toolbar action
    const actionDefinitionName = determineActionDefinitionName(lineItemData, lineItemRecord);
    const propertyKey = (0, StableIdHelper_1.getStableIdPartFromDataField)(lineItemRecord);
    let actionDefinition = {};
    if (createRef) {
        actions.properties[`${propertyKey}`] = {
            $ref: (0, common_1.getFacetDefinitionLink)(actionDefinitionName, (0, common_1.prepareRef)(propertyKey))
        };
        actionDefinition = (0, common_1.parseSchemaDefinition)(actionDefinitionName, (0, common_1.prepareRef)(propertyKey), lineItemData.appSchema);
    }
    else {
        actions.properties[`${propertyKey}`] = actionDefinition;
    }
    if (!actionDefinition.properties) {
        actionDefinition.properties = {};
    }
    actionDefinition.description = (0, common_1.getDataFieldDescription)(lineItemRecord, lineItemData.entityType);
    actionDefinition.type = 'object';
    actionDefinition.isViewNode = true;
    actionDefinition[ux_specification_types_1.SchemaTag.propertyIndex] = index;
    actionDefinition[ux_specification_types_1.SchemaTag.dataType] = (0, common_1.determineDataType)(lineItemRecord);
    actionDefinition[ux_specification_types_1.SchemaTag.annotationPath] = `${lineItemPath}/${index}`;
    (lineItemRecord['Actions'] ?? []).forEach((action, index) => {
        const lineItemActionDefinitionParams = {
            ...lineItemDefinitionParams,
            lineItemRecord: action,
            lineItemPath: `${actionDefinition[ux_specification_types_1.SchemaTag.annotationPath]}/Actions`,
            actions: actionDefinition,
            index
        };
        addActionRecordToSchema(lineItemActionDefinitionParams, createRef, true);
    });
}
/**
 * Adds a line item action definition to the schema based on the provided parameters.
 * Handles determining which action to take based on specific conditions of the line item record.
 *
 * @param {AddLineItemDefinitionParams} data - An object containing the details of the line item record and the line item definition.
 * @param {object} data.lineItemRecord - The record of the line item to be processed, containing relevant properties.
 * @param {boolean} data.lineItemRecord.Inline - Indicates whether the line item is inline.
 * @param {boolean} data.lineItemRecord.Determining - Indicates if the line item is determining.
 * @param {boolean} data.lineItemDefinition - Indicates whether the line item definition is present.
 */
function addLineItemActionDefinition(data) {
    const { lineItemRecord, lineItemDefinition } = data;
    if (lineItemRecord.Inline !== true || lineItemRecord.Determining === true) {
        addActionRecordToSchema(data, !lineItemDefinition);
    }
    else {
        addLineItemRecordToSchema(data);
    }
}
/**
 * Adds a line item record to the provided schema based on the definition parameters.
 *
 * @param {AddLineItemDefinitionParams} lineItemDefinitionParams - The parameters defining the line item data, schema information, and record.
 */
function addLineItemRecordToSchema(lineItemDefinitionParams) {
    const { lineItemData, lineItemRecord, lineItemDefinition, lineItemPath, index, columnDefinitionName } = lineItemDefinitionParams;
    const columnDefinition = lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */
        ? `${columnDefinitionName}Action`
        : columnDefinitionName;
    const lineItemId = lineItemData.lineItemId;
    if (lineItemRecord['Target']?.['value']) {
        const regex = `@${(0, utils_1.findAlias)(ux_specification_types_1.UIVOCABULARY, lineItemData.oDataServiceAVT)}.`;
        lineItemRecord['Target']['value'] = lineItemRecord['Target']['value'].replace(regex, '@');
    }
    const schemaKey = (0, StableIdHelper_1.getStableIdPartFromDataField)(lineItemRecord).replace(/\//g, exports.FIELD_SEPARATOR);
    if (schemaKey) {
        let columnsDefinition = lineItemDefinition;
        if (!columnsDefinition) {
            columnsDefinition = lineItemData.appSchema.definitions[lineItemId];
        }
        const properties = columnsDefinition.properties;
        const property = {
            description: (0, common_1.getDataFieldDescription)(lineItemRecord, lineItemData.entityType)
        };
        if (lineItemDefinition) {
            property.properties = {};
            property.type = 'object';
            property.isViewNode = true;
        }
        else {
            property.$ref = utils_1.DEFINITION_LINK_PREFIX + columnDefinition;
        }
        property[ux_specification_types_1.SchemaTag.annotationType] = lineItemRecord?.$Type;
        property[ux_specification_types_1.SchemaTag.annotationPath] = `${lineItemPath}/${index}`;
        property[ux_specification_types_1.SchemaTag.propertyIndex] = index;
        property[ux_specification_types_1.SchemaTag.dataType] = (0, common_1.determineDataType)(lineItemRecord);
        properties[schemaKey] = property;
        (0, common_1.addKeyToDefinition)(lineItemRecord, properties, schemaKey);
    }
}
/**
 * Appends line item columns and actions to the app schema (for the list report, custom page or an object page section comprising a table).
 *
 * @param {LineItemDataForSchema} data structure comprising
 * - appSchema - the app specific schema that shall get enhanced
 * - lineItemAnnotation - the UI.LineItem annotation, comprising all records
 * - entityType - the entity type as part of the AVT ConvertedMetadata
 * - oDataServiceAVT - complete service information, as returned by Annotation Vocabularies Tool
 * - lineItemId - in case of OP the parameter must be passed to distinguish the OP tables;
 *                in case of LR or ALP 'LineItems' is passed.
 * @param {Definition} actions - actions definition in schema, parent object
 * @param {string} lineItemPath - annotation path to the line item
 * @param {Definition | undefined} lineItemDefinition - line item definition
 * @param {string} columnDefinitionName - line item definition name
 */
function appendLineItemsToSchema(data, actions, lineItemPath, lineItemDefinition, columnDefinitionName = ux_specification_types_1.DefinitionName.TableColumn) {
    if (!data.lineItemAnnotation) {
        return;
    }
    let i = 0;
    data.lineItemAnnotation.forEach((lineItemRecord) => {
        const addLineItemDefinitionsParams = {
            lineItemData: data,
            actions,
            lineItemPath,
            lineItemRecord: lineItemRecord,
            index: i,
            lineItemDefinition,
            columnDefinitionName
        };
        const strategy = DataFieldStrategy_1.dataFieldStrategyContext.getStrategy(lineItemRecord.$Type);
        strategy.addLineItemDefinition(addLineItemDefinitionsParams);
        i++;
    });
}
/**
 * Adds the line item definition, columns and actions to the app schema (for the list report, custom page or an object page section comprising a table.
 *
 * @param data structure comprising
 * - isObjectPage - indicates that the page is an object page
 * - appSchema - the app specific schema that shall get enhanced
 * - lineItemAnnotation - the UI.LineItem annotation, comprising all records
 * - entityType - the entity type as part of the AVT ConvertedMetadata
 * - oDataServiceAVT - complete service information, as returned by Annotation Vocabularies Tool
 * - lineItemId - in case of OP the parameter must be passed to distinguish the OP tables;
 *                in case of LR or ALP 'LineItems' is passed.
 * @param columnDefinitionName - name of the column definition, i.e. TableColumn or ObjectPageTableColumn
 * @param customColumnDefinitionName - name of the custom column definition
 * @param customActionDefinitionName - name of the custom action definition
 */
function addLineItemsTypeToSchema(data, columnDefinitionName = ux_specification_types_1.DefinitionName.TableColumn, customColumnDefinitionName = ux_specification_types_1.DefinitionName.CustomColumn, customActionDefinitionName = ux_specification_types_1.DefinitionName.CustomTableAction) {
    const { actions, lineItemPath } = (0, common_1.addCommonLineItemDefinitions)(data.isObjectPage, data.appSchema, data.lineItemAnnotation, data.entityType, data.lineItemId, customColumnDefinitionName, customActionDefinitionName);
    appendLineItemsToSchema(data, actions, lineItemPath, undefined, columnDefinitionName);
}
/**
 * Adds an enum or value help to position > anchor of custom column.
 *
 * @param appSchema - app specific JSON schema
 * @param lineItemId - ID of the current line item in schema
 * @param v4Page - current page in manifest
 * @param positionName - ID of the definition of custom column position in schema
 * @param sectionIdInManifest - identifier of the current object page section in manifest
 */
function addFragmentEnumForAnchor(appSchema, lineItemId, v4Page, positionName = ux_specification_types_1.DefinitionName.Position, sectionIdInManifest) {
    const columns = appSchema.definitions[lineItemId]?.properties;
    const enumEntries = [];
    if (columns) {
        for (const key in columns) {
            if (key !== 'custom') {
                enumEntries.push(key);
            }
        }
    }
    const id = lineItemId !== ux_specification_types_1.DefinitionName.LineItems ? sectionIdInManifest : `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
    const columnsInManifest = v4Page.options?.settings?.controlConfiguration?.[id]?.['columns'];
    if (columnsInManifest) {
        for (const key in columnsInManifest) {
            if (enumEntries.indexOf(key) === -1) {
                enumEntries.push(key);
            }
        }
    }
    if (enumEntries.length > 0) {
        const anchor = appSchema.definitions[positionName].properties.anchor;
        (0, common_1.addEnumToSchema)(enumEntries, anchor);
    }
}
/**
 * Adds an enum or value help to position > anchor of custom column or custom action.
 *
 * @param appSchema - app specific JSON schema
 * @param definitionId - definition key of actions
 * @param positionName - target definition to update
 */
function addEnumForActionAnchor(appSchema, definitionId, positionName = ux_specification_types_1.DefinitionName.CustomActionPosition) {
    (0, common_1.addDescriptiveEnumDefinition)(appSchema, appSchema.definitions[definitionId], {
        definition: positionName,
        property: 'anchor'
    }, {
        resolveDefinition: true
    });
}
/**
 * Adds an enum options of the columns to the table enableMassEdit properties.
 *
 * @param {Definition} appSchema - The schema of the application where the enums will be added.
 * @param {string} tableDefinitionName - The name of the table definition in the schema.
 * @param {string} columnsDefinitionName - The name of the columns definition used to extract column enumerations.
 * @param {EntityType} [entityType] - Optional entity type for additional context when retrieving column definitions.
 */
function addEnumForEnableMassEdit(appSchema, tableDefinitionName, columnsDefinitionName, entityType) {
    const FIELD_PROPERTIES = ['visibleFields', 'ignoredFields'];
    const columnsDefinitions = getNonNavigationColumnDefinitions(appSchema, columnsDefinitionName, entityType);
    const columnEnums = getColumnsEnum(columnsDefinitions);
    const enableMassEditDefinition = appSchema.definitions[tableDefinitionName].properties['enableMassEdit'];
    const enableMassEditFields = enableMassEditDefinition.anyOf.find((definition) => definition.type === 'object');
    for (const propertyKey in enableMassEditFields.properties) {
        if (FIELD_PROPERTIES.includes(propertyKey)) {
            const property = enableMassEditFields.properties[propertyKey];
            property.items['enum'] = columnEnums;
            property.uniqueItems = true;
        }
    }
}
/**
 * Filters and retrieves column definitions that are not related to navigation properties
 * based on the provided application schema, line item ID, and entity type.
 *
 * @param appSchema The application schema definition containing the column definitions.
 * @param lineItemId The identifier of the line item whose column definitions are to be filtered.
 * @param entityType The entity type containing the navigation properties to filter against.
 * @returns A definition object containing column definitions that are not navigation properties.
 */
function getNonNavigationColumnDefinitions(appSchema, lineItemId, entityType) {
    const columns = appSchema.definitions[lineItemId]?.properties;
    const navigationProperties = new Set((entityType?.navigationProperties ?? []).map((np) => np.name));
    const filteredColumns = {};
    for (const key of Object.keys(columns)) {
        const column = columns[key];
        const propertyKeyValue = (column[ux_specification_types_1.SchemaTag.keys] ?? []).reduce((acc, currentKey) => {
            const { name, value } = currentKey;
            return name === ux_specification_types_1.SchemaKeyName.value || name === ux_specification_types_1.SchemaKeyName.target ? value : acc;
        }, '');
        const isNavigationProperty = propertyKeyValue.split('/').some((value) => navigationProperties.has(value));
        if (!isNavigationProperty) {
            filteredColumns[key] = columns[key];
        }
    }
    return filteredColumns;
}
/**
 * Initializes and modifies a specific schema definition for the creation mode of a line item.
 *
 * @param {Definition} appSchema - The base application schema containing definitions.
 * @param {string} lineItemId - The identifier for the line item in the schema.
 * @param {EntityType} entityType - The metadata entity type related to the line item.
 * @param {string} definitionName - The name of the general schema definition to be adapted.
 * @returns {string} The name of the newly created specific schema definition for the creation mode.
 */
function initializeCreationModeSchema(appSchema, lineItemId, entityType, definitionName) {
    const columnDefinitions = getNonNavigationColumnDefinitions(appSchema, lineItemId, entityType);
    const columnOneOfEnums = getCreationFieldOptions(columnDefinitions);
    const fieldGroups = getFieldGroupsFromEntityType(entityType);
    const specificCreationModeDefinitionName = (0, common_1.getFacetDefinitionKey)(definitionName, lineItemId);
    const specificCreationModeDefinition = (appSchema.definitions[specificCreationModeDefinitionName] = structuredClone(appSchema.definitions[definitionName]));
    const creationFieldsDefinition = specificCreationModeDefinition.properties[ux_specification_types_1.PropertyName.creationFields];
    const creationFieldsDefinitionItems = creationFieldsDefinition.items;
    creationFieldsDefinitionItems['oneOf'] = [...columnOneOfEnums, ...fieldGroups];
    // Entries of one of are translatable using 'service' i18n bundle
    creationFieldsDefinitionItems.i18nBundle = 'service';
    creationFieldsDefinition.uniqueItems = true;
    return specificCreationModeDefinitionName;
}
/**
 * Updates the schema for specific creation fields in the provided application schema.
 * This method dynamically modifies schemas of particular table types to include specific definitions for creation fields.
 *
 * @param appSchema The application schema to update, represented as a Definition object.
 * @param entityType The entity type used for determining field groups.
 * @param definitionName The name of the schema definition that serves as the base for the specific creation mode schema.
 * @param lineItemId The identifier of the line item related to the creation fields to be updated in the schema.
 */
function addOneOfForCreationFields(appSchema, entityType, definitionName, lineItemId) {
    const creationModeDefinitionName = initializeCreationModeSchema(appSchema, lineItemId, entityType, definitionName);
    // replace the generic creationMode definition with the specific one for all table types
    objectPage_1.OBJECT_PAGE_TABLE_DEFINITION_TYPES.forEach((type) => {
        const creationModeAnyOf = appSchema.definitions[`${type}<${lineItemId}>`]?.properties?.creationMode?.anyOf;
        if (creationModeAnyOf) {
            const updatedCreationModeAnyOf = creationModeAnyOf.map((definition) => {
                const { $ref } = definition;
                // replace generic creation mode definition with specific one
                // I don't check that $ref contains the definition name, the replacement should not work for other definitions
                const updatedRef = $ref.replace(definitionName, creationModeDefinitionName);
                return { ...definition, $ref: updatedRef };
            });
            appSchema.definitions[`${type}<${lineItemId}>`].properties.creationMode.anyOf = updatedCreationModeAnyOf;
        }
    });
}
/**
 * Find the relevant V4 page under the routing targets of manifest,json.
 *
 * @param pages - list of all pages in manifest
 * @param templateName - search criterion: template name
 * @param entitySet - search criterion: entity set object from AVT
 * @param contextPath - search criterion: contextPath
 * @returns the page definition in manifest (if found)
 */
function findPageV4(pages, templateName, entitySet, contextPath) {
    let v4Page;
    for (const i in pages) {
        const pageSettings = pages[i].options?.settings || {};
        const isConnectionMatches = (contextPath && pageSettings.contextPath === contextPath) ||
            (entitySet?.name && pageSettings.entitySet === entitySet.name);
        if (isConnectionMatches &&
            ((0, common_1.compareTemplateNames)(templateName, pages[i].name) ||
                (templateName === ux_specification_types_1.v4.FE_TEMPLATE_V4_ALP && pages[i].name === ux_specification_types_1.v4.FE_TEMPLATE_V4_LIST_REPORT))) {
            v4Page = pages[i];
            break;
        }
    }
    return v4Page;
}
/**
 * Depending on the template type, strip down the app schema so that only the relevant views are part of it.
 *
 * @param {Definition} appSchema - app specific JSON schema, to be adjusted
 * @param templateType - template type of the current page
 * @returns the right definition name for the table in the schema
 */
function alignSchemaWithTemplateType(appSchema, templateType) {
    let tableDefinitionName;
    const tableDefinition = appSchema.properties[ux_specification_types_1.PropertyName.table];
    if (templateType === ux_specification_types_1.TemplateType.AnalyticalListPageV4) {
        tableDefinitionName = ux_specification_types_1.DefinitionName.ALPTableView;
        delete tableDefinition.anyOf;
        tableDefinition.$ref = `${utils_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.ALPTableView}`;
        delete appSchema.definitions[ux_specification_types_1.DefinitionName.Table];
        delete appSchema.definitions[ux_specification_types_1.DefinitionName.LRChartView];
        delete appSchema.definitions[ux_specification_types_1.DefinitionName.LRTableView];
        delete appSchema.definitions[ux_specification_types_1.DefinitionName.MultiTableModeV4];
    }
    else if (templateType === ux_specification_types_1.TemplateType.ListReportObjectPageV4) {
        tableDefinitionName = ux_specification_types_1.DefinitionName.Table;
        delete tableDefinition.anyOf;
        tableDefinition.$ref = `${utils_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.Table}`;
        appSchema.definitions[tableDefinitionName].properties[ux_specification_types_1.PropertyName.annotationPath][ux_specification_types_1.SchemaTag.hidden] = true;
        delete appSchema.definitions[ux_specification_types_1.DefinitionName.ALPTableView];
        appSchema.properties[ux_specification_types_1.PropertyName.defaultPath][ux_specification_types_1.SchemaTag.hidden] = true;
    }
    return tableDefinitionName;
}
/**
 * Common function for enhancing LineItems, FieldGroups and Custom Section definitions of app schema by custom action definitions.
 *
 * @param appSchema The application schema where the custom action definition will be added.
 * @param v4Page The V4 page configuration object that contains metadata and settings for the page.
 * @param logger A logging instance for logging warnings or errors during the processing.
 * @param customActionDefinitionName The name of the custom action definition to be added. Defaults to `DefinitionName.CustomTableAction`.
 * @param sectionDefinitionName The name of the section definition within the schema to which the action definition will be added.
 * @param sectionIdInManifest Optional: The section ID in the manifest, used to derive the configuration ID.
 * @param lineItemId Optional: The ID of the line item, if applicable.
 */
function addCustomActionDefinition(appSchema, v4Page, logger, customActionDefinitionName = ux_specification_types_1.DefinitionName.CustomTableAction, sectionDefinitionName = '', sectionIdInManifest = '', lineItemId) {
    const definition = appSchema.definitions[sectionDefinitionName];
    if (!definition) {
        return;
    }
    // Sort existing actions
    let sortedActionsArray = sortPropertiesRecords(definition);
    let configId;
    if (sectionIdInManifest) {
        if (customActionDefinitionName.indexOf(ux_specification_types_1.DefinitionName.CustomFormActionOP) !== -1) {
            configId = sectionIdInManifest.replace(/::/g, '#');
        }
        else {
            configId = sectionIdInManifest.replace(/::/g, '/');
        }
    }
    else {
        if (customActionDefinitionName === ux_specification_types_1.DefinitionName.CustomFormActionOP) {
            configId = `@${"com.sap.vocabularies.UI.v1.FieldGroup" /* UIAnnotationTerms.FieldGroup */}`;
        }
        else {
            configId = `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
        }
    }
    let actions;
    if (sectionDefinitionName.includes(ux_specification_types_1.DefinitionName.ObjectPageCustomSectionActions)) {
        actions = v4Page.options?.settings?.content?.body?.sections?.[configId]?.['actions'];
    }
    else {
        actions = v4Page.options?.settings?.controlConfiguration?.[configId]?.['actions'];
    }
    if (actions) {
        // Add custom actions and custom action menus to the actions array
        const parameters = {
            extensions: actions,
            appSchema,
            customActionDefinitionName,
            initialActionDetailsList: sortedActionsArray,
            logger,
            lineItemId
        };
        sortedActionsArray = addActionsToArray(parameters);
    }
    // Adjust propertyIndex
    if (sortedActionsArray) {
        for (let index = 0; index < sortedActionsArray.length; index++) {
            sortedActionsArray[index][1][ux_specification_types_1.SchemaTag.propertyIndex] = index;
        }
        const sortedActionsAsObject = {};
        sortedActionsArray.forEach(([key, value]) => (sortedActionsAsObject[key] = value));
        appSchema.definitions[sectionDefinitionName].properties = sortedActionsAsObject;
    }
}
/**
 * Common function for enhancing header and footer definitions of app schema by custom action definitions.
 *
 * @param appSchema - app-specific JSON schema
 * @param v4Page - actual page in the manifest
 * @param logger - logger for error messages
 * @param customActionDefinitionName - definition name of custom action
 * @param sectionId - identifier of the current object page section in schema
 */
function addHeaderFooterCustomActionDefinition(appSchema, v4Page, logger, customActionDefinitionName = ux_specification_types_1.DefinitionName.CustomHeaderActionOP, sectionId = '') {
    const definition = appSchema.definitions[sectionId];
    if (!definition) {
        return;
    }
    // Sort existing actions
    let sortedActionsArray = sortPropertiesRecords(definition);
    let actions;
    if ([ux_specification_types_1.DefinitionName.CustomHeaderAction, ux_specification_types_1.DefinitionName.CustomHeaderActionOP].includes(customActionDefinitionName)) {
        actions = v4Page.options?.settings?.content?.header?.['actions'];
    }
    else {
        actions = v4Page.options?.settings?.content?.footer?.['actions'];
    }
    if (actions) {
        // Add custom actions and custom action menus to the actions array
        const parameters = {
            extensions: actions,
            appSchema,
            customActionDefinitionName,
            initialActionDetailsList: sortedActionsArray,
            logger
        };
        sortedActionsArray = addActionsToArray(parameters);
    }
    // Adjust propertyIndex
    const sortedActionsAsObject = {};
    if (sortedActionsArray) {
        for (let index = 0; index < sortedActionsArray.length; index++) {
            sortedActionsArray[index][1][ux_specification_types_1.SchemaTag.propertyIndex] = index;
        }
        sortedActionsArray.forEach(([key, value]) => (sortedActionsAsObject[key] = value));
    }
    appSchema.definitions[sectionId].properties = sortedActionsAsObject;
}
/**
 * Adds actions and custom action menus to an array of initial actions using specified parameters.
 *
 * @param params - An object containing the parameters for adding actions to the array:
 *   - actions: The original actions to be processed.
 *   - initialActionsArray: The array to which actions should be added.
 *   - customActionDefinitionName: The name of the custom action definition.
 *   - appSchema: The application schema used for processing.
 *   - logger: An object used for logging information during processing.
 * @returns An array of action details after processing and adding extensions.
 */
function addActionsToArray(params) {
    const { extensions, initialActionDetailsList, customActionDefinitionName, logger } = params;
    // Add custom actions
    let actionDetailsList = addExtensionToArray(extensions, initialActionDetailsList, customActionDefinitionName, [ux_specification_types_1.TemplatePropertyName.Press, ux_specification_types_1.TemplatePropertyName.Menu], logger);
    const processActionMenusParams = {
        ...params,
        initialActionDetailsList: actionDetailsList
    };
    actionDetailsList = processActionMenus(processActionMenusParams);
    return actionDetailsList;
}
/**
 * Processes action menus by identifying menu-type actions within the provided extensions and updating the list of action details accordingly.
 *
 * @param {ActionProcessingParameters} params - An object containing required parameters for processing action menus. It includes:
 *   - extensions: A map of extension data where the keys are extension IDs and the values are extension definitions.
 *   - initialActionDetailsList: A list of action details, each represented as a tuple with the action ID and action definition.
 * @returns {Array} An updated list of action details after processing any menu-type actions.
 */
function processActionMenus(params) {
    const { extensions, initialActionDetailsList } = params;
    let actionDetailsList = [...initialActionDetailsList];
    // Currently, all actions were initialized as custom actions. We need to check if the action is a menu and if so,
    // we need to process it differently.
    for (const extensionId in extensions) {
        const extension = extensions[extensionId];
        const actionDetails = actionDetailsList.find(([actionId]) => actionId === extensionId);
        if (Object.keys(extension).includes(ux_specification_types_1.PropertyName.menu) && actionDetails) {
            const [, actionDefinition] = actionDetails;
            actionDetailsList = processActionMenu(params, extension, actionDefinition, actionDetailsList, extensionId);
        }
    }
    return actionDetailsList;
}
/**
 * Retrieves a reference to a menu entry definition based on the provided parameters.
 *
 * @param {string} $ref - The reference string used to identify the menu entry definition.
 * @param {string} actionMenuDefinitionName - The name of the action menu definition.
 * @param {Definition} appSchema - The application schema containing the definitions.
 * @returns {string} The constructed link or reference for the specified menu entry definition.
 */
function getMenuEntryDefinitionLink($ref, actionMenuDefinitionName, appSchema) {
    const definitionName = (0, utils_1.getDefinitionKey)($ref);
    const { baseDefinitionName, definitionQualifier } = parseDefinitionName(definitionName);
    // incorrect definition name - probably a reference to an intent based navigation action
    if (baseDefinitionName.includes(exports.FIELD_SEPARATOR)) {
        return $ref;
    }
    const menuEntryDefinitionQualifier = definitionQualifier
        ? `${actionMenuDefinitionName}${exports.FIELD_SEPARATOR}${definitionQualifier}`
        : actionMenuDefinitionName;
    const menuEntryDefinitionRef = (0, common_1.getFacetDefinitionKey)(baseDefinitionName, menuEntryDefinitionQualifier);
    const menuEntryDefinitionLink = (0, common_1.getFacetDefinitionLink)(baseDefinitionName, menuEntryDefinitionQualifier);
    const menuEntryDefinition = appSchema.definitions[menuEntryDefinitionRef];
    if (!menuEntryDefinition) {
        const originalDefinition = appSchema.definitions[definitionName];
        const menuEntryDefinition = (0, common_1.parseSchemaDefinition)(baseDefinitionName, menuEntryDefinitionQualifier, appSchema);
        for (const originalDefinitionKey of Object.keys(originalDefinition)) {
            if (menuEntryDefinition[originalDefinitionKey] === undefined) {
                menuEntryDefinition[originalDefinitionKey] = originalDefinition[originalDefinitionKey];
            }
        }
        // some properties doesn't make sense for menu entries
        delete menuEntryDefinition.properties[ux_specification_types_1.PropertyName.position];
        delete menuEntryDefinition.properties[ux_specification_types_1.PropertyName.overflowGroup];
        delete menuEntryDefinition.properties[ux_specification_types_1.PropertyName.priority];
    }
    return menuEntryDefinitionLink;
}
/**
 * Determines the appropriate action menu definition name based on a custom action definition name.
 *
 * @param {string} customActionDefinitionName - The custom action definition name to be parsed and matched.
 * @returns {ActionMenuDefinitionName} The corresponding action menu definition name, or a default value if not found.
 */
function determineActionMenuDefinitionName(customActionDefinitionName) {
    const { baseDefinitionName } = parseDefinitionName(customActionDefinitionName);
    return actionMenuDefinitionNameMap.get(baseDefinitionName) ?? LR_ACTION_MENU_DEFINITION;
}
/**
 * Parses a given definition name into its base name and optional qualifier.
 *
 * @param definitionName The definition name to parse. This should be a string in the format "BaseName" or "BaseName<Qualifier>".
 * @returns An object containing the base definition name and, if applicable, its qualifier.
 * If there is no qualifier, it will return undefined for the qualifier field.
 */
function parseDefinitionName(definitionName = '') {
    const match = /^([^<]*)(?:<(.*)>)?$/.exec(definitionName);
    if (!match) {
        return { baseDefinitionName: definitionName };
    }
    const [, baseDefinitionName, definitionQualifier] = match;
    return {
        baseDefinitionName: baseDefinitionName,
        definitionQualifier: definitionQualifier ?? undefined
    };
}
/**
 * Updates the custom menu's default action to include a list of valid options based on the provided menu schema.
 *
 * @param {Definition} customMenuDefinition - The definition object for the custom menu, where the default action will be updated.
 * @param {Record<string, SchemaDefinition>} [menu={}] - A mapping of menu items to their schema definitions, used to generate valid options for the default action.
 */
function setCustomMenuDefaultAction(customMenuDefinition, menu = {}) {
    if (customMenuDefinition.properties[ux_specification_types_1.PropertyName.defaultAction]) {
        const menuOneOfValues = Object.keys(menu).map((value) => ({
            const: value,
            description: menu[value].description
        }));
        customMenuDefinition.properties[ux_specification_types_1.PropertyName.defaultAction][ux_specification_types_1.PropertyName.oneOf] = menuOneOfValues;
    }
}
/**
 * Retrieves the description of a menu entry from its schema definition.
 *
 * @param menuEntryDefinition The schema definition of the menu entry, including its reference information.
 * @param appSchema The complete application schema containing definitions for the menu entries.
 * @returns The description of the menu entry if found, or an empty string if no description is available.
 */
function getMenuEntryDescription(menuEntryDefinition, appSchema) {
    const definitionKey = (0, utils_1.getDefinitionKey)(menuEntryDefinition.$ref);
    const definition = appSchema.definitions[definitionKey];
    return menuEntryDefinition?.description ?? definition?.description ?? '';
}
/**
 * Processes an action menu for a custom extension, updating the schema definition and action details list accordingly.
 *
 * @param {ActionProcessingParameters} params The parameters required for action menu processing, including `actionMenu`, `actionMenuActions`, `appSchema`, and `lineItemId`.
 * @param {CustomExtension} extension The custom extension that contains the action menu configuration.
 * @param {SchemaDefinition} actionDefinition The schema definition object to be populated with details of the custom action menu.
 * @param {ActionDetails[]} initialDetailsList The initial list of action details to be processed and modified.
 * @param {string} extensionId The unique identifier for the extension being processed.
 * @returns {ActionDetails[] | undefined} Returns the updated list of action details if processing occurs; otherwise, returns `undefined` if the extension is not a custom action menu.
 */
function processActionMenu(params, extension, actionDefinition, initialDetailsList, extensionId) {
    // if the extension isn't a custom action menu, don't do anything
    if (!(ux_specification_types_1.TemplatePropertyName.Menu in extension)) {
        return undefined;
    }
    const { customActionDefinitionName, appSchema, lineItemId } = params;
    const detailsList = [...initialDetailsList];
    const { actionMenuDefinitionName, actionMenuActionsDefinitionName } = determineActionMenuDefinitionName(customActionDefinitionName);
    // Prepare submenu entries to be processed
    const menu = extension[ux_specification_types_1.TemplatePropertyName.Menu] ?? [];
    const properties = {};
    // For forms and tables, the id should contain both the section and action names
    const extendedExtensionId = lineItemId ? `${extensionId}${exports.FIELD_SEPARATOR}${lineItemId}` : extensionId;
    // Create the specific action menu definition in the schema based on the generic action menu definition
    const customMenuDefinition = (0, common_1.parseSchemaDefinition)(actionMenuDefinitionName, extendedExtensionId, appSchema);
    actionDefinition.$ref = (0, common_1.getFacetDefinitionLink)(actionMenuDefinitionName, extendedExtensionId);
    actionDefinition[ux_specification_types_1.SchemaTag.actionType] = ux_specification_types_1.ActionType.CustomMenu;
    const customMenuActionsDefinition = (0, common_1.parseSchemaDefinition)(actionMenuActionsDefinitionName, extendedExtensionId, appSchema);
    const customMenuActionsDefinitionLink = (0, common_1.getFacetDefinitionLink)(actionMenuActionsDefinitionName, extendedExtensionId);
    // for manifest based menu actions, we need to store the menu entries from the manifest
    actionDefinition[ux_specification_types_1.PropertyName.menu] = menu;
    // Add the menu items to the action menu definition
    menu.forEach((menuEntry, propertyIndex) => {
        const sortedExtensionIndex = detailsList.findIndex(([entry]) => entry === menuEntry);
        // If the list of actions contains the menu entry, add the menu entry to the properties of the custom action menu
        // and remove the extension reference from the list of actions
        if (sortedExtensionIndex !== -1) {
            const menuEntryDefinition = detailsList[sortedExtensionIndex][1];
            menuEntryDefinition.propertyIndex = propertyIndex;
            menuEntryDefinition.isViewNode = true;
            menuEntryDefinition.$ref = getMenuEntryDefinitionLink(menuEntryDefinition.$ref, actionMenuDefinitionName, appSchema);
            menuEntryDefinition.description = getMenuEntryDescription(menuEntryDefinition, appSchema);
            properties[menuEntry] = menuEntryDefinition;
            detailsList.splice(sortedExtensionIndex, 1);
        }
    });
    customMenuDefinition.description = actionDefinition.description;
    // Update the properties of the custom action menu definition with the menu items
    const actions = customMenuDefinition.properties[ux_specification_types_1.PropertyName.actions];
    setCustomMenuDefaultAction(customMenuDefinition, properties);
    customMenuActionsDefinition.properties = properties;
    actions.$ref = customMenuActionsDefinitionLink;
    return detailsList;
}
/**
 * Method returns page from manifest by passed page key.
 *
 * @param manifest Object from manifest.json.
 * @param pageId Page id.
 * @param logger Logger to report error of unexisting page.
 * @returns Manifest's target page.
 */
function getManifestPage(manifest, pageId, logger) {
    const pages = (0, utils_1.getJSONPropertyByPath)(manifest, [
        ux_specification_types_1.ManifestSection.ui5,
        'routing',
        'targets'
    ]);
    if (!pages) {
        (0, __1.log)(logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('NOTARGETS'),
            location: {
                path: ux_specification_types_1.MANIFESTPATH,
                range: [ux_specification_types_1.ManifestSection.ui5, 'routing']
            }
        });
        return;
    }
    const page = (0, utils_1.getJSONPropertyByPath)(pages, [pageId]);
    if (!page) {
        (0, __1.log)(logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('NOROUTINGID', { routingId: pageId }),
            location: {
                path: ux_specification_types_1.MANIFESTPATH,
                range: [ux_specification_types_1.ManifestSection.ui5, 'routing']
            }
        });
        return;
    }
    return page;
}
/**
 * Method finds custom view/section XML file for passed page.
 *
 * @param files All extension files.
 * @param page - the page object containing routing target options
 * @param manifest Object from manifest.json.
 * @param xmlType XML file type - view or fragment.
 * @param extensionName Extension namespace or path to extension name in page object.
 * @returns Custom page's data containing XML file.
 */
function getPageCustomExtensionFile(files, page, manifest, xmlType, extensionName) {
    if (extensionName) {
        const appId = manifest['sap.app']?.id || '';
        const fileExtension = 'xml';
        if (extensionName.startsWith(appId)) {
            // Remove app id from extension name
            extensionName = extensionName.replace(appId, '');
        }
        const fileParts = extensionName.split('.');
        let baseName = fileParts.pop();
        baseName = `${baseName}.${xmlType}.${fileExtension}`;
        const extPath = (0, path_1.join)(...fileParts, baseName);
        const file = (files ?? []).find((file) => file.dataSourceUri.endsWith(extPath));
        if (file) {
            const settings = page.options?.settings;
            return {
                file,
                relativeFilePath: extPath,
                connection: {
                    contextPath: settings?.contextPath,
                    entitySet: settings?.entitySet
                }
            };
        }
    }
    return undefined;
}
/**
 * Method finds view XML file for passed page.
 *
 * @param files All view files.
 * @param pageId Page id.
 * @param manifest Object from manifest.json.
 * @param logger Logger.
 * @returns Custom page's data containing view XML file.
 */
function getPageCustomViewFile(files, pageId, manifest, logger) {
    const page = getManifestPage(manifest, pageId, logger);
    const viewName = (0, utils_1.getJSONPropertyByPath)(page, ['options', 'settings', 'viewName']);
    return page && typeof viewName === 'string'
        ? getPageCustomExtensionFile(files, page, manifest, 'view', viewName)
        : undefined;
}
/**
 * Adds custom section or custom sub section definitions to app schema.
 *
 * @param appSchema - app-specific JSON schema
 * @param definition - sections definition
 * @param v4Page - actual page in the manifest
 * @param customSectionRef - value of custom section ref
 * @param isMergedSections - are merged section used
 * @param facetKey - facet key
 * @param logger - logger for error messages
 */
function addCustomSectionDefinition(appSchema, definition, v4Page, customSectionRef, isMergedSections, facetKey, logger) {
    let sortedSectionsArray = sortPropertiesRecords(definition);
    const annotationSectionsMap = new Map();
    sortedSectionsArray = sortedSectionsArray.map((annotationSection) => {
        const entry = (0, common_1.getEnumEntry)(appSchema, annotationSection[1], annotationSection[0], {
            keyProperties: [ux_specification_types_1.SchemaKeyName.id],
            descriptionAsFallback: true,
            resolveDefinition: true
        });
        annotationSectionsMap.set(entry.const, annotationSection[0]);
        return [entry.const, annotationSection[1]];
    });
    if (facetKey) {
        // check for already defined section
        const section = v4Page.options?.settings?.content?.body?.sections?.[facetKey];
        if (section && 'subSections' in section) {
            // add extension to subsection of section
            sortedSectionsArray = addExtensionToArray(section.subSections, sortedSectionsArray, customSectionRef, ux_specification_types_1.TemplatePropertyName.Template, logger, isMergedSections);
        }
    }
    else if (customSectionRef.includes(ux_specification_types_1.DefinitionName.ObjectPageCustomHeaderSectionFragment)) {
        // header custom section extensions
        const header = v4Page.options?.settings?.content?.header;
        if (header && 'facets' in header) {
            // add extension to header section
            sortedSectionsArray = addExtensionToArray(header.facets, sortedSectionsArray, customSectionRef, ux_specification_types_1.TemplatePropertyName.Template, logger, isMergedSections);
        }
    }
    else {
        // body custom section extensions
        const sections = v4Page.options?.settings?.content?.body?.sections;
        if (sections) {
            // add extension to sections section
            sortedSectionsArray = addExtensionToArray(sections, sortedSectionsArray, customSectionRef, ux_specification_types_1.TemplatePropertyName.Template, logger, isMergedSections);
        }
    }
    // Adjust propertyIndex
    for (let index = 0; index < sortedSectionsArray.length; index++) {
        sortedSectionsArray[index][1][ux_specification_types_1.SchemaTag.propertyIndex] = index;
    }
    const sortedActionsAsObject = {};
    sortedSectionsArray.forEach(([key, value]) => {
        key = annotationSectionsMap.get(key) || key;
        sortedActionsAsObject[key] = value;
    });
    definition.properties = sortedActionsAsObject;
}
/**
 * Method adds custom filter fields from manifest to schema properties.
 *
 * @param appSchema - app-specific JSON schema
 * @param definition - filter fields definition
 * @param v4Page - actual page in the manifest
 */
function addCustomFilterFieldDefinition(appSchema, definition, v4Page) {
    let sortedFilterFieldsArray = sortPropertiesRecords(definition);
    const annotationSectionsMap = new Map();
    sortedFilterFieldsArray = sortedFilterFieldsArray.map((annotationSection) => {
        const entry = (0, common_1.getEnumEntry)(appSchema, annotationSection[1], annotationSection[0], {
            keyProperties: [ux_specification_types_1.SchemaKeyName.value],
            descriptionAsFallback: true,
            resolveDefinition: true
        });
        annotationSectionsMap.set(entry.const, annotationSection[0]);
        return [entry.const, annotationSection[1]];
    });
    // check for already defined section
    const selectionFieldsEntry = v4Page.options?.settings?.controlConfiguration?.[`@${"com.sap.vocabularies.UI.v1.SelectionFields" /* UIAnnotationTerms.SelectionFields */}`];
    if (typeof selectionFieldsEntry === 'object' && 'filterFields' in selectionFieldsEntry) {
        // add extension to subsection of section
        sortedFilterFieldsArray = addExtensionToArray(selectionFieldsEntry.filterFields, sortedFilterFieldsArray, ux_specification_types_1.DefinitionName.CustomFilterField, ux_specification_types_1.TemplatePropertyName.Template);
    }
    // Adjust propertyIndex
    for (let index = 0; index < sortedFilterFieldsArray.length; index++) {
        sortedFilterFieldsArray[index][1][ux_specification_types_1.SchemaTag.propertyIndex] = index;
    }
    const sortedFilterFieldsAsObject = {};
    sortedFilterFieldsArray.forEach(([key, value]) => {
        key = annotationSectionsMap.get(key) || key;
        sortedFilterFieldsAsObject[key] = value;
    });
    definition.properties = sortedFilterFieldsAsObject;
}
/**
 * Imports action settings into a configuration object and applies necessary transformations based on provided parameters.
 *
 * @param {object} importActionParams - Parameters required for importing action settings, including schema, factory, and action specifications.
 * @param {string} key - The key used to identify the specific configuration or schema definition.
 * @param {boolean} [keepEmptyAction] - Determines whether to keep empty actions in the configuration object.
 */
function importActionToConfigurationObject(importActionParams, key, keepEmptyAction = false) {
    const { appSchema, factory, actionsInConfig, actionKey, manifest, routingId, manifestSectionId, targetAnnotation } = importActionParams;
    const schemaPropertyName = (key ?? '').split('<')[0];
    const metaInstance = factory.createInstance(ux_specification_types_1.PageTypeV4.ObjectPage, schemaPropertyName);
    const breadcrumbs = [actionKey.replace('/', '??')];
    if (targetAnnotation) {
        breadcrumbs.push(targetAnnotation);
    }
    if (metaInstance) {
        const action = (actionsInConfig[actionKey] = metaInstance);
        (0, utils_2.importSettingsOfObject)(action, manifest, appSchema.definitions[key], routingId, breadcrumbs, manifestSectionId);
        if (!keepEmptyAction) {
            (0, common_1.removeEmptyStructure)(actionsInConfig, actionKey);
        }
    }
}
/**
 * Imports the settings of a single action reference into the configuration object.
 *
 * @param {ImportActionSettingsOfReferenceParams} importActionParams - The parameters required for importing action settings, including property definitions.
 * @param {Definition} definitionOfReference - The reference definition object used to resolve the action.
 */
function importSingleActionSettingsOfReference(importActionParams, definitionOfReference) {
    const { actionPropertyDefinition } = importActionParams;
    const key = (0, utils_1.getDefinitionKey)(definitionOfReference.$ref || actionPropertyDefinition.$ref);
    importActionToConfigurationObject(importActionParams, key);
}
/**
 * Imports and processes the settings for a group of actions based on a reference definition.
 *
 * @param {ImportActionSettingsOfReferenceParams} importActionParams - Parameters containing details required to import group action settings, such as action property definitions, application schema, action configurations, and action keys.
 * @param {Definition} definitionOfReference - The definition object that serves as the reference for importing group action settings.
 * @param {string} definitionKey - Optional, the reference definition key from which the action group settings are imported.
 */
function importGroupActionSettingsOfReference(importActionParams, definitionOfReference, definitionKey) {
    const { actionPropertyDefinition, appSchema, actionsInConfig, actionKey } = importActionParams;
    let resolvedDefinitionOfReference = definitionOfReference;
    let resolvedDefinitionKey = (0, utils_1.getDefinitionKey)(resolvedDefinitionOfReference.$ref ?? actionPropertyDefinition.$ref);
    /* Some action groups (e.g. form group actions) have wrapper definition in the schema, in such cases we need to use the referenced definition. */
    const hasActionGroupWrapper = (0, utils_1.getDefinitionKey)(definitionOfReference.$ref) === `ObjectPageFormActionGroup<${definitionKey}>`;
    if (hasActionGroupWrapper) {
        resolvedDefinitionKey = (0, utils_1.getDefinitionKey)(definitionOfReference.$ref);
        resolvedDefinitionOfReference = appSchema.definitions[resolvedDefinitionKey];
    }
    // create an instance of the action group in the configuration object
    importActionToConfigurationObject(importActionParams, resolvedDefinitionKey, true);
    // newly created action group instance is available in the actionsInConfig object
    const actionGroup = actionsInConfig[actionKey];
    // fill the action group with the action settings of the group action
    const { properties } = resolvedDefinitionOfReference;
    for (const propertyKey in properties) {
        const actionInGroupProperty = properties[propertyKey];
        if (actionInGroupProperty['$ref']) {
            const actionInGroupPropertyKey = (0, utils_1.getDefinitionKey)(actionInGroupProperty['$ref']);
            const actionInGroupDefinition = appSchema.definitions[actionInGroupPropertyKey];
            const key = (0, utils_1.getDefinitionKey)(actionInGroupDefinition.$ref ?? actionInGroupProperty['$ref']);
            const importGroupedActionParams = {
                ...importActionParams,
                actionsInConfig: actionGroup,
                actionKey: propertyKey
            };
            importActionToConfigurationObject(importGroupedActionParams, key);
        }
    }
    (0, common_1.removeEmptyStructure)(actionsInConfig, actionKey);
}
/**
 * Imports and updates the action menu settings in a configuration object based on a given reference definition and related action parameters.
 *
 * @param {ImportActionSettingsOfReferenceParams} importActionParams - An object containing details such as the action property definition, application schema, actions configuration, and action key. These parameters are used for resolving and importing the settings.
 * @param {Definition} definitionOfReference - The reference definition object which includes properties and other settings required to define action menus and their related configurations.
 */
function importManifestBasedActionMenuSettingsOfReference(importActionParams, definitionOfReference) {
    const { actionPropertyDefinition, appSchema, actionsInConfig, actionKey } = importActionParams;
    // create an instance of the menu action in the configuration object
    const key = (0, utils_1.getDefinitionKey)(definitionOfReference.$ref ?? actionPropertyDefinition.$ref);
    importActionToConfigurationObject(importActionParams, key, true);
    // newly created menu action instance is available in the actionsInConfig object
    const menuAction = actionsInConfig[actionKey];
    menuAction[ux_specification_types_1.PropertyName.menu] = actionPropertyDefinition[ux_specification_types_1.PropertyName.menu];
    menuAction[ux_specification_types_1.PropertyName.actions] = {};
    menuAction[ux_specification_types_1.PropertyName.text] = definitionOfReference.description;
    const actionsDefinitionKey = (0, utils_1.getDefinitionKey)(definitionOfReference?.properties?.[ux_specification_types_1.PropertyName.actions]?.$ref);
    const actionsDefinition = appSchema.definitions[actionsDefinitionKey];
    // fill the action menu with the action settings of the menu action
    const actions = actionsDefinition?.properties ?? {};
    for (const action in actions) {
        const actionInMenuActionProperty = actions[action];
        const actionInMenuActionPropertyKey = (0, utils_1.getDefinitionKey)(actionInMenuActionProperty['$ref']);
        const actionInMenuActionDefinition = appSchema.definitions[actionInMenuActionPropertyKey];
        const key = (0, utils_1.getDefinitionKey)(actionInMenuActionDefinition?.$ref ?? actionInMenuActionProperty['$ref']);
        const importMenuActionParams = {
            ...importActionParams,
            actionsInConfig: menuAction[ux_specification_types_1.PropertyName.actions],
            actionKey: action
        };
        importActionToConfigurationObject(importMenuActionParams, key);
    }
    (0, common_1.removeEmptyStructure)(actionsInConfig, actionKey);
}
/**
 * Determines the strategy type for action settings based on the provided data type and action type.
 *
 * @param {string} [dataType=''] - The data type associated with the action settings. Defaults to an empty string.
 * @param {string} [actionType=''] - The action type within the context of the action settings. Defaults to an empty string.
 * @returns {DataFieldStrategyTypes} The corresponding strategy type for the given data type and action type.
 */
function determineActionStrategyType(dataType = '', actionType = '') {
    const key = `${dataType}${actionType}`;
    return strategyTypeMap.get(key) || "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */;
}
/**
 * Imports the action settings of a specified reference based on the given parameters.
 *
 * @param {object} importActionParams - The parameters required for importing action settings.
 * @param {object} importActionParams.actionPropertyDefinition - The action property definition containing the $ref to the reference.
 * @param {object} importActionParams.appSchema - The application schema containing definitions and other related metadata.
 */
function importActionSettingsOfReference(importActionParams) {
    const { actionPropertyDefinition, appSchema } = importActionParams;
    const definitionKey = (0, utils_1.getDefinitionKey)(actionPropertyDefinition.$ref);
    const definitionOfReference = appSchema.definitions[definitionKey];
    const dataType = definitionOfReference?.['dataType'];
    const actionType = actionPropertyDefinition?.[ACTION_TYPE];
    const strategyType = determineActionStrategyType(dataType, actionType);
    const strategy = DataFieldStrategy_1.dataFieldStrategyContext.getStrategy(strategyType);
    strategy.importActionSettingsOfReference(importActionParams, definitionOfReference, definitionKey);
}
/**
 * Enhances the application schema with custom field definitions for Object Page sections.
 *
 * @param appSchema - The application-specific JSON schema object representing the Object Page.
 * @param v4Page - The current Object Page configuration from the manifest (V4 format).
 * @param fieldGroupInManifest - The manifest identifier for the Object Page section associated with the field definitions.
 * @param logger - Logger instance for reporting or debugging schema processing errors.
 * @param customFieldDefinitionName - The schema definition name to be used for custom fields (defaults to `CustomTableAction`).
 * @param fieldsDefinitionName - The schema definition name for the set of fields being enhanced.
 */
function addCustomFieldDefinition(appSchema, v4Page, fieldGroupInManifest, logger, customFieldDefinitionName, fieldsDefinitionName) {
    const definition = appSchema.definitions[fieldsDefinitionName];
    if (!definition) {
        return;
    }
    // Sort existing actions
    let sortedFieldsArray = sortPropertiesRecords(definition);
    const configId = fieldGroupInManifest.replace(/::/g, '#');
    const fields = v4Page.options?.settings?.controlConfiguration?.[configId]?.['fields'];
    if (fields) {
        sortedFieldsArray = addExtensionToArray(fields, sortedFieldsArray, customFieldDefinitionName, ux_specification_types_1.TemplatePropertyName.Template, logger);
    }
    // Adjust propertyIndex
    if (sortedFieldsArray) {
        for (let index = 0; index < sortedFieldsArray.length; index++) {
            sortedFieldsArray[index][1][ux_specification_types_1.SchemaTag.propertyIndex] = index;
        }
        const sortedFieldsAsObject = {};
        sortedFieldsArray.forEach(([key, value]) => (sortedFieldsAsObject[key] = value));
        appSchema.definitions[fieldsDefinitionName].properties = sortedFieldsAsObject;
    }
}
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param {string} appSchema - Full schema.
 * @param {string | undefined} definitionName - The name of the definition/class whose properties are being processed.
 *   If `undefined`, the function attempts to resolve the definition name from the `$ref` property of the provided definition.
 * @param {Definition} definition - The definition object containing property schemas.
 * @param {ManifestPathParams} pathParams - Additional context required to compute manifest paths.
 * @param handleRelative - A flag indicating whether to use relative paths for definition properties.
 */
function addManifestPathsToProperties(appSchema, definitionName, definition, pathParams, handleRelative = false) {
    (0, utils_1.addManifestPathsToProperties)([v4controls, pages], appSchema, definitionName, definition, pathParams, undefined, handleRelative);
}
/**
 * Returns the manifest path for a given page based on the provided path parameters.
 *
 * @param {ManifestPathParams} pathParams - Parameters containing page information for path resolution.
 * @returns {string | undefined} The resolved manifest path as a string, or undefined if not applicable.
 */
function getPageManifestPath(pathParams) {
    if (!Array.isArray(pathParams.pageName)) {
        const syncPath = (0, application_1.getPathForPage)([pathParams.pageName]);
        return (0, utils_1.convertSyncRulePathToJsonPath)(syncPath);
    }
}
//# sourceMappingURL=utils.js.map