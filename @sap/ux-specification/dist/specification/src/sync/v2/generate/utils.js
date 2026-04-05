"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFieldTarget = void 0;
exports.handleActionRecord = handleActionRecord;
exports.retrieveNameWithoutVocabularyFromVisualization = retrieveNameWithoutVocabularyFromVisualization;
exports.addLineItemsType = addLineItemsType;
exports.addListReportLeadingProperties = addListReportLeadingProperties;
exports.addTabkeyEnum = addTabkeyEnum;
exports.addFragmentEnum = addFragmentEnum;
exports.addTableColumnExtensions = addTableColumnExtensions;
exports.processMetadata = processMetadata;
exports.removeElementsFromEnum = removeElementsFromEnum;
exports.addSelectionFields = addSelectionFields;
exports.addEntityPropertiesToEnum = addEntityPropertiesToEnum;
exports.isDraftEnabled = isDraftEnabled;
exports.isEntityDeletable = isEntityDeletable;
exports.isEntityUpdatable = isEntityUpdatable;
exports.addStandardHeaderActions = addStandardHeaderActions;
exports.addStandardFooterActionsOP = addStandardFooterActionsOP;
exports.getUIAnnotationForEntitySet = getUIAnnotationForEntitySet;
exports.getLineItemAnnotation = getLineItemAnnotation;
exports.getLineItemInfo = getLineItemInfo;
exports.getExportTablesPropertiesAdapter = getExportTablesPropertiesAdapter;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../../common");
const decorators_1 = require("../../common/decoration/decorators");
const path_1 = require("path");
const xml_js_1 = require("xml-js");
const types_1 = require("../types");
const types_2 = require("../../../../../types/src/common/types");
const extensionLogger_1 = require("../../../extensionLogger");
const manifestPropertyUtils_1 = require("./manifestPropertyUtils");
const stableIdUtils_1 = require("./stableIdUtils");
const i18next_1 = __importDefault(require("i18next"));
/**
 * Common function for enhancing the LineItems definition of app schema by custom columns.
 *
 * @param appSchema - app-specific JSON schema
 * @param customColumnsDefinitionName - custom column definition name (plural)
 * @param customColumnDefinitionName - custom column definition name (singular)
 */
function addCustomColumnDefinition(appSchema, customColumnsDefinitionName, customColumnDefinitionName) {
    if (appSchema.definitions[ux_specification_types_1.DefinitionName.LineItems]) {
        appSchema.definitions[ux_specification_types_1.DefinitionName.LineItems].properties['custom'] = {
            $ref: `${common_1.DEFINITION_LINK_PREFIX}${customColumnsDefinitionName}`
        };
    }
    appSchema.definitions[customColumnsDefinitionName] = {
        type: 'array',
        items: {
            $ref: `${common_1.DEFINITION_LINK_PREFIX}${customColumnDefinitionName}`
        },
        description: 'Custom Columns'
    };
    appSchema.definitions[customColumnsDefinitionName][ux_specification_types_1.SchemaTag.isViewNode] = true;
    const extensionType = appSchema.definitions[customColumnDefinitionName].properties['extensionType'];
    if (extensionType) {
        extensionType[ux_specification_types_1.SchemaTag.artifactType] = ux_specification_types_1.ArtifactType.Manifest;
    }
}
/**
 * Prepares and returns id of action for further use and reference.
 *
 * @param actionType - type of action
 * @param lineItemProperties - properties of the line item collection: lineItemPath, lineItemRecord, lineItemId
 * @param lineItemProperties.lineItemPath - The path to the line item in the schema.
 * @param lineItemProperties.lineItemRecord - The record of the line item in the collection.
 * @param lineItemProperties.lineItemId - The identifier of the line item.
 * @param lineItemProperties.entityType - The entity type as part of the AVT ConvertedMetadata.
 * @returns {string} actionId
 */
function getActionId(actionType, lineItemProperties) {
    let actionId;
    if (actionType === types_1.ActionTypeV2.ColumnIntentBased) {
        actionId = (0, common_1.getSchemaKeyOfLineItemRecord)(lineItemProperties.lineItemRecord);
    }
    else if (actionType === types_1.ActionTypeV2.ToolBarIntentBased || actionType === types_1.ActionTypeV2.FooterIntentBased) {
        actionId = (0, common_1.prepareRef)(`${lineItemProperties.lineItemRecord.SemanticObject}::${lineItemProperties.lineItemRecord.Action}`);
    }
    else if (actionType === types_1.ActionTypeV2.Column &&
        lineItemProperties.lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) {
        actionId = (0, common_1.prepareRef)(`DataFieldForAction:::sAction::${lineItemProperties.lineItemRecord.Action}`);
    }
    else {
        actionId = (0, common_1.prepareRef)(lineItemProperties.lineItemRecord.Action);
    }
    if (lineItemProperties.lineItemId && lineItemProperties.lineItemId !== 'LineItems') {
        return `${lineItemProperties.lineItemId}??${actionId}`;
    }
    else {
        return actionId;
    }
}
/**
 * Processes a LineItem record of type DataFieldForAction and DataFieldForIntentBasedNavigation during app schema generation.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param actions - actions definition in schema, parent object
 * @param lineItemProps - properties of the line item collection: lineItemPath, lineItemRecord, lineItemId
 * @param lineItemProps.lineItemPath - The path to the line item in the schema.
 * @param lineItemProps.lineItemRecord - The record of the line item in the collection.
 * @param lineItemProps.lineItemId - The identifier of the line item.
 * @param lineItemProps.entityType - the entity type as part of the AVT ConvertedMetadata
 * @param actionType - type of action
 * @param recordIndex - record index in the collection
 */
function handleActionRecord(appSchema, actions, lineItemProps, actionType, recordIndex) {
    let actionReferenceType;
    const actionTemplate = lineItemProps.lineItemId === ux_specification_types_1.DefinitionName.LineItems ? '' : 'ObjectPage';
    const actionId = getActionId(actionType, lineItemProps);
    if (actionType === types_1.ActionTypeV2.Footer || actionType === types_1.ActionTypeV2.FooterIntentBased) {
        actionReferenceType = `Action`;
        actionType = types_1.ActionTypeV2.Footer;
    }
    else if (actionType === types_1.ActionTypeV2.Column || actionType === types_1.ActionTypeV2.ColumnIntentBased) {
        actionReferenceType = `TableColumnAction`;
    }
    else {
        actionReferenceType = actionTemplate !== '' ? `${actionTemplate}${actionType}` : `Action`;
        actionType = types_1.ActionTypeV2.ToolBar;
    }
    const actionDefinition = `${actionTemplate}${actionType}<${actionId}>`;
    const description = (0, common_1.getDataFieldDescription)(lineItemProps.lineItemRecord, lineItemProps.entityType);
    actions.properties[actionId] = {
        $ref: common_1.DEFINITION_LINK_PREFIX + actionDefinition
    };
    actions.properties[actionId][ux_specification_types_1.SchemaTag.propertyIndex] = recordIndex;
    const { key, ns } = (0, common_1.getActionKey)(lineItemProps.lineItemRecord.Action, true);
    if (appSchema.definitions[actionReferenceType]) {
        appSchema.definitions[actionDefinition] = {
            ...JSON.parse(JSON.stringify(appSchema.definitions[actionReferenceType])),
            description,
            keys: [{ name: 'Action', value: key }],
            annotationPath: `${lineItemProps.lineItemPath}/${recordIndex}`
        };
        if (ns) {
            appSchema.definitions[actionDefinition][ux_specification_types_1.SchemaTag.target] = ns;
        }
    }
    else {
        appSchema.definitions[actionDefinition] = {
            type: 'object',
            properties: {},
            description,
            additionalProperties: false
        };
        appSchema.definitions[actionDefinition][ux_specification_types_1.SchemaTag.isViewNode] = true;
        appSchema.definitions[actionDefinition][ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.action, value: key }];
        if (ns) {
            appSchema.definitions[actionDefinition][ux_specification_types_1.SchemaTag.target] = ns;
        }
        appSchema.definitions[actionDefinition][ux_specification_types_1.SchemaTag.annotationPath] =
            `${lineItemProps.lineItemPath}/${recordIndex}`;
    }
}
/**
 * Returns the type of a column lineItem action.
 *
 * @param {boolean} isOP - true if we deal with the usage of the line item on an OP, false otherwise;
 * @param {object} lineItemRecord - actual record of the line item collection
 * @param actionTypes - array of action types to be filled
 */
function getColumnActionType(isOP, lineItemRecord, actionTypes) {
    if (isOP &&
        lineItemRecord.Inline === true &&
        (lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */ ||
            lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */)) {
        actionTypes.push(types_1.ActionTypeV2.OPColumn);
    }
    else if (lineItemRecord.Inline === true && lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) {
        actionTypes.push(types_1.ActionTypeV2.Column);
    }
    else if (lineItemRecord.Inline === true &&
        lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */) {
        actionTypes.push(types_1.ActionTypeV2.ColumnIntentBased);
    }
}
/**
 * Returns the type of a lineItem action.
 *
 * @param {object} lineItemRecord - actual record of the line item collection
 * @param {boolean} isOP - true if we deal with the usage of the line item on an OP, false otherwise;
 * @returns {string[] | undefined } ActionTypeV2[] - action type(s) of the lineItem
 */
function getActionType(lineItemRecord, isOP) {
    const actionTypes = [];
    if (lineItemRecord.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */ &&
        lineItemRecord.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */) {
        return undefined;
    }
    if (lineItemRecord.Inline !== true &&
        lineItemRecord.Determining !== true &&
        lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) {
        actionTypes.push(types_1.ActionTypeV2.ToolBar);
    }
    else if (lineItemRecord.Inline !== true &&
        lineItemRecord.Determining !== true &&
        lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */) {
        actionTypes.push(types_1.ActionTypeV2.ToolBarIntentBased);
    }
    else if (lineItemRecord.Determining === true && lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) {
        actionTypes.push(types_1.ActionTypeV2.Footer);
    }
    else if (lineItemRecord.Determining === true &&
        lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */) {
        actionTypes.push(types_1.ActionTypeV2.FooterIntentBased);
    }
    getColumnActionType(isOP, lineItemRecord, actionTypes);
    return actionTypes;
}
/**
 * Generates a generic column for the line item collection.
 *
 * @param lineItemProperties - Properties of the line item collection, including path, record, ID, and entity type.
 * @param appSchema - The app-specific JSON schema to be enhanced.
 * @param recordIndex - The index of the current record in the line item collection.
 */
function generateGenericColumn(lineItemProperties, appSchema, recordIndex) {
    const schemaKey = (0, common_1.getSchemaKeyOfLineItemRecord)(lineItemProperties.lineItemRecord);
    if (schemaKey) {
        const lineItemDefinition = appSchema.definitions[lineItemProperties.lineItemId];
        lineItemDefinition.properties[schemaKey] = {
            $ref: common_1.DEFINITION_LINK_PREFIX + ux_specification_types_1.DefinitionName.TableColumn,
            description: (0, common_1.getDataFieldDescription)(lineItemProperties.lineItemRecord, lineItemProperties.entityType)
            // Custom property in schema - for object properties ordering purpose
        };
        lineItemDefinition.properties[schemaKey][ux_specification_types_1.SchemaTag.propertyIndex] = recordIndex;
        lineItemDefinition.properties[schemaKey][ux_specification_types_1.SchemaTag.annotationPath] =
            `${lineItemProperties.lineItemPath}/${recordIndex}`;
        (0, common_1.addDataTypeToDefinition)(lineItemDefinition.properties[schemaKey], lineItemProperties.lineItemRecord);
        (0, common_1.addKeyToDefinition)(lineItemProperties.lineItemRecord, lineItemDefinition.properties, schemaKey);
    }
}
/**
 * Handles any action type of a line item record.
 *
 * @param actionType - The type of action being processed.
 * @param appSchema - The app-specific JSON schema to be enhanced.
 * @param actions - The actions definition in the schema, parent object.
 * @param lineItemProperties - Properties of the line item collection, including path, record, ID, and entity type.
 * @param recordIndex - The index of the current record in the line item collection.
 * @param footerActions - The footer actions definition in the schema, if applicable.
 * @param lineItemId - The identifier of the line item, used to distinguish between different line item collections.
 */
function handleAnyAction(actionType, appSchema, actions, lineItemProperties, recordIndex, footerActions, lineItemId) {
    switch (actionType) {
        case types_1.ActionTypeV2.ToolBar:
        case types_1.ActionTypeV2.ToolBarIntentBased: {
            handleActionRecord(appSchema, actions, lineItemProperties, actionType, recordIndex);
            break;
        }
        case types_1.ActionTypeV2.Footer:
        case types_1.ActionTypeV2.FooterIntentBased: {
            if (footerActions) {
                handleActionRecord(appSchema, footerActions, lineItemProperties, actionType, recordIndex);
            }
            break;
        }
        case types_1.ActionTypeV2.Column:
        case types_1.ActionTypeV2.ColumnIntentBased: {
            handleActionRecord(appSchema, appSchema.definitions[lineItemId], lineItemProperties, actionType, recordIndex);
            break;
        }
        case types_1.ActionTypeV2.OPColumn: {
            generateGenericColumn(lineItemProperties, appSchema, recordIndex);
        }
    }
}
/**
 *
 * @param annotationTerm "unqualified" annotation term that can be specified whithin a visualization (i.e. "LineItem" or "Chart")
 * @param visualization one visualization of a PresentationVariant
 * @returns empty string if the visualization does not match the annotationTerm. Otherwise the value of the visualization stripped by the reference to the ui vocabulary
 */
function retrieveNameWithoutVocabularyFromVisualization(annotationTerm, visualization) {
    // check whether the value of the visualization specifies the fully qualified annotation term if yes, return the value without the vocabulary prefix, otherwise the empty string
    const visualizationValue = visualization.value;
    return visualizationValue.includes(ux_specification_types_1.UIVOCABULARYALPHADOT + annotationTerm) // replace includes with startsWith?
        ? visualizationValue.replace(ux_specification_types_1.UIVOCABULARYALPHADOT, '')
        : '';
}
/**
 * Adds the line item records to the app schema (for the list report or an object page section comprising a table).
 *
 * @param isObjectPage - indicates that the page is an object page
 * @param appSchema - the app specific schema that shall get enhanced
 * @param lineItemAnnotation - the UI.LineItem annotation, comprising all records
 * @param entityType - the entity type as part of the AVT ConvertedMetadata
 * @param lineItemId - optional: in case of OP the parameter must be passed to distinguish the OP tables;
 *                      in case of LR or ALP no ID is passed, 'LineItems' is taken then.
 * @param customColumnRef - schema reference to custom column definition.
 */
function addLineItemsType(isObjectPage, appSchema, lineItemAnnotation, entityType, lineItemId, customColumnRef) {
    const isOP = !!lineItemId;
    // Add the correct lineItem definition
    lineItemId = lineItemId || ux_specification_types_1.DefinitionName.LineItems;
    const { actions, footerActions, lineItemPath } = (0, common_1.addCommonLineItemDefinitions)(isObjectPage, appSchema, lineItemAnnotation, entityType, lineItemId);
    if (lineItemAnnotation) {
        let recordIndex = 0;
        lineItemAnnotation.forEach((lineItemRecord) => {
            const lineItemProperties = { lineItemPath, lineItemRecord, lineItemId, entityType };
            const actionTypes = getActionType(lineItemRecord, isOP);
            if (actionTypes) {
                actionTypes.forEach((actionType) => {
                    handleAnyAction(actionType, appSchema, actions, lineItemProperties, recordIndex, footerActions, lineItemId);
                });
            }
            else {
                generateGenericColumn(lineItemProperties, appSchema, recordIndex);
            }
            recordIndex++;
        });
    }
    if (customColumnRef) {
        appSchema.definitions[lineItemId].properties['custom'] = {
            $ref: `${common_1.DEFINITION_LINK_PREFIX}${customColumnRef}`
        };
    }
}
/**
 * Adds enum entries of possible leading properties for 'leadingProperty' property in TableCustomColumn properties.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param entityType - the entity type as part of the AVT ConvertedMetadata
 * @param definitionName - definition name of CustomColumn definition
 */
function addListReportLeadingProperties(appSchema, entityType, definitionName) {
    // Leading Property
    const leadingPropertySchema = appSchema.definitions[definitionName]?.['properties']?.['leadingProperty'];
    if (leadingPropertySchema) {
        const properties = [
            //  Entity properties
            ...(entityType?.entityProperties || []),
            // Navigation Properties
            ...(entityType?.navigationProperties || [])
        ];
        leadingPropertySchema['enum'] = properties?.reduce((result, property) => {
            if (!result.includes(property.name)) {
                result.push(property.name);
            }
            return result;
        }, []);
    }
}
/**
 * Adds enum entries of posible tabKey properties for 'leadingProperty' property in TableCustomColumn properties.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param definitionName - definition name of CustomColumn definition
 * @param page - sapui5 page object
 * @param facetID -  The facet ID
 */
function addTabkeyEnum(appSchema, definitionName, page, facetID) {
    const tabkeyPropertySchema = appSchema.definitions[definitionName]?.['properties']?.['tabKey'];
    if (!page) {
        if (facetID) {
            tabkeyPropertySchema.description =
                'In case of Object Page, the tabkey in manifest is equivalent to the facet ID.';
            tabkeyPropertySchema['enum'] = [facetID];
        }
        return;
    }
    const quickVariantsX = page.component?.settings?.quickVariantSelectionX?.['variants'];
    if (quickVariantsX) {
        const enumEntries = [];
        for (const index in quickVariantsX) {
            const key = quickVariantsX[index]?.key;
            if (key !== undefined && !enumEntries.includes(key)) {
                enumEntries.push(key);
            }
        }
        (0, common_1.addEnumToSchema)(enumEntries, tabkeyPropertySchema);
    }
}
/**
 * Adds enum entries of posible fragment entries.
 *
 * @param {object} appSchema The app specific schema that shall get enhanced.
 * @param {FileData[]} fragments Array of fragments.
 * @param {string[]} appId Application id.
 * @param {string} property Property name.
 * @param {string} definitionName Definition name of CustomColumn definition.
 */
function addFragmentEnum(appSchema, fragments, appId, property, definitionName) {
    if (!fragments || !appId || appId.startsWith('${')) {
        return;
    }
    const enumEntries = [];
    fragments.forEach((fragment) => {
        let relPath = fragment.dataSourceUri.split('webapp')[1];
        if (relPath && relPath.indexOf('.fragment.xml') > 0) {
            const fragmentJson = JSON.parse((0, xml_js_1.xml2json)(fragment.fileContent, { compact: true }))['core:FragmentDefinition'];
            if ((property === 'fragmentName' &&
                (!fragmentJson ||
                    fragmentJson.Column ||
                    fragmentJson['table:Column'] ||
                    fragmentJson['table:AnalyticalColumn'])) ||
                (property === 'cellsFragmentName' &&
                    (!fragmentJson ||
                        (!fragmentJson.Column &&
                            !fragmentJson['table:Column'] &&
                            !fragmentJson['table:AnalyticalColumn'] &&
                            !fragmentJson['smartfilterbar:ControlConfiguration'])))) {
                relPath = relPath.replace(new RegExp('\\' + path_1.sep, 'g'), '/');
                const fragmentName = appId + relPath.split('.fragment.xml')[0].replace(/\//g, '.');
                enumEntries.push(fragmentName);
            }
        }
    });
    (0, common_1.addEnumToSchema)(enumEntries, appSchema.definitions[definitionName]?.['properties']?.[property]);
}
/**
 * Adds the custom columns to the line item records of the app schema (for the list report comprising a table).
 *
 * @param appSchema The app specific schema that shall get enhanced.
 * @param entityType The entity type as part of the AVT ConvertedMetadata.
 * @param page Sapui5 page object.
 * @param manifest Application manifest.
 * @param [fragments] Array of fragments.
 * @param [customColumnsDefinitionName] Definition name of Custom Columns definition.
 * @param [customColumnDefinitionName] Definition name of Custom Column definition.
 * @param facetID -  Facet ID
 */
function addTableColumnExtensions(appSchema, entityType, page, manifest, fragments, customColumnsDefinitionName = ux_specification_types_1.DefinitionName.CustomColumns, customColumnDefinitionName = ux_specification_types_1.DefinitionName.CustomColumn, facetID) {
    addCustomColumnDefinition(appSchema, customColumnsDefinitionName, customColumnDefinitionName);
    // Leading Property
    addListReportLeadingProperties(appSchema, entityType, customColumnDefinitionName);
    // Tab key property
    addTabkeyEnum(appSchema, customColumnDefinitionName, page, facetID);
    // Fragment property
    const appId = manifest && manifest['sap.app'] && manifest['sap.app']['id'];
    addFragmentEnum(appSchema, fragments, appId, 'fragmentName', customColumnDefinitionName);
    //tools-suite does not distinguish by section ID, looks at the generic entry
    addFragmentEnum(appSchema, fragments, appId, 'fragmentName', ux_specification_types_1.DefinitionName.CustomColumn);
    addFragmentEnum(appSchema, fragments, appId, 'cellsFragmentName', customColumnDefinitionName);
    addFragmentEnum(appSchema, fragments, appId, 'cellsFragmentName', ux_specification_types_1.DefinitionName.CustomColumn);
}
/**
 * Processes an anyOf definition of the generic schema.
 *
 * @param propertyDefinition - current definition in the generic schema
 * @param schema - the app-specific schema
 * @param propertyKey - key of the single property
 * @param factory - factory for creating metadata instances
 * @param pageType - page type
 * @param processedRefs - array of already processed refs which used to avoid cycling recursion
 */
function processAnyOf(propertyDefinition, schema, propertyKey, factory, pageType, processedRefs) {
    propertyDefinition['anyOf'].forEach((element) => {
        const nextDefinition = (0, common_1.getNextTargetDefinition)(schema, '', {}, element, propertyKey, factory, pageType);
        if (nextDefinition) {
            processMetadata(schema, nextDefinition.targetDefinition, nextDefinition.configObject, pageType, factory, processedRefs, element.$ref);
        }
    });
}
/**
 * Processes an object reference of the generic schema.
 *
 * @param schema - The JSON schema to be processed.
 * @param propertyDefinition - current definition in the generic schema
 * @param propertyKey - key of the single property
 * @param factory - factory for creating metadata instances
 * @param pageType - page type
 * @param processedRefs - array of already processed refs which used to avoid cycling recursion
 */
function processObject(schema, propertyDefinition, propertyKey, factory, pageType, processedRefs) {
    const nextDefinition = (0, common_1.getNextTargetDefinition)(schema, '', {}, propertyDefinition, propertyKey, factory, pageType);
    if (nextDefinition) {
        processMetadata(schema, nextDefinition.targetDefinition, nextDefinition.configObject, pageType, factory, processedRefs, propertyDefinition.$ref);
    }
}
/**
 * Determines the artifact type of a property and adds it to the property definition in schema.
 *
 * @param syncRule - sync rule of the current property
 * @param propertyDefinition - current definition in the generic schema
 */
function addArtifactType(syncRule, propertyDefinition) {
    if (syncRule.manifest !== undefined) {
        propertyDefinition.artifactType = ux_specification_types_1.ArtifactType.Manifest;
    }
    else if (syncRule.flex !== undefined) {
        propertyDefinition.artifactType = ux_specification_types_1.ArtifactType.FlexChange;
        //Add control type
        if (syncRule.flex.controlType) {
            propertyDefinition.controlType = syncRule.flex.controlType();
        }
    }
    else if (syncRule.processingRuleAdapter === undefined) {
        // artifact type 'annotation' is actually useless in V2. For compatibility we leave it in for legacy cases, until new logic has been established everywhere.
        propertyDefinition.artifactType = ux_specification_types_1.ArtifactType.Annotation;
    }
}
/**
 * After the generation of a generic schema, apply post-generation rule to a single property.
 *
 * @param metaDataDefinition - The metadata definition object containing property configurations and rules.
 * @param schema - given app schema, to be adapted
 * @param pageType - page type
 * @param factory - factory for creating metadata instances
 * @param propertyDefinition - definition of the single property
 * @param propertyKey - key of the single property
 * @param schemaDefinition - the current entry point or definition in the app schema
 * @param processedRefs - array of already processed refs which used to avoid cycling recursion
 */
function processSingleProperty(metaDataDefinition, schema, pageType, factory, propertyDefinition, propertyKey, schemaDefinition, processedRefs) {
    if (metaDataDefinition) {
        //get sync rule from reflect metadata
        const syncRule = (0, decorators_1.getReflectMetadata)(metaDataDefinition, propertyKey);
        if (syncRule) {
            if (typeof syncRule.generate === 'function') {
                syncRule.generate(schema, schemaDefinition, propertyKey);
                propertyDefinition = schemaDefinition['properties'][propertyKey];
            }
            //Add artifact type
            addArtifactType(syncRule, propertyDefinition);
        }
        //get getDescriptionSrcURL from reflect metadata
        const descriptionSrcURL = (0, decorators_1.getDescriptionSrcURL)(metaDataDefinition, propertyKey);
        if (descriptionSrcURL) {
            propertyDefinition[ux_specification_types_1.SchemaTag.descriptionSrcURL] = descriptionSrcURL;
        }
        if (propertyDefinition.type === 'object' || propertyDefinition.$ref) {
            processObject(schema, propertyDefinition, propertyKey, factory, pageType, processedRefs);
        }
        else if (propertyDefinition['anyOf']) {
            processAnyOf(propertyDefinition, schema, propertyKey, factory, pageType, processedRefs);
        }
    }
}
/**
 * After the generation of a generic schema, apply rules to a list of properties of the given schema section.
 *
 * @param schema - given app schema, to be adapted
 * @param schemaDefinition - the current entry point or definition in the app schema
 * @param metaDataDefinition - the current entry point or definition in the metadata
 * @param propertiesSection - the section of the schema containing properties to process (e.g., 'properties', 'additionalProperties', or 'patternProperties')
 * @param pageType - page type
 * @param factory - factory for creating metadata instances
 * @param processedRefs - array of already processed refs which used to avoid cycling recursion
 */
function processProperties(schema, schemaDefinition, metaDataDefinition, propertiesSection, pageType, factory, processedRefs) {
    if (schemaDefinition[propertiesSection]) {
        for (const propertyKey in schemaDefinition[propertiesSection]) {
            if (propertyKey === 'anyOf') {
                processAnyOf(schemaDefinition[propertiesSection], schema, propertyKey, factory, pageType, processedRefs);
            }
            else {
                const propertyDefinition = schemaDefinition[propertiesSection][propertyKey];
                if (propertyDefinition['anyOf']) {
                    processAnyOf(propertyDefinition, schema, propertyKey, factory, pageType, processedRefs);
                }
                else if (propertyKey === '$ref') {
                    processObject(schema, schemaDefinition[propertiesSection], propertyKey, factory, pageType, processedRefs);
                }
                else {
                    processSingleProperty(metaDataDefinition, schema, pageType, factory, propertyDefinition, propertyKey, schemaDefinition, processedRefs);
                }
            }
        }
    }
}
/**
 * Apply post-processing rules as specified in form of "generate" at the syncRule.
 *
 * @param schema - given app schema, to be adapted
 * @param schemaDefinition - the current entry point or definition in the app schema
 * @param metaDataDefinition - the current entry point or definition in the metadata
 * @param pageType - page type
 * @param factory - factory for creating metadata instances
 * @param processedRefs - array of already processed refs which used to avoid cycling recursion
 * @param ref - currently processed schema definition reference name
 */
function processMetadata(schema, schemaDefinition, metaDataDefinition, pageType, factory, processedRefs, ref) {
    if (ref) {
        if (processedRefs.includes(ref)) {
            return;
        }
        processedRefs.push(ref);
    }
    processProperties(schema, schemaDefinition, metaDataDefinition, 'properties', pageType, factory, processedRefs);
    processProperties(schema, schemaDefinition, metaDataDefinition, 'additionalProperties', pageType, factory, processedRefs);
    processProperties(schema, schemaDefinition, metaDataDefinition, 'patternProperties', pageType, factory, processedRefs);
}
/**
 * Method updates passed 'enum' array by removing passed matching entries.
 *
 * @param {Array<unknown>} values Array of values.
 * @param {Array<unknown>} valuesToRemove Array of values to remove.
 */
function removeElementsFromEnum(values, valuesToRemove) {
    for (const value of valuesToRemove) {
        const index = values.indexOf(value);
        if (index !== -1) {
            // Value exists - remove it
            values.splice(index, 1);
        }
    }
}
/**
 * Adds the selection fields to the app schema, as properties of the Filterbar.
 *
 * @param appSchema - the app specific schema that shall get enhanced
 * @param selectionFieldsAnnotation - the UI.SelectionField annotation
 * @param entityType - the entity type as part of the AVT ConvertedMetadata
 */
function addSelectionFields(appSchema, selectionFieldsAnnotation, entityType) {
    appSchema.definitions.SelectionFields = {
        ...appSchema.definitions.SelectionFields,
        properties: {},
        additionalProperties: false
    };
    const selectionFieldsDefinition = appSchema.definitions.SelectionFields;
    const annotationPath = (0, common_1.createAnnotationPath)(entityType?.fullyQualifiedName, "com.sap.vocabularies.UI.v1.SelectionFields" /* UIAnnotationTerms.SelectionFields */);
    if (annotationPath) {
        selectionFieldsDefinition[ux_specification_types_1.SchemaTag.annotationPath] = annotationPath;
    }
    if (!selectionFieldsAnnotation) {
        return;
    }
    let i = 0;
    selectionFieldsAnnotation.forEach((selectionField) => {
        let description = selectionField.value;
        const fieldDefinition = `SelectionField<${(0, common_1.prepareRef)(selectionField.value)}>`;
        const dataType = (0, common_1.determineDataType)(selectionField);
        if (selectionField.type === 'PropertyPath') {
            description = (0, common_1.getLabelForPropertyPath)(selectionField, entityType);
        }
        selectionFieldsDefinition.properties[selectionField.value] = {
            $ref: common_1.DEFINITION_LINK_PREFIX + fieldDefinition
        };
        selectionFieldsDefinition.properties[selectionField.value][ux_specification_types_1.SchemaTag.propertyIndex] = i;
        appSchema.definitions[fieldDefinition] = {
            type: 'object',
            description,
            additionalProperties: false
        };
        appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.isViewNode] = true;
        appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.annotationType] = selectionField?.type;
        appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.dataType] = dataType;
        appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.keys] = [
            { name: ux_specification_types_1.SchemaKeyName.value, value: `${selectionField.value}` }
        ];
        appSchema.definitions[fieldDefinition][ux_specification_types_1.SchemaTag.annotationPath] = `${selectionFieldsDefinition[ux_specification_types_1.SchemaTag.annotationPath]}/${i}`;
        if (['Date', 'DateTime', 'DateTimeOffset'].includes(dataType)) {
            appSchema.definitions[fieldDefinition]['$ref'] = `${common_1.DEFINITION_LINK_PREFIX}SelectionFieldDateSettings`;
        }
        else {
            appSchema.definitions[fieldDefinition]['properties'] = {};
        }
        i++;
    });
}
/**
 * Add entityProperties to passed a passed enum entry.
 *
 * @param {string[]} appSchemaEnum - Enum to be enhanced
 * @param {EntityType} entityType - Given entity type for which entries shall get generated
 */
function addEntityPropertiesToEnum(appSchemaEnum, entityType) {
    for (const key of entityType.entityProperties) {
        appSchemaEnum.push(key.name);
    }
}
/**
 * Checks if an entity supports draft capabilities.
 *
 * @param {EntitySet} entitySet Entity Set
 * @returns true if the entity supports draft
 */
function isDraftEnabled(entitySet) {
    return !!entitySet.annotations?.Common?.DraftRoot || !!entitySet.annotations?.Common?.DraftNode;
}
/**
 * Function to determine if the entity is deletable.
 *
 * @param {EntitySet} entitySet - current entity set
 * returns {boolean} return true if the Entity is deletable
 */
/**
 * Checks if an entity supports draft capabilities.
 *
 * @param entitySet - The entity set to check for draft capabilities.
 * @returns {boolean} True if the entity supports draft capabilities, otherwise false.
 */
function isEntityDeletable(entitySet) {
    return entitySet.annotations?.Capabilities?.DeleteRestrictions?.Deletable !== false;
}
/**
 * Function to determine if the entity is updatable.
 *
 * @param {EntitySet} entitySet - current entity set
 * @returns returns true if the Entity is updatable
 */
function isEntityUpdatable(entitySet) {
    return entitySet.annotations?.Capabilities?.UpdateRestrictions?.Updatable !== false;
}
/**
 * Adds standard header actions to schema (LR, ALP or OP).
 *
 * @param {Definition} appSchema - app-specific JSON schema
 * @param {boolean} isOP - flag to add to either LR/ALP or OP definition
 * @param {Definition} actions - optional standard actions definition
 */
function addStandardHeaderActions(appSchema, isOP = false, actions) {
    // add standard header actions definitions
    let headerActionsKey = ux_specification_types_1.DefinitionName.HeaderActionsStandard;
    let actionDefinition = ux_specification_types_1.DefinitionName.HeaderActionStandard;
    if (isOP) {
        headerActionsKey = ux_specification_types_1.DefinitionName.ObjectPageHeaderActions;
        actionDefinition = ux_specification_types_1.DefinitionName.ObjectPageHeaderActionStandard;
    }
    const headerActions = appSchema.definitions[headerActionsKey];
    headerActions[ux_specification_types_1.SchemaTag.isViewNode] = true;
    headerActions.description = 'Actions';
    const standardActions = actions || headerActions;
    Object.entries(standardActions.properties).forEach(([name, definition]) => {
        const actionRef = definition['$ref'].split(common_1.DEFINITION_LINK_PREFIX)[1];
        const actionKey = `${actionDefinition}<${actionRef}>`;
        headerActions.properties[name] = { $ref: `${common_1.DEFINITION_LINK_PREFIX}${actionKey}` };
        appSchema.definitions[actionKey] = appSchema.definitions[actionRef];
        appSchema.definitions[actionRef][ux_specification_types_1.SchemaTag.actionType] = ux_specification_types_1.ActionType.Standard;
    });
}
/**
 * Adds standard footer actions to schema of Object Page.
 *
 * @param {Definition} appSchema - app-specific JSON schema
 * @param {Definition} actions - optional standard actions definition
 */
function addStandardFooterActionsOP(appSchema, actions) {
    const standardActions = appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageFooterActions];
    for (const action in standardActions.properties) {
        const actionRef = standardActions.properties[action]['$ref'].split(common_1.DEFINITION_LINK_PREFIX)[1];
        const actionKey = `${ux_specification_types_1.DefinitionName.ObjectPageFooterActionStandard}<${actionRef}>`;
        actions.properties[action] = { $ref: `${common_1.DEFINITION_LINK_PREFIX}${actionKey}` };
        appSchema.definitions[actionKey] = appSchema.definitions[actionRef];
        appSchema.definitions[actionRef][ux_specification_types_1.SchemaTag.actionType] = ux_specification_types_1.ActionType.Standard;
    }
}
/**
 * Extract entity type and ui annotations for a entity set and log an error in case that either of these objects does not exist.
 *
 * @param {GenerateAppSchemaParameters} generateParameters list of API input parameters
 * @returns the entity type and the ui annotations for the given entity set
 */
function getUIAnnotationForEntitySet(generateParameters) {
    const entityType = generateParameters.entitySet?.entityType;
    const uIAnnotations = entityType?.annotations?.UI;
    if (typeof uIAnnotations !== 'object' || Object.keys(uIAnnotations).length === 0) {
        const message = entityType
            ? i18next_1.default.t('NOUIANNOTATIONS', { entityType: entityType.name })
            : i18next_1.default.t('NOENTITYTYPE4SET', { entitySetName: generateParameters.entitySet?.name });
        (0, extensionLogger_1.log)(generateParameters.logger, {
            severity: "error" /* LogSeverity.Error */,
            message: message
        });
    }
    return { entityType, uIAnnotations };
}
/**
 * Helper function for getLineItemAnnotation which determines the presentation variant to be used. The parameters of both functions have identical meaning.
 *
 * @param uIAnnotations - The UI annotations for the entity type.
 * @param annotationPath - Optional annotation path to identify the specific presentation variant.
 * @param logger - Optional logger instance for logging warnings or errors.
 * @returns The determined PresentationVariant or undefined if none is found.
 */
function getPresentationVariantForLineItem(uIAnnotations, annotationPath, logger) {
    let presentationVariant; // the presentation variant to be used to determine the LineItem
    // Note: annotationPath (if it exists) contains the fully qualified annotation name (starting with UIVOCABULARYDOT) which would be a member of enum UIAnnotationTerms.
    // Inside uiAnnotations the unqualified annotation names are used as keys. They can be found in enum FacetBase or obtained from the terms above by removing UIVOCABULARYDOT.
    if (annotationPath) {
        const isSPV = annotationPath.includes("com.sap.vocabularies.UI.v1.SelectionPresentationVariant" /* UIAnnotationTerms.SelectionPresentationVariant */);
        const isPV = !isSPV && annotationPath.includes("com.sap.vocabularies.UI.v1.PresentationVariant" /* UIAnnotationTerms.PresentationVariant */);
        if (isSPV || isPV) {
            const accessor = annotationPath.replace(ux_specification_types_1.UIVOCABULARYDOT, '');
            const uiAnnotation = uIAnnotations[accessor]; // the ui annotation specified by the annotationPath if it exists
            if (uiAnnotation) {
                if (isPV) {
                    presentationVariant = uiAnnotation;
                }
                else {
                    // SPV case
                    presentationVariant = uiAnnotation[types_2.FacetBase.PresentationVariant];
                    if (presentationVariant &&
                        presentationVariant.fullyQualifiedName.includes(types_2.FacetBase.SelectionPresentationVariant)) {
                        presentationVariant = uIAnnotations[types_2.FacetBase.PresentationVariant]; // inline presentation variants are ignored, use standard presentation variant instead
                    }
                }
            }
            else {
                // annotationPath is pointing to a selection presentation variant or a presentation variant but the corresponding annotation does not exist
                (0, extensionLogger_1.log)(logger, {
                    severity: "warning" /* LogSeverity.Warning */,
                    message: i18next_1.default.t('NOANNOTATIONFORPATH', { annotationPath: annotationPath })
                });
                // If the annotationPath has specified a non-existing selection presentation variant fall back to the standard presentation variant
                if (isSPV) {
                    presentationVariant = uIAnnotations[types_2.FacetBase.PresentationVariant];
                }
            }
        }
        else {
            // annotationPath exists but does not point to a selection presentation variant or presentation variant (should point to a selection variant then)
            presentationVariant = uIAnnotations[types_2.FacetBase.PresentationVariant]; // use standard presentation variant in this case
        }
    }
    else {
        presentationVariant = uIAnnotations[types_2.FacetBase.PresentationVariant];
    }
    return presentationVariant;
}
/**
 * Determine the LineItemAnnotation to be used for the LR.
 * Reproduces logic from Fiori Elements LR implementation (function createWorkingContext in LR specific AnnotationHelper).
 *
 * @param uIAnnotations - The UI annotations for the entity type.
 * @param settings - Optional settings object, typically a piece of the manifest, containing an optional annotationPath property.
 * @param logger - Optional logger instance for logging warnings or errors.
 * @returns The determined LineItem annotation or undefined if none is found.
 */
function getLineItemAnnotation(uIAnnotations, settings, // an object (actually a piece of the manifest) possessing an optional property annotationPath which would define the path to the PresentationVariant
logger // used in case an error/warning is detected while determining the result
) {
    if ((0, manifestPropertyUtils_1.hasPropertyTypeError)(settings, 'annotationPath', logger)) {
        return undefined; // return undefined in case there is an error in the settings
    }
    const presentationVariant = getPresentationVariantForLineItem(uIAnnotations, settings?.['annotationPath'], logger); // the presentation variant to be used to determine the LineItem (if there is one)
    // If a PV could be determined LineItem should be defined as a visualization of the PV.
    const visualizations = presentationVariant?.Visualizations || [];
    let lineItemName = ''; // the name that will be used to retrieve the LineItem from uiAnnotations
    visualizations.some(function (visualization) {
        lineItemName = retrieveNameWithoutVocabularyFromVisualization(types_2.FacetBase.LineItem, visualization);
        return lineItemName; // end loop as soon as name of LineItem has been identified
    });
    // If the above logic did not identify a name for the LineItem then still the corresponding annotation (but without qualifier) will be used
    lineItemName = lineItemName || types_2.FacetBase.LineItem;
    const lineItem = uIAnnotations[lineItemName];
    if (!lineItem) {
        (0, extensionLogger_1.log)(logger, {
            severity: "warning" /* LogSeverity.Warning */,
            message: i18next_1.default.t('NOLINEITEMFORPATH', { annotationPath: lineItemName })
        });
    }
    return lineItem;
}
/**
 * Possible placements for a datafield in the ui.
 */
var DataFieldTarget;
(function (DataFieldTarget) {
    DataFieldTarget["Column"] = "Column";
    DataFieldTarget["Toolbar"] = "Toolbar";
    DataFieldTarget["Footer"] = "Footer";
})(DataFieldTarget || (exports.DataFieldTarget = DataFieldTarget = {}));
/**
 * Determines the target placement of an action based on its type.
 *
 * @param actionType - The type of the action
 * @returns The target placement for the action, or undefined if no target can be determined
 */
function getTargetFromActionType(actionType) {
    switch (actionType) {
        case types_1.ActionTypeV2.ToolBar:
        case types_1.ActionTypeV2.ToolBarIntentBased: {
            return DataFieldTarget.Toolbar;
        }
        case types_1.ActionTypeV2.Footer:
        case types_1.ActionTypeV2.FooterIntentBased: {
            return DataFieldTarget.Footer;
        }
        case types_1.ActionTypeV2.Column:
        case types_1.ActionTypeV2.ColumnIntentBased: {
            return DataFieldTarget.Column;
        }
        case types_1.ActionTypeV2.OPColumn: {
            return undefined; // TODO: Revisit when this code should also be used for OP
        }
    }
}
/**
 * Collects all relevant information about a given line item.
 *
 * @param lineItemName - the name of the line item annotation (including qualifier if any)
 * @param lineItemDefinition - the definition of the line item
 * @param entityType - the entity type the line item belongs to
 * @param tableType - the table type the line item is used for
 * @param generateParameters - the generation parameters of the process the information is collected for. Used for logging.
 * @param isOP - whether the line item is for an object page
 * @returns an instance of LineItemInfo containing the collected information
 */
function getLineItemInfo(lineItemName, lineItemDefinition, entityType, tableType, generateParameters, isOP) {
    const dataFieldInfos = [];
    lineItemDefinition.forEach((lineItemRecord) => {
        const isDataField = lineItemRecord.$Type === "com.sap.vocabularies.UI.v1.DataField" /* UIAnnotationTypes.DataField */;
        const stableIdPart = (0, stableIdUtils_1.getStableIdPartFromDataField)(lineItemRecord, generateParameters) || '';
        const description = (0, common_1.getDataFieldDescription)(lineItemRecord, entityType);
        const actionTypes = isDataField ? undefined : getActionType(lineItemRecord, isOP);
        if (actionTypes) {
            const message = lineItemRecord.Label
                ? undefined
                : {
                    type: ux_specification_types_1.PropertyMessageType.Warning,
                    text: i18next_1.default.t('NOLABELFORBUTTON')
                };
            actionTypes.forEach((actionType) => {
                const target = getTargetFromActionType(actionType); // Note that actionType has been produced by getActionType, so undefined can be excluded
                const dataFieldInfo = {
                    isAction: true,
                    target,
                    stableIdPart,
                    description,
                    dataField: lineItemRecord
                };
                if (message) {
                    dataFieldInfo.message = message;
                }
                dataFieldInfos.push(dataFieldInfo);
            });
        }
        else {
            const dataFieldInfo = {
                isAction: false,
                target: DataFieldTarget.Column,
                stableIdPart,
                description,
                dataField: lineItemRecord
            };
            dataFieldInfos.push(dataFieldInfo);
        }
    });
    return {
        name: lineItemName,
        dataFieldInfos: dataFieldInfos
    };
}
/**
 * This function provides a DefinitionAdapter that will modify sections of a schema that represent a table.
 * Thereby, the table properties enableExport and useExportToExcel are checked.
 * We assume that the first of those is preferred and the second one is only supported for compatibility.
 * Note that this is valid starting with UI5 release 1.142. Hence, this function should not be used for lower releases.
 *
 * @param flex - the flex changes applicable to the current page
 * @param smartTableControlId - if this parameter is truthy only flex changes for smart tables with this local id will be considered.
 * Otherwise all flex changes for any smart table will be considered.
 * Note that anyway only flex changes for the two properties mentioned above are relevant.
 * @returns a DefinitionAdapter that should be applied to all table sections that correspond to the specified SmartTable.
 */
function getExportTablesPropertiesAdapter(flex, smartTableControlId) {
    const preferredName = 'enableExport';
    const unfavoredName = 'useExportToExcel';
    let preferredChange;
    let unfavoredChange;
    flex.forEach(function (flexContent) {
        const change = (0, common_1.parseChangeString)(flexContent);
        if (change.controlType === ux_specification_types_1.ControlType.SmartTable &&
            (!smartTableControlId || change.controlId.split('--')[1] == smartTableControlId)) {
            if (change.content.property === preferredName) {
                preferredChange = change.content;
            }
            else if (change.content.property === unfavoredName) {
                unfavoredChange = change.content;
            }
        }
    });
    if (unfavoredChange) {
        // A change of the unfavored property exists. => Inform user that he should better use the preferred property.
        let messageParams;
        // The exact message depends on the situation.
        if (preferredChange?.newValue === unfavoredChange.newValue &&
            preferredChange?.newBinding === unfavoredChange.newBinding) {
            messageParams = {
                text: i18next_1.default.t('USE_ENABLE_EXPORT_ONLY'),
                deletable: true,
                type: ux_specification_types_1.PropertyMessageType.Info
            }; // Change for unfavored property is simply superfluous, since there is a redundant change for the preferred property.
        }
        else if (preferredChange) {
            messageParams = {
                text: i18next_1.default.t('ENABLE_EXPORT_INCONSISTENT'),
                deletable: true,
                type: ux_specification_types_1.PropertyMessageType.Error
            }; // Changes for the two properties exist and are inconsistent -> Seems to be a misconfiguration
        }
        else {
            messageParams = {
                text: i18next_1.default.t('EXPORT_TO_EXCEL_OUTDATED'),
                type: ux_specification_types_1.PropertyMessageType.Info,
                quickFix: {
                    text: i18next_1.default.t('TRANSFER_VALUE'),
                    values: { [preferredName]: unfavoredChange.newValue ?? unfavoredChange.newBinding },
                    remove: true
                }
            }; // Only change for the unfavored property exists -> Provide option to transfer it to the preferred property
        }
        return function (tableDefinition) {
            const elementToMark = tableDefinition?.properties?.[unfavoredName];
            if (elementToMark) {
                elementToMark[ux_specification_types_1.SchemaTag.messages] = [messageParams];
            }
        };
    }
    // When we come here everything is fine. So just return a function that hides the unfavored property.
    return function (tableDefinition) {
        const elementToHide = tableDefinition?.properties?.[unfavoredName];
        if (elementToHide) {
            elementToHide[ux_specification_types_1.SchemaTag.hidden] = true;
        }
    };
}
//# sourceMappingURL=utils.js.map