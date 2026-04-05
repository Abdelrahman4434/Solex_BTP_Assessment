"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBJECT_PAGE_TABLE_DEFINITION_TYPES = void 0;
exports.addGroupedHeaderActions = addGroupedHeaderActions;
exports.generateObjectPageSchemaV4 = generateObjectPageSchemaV4;
const i18next_1 = __importDefault(require("i18next"));
const extensionLogger_1 = require("../../../extensionLogger");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../../common");
const utils_1 = require("../utils/utils");
const utils_2 = require("../utils/utils");
const StableIdHelper_1 = require("../../v4/utils/StableIdHelper");
const pageExtensions_1 = require("./fpm-custom-page/pageExtensions");
const utils_3 = require("../../v2/generate/utils");
const actions_1 = require("./actions");
const ObjectPageCustomSection_1 = require("../export/controls/ObjectPageCustomSection");
const ROOT_PROPERTIES_ORDER = ['header', 'layout', 'sections', 'footer'];
const CRITICAL_ACTION_TYPES = [
    'UI.CriticalityType/Positive',
    'UI.CriticalityType/VeryPositive',
    'UI.CriticalityType/Negative',
    'UI.CriticalityType/VeryNegative'
];
const CUSTOM_ACTION_DEFINITION_DESCRIPTION = 'Custom Action';
const CUSTOM_FIELD_DEFINITION_DESCRIPTION = 'Custom Field';
exports.OBJECT_PAGE_TABLE_DEFINITION_TYPES = [
    ux_specification_types_1.DefinitionName.ObjectPageResponsiveTableV4,
    ux_specification_types_1.DefinitionName.ObjectPageAnalyticalTableV4,
    ux_specification_types_1.DefinitionName.ObjectPageGridTableV4,
    ux_specification_types_1.DefinitionName.ObjectPageTreeTableV4
];
const CREATION_DIALOG_DEFINITION_TYPES = [
    ux_specification_types_1.DefinitionName.TableCreationModeCreationDialogOPTable,
    ux_specification_types_1.DefinitionName.TableCreationModeCreationDialogOPTreeTable
];
/**
 * V4 callback - adds a single header action to schema.
 *
 * @param oDataServiceAVT - Complete service information, as returned by annotation vocabularies tool.
 * @param action - Item of the Ui.Identification collection and its original index.
 * @param actionType - Action classification for grouping.
 * @param appSchema - Schema of the app.
 * @param entityType - Current entity type.
 * @param headerActions - List of header actions, to be enhanced.
 * @param index - The index of the action in the header actions list.
 */
function addSingleHeaderActionV4(oDataServiceAVT, action, actionType, appSchema, entityType, headerActions, index) {
    const { actionName, namespace } = (0, common_1.getActionNameAndId)(action.item, oDataServiceAVT);
    const stableId = (0, StableIdHelper_1.getStableIdPartFromDataField)(action.item);
    const actionEntityType = action.item['$Type'];
    const isActionGroup = actionEntityType === "com.sap.vocabularies.UI.v1.DataFieldForActionGroup" /* UIAnnotationTypes.DataFieldForActionGroup */;
    const actionDefinitionType = isActionGroup
        ? ux_specification_types_1.DefinitionName.ObjectPageHeaderActionGroup
        : action.isInnerAction
            ? ux_specification_types_1.DefinitionName.ObjectPageHeaderActionBase
            : ux_specification_types_1.DefinitionName.ObjectPageHeaderAction;
    //stableId is used as key in V4, as the DataFieldForAction:: prefix shall be present in manifest settings
    const convertedIdentification = action.item['fullyQualifiedName'].replace(`@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`, `/@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`);
    const actionDefinitionKey = `${actionDefinitionType}<${(0, common_1.prepareRef)(stableId)}>`;
    const headerAction = (appSchema.definitions[actionDefinitionKey] = {
        type: 'object',
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${actionDefinitionType}`,
        description: (0, common_1.getDataFieldDescription)(action.item, entityType)
    });
    headerAction[ux_specification_types_1.SchemaTag.isViewNode] = true;
    headerAction[ux_specification_types_1.SchemaTag.dataType] = (0, common_1.determineDataType)(action.item);
    headerAction[ux_specification_types_1.SchemaTag.propertyIndex] = index;
    if (isActionGroup) {
        const properties = (0, common_1.getPropertiesForStandardActionAndActionGroup)(appSchema, ux_specification_types_1.DefinitionName.ObjectPageHeaderActionGroup);
        headerAction['properties'] = {
            ...properties
        };
        const subActions = (action.item['Actions'] ?? []).map((groupedAction, index) => ({
            item: groupedAction,
            index,
            isInnerAction: true
        }));
        addGroupedHeaderActions(subActions, oDataServiceAVT, appSchema, entityType, headerAction, ux_specification_types_1.ActionType.Annotation);
    }
    else {
        //keys
        headerAction[ux_specification_types_1.SchemaTag.keys] = [];
        if (action.item[ux_specification_types_1.SchemaKeyName.semanticObject]) {
            headerAction[ux_specification_types_1.SchemaTag.keys].push({
                name: ux_specification_types_1.SchemaKeyName.semanticObject,
                value: action.item[ux_specification_types_1.SchemaKeyName.semanticObject]
            });
        }
        headerAction[ux_specification_types_1.SchemaTag.keys].push({ name: ux_specification_types_1.SchemaKeyName.action, value: actionName });
    }
    if (namespace) {
        appSchema.definitions[actionDefinitionKey][ux_specification_types_1.SchemaTag.target] = namespace;
    }
    headerAction[ux_specification_types_1.SchemaTag.actionType] = actionType;
    headerAction[ux_specification_types_1.SchemaTag.annotationPath] = `/${convertedIdentification}`;
    headerActions.properties[stableId] = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${actionDefinitionKey}`
    };
    // add propertyIndexes
    headerActions.properties[stableId][ux_specification_types_1.SchemaTag.propertyIndex] = index;
}
/**
 * Adds a given standard action to the app schema of the object page.
 *
 * @param actionName - Name of the action.
 * @param appSchema - Schema of the object page.
 * @param headerActions - List of header actions, to be enhanced.
 * @param index - Index for propertyIndex.
 * @returns The new header action definition.
 */
function addStandardHeaderAction(actionName, appSchema, headerActions, index) {
    const referenceKey = `${actionName}Action`;
    const actionDefinitionKey = `ObjectPageHeaderAction<${referenceKey}>`;
    // standard action properties
    const properties = (0, common_1.getPropertiesForStandardActionAndActionGroup)(appSchema, ux_specification_types_1.DefinitionName.ObjectPageHeaderActionGroup);
    const headerAction = (appSchema.definitions[actionDefinitionKey] = {
        type: 'object',
        description: `${actionName}`,
        ...(Object.keys(properties).length > 0 && { properties }),
        additionalProperties: true
    });
    headerAction[ux_specification_types_1.SchemaTag.isViewNode] = true;
    headerAction[ux_specification_types_1.SchemaTag.propertyIndex] = index;
    //keys
    headerAction[ux_specification_types_1.SchemaTag.keys] = [];
    headerAction[ux_specification_types_1.SchemaTag.keys].push({ name: ux_specification_types_1.SchemaKeyName.action, value: actionName });
    headerAction[ux_specification_types_1.SchemaTag.actionType] = ux_specification_types_1.ActionType.Standard;
    headerActions.properties[referenceKey] = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${actionDefinitionKey}`
    };
    // add propertyIndexes
    headerActions.properties[referenceKey][ux_specification_types_1.SchemaTag.propertyIndex] = index;
    return headerAction;
}
/**
 * V4 callback - adds a single footer action to schema.
 *
 * @param action - Item of the Ui.Identification collection and its original index.
 * @param actionType - Action classification for grouping.
 * @param entityType - Current entity type.
 * @param appSchema - Schema of the object page.
 * @param footerActions - List of footer actions, to be enhanced.
 * @param index - The index of the action in the footer actions list.
 */
function addSingleFooterAction(action, actionType, entityType, appSchema, footerActions, index) {
    const actionId = (0, StableIdHelper_1.getStableIdPartFromDataField)(action.item);
    const description = (0, common_1.getDataFieldDescription)(action.item, entityType);
    const actionDefinitionKey = (0, common_1.prepareRef)(`${ux_specification_types_1.DefinitionName.ObjectPageFooterAction}<${actionId}>`);
    const convertedIdentification = action.item['fullyQualifiedName'].replace(`@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`, `/@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`);
    const footerAction = (appSchema.definitions[actionDefinitionKey] = {
        type: 'object',
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.FooterActionV4}`,
        description: description
    });
    footerAction[ux_specification_types_1.SchemaTag.isViewNode] = true;
    footerAction[ux_specification_types_1.SchemaTag.actionType] = actionType;
    footerAction[ux_specification_types_1.SchemaTag.propertyIndex] = index;
    footerAction[ux_specification_types_1.SchemaTag.annotationPath] = `/${convertedIdentification}`;
    footerActions.properties[actionId] = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${actionDefinitionKey}`
    };
}
/**
 * Distinguishes critical actions and others and returns two separate groups.
 *
 * @param identification - UI.Identification annotation as present in AVT ConvertedMetadata.
 * @returns Two separate groups of items.
 */
function groupByCriticality(identification) {
    const criticalActions = [];
    const unCriticalActions = [];
    identification.forEach((item, index) => {
        if ((!item['Determining'] && item.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) ||
            item.$Type === "com.sap.vocabularies.UI.v1.DataFieldForActionGroup" /* UIAnnotationTypes.DataFieldForActionGroup */ ||
            item.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */) {
            if (CRITICAL_ACTION_TYPES.includes(item['Criticality'])) {
                criticalActions.push({ index, item });
            }
            else {
                unCriticalActions.push({ index, item });
            }
        }
    });
    return { criticalActions, unCriticalActions };
}
/**
 * Checks if one of the uncritical actions is marked by isCopyAction.
 * If so, adds this first to the schema and deletes it from the list.
 *
 * @param {ActionListType[]} unCriticalActions - list of uncritical actions
 * @param {ConvertedMetadata} oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @param {Definition} appSchema - schema of the object page
 * @param {EntityType} entityType - current entity type
 * @param {Definition} headerActions - list of all header actions
 * @param {number} nextIndex - index for propertyIndex
 */
function addCopyAction(unCriticalActions, oDataServiceAVT, appSchema, entityType, headerActions, nextIndex) {
    const copyActionIndex = unCriticalActions.findIndex((action) => {
        return action.item['annotations']?.UI?.IsCopyAction !== undefined;
    });
    if (copyActionIndex > -1) {
        addSingleHeaderActionV4(oDataServiceAVT, unCriticalActions[copyActionIndex], ux_specification_types_1.ActionType.Copy, appSchema, entityType, headerActions, nextIndex);
        nextIndex++;
        unCriticalActions.splice(copyActionIndex, 1);
    }
}
/**
 * Adds a list of actions to the header actions in the application schema.
 *
 * @param {ActionListType[]} actions - The list of actions to be added.
 * @param {ConvertedMetadata} oDataServiceAVT - The converted metadata service containing OData service annotations.
 * @param {Definition} appSchema - The application schema definition where actions will be added.
 * @param {EntityType} entityType - The entity type for which the actions are applicable.
 * @param {Definition} headerActions - The definition where the header actions will be appended.
 * @param {ActionType} actionType - The type of actions to be processed and added.
 * @param {number} [startingIndex] - The starting index for assigning actions in the header actions definition.
 */
function addGroupedHeaderActions(actions, oDataServiceAVT, appSchema, entityType, headerActions, actionType, startingIndex = 0) {
    let nextIndex = startingIndex;
    for (const action of actions) {
        addSingleHeaderActionV4(oDataServiceAVT, action, actionType, appSchema, entityType, headerActions, nextIndex);
        nextIndex++;
    }
}
/**
 * Adds the critical header actions to schema.
 *
 * @param {Definition} headerActions - list of all header actions
 */
function addRelatedAppsButton(headerActions) {
    const actionName = 'RelatedApps';
    const newAction = (headerActions.properties[actionName] = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${actionName}`,
        description: 'Related Apps'
    });
    // add tags
    newAction[ux_specification_types_1.SchemaTag.propertyIndex] = Object.keys(headerActions.properties).length - 1;
    newAction[ux_specification_types_1.SchemaTag.artifactType] = ux_specification_types_1.ArtifactType.Manifest;
    newAction[ux_specification_types_1.SchemaTag.actionType] = ux_specification_types_1.ActionType.Standard;
    newAction[ux_specification_types_1.SchemaTag.isViewNode] = true;
    newAction[ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.action, value: actionName }];
}
/**
 * Fills the annotationPath of the given schema definition, by checking first the EntitySet annotation, then the EntityType annotation.
 *
 * @param {Definition} schemaDefinition - current definition in the schema
 * @param {EntitySet} entitySet - current entity set
 * @param {EntityType} entityType - current entity type
 * @param {string} annotationName - name of the annotation term to be checked
 */
function setAnnotationPathFromEntitySetOrEntityType(schemaDefinition, entitySet, entityType, annotationName) {
    if (entitySet?.annotations?.UI?.[annotationName] || !entityType?.annotations?.UI?.[annotationName]) {
        schemaDefinition[ux_specification_types_1.SchemaTag.annotationPath] =
            `/${entitySet.fullyQualifiedName}/${ux_specification_types_1.UIVOCABULARYALPHADOT}${annotationName}`;
    }
    else {
        schemaDefinition[ux_specification_types_1.SchemaTag.annotationPath] =
            `/${entityType.fullyQualifiedName}/${ux_specification_types_1.UIVOCABULARYALPHADOT}${annotationName}`;
    }
}
/**
 * Callback for adding a single action to headerActions of V4.
 *
 * @param entityType - current entity type
 * @param appSchema - schema of the object page
 * @param identification - UI.Identification annotation as present in AVT ConvertedMetadata
 * @param headerActions - list of header actions, to be enhanced
 * @param generateParameters - list of API input parameters
 * @param pageInManifest - current page in manifest
 */
function addHeaderActionCallBackV4(entityType, appSchema, identification, headerActions, generateParameters, pageInManifest) {
    //Build groups of action types
    const { criticalActions = [], unCriticalActions = [] } = identification ? groupByCriticality(identification) : {};
    addGroupedHeaderActions(criticalActions, generateParameters.serviceAVT, appSchema, entityType, headerActions, ux_specification_types_1.ActionType.Criticality);
    if (generateParameters.entitySet) {
        const isDeletable = (0, utils_3.isEntityDeletable)(generateParameters.entitySet);
        const isUpdatable = (0, utils_3.isEntityUpdatable)(generateParameters.entitySet);
        // Add standard header actions
        // If ReadOnly, and all capabilities restrictions are set to true or When nothing exists i.e. no capabilities annotation and no draft root, show only Delete button
        // If DraftRoot + DraftNode and dynamic value for restriction - show Edit and Delete, if bool == false then hide the button
        if ((0, utils_3.isDraftEnabled)(generateParameters.entitySet) && isUpdatable) {
            const editAction = addStandardHeaderAction('Edit', appSchema, headerActions, criticalActions.length);
            setAnnotationPathFromEntitySetOrEntityType(editAction, generateParameters.entitySet, entityType, 'UpdateHidden');
        }
        if (isDeletable) {
            const deleteAction = addStandardHeaderAction('Delete', appSchema, headerActions, criticalActions.length + 1);
            setAnnotationPathFromEntitySetOrEntityType(deleteAction, generateParameters.entitySet, entityType, 'DeleteHidden');
        }
    }
    const nextIndex = criticalActions.length + 2;
    //Check if isCopyAction is defined, this gets rendered first after delete
    addCopyAction(unCriticalActions, generateParameters.serviceAVT, appSchema, entityType, headerActions, nextIndex);
    addGroupedHeaderActions(unCriticalActions, generateParameters.serviceAVT, appSchema, entityType, headerActions, ux_specification_types_1.ActionType.Annotation, nextIndex);
    // Add custom header actions
    addHeaderFooterCustomActionsOP(appSchema, pageInManifest, ux_specification_types_1.DefinitionName.CustomHeaderActionOP, generateParameters);
    addRelatedAppsButton(headerActions);
    (0, utils_2.addEnumForActionAnchor)(appSchema, ux_specification_types_1.DefinitionName.ObjectPageHeaderActions, ux_specification_types_1.DefinitionName.CustomHeaderActionPositionOP);
}
/**
 * Callback for adding a single action to footerActions of V4.
 *
 * @param {EntityType} entityType - current entity type
 * @param {Definition} appSchema - schema of the object page
 * @param {Definition} footerActions - list of footer actions, to be enhanced
 * @param {any} identification - UI.Identification annotation as present in AVT ConvertedMetadata
 */
function addFooterActionCallBackV4(entityType, appSchema, footerActions, identification) {
    const criticalActions = [];
    const unCriticalActions = [];
    identification.forEach((item, index) => {
        if (item['Determining'] && item.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) {
            if (item['Criticality']) {
                criticalActions.push({ index, item });
            }
            else {
                unCriticalActions.push({ index, item });
            }
        }
    });
    for (let index = 0; index < criticalActions.length; index++) {
        const action = criticalActions[index];
        addSingleFooterAction(action, ux_specification_types_1.ActionType.Criticality, entityType, appSchema, footerActions, index);
    }
    for (let index = 0; index < unCriticalActions.length; index++) {
        const action = unCriticalActions[index];
        addSingleFooterAction(action, ux_specification_types_1.ActionType.Annotation, entityType, appSchema, footerActions, criticalActions.length + index);
    }
}
/**
 * Object Page specific enhancements to addCustomColumnDefinition.
 *
 * @param appSchema - app schema of the object page
 * @param v4Page Current page in manifest
 * @param lineItemId - identifier of the current table in schema
 * @param facetIdInManifest - identifier of the current object page section in manifest
 * @param {GenerateAppSchemaParameters} generateParameters - Parameters required for generating the application schema.
 */
function addCustomColumnsOP(appSchema, v4Page, lineItemId, facetIdInManifest, generateParameters) {
    // Create type specific copy of 'TableCustomColumnOP'
    const useDefinitionAsKey = lineItemId !== ux_specification_types_1.DefinitionName.LineItems &&
        lineItemId !== 'LineItemsOfSPV::LineItem' &&
        lineItemId !== `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
    const customColumDefinitionKey = useDefinitionAsKey
        ? `${ux_specification_types_1.DefinitionName.CustomColumnOP}<${lineItemId}>`
        : ux_specification_types_1.DefinitionName.CustomColumnOP;
    const customColumnDefinition = appSchema.definitions[customColumDefinitionKey];
    customColumnDefinition[ux_specification_types_1.SchemaTag.isViewNode] = true;
    customColumnDefinition.description = 'Custom Column';
    // Update definitions for type specific custom columns
    const schemaId = `${ux_specification_types_1.DefinitionName.CustomColumnOP}<${lineItemId}>`;
    (0, utils_2.addCustomColumnDefinition)(appSchema, v4Page, generateParameters.logger, schemaId, lineItemId, facetIdInManifest);
    const facetKey = useDefinitionAsKey ? lineItemId : ux_specification_types_1.DefinitionName.PositionOP;
    (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.PositionOP, facetKey, appSchema, useDefinitionAsKey);
    const positionId = useDefinitionAsKey ? `${ux_specification_types_1.DefinitionName.PositionOP}<${lineItemId}>` : ux_specification_types_1.DefinitionName.PositionOP;
    customColumnDefinition.properties.position.$ref = `${common_1.DEFINITION_LINK_PREFIX}${positionId}`;
    (0, utils_2.addFragmentEnumForAnchor)(appSchema, lineItemId, v4Page, positionId, facetIdInManifest.replace(/::/g, '/'));
    //Table custom column: Add enum for properties
    const lineItems = appSchema.definitions[lineItemId];
    if (lineItems) {
        (0, utils_2.addEnumForProperties)(lineItems, customColumnDefinition);
    }
}
/**
 * Object Page specific enhancements to addCustomColumnDefinition.
 *
 * @param appSchema - app schema of the object page
 * @param v4Page Current page in manifest
 * @param lineItemId - identifier of the current table in schema
 * @param facetIdInManifest - identifier of the current object page section in manifest
 * @param {GenerateAppSchemaParameters} generateParameters - Parameters required for generating the application schema.
 * @returns Schema ID for actions definition.
 */
function addTableCustomActionsOP(appSchema, v4Page, lineItemId, facetIdInManifest, generateParameters) {
    // Create type specific copy of 'TableCustomActionOP'
    const useDefinitionAsKey = lineItemId !== ux_specification_types_1.DefinitionName.LineItems &&
        lineItemId !== 'LineItemsOfSPV::LineItem' &&
        lineItemId !== `@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}`;
    const customActionDefinitionKey = useDefinitionAsKey
        ? `${ux_specification_types_1.DefinitionName.CustomTableActionOP}<${lineItemId}>`
        : ux_specification_types_1.DefinitionName.CustomTableActionOP;
    const customActionDefinition = appSchema.definitions[customActionDefinitionKey];
    customActionDefinition[ux_specification_types_1.SchemaTag.isViewNode] = true;
    customActionDefinition.description = CUSTOM_ACTION_DEFINITION_DESCRIPTION;
    // Update definitions for type specific custom columns
    const schemaId = `${ux_specification_types_1.DefinitionName.CustomTableActionOP}<${lineItemId}>`;
    const schemaIdForActions = `${ux_specification_types_1.DefinitionName.Actions}<${(0, common_1.prepareRef)(lineItemId)}>`;
    (0, utils_2.addCustomActionDefinition)(appSchema, v4Page, generateParameters.logger, schemaId, schemaIdForActions, facetIdInManifest);
    const facetKey = useDefinitionAsKey ? lineItemId : ux_specification_types_1.DefinitionName.CustomActionPositionOP;
    (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.CustomActionPositionOP, facetKey, appSchema, useDefinitionAsKey);
    // Anchor selection
    const positionId = useDefinitionAsKey
        ? `${ux_specification_types_1.DefinitionName.CustomActionPositionOP}<${lineItemId}>`
        : ux_specification_types_1.DefinitionName.CustomActionPositionOP;
    customActionDefinition.properties.position.$ref = `${common_1.DEFINITION_LINK_PREFIX}${positionId}`;
    (0, utils_2.addEnumForActionAnchor)(appSchema, schemaIdForActions, positionId);
    (0, actions_1.configureAdditionalPropertiesForCustomActionsAndMenus)(appSchema, schemaIdForActions, positionId, lineItemId, ux_specification_types_1.DefinitionName.CustomTableActionOP, customActionDefinitionKey);
    return schemaIdForActions;
}
/**
 * Object Page specific custom action enhancements to header and footer.
 *
 * @param appSchema - app schema of the object page
 * @param v4Page  - current page in manifest
 * @param customActionDefinitionKey - custom action key used in definitions
 * @param generateParameters - list of API input parameters
 */
function addHeaderFooterCustomActionsOP(appSchema, v4Page, customActionDefinitionKey, generateParameters) {
    const customActionDefinition = appSchema.definitions[customActionDefinitionKey];
    customActionDefinition[ux_specification_types_1.SchemaTag.isViewNode] = true;
    customActionDefinition.description = CUSTOM_ACTION_DEFINITION_DESCRIPTION;
    const schemaIdForActions = customActionDefinitionKey === ux_specification_types_1.DefinitionName.CustomHeaderActionOP
        ? ux_specification_types_1.DefinitionName.ObjectPageHeaderActions
        : ux_specification_types_1.DefinitionName.FooterActions;
    (0, utils_2.addHeaderFooterCustomActionDefinition)(appSchema, v4Page, generateParameters.logger, customActionDefinitionKey, schemaIdForActions);
    const facetKey = customActionDefinitionKey === ux_specification_types_1.DefinitionName.CustomHeaderActionOP
        ? ux_specification_types_1.DefinitionName.CustomHeaderActionPositionOP
        : ux_specification_types_1.DefinitionName.CustomFooterActionPositionOP;
    (0, common_1.parseSchemaDefinition)(facetKey, facetKey, appSchema, false);
    // Anchor selection
    customActionDefinition.properties.position.$ref = `${common_1.DEFINITION_LINK_PREFIX}${facetKey}`;
    if (appSchema.definitions[schemaIdForActions] && typeof appSchema.definitions[schemaIdForActions] === 'object') {
        appSchema.definitions[schemaIdForActions].additionalProperties =
            (0, actions_1.buildAdditionalPropertiesSchemaForCustomActionsAndMenus)(customActionDefinitionKey);
    }
}
/**
 * Adds a table definition to the application schema based on the provided configuration.
 * This method defines the properties and annotations required for the table in the schema.
 *
 * @param params - The parameters for adding the table definition.
 * @param params.tableType - The type of the table to be added. For example, AnalyticalTable or ResponsiveTable.
 * @param params.facetKey - The key identifying the facet for which the table is being defined.
 * @param params.facet - The configuration object defining the properties of the facet.
 * @param params.appSchema - The overall application schema where the table definition should be added.
 * @param params.lineItemId - Optional ID for the line item, defaults to a generated schema facet key.
 * @param params.lineItemFacet - The current line item facet configuration.
 * @param params.v4Page - The current page configuration in the manifest.
 * @param params.isCollection - Indicates if the table is in a collection section. Defaults to false.
 */
function addTableDefinition({ tableType, facetKey, facet, appSchema, lineItemId, lineItemFacet, v4Page, isCollection = false }) {
    const index = facetKey.lastIndexOf('::');
    const annotation = index > -1 ? facetKey.substring(index + 2) : facetKey;
    const tableDefinition = (0, common_1.parseSchemaDefinition)(tableType, facetKey, appSchema);
    if (facet.entityType && annotation) {
        tableDefinition[ux_specification_types_1.SchemaTag.annotationPath] = `/${facet.entityType.fullyQualifiedName}/${annotation}`;
    }
    tableDefinition.properties.columns = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${lineItemId}`
    };
    tableDefinition.properties.toolBar.$ref = (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.ObjectPageToolBar, facetKey);
    tableDefinition.properties.quickVariantSelection.$ref = (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.QuickVariantSelectionV4OP, facetKey);
    tableDefinition[ux_specification_types_1.SchemaTag.target] = lineItemFacet.namespace;
    if (tableDefinition.properties.rowCountMode && !isCollection) {
        adjustRowCountMode(v4Page, facetKey, appSchema, tableDefinition);
    }
}
/**
 * Object Page specific enhancements to handleFormIdentification.
 *
 * @param appSchema - app schema of the object page
 * @param v4Page - current page in manifest
 * @param formItemId - identifier of the current form in schema
 * @param facetIdInManifest - identifier of the current object page section in manifest
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @returns Schema ID for actions definition.
 */
function addFormCustomActionsOP(appSchema, v4Page, formItemId, facetIdInManifest, generateParameters) {
    const customActionDefinitionKey = `${ux_specification_types_1.DefinitionName.CustomFormActionOP}<${formItemId}>`;
    const customActionDefinition = appSchema.definitions[customActionDefinitionKey];
    customActionDefinition[ux_specification_types_1.SchemaTag.isViewNode] = true;
    customActionDefinition.description = CUSTOM_ACTION_DEFINITION_DESCRIPTION;
    const schemaId = `${ux_specification_types_1.DefinitionName.CustomFormActionOP}<${formItemId}>`;
    const schemaIdForActions = `${ux_specification_types_1.DefinitionName.SectionActions}<${(0, common_1.prepareRef)(formItemId)}>`;
    (0, utils_2.addCustomActionDefinition)(appSchema, v4Page, generateParameters.logger, schemaId, schemaIdForActions, facetIdInManifest, formItemId);
    (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.CustomActionPositionOP, formItemId, appSchema, true);
    // Anchor selection
    const positionId = `${ux_specification_types_1.DefinitionName.CustomActionPositionOP}<${formItemId}>`;
    customActionDefinition.properties.position.$ref = `${common_1.DEFINITION_LINK_PREFIX}${positionId}`;
    (0, utils_2.addEnumForActionAnchor)(appSchema, schemaIdForActions, positionId);
    (0, actions_1.configureAdditionalPropertiesForCustomActionsAndMenus)(appSchema, schemaIdForActions, positionId, formItemId, ux_specification_types_1.DefinitionName.CustomFormActionOP, customActionDefinitionKey);
    return schemaIdForActions;
}
/**
 * Adjusts the `rowCountMode` property enum and adds a warning, if `sectionLayout` is set to `Tabs` and `rowCountMode` is not set to `Auto`.
 *
 * @param v4Page Current page in manifest
 * @param facetKey key of the facet
 * @param appSchema - app schema of the object page
 * @param tableDefinition - current table definition in the schema
 */
function adjustRowCountMode(v4Page, facetKey, appSchema, tableDefinition) {
    const isTabsMode = v4Page?.options?.settings?.sectionLayout == ux_specification_types_1.v4.SectionLayoutType.Tabs;
    if (!isTabsMode || !appSchema.definitions[ux_specification_types_1.DefinitionName.RowCountMode]) {
        return;
    }
    const rowCountModeDefinition = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.RowCountMode, facetKey, appSchema);
    // special handling for enum value - only `Auto` is allowed in Tabs mode
    rowCountModeDefinition.enum = ['Auto'];
    tableDefinition.properties.rowCountMode.$ref = (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.RowCountMode, facetKey);
    const rowCountMode = v4Page?.options?.settings?.controlConfiguration?.[facetKey.replace('::', '/')]?.tableSettings?.rowCountMode;
    if (rowCountMode && rowCountMode !== ux_specification_types_1.v4.RowCountMode.Auto) {
        (0, common_1.addMessageToSchema)(rowCountModeDefinition, { text: i18next_1.default.t('WARNING_DEFAULT_ROW_COUNT_MODE') });
    }
}
/**
 * Adds definitions for line items in object page sections to the app schema.
 *
 * @param {GenerateAppSchemaParameters} generateParameters - Parameters required for generating the application schema.
 * @param {FacetConfig} facet - The facet configuration object defining the current facet.
 * @param {string} facetKey - The unique key associated with the facet.
 * @param {Definition} appSchema - The application schema to be updated with line item definitions.
 * @param {FacetConfig} lineItemFacet - The configuration of the line item facet being processed.
 * @param {ConvertedMetadata} oDataServiceAVT - Metadata converted from OData service annotations (AVT).
 * @param {v4.SapUiAppPageV4} v4Page - The V4 application page object.
 * @param {ExtensionLogger} logger - Logger instance for capturing warnings and diagnostic messages.
 * @param {boolean} [isCollection] - Indicates if the facet represents a collection of entities.
 */
function handleLineItem(generateParameters, facet, facetKey, appSchema, lineItemFacet, oDataServiceAVT, v4Page, logger, isCollection) {
    const lineItemId = (0, common_1.getFacetKeyInSchema)(facetKey);
    exports.OBJECT_PAGE_TABLE_DEFINITION_TYPES.forEach((type) => {
        addTableDefinition({
            tableType: type,
            facetKey,
            facet,
            appSchema,
            lineItemId,
            lineItemFacet,
            v4Page,
            isCollection,
            generateParameters
        });
    });
    const tableQVS = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.QuickVariantSelectionV4OP, facetKey, appSchema);
    tableQVS.properties.paths['items'].$ref = (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.AnnotationPathAsObject, facetKey);
    (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.AnnotationPathAsObject, facetKey, appSchema);
    (0, common_1.addEnumForSingleTabVariant)(facet.entityType, appSchema, `${ux_specification_types_1.DefinitionName.AnnotationPathAsObject}<${lineItemId}>`);
    const dataForLineItem = {
        isObjectPage: true,
        appSchema,
        lineItemAnnotation: lineItemFacet['target'],
        entityType: lineItemFacet['entityType'],
        oDataServiceAVT,
        lineItemId
    };
    (0, utils_2.addLineItemsTypeToSchema)(dataForLineItem, ux_specification_types_1.DefinitionName.ObjectPageTableColumn, ux_specification_types_1.DefinitionName.CustomColumnOP, ux_specification_types_1.DefinitionName.CustomTableActionOP);
    // Line items are added to the schema after the table definitions, so we loop through all table types again and add line item enums for enableMassEdit
    exports.OBJECT_PAGE_TABLE_DEFINITION_TYPES.forEach((type) => {
        // add columns to a enum, in this case enableMassEdit -> visibleFields and ignoredFields
        (0, utils_2.addEnumForEnableMassEdit)(appSchema, `${type}<${lineItemId}>`, lineItemId, lineItemFacet.entityType);
        // add "manifestPath" to table properties for different table types
        const tableDefinitionKey = (0, common_1.getFacetDefinitionKey)(type, facetKey);
        const tableDefinition = appSchema.definitions?.[tableDefinitionKey];
        if (typeof tableDefinition === 'object') {
            addManifestPathsToPropertiesOP(appSchema, type, tableDefinition, {
                pageName: v4Page.id,
                manifest: generateParameters.manifest,
                sectionId: facetKey
            }, true);
        }
    });
    // populates the set of fields and field groups for the creationFields property definition
    CREATION_DIALOG_DEFINITION_TYPES.forEach((definitionName) => {
        (0, utils_1.addOneOfForCreationFields)(appSchema, lineItemFacet.entityType, definitionName, lineItemId);
    });
    addCustomColumnsOP(appSchema, v4Page, lineItemId, facetKey, generateParameters);
    addManifestPathsToDefinitionPropertiesOP(appSchema, v4Page.id, lineItemId, generateParameters, facetKey);
    const schemaIdForActions = addTableCustomActionsOP(appSchema, v4Page, lineItemId, facetKey, generateParameters);
    addManifestPathsToDefinitionPropertiesOP(appSchema, v4Page.id, schemaIdForActions, generateParameters, facetKey);
}
/**
 * Handles the creation and modification of a section table within the application schema.
 *
 * @param facet - The facet configuration object containing details for the section.
 * @param facetKey - The unique key for identifying the facet in the schema.
 * @param appSchema - The overall application schema where the section table is defined.
 * @param lineItemFacet - The facet configuration specific to line item processing.
 * @param generateParameters - Parameters required for generating the application schema.
 * @param v4Page - The OData V4 page object containing details about the target application page.
 * @param [sections] - The sections definition object where the section table might be added as a reference.
 * @param isCollection - Indicates if the table is in a collection section.
 * @returns The updated definition of the section table included or modified in the application schema.
 */
function handleSectionTable(facet, facetKey, appSchema, lineItemFacet, generateParameters, v4Page, sections, isCollection) {
    if (sections) {
        addPropertyRef(sections, facetKey, ux_specification_types_1.DefinitionName.ObjectPageSectionTableV4);
    }
    const sectionTable = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ObjectPageSectionTableV4, facetKey, appSchema);
    (0, common_1.addSectionTitle)(facet, sectionTable, (0, common_1.getFacetKeyInSchema)(facetKey));
    (0, common_1.addSectionDescription)(facet, sectionTable, (0, common_1.getFacetKeyInSchema)(facetKey));
    sectionTable[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    sectionTable[ux_specification_types_1.SchemaTag.target] = facet.namespace;
    sectionTable.properties.table.anyOf = sectionTable.properties.table.anyOf.map((item) => {
        const definition = item['$ref'].split('/').pop();
        return {
            ['$ref']: (0, common_1.getFacetDefinitionLink)(definition, facetKey)
        };
    });
    handleLineItem(generateParameters, facet, facetKey, appSchema, lineItemFacet, generateParameters.serviceAVT, v4Page, generateParameters.logger, isCollection);
    return sectionTable;
}
/**
 * Adds definitions for Identification and Form facet items in object page sections to the app schema.
 *
 * @param {FacetConfig} facet - current facet
 * @param {v4.SapUiAppPageV4} v4Page Current page in manifest
 * @param {string} facetKey - facet key
 * @param {object} sections - schema of current sections definition
 * @param {object} appSchema - app specific schema of the object page that gets enhanced
 * @param {SectionType} sectionPrefix - prefix to distinguish Section and HeaderSection
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 */
function handleFormIdentification(facet, v4Page, facetKey, sections, appSchema, sectionPrefix, generateParameters) {
    let definitionType;
    if (sectionPrefix === ux_specification_types_1.SectionType.Section) {
        definitionType = ux_specification_types_1.DefinitionName.ObjectPageSectionForm;
    }
    else if (sectionPrefix === ux_specification_types_1.SectionType.HeaderSection) {
        definitionType = ux_specification_types_1.DefinitionName.ObjectPageHeaderSectionForm;
    }
    sections['properties'][facetKey] = {
        $ref: (0, common_1.getFacetDefinitionLink)(definitionType, facetKey)
    };
    const formSection = (0, common_1.parseSchemaDefinition)(definitionType, facetKey, appSchema);
    if (!facet.ID) {
        formSection.properties = {};
    }
    (0, common_1.addSectionTitle)(facet, formSection, facetKey);
    (0, common_1.addSectionDescription)(facet, formSection, facetKey);
    formSection[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    formSection[ux_specification_types_1.SchemaTag.target] = facet.namespace;
    formSection[ux_specification_types_1.SchemaTag.isViewNode] = true;
    const targetId = (0, common_1.handleForm)(sectionPrefix, facet, formSection, appSchema, ux_specification_types_1.FioriElementsVersion.v4, facetKey);
    const formItemId = (0, common_1.getFacetKeyInSchema)(facetKey);
    if (facet.base === ux_specification_types_1.FacetBase.Form) {
        (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.CustomFormActionOP, targetId, appSchema);
        const schemaIdForActions = addFormCustomActionsOP(appSchema, v4Page, targetId, formItemId, generateParameters);
        addManifestPathsToDefinitionPropertiesOP(appSchema, v4Page.id, schemaIdForActions, generateParameters, facetKey);
    }
    // Add custom fields
    (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.CustomField, targetId, appSchema);
    const schemaIdForFields = addFormCustomFieldsOP(appSchema, v4Page, sectionPrefix, targetId, formItemId, generateParameters);
    addManifestPathsToDefinitionPropertiesOP(appSchema, v4Page.id, schemaIdForFields, generateParameters, facetKey);
}
/**
 * Adds definitions for header sections (DataPoint, Chart) in object page sections to the app schema.
 *
 * @param {FacetConfig} facet - current facet
 * @param {string} facetKey - facet key
 * @param {object} sections - schema of current sections definition
 * @param {object} appSchema - app specific schema of the object page that gets enhanced
 * @param {SectionType} facetDefinitionKey - key to identify new definition
 */
function handleHeaderFacet(facet, facetKey, sections, appSchema, facetDefinitionKey) {
    sections['properties'][facetKey] = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${facetDefinitionKey}`
    };
    const sectionFacet = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.CommonHeaderFacetSettings, facetDefinitionKey, appSchema, false);
    (0, common_1.addTargetTitleAndSectionDescription)(facet, sectionFacet, facetKey);
    sectionFacet[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    sectionFacet[ux_specification_types_1.SchemaTag.target] = facet.namespace;
    sectionFacet[ux_specification_types_1.SchemaTag.dataType] = (0, common_1.determineDataTypeOfTarget)(facet?.target);
    sectionFacet[ux_specification_types_1.SchemaTag.isViewNode] = true;
}
/**
 * Adds definitions for Chart items in object page sections to the app schema.
 *
 * @param {FacetConfig | Chart | object} facet - current facet.
 * @param {string} facetKey - facet key.
 * @param {object} appSchema - app specific schema of the object page that gets enhanced.
 * @param {EntityType} entityType - current entity type
 * @returns {Definition} - the new chart definition
 */
function handleChartActions(facet, facetKey, appSchema, entityType) {
    const actions = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ObjectPageToolBarActions, facetKey, appSchema);
    actions.additionalProperties = false;
    actions.properties = {};
    if (facet.Actions) {
        let i = 0;
        facet.Actions.forEach((chartAction) => {
            const actionRecord = chartAction;
            const description = (0, common_1.getDataFieldDescription)(actionRecord, entityType);
            const prefix = actionRecord.$Type.split(ux_specification_types_1.UIVOCABULARYDOT)[1];
            const actionId = actionRecord.Action.replace('/', '::');
            const toolBarActionsProperty = (actions.properties[`${prefix}::${actionRecord.Action}`] = {
                $ref: (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.ObjectPageToolBarAction, actionId),
                description
            });
            toolBarActionsProperty[ux_specification_types_1.SchemaTag.propertyIndex] = i;
            toolBarActionsProperty[ux_specification_types_1.SchemaTag.annotationType] = actionRecord.$Type;
            const toolBarAction = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ObjectPageToolBarAction, (0, common_1.prepareRef)(actionId), appSchema);
            toolBarAction[ux_specification_types_1.SchemaTag.annotationPath] = (0, common_1.getFacetAnnotationPath)(actionRecord);
            toolBarAction[ux_specification_types_1.SchemaTag.dataType] = (0, common_1.determineDataType)(actionRecord);
            toolBarAction.properties = {};
            i++;
        });
    }
    return actions;
}
/**
 * Adds definitions for Chart items in object page sections to the app schema.
 *
 * @param facet - current facet.
 * @param facetKey - facet key.
 * @param appSchema - app specific schema of the object page that gets enhanced.
 * @param entityType - current entity type
 * @returns - the new chart definition
 */
function handleChart(facet, facetKey, appSchema, entityType) {
    const chart = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ObjectPageChart, facetKey, appSchema);
    if (facet['Title']) {
        chart.description = facet['Title'];
    }
    chart[ux_specification_types_1.SchemaTag.annotationPath] = (0, common_1.getFacetAnnotationPath)(facet);
    chart[ux_specification_types_1.SchemaTag.dataType] = (0, common_1.determineDataTypeOfTarget)(facet.target || facet);
    chart[ux_specification_types_1.SchemaTag.isViewNode] = true;
    chart.properties.toolBar['$ref'] = (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.ObjectPageToolBar, facetKey);
    const chartToolBar = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ObjectPageToolBar, facetKey, appSchema);
    chartToolBar.properties.actions['$ref'] = (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.ObjectPageToolBarActions, facetKey);
    const chartActions = handleChartActions(facet, facetKey, appSchema, entityType);
    return { chart, chartActions };
}
/**
 * Adds definitions for Chart section in object page sections to the app schema.
 *
 * @param {FacetConfig} facet - current facet.
 * @param {string} facetKey - facet key.
 * @param {object} appSchema - app specific schema of the object page that gets enhanced.
 * @param {object} sections - schema of current sections definition.
 * @param {EntityType} entityType - current entity type
 * @param {boolean} isPVHeaderFacet - whether the facet is a Presentation Variant header facet
 * @param namespace - the namespace of the facet
 * @returns - the new chart definition
 */
function handleSectionChart(facet, facetKey, appSchema, sections, entityType = facet.entityType, isPVHeaderFacet = false, namespace) {
    const definition = isPVHeaderFacet
        ? ux_specification_types_1.DefinitionName.CommonHeaderFacetSettings
        : ux_specification_types_1.DefinitionName.ObjectPageSectionChart;
    const facetDefinitionKey = isPVHeaderFacet
        ? ux_specification_types_1.DefinitionName.ObjectPageHeaderSectionChart
        : ux_specification_types_1.DefinitionName.ObjectPageSectionChart;
    if (sections) {
        addPropertyRef(sections, facetKey, definition);
    }
    const facetName = (0, common_1.getFacetDefinitionKey)(facetDefinitionKey, facetKey);
    const parentChartRef = (0, common_1.parseSchemaDefinition)(definition, facetName, appSchema, false);
    (0, common_1.addTargetTitleAndSectionDescription)(facet, parentChartRef, facetKey);
    // For Presentation Variant header facets we don't add chart properties
    if (isPVHeaderFacet) {
        delete parentChartRef.properties.chart;
        return { parentChartRef };
    }
    parentChartRef[ux_specification_types_1.SchemaTag.annotationPath] = (0, common_1.getFacetAnnotationPath)(facet);
    parentChartRef.properties.chart['$ref'] = (0, common_1.getFacetDefinitionLink)(ux_specification_types_1.DefinitionName.ObjectPageChart, facetKey);
    const { chart, chartActions } = handleChart(facet.target || facet, facetKey, appSchema, entityType);
    chart[ux_specification_types_1.SchemaTag.target] = namespace;
    return { parentChartRef, chart, chartActions };
}
/**
 * Extracts the key and type of the visualization.
 *
 * @param hasTarget - whether the facet has a target
 * @param facetTarget - target of the facet
 * @param generateParameters - list of API input parameters
 * @returns - key and type of the visualization
 */
function getVisualizationKeyAndType(hasTarget, facetTarget, generateParameters) {
    const alias = hasTarget ? facetTarget.fullyQualifiedName : facetTarget.targetString;
    const aliasPart = alias.split('@')[1].split('/')[0];
    const replacedAlias = (0, common_1.replaceAlias)(aliasPart, generateParameters.serviceAVT);
    const key = `@${replacedAlias}`;
    const type = key.split(ux_specification_types_1.UIVOCABULARYDOT)[1];
    return { key, type };
}
/**
 * Returns the target of the visualization.
 *
 * @param generateParameters - list of API input parameters
 * @param navigationPath - navigation path of the target
 * @param visualizationType - type of the visualization
 * @returns - target of the visualization
 */
function getTargetFromNavigation(generateParameters, navigationPath, visualizationType) {
    const navigationProp = generateParameters.entityType.navigationProperties.find((prop) => prop.name === navigationPath);
    return navigationProp.targetType?.annotations?.UI[visualizationType];
}
/**
 * Returns the properties of the visualization.
 *
 * @param facet - the given facet from the UI annotations
 * @param facetKey - key of the facet, as used in annotation
 * @param generateParameters - list of API input parameters
 * @returns {VisualizationProps | undefined} - properties of the visualization
 */
function getVisualizationProps(facet, facetKey, generateParameters) {
    const visualizations = facet.target[ux_specification_types_1.FacetBase.PresentationVariant]
        ? facet.target[ux_specification_types_1.FacetBase.PresentationVariant].Visualizations
        : facet.target['Visualizations'];
    if (!visualizations?.[0]) {
        return;
    }
    const $target = visualizations[0].$target;
    const facetTarget = $target || visualizations[0];
    const navigationPath = facetKey.lastIndexOf('::') > 0 ? facetKey.slice(0, facetKey.lastIndexOf('::')) : undefined;
    const { key, type } = getVisualizationKeyAndType(!!$target, facetTarget, generateParameters);
    const target = $target ? facetTarget : getTargetFromNavigation(generateParameters, navigationPath, type);
    const namespace = facet.target[ux_specification_types_1.SchemaTag.fullyQualifiedName].split('@')[0];
    return { key, type, target, namespace, navigationPath };
}
/**
 * Helper function to add property reference to the sections.
 *
 * @param {Definition} sections Definition to add property reference
 * @param {string} propertyName Property name to be added
 * @param {DefinitionName} definition - Key of the visualization
 * @param {string} link - Alternative to the property name to be added as link
 */
function addPropertyRef(sections, propertyName, definition, link) {
    sections.properties[propertyName] = {
        $ref: (0, common_1.getFacetDefinitionLink)(definition, link || propertyName)
    };
}
/**
 * Generates the property and navigation keys for a section based on the facet key and visualization properties.
 *
 * @param facetKey - The key of the facet.
 * @param props - The visualization properties containing key, type, target, namespace, and navigationPath.
 * @returns An object containing the navigationKey and propertyKey for the section.
 */
function getSectionPropertyRef(facetKey, props) {
    const propertyKey = `${facetKey}<${props.key}>`;
    const navigationKey = props.navigationPath ? `${props.navigationPath}::${props.key}` : props.key;
    return { propertyKey, navigationKey };
}
/**
 * Adds LineItem definition of object page section to the app schema.
 *
 * @param facet - the given facet from the UI annotations
 * @param facetKey - key of the facet, as used in annotation
 * @param appSchema - app schema of the object page
 * @param sections - schema of current sections definition.
 * @param props - visualization properties
 * @param generateParameters - list of API input parameters
 * @param v4Page Current page in manifest
 */
function addPVLineItemSection(facet, facetKey, appSchema, sections, props, generateParameters, v4Page) {
    const { propertyKey, navigationKey } = getSectionPropertyRef(facetKey, props);
    addPropertyRef(sections, propertyKey, ux_specification_types_1.DefinitionName.ObjectPageSectionTableV4, navigationKey);
    const sectionTable = handleSectionTable(facet, navigationKey, appSchema, {
        target: props.target,
        entityType: facet.entityType,
        annotationPath: `/${props.namespace}/${props.key}`,
        namespace: props.namespace
    }, generateParameters, v4Page);
    sectionTable[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    (0, common_1.addTargetTitleAndSectionDescription)(facet, sectionTable, facetKey);
    delete sectionTable[ux_specification_types_1.SchemaTag.isViewNode];
}
/**
 * Adds Chart definition of object page (header) section to the app schema.
 *
 * @param {FacetConfig} facet - the given facet from the UI annotations
 * @param {string} facetKey - key of the facet, as used in annotation
 * @param {Definition} appSchema - app schema of the object page
 * @param {object} sections - schema of current sections definition.
 * @param {VisualizationProps} props - visualization properties
 * @param {boolean} isPVHeaderFacet - flag to determine if the facet is a header facet
 */
function addPVChartSection(facet, facetKey, appSchema, sections, props, isPVHeaderFacet = false) {
    const definition = isPVHeaderFacet
        ? ux_specification_types_1.DefinitionName.ObjectPageHeaderSectionChart
        : ux_specification_types_1.DefinitionName.ObjectPageSectionChart;
    const { propertyKey, navigationKey } = getSectionPropertyRef(facetKey, props);
    addPropertyRef(sections, propertyKey, definition, navigationKey);
    const { parentChartRef } = handleSectionChart(props.target, navigationKey, appSchema, undefined, facet.entityType, isPVHeaderFacet, props.namespace);
    parentChartRef[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    // If no header facet ID exists, remove properties as it is requirement for export to manifest.json
    if (!facet?.['ID']) {
        parentChartRef.properties = {};
    }
    if (isPVHeaderFacet) {
        // Fill description with Facet ID of (S)PV in case referenced Chart has no title. In case no facet ID exists, it is already prefilled with Chart and qualifier.
        (0, common_1.addSectionTitle)(facet, parentChartRef, facetKey);
        (0, common_1.addChartFacetID)(facet, parentChartRef);
    }
    else {
        (0, common_1.addTargetTitleAndSectionDescription)(facet, parentChartRef, facetKey);
    }
}
/**
 * Adds definitions for (selection) presentation variants in object page sections to the app schema.
 *
 * @param facet - the given facet from the UI annotations
 * @param facetKey - key of the facet, as used in annotation
 * @param appSchema - app schema of the object page
 * @param sections - schema of current sections definition.
 * @param sectionPrefix - prefix to distinguish Section and HeaderSection
 * @param generateParameters - list of API input parameters
 * @param v4Page Current page in manifest
 */
function handleSectionPresentationVariant(facet, facetKey, appSchema, sections, sectionPrefix, generateParameters, v4Page) {
    if (!facet?.target) {
        (0, extensionLogger_1.log)(generateParameters.logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('NOPRESENTATIONVARIANT', { key: facetKey })
        });
        return;
    }
    const visualizationProps = getVisualizationProps(facet, facetKey, generateParameters);
    const isPVHeaderFacet = sectionPrefix === ux_specification_types_1.SectionType.HeaderSection;
    if (!visualizationProps) {
        // Catch cases where no visualization properties are found
        return;
    }
    if (visualizationProps.type.startsWith(ux_specification_types_1.Visualization.Chart)) {
        addPVChartSection(facet, facetKey, appSchema, sections, visualizationProps, isPVHeaderFacet);
    }
    else if (visualizationProps.type.startsWith(ux_specification_types_1.Visualization.LineItem)) {
        addPVLineItemSection(facet, facetKey, appSchema, sections, visualizationProps, generateParameters, v4Page);
    }
}
/**
 * Method checks if passed facet contains any collection facet.
 *
 * @param {FacetConfig} facet - facet to check
 * @returns {boolean} Passed facet contains at least one collection facet
 */
function containsCollectionFacet(facet) {
    const childFacets = facet.facets || {};
    for (const id in childFacets) {
        const childFacet = childFacets[id];
        if (childFacet.base === ux_specification_types_1.FacetBase.CollectionFacet) {
            return true;
        }
    }
    return false;
}
/**
 * Object Page specific enhancements to addCustomColumnDefinition.
 *
 * @param {object} appSchema - app schema of the object page
 * @param {string} id - identifier of the current section facet
 * @param {string[]} featureToggles - supported features
 * @returns {string} Custom sub section reference id
 */
function createCustomSubSectionReference(appSchema, id, featureToggles) {
    const referenceId = `${ux_specification_types_1.DefinitionName.ObjectPageCustomSubSectionFragment}<${id}>`;
    const sourceDefinition = appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageCustomSubSectionFragment];
    // Instantiate for @validity check
    new ObjectPageCustomSection_1.ObjectPageCustomSubSectionFragment().init();
    if (typeof sourceDefinition === 'object') {
        const relatedFacetSchema = typeof sourceDefinition.properties?.relatedFacet === 'object'
            ? sourceDefinition.properties.relatedFacet
            : {};
        const newRef = {
            ...sourceDefinition,
            properties: {
                ...sourceDefinition.properties,
                relatedFacet: {
                    ...relatedFacetSchema,
                    type: 'string'
                }
            }
        };
        // Building blocks
        if ((0, common_1.isFeatureSupported)(featureToggles, ux_specification_types_1.Features.BuildingBlocks)) {
            newRef['properties']['controls'] = {
                type: 'object'
            };
        }
        appSchema.definitions[referenceId] = newRef;
    }
    return referenceId;
}
/**
 * Method applies custom action definitions to custom sections.
 *
 * @param {Definition} appSchema - app schema of the object page
 * @param {v4.SapUiAppPageV4} v4Page Current page in manifest
 * @param {string} customSectionRef - reference to custom section definition
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 */
function applyCustomActionsToCustomSections(appSchema, v4Page, customSectionRef, generateParameters) {
    // add specific definitions for custom sections and custom actions from manifest
    const sectionsInManifest = v4Page.options?.settings?.content?.body?.sections;
    if (sectionsInManifest) {
        for (const sectionId in sectionsInManifest) {
            // in order to differentiate which custom actions belongs to which custom section, we need to create specific definition for each custom section
            const customSectionDef = (0, common_1.parseSchemaDefinition)(customSectionRef, sectionId, appSchema);
            // create definition for custom section actions
            const customSectionCustomActionsDef = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.ObjectPageCustomSectionActions, sectionId, appSchema);
            // create definition for custom section actions properties
            const customActionOPDef = (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.CustomSectionActionOP, sectionId, appSchema);
            // assign reference for current custom sections to custom section actions definitions
            const customActionsDefinitionName = `${ux_specification_types_1.DefinitionName.ObjectPageCustomSectionActions}<${sectionId}>`;
            customSectionDef.properties['actions'] = {
                $ref: `${common_1.DEFINITION_LINK_PREFIX}${customActionsDefinitionName}`
            };
            const customActionDefinitionName = `${ux_specification_types_1.DefinitionName.CustomSectionActionOP}<${sectionId}>`;
            customSectionCustomActionsDef.additionalProperties = {
                $ref: `${common_1.DEFINITION_LINK_PREFIX}${customActionDefinitionName}`
            };
            (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.CustomSectionActionPositionOP, sectionId, appSchema);
            const customActionPositionOPDefinitionName = `${ux_specification_types_1.DefinitionName.CustomSectionActionPositionOP}<${sectionId}>`;
            // assign reference for current custom section action position
            customActionOPDef.properties['position']['$ref'] =
                `${common_1.DEFINITION_LINK_PREFIX}${customActionPositionOPDefinitionName}`;
            // set custom action as view node
            customActionOPDef[ux_specification_types_1.SchemaTag.isViewNode] = true;
            // add custom actions definitions
            (0, utils_2.addCustomActionDefinition)(appSchema, v4Page, generateParameters.logger, customActionDefinitionName, customActionsDefinitionName, sectionId);
            // add anchors
            (0, utils_2.addEnumForActionAnchor)(appSchema, customActionsDefinitionName, customActionPositionOPDefinitionName);
            addManifestPathsToDefinitionPropertiesOP(appSchema, v4Page.id, customActionsDefinitionName, generateParameters, sectionId);
        }
    }
}
/**
 * Common method updates schema for custom sections or custom subsections.
 *
 * @param sections - sections definition
 * @param  appSchema - app schema of the object page
 * @param generateParameters - list of API input parameters
 * @param v4Page Current page in manifest
 * @param customSectionDefinitionName - The name of the custom section definition to be applied.
 * @param facet - the given facet from the UI annotations
 * @param facetKey - key of the facet, as used in annotation
 */
function applyCustomSections(sections, appSchema, generateParameters, v4Page, customSectionDefinitionName, facet, facetKey) {
    let isMergedSections = false;
    let customSectionRef;
    // facet and facetkey are used for custom subsection definition
    if (facet && facetKey) {
        isMergedSections = !containsCollectionFacet(facet);
        customSectionRef = createCustomSubSectionReference(appSchema, facetKey, generateParameters.featureToggles);
    }
    else {
        // else use custom header section definition
        customSectionRef = customSectionDefinitionName;
    }
    sections.additionalProperties = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${customSectionRef}`
    };
    (0, utils_2.addCustomSectionDefinition)(appSchema, sections, v4Page, customSectionRef, isMergedSections, facetKey, generateParameters.logger);
    const sectionDefinition = appSchema.definitions[customSectionRef];
    if (typeof sectionDefinition === 'object') {
        (0, common_1.addDescriptiveEnumDefinition)(appSchema, sections, {
            schema: sectionDefinition,
            property: 'relatedFacet'
        }, {
            resolveDefinition: true,
            keyProperties: [ux_specification_types_1.SchemaKeyName.id, ux_specification_types_1.SchemaKeyName.key],
            descriptionAsFallback: true
        });
    }
    // add specific definitions for custom sections and custom actions
    if (customSectionRef.includes(ux_specification_types_1.DefinitionName.ObjectPageCustomSectionFragment)) {
        const customSectionCustomActions = appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageCustomSectionActions];
        // initially define no actions for section
        customSectionCustomActions.properties = {};
        applyCustomActionsToCustomSections(appSchema, v4Page, customSectionRef, generateParameters);
    }
    const relatedFacet = sectionDefinition.properties.relatedFacet;
    if (customSectionRef?.includes(ux_specification_types_1.DefinitionName.ObjectPageCustomSubSectionFragment) &&
        isMergedSections &&
        typeof relatedFacet === 'object') {
        // Exclude annotation nodes
        const section = v4Page.options?.settings?.content?.body?.sections?.[facetKey];
        const subSections = section && 'subSections' in section ? section.subSections : {};
        for (let i = relatedFacet.oneOf.length - 1; i >= 0; i--) {
            const entry = relatedFacet.oneOf[i];
            if (!subSections[entry.const]) {
                entry.hidden = true;
            }
        }
    }
}
/**
 * Adds definitions for collections in object page sections to the app schema.
 *
 * @param facet - the given facet from the UI annotations
 * @param facetKey - key of the facet, as used in annotation
 * @param appSchema - app schema of the object page
 * @param sections - schema of current sections definition.
 * @param sectionPrefix - prefix to distinguish Section and HeaderSection
 * @param generateParameters - list of API input parameters
 * @param v4Page Current page in manifest
 * @param level Collection level in tree
 */
function handleCollection(facet, facetKey, appSchema, sections, sectionPrefix, generateParameters, v4Page, level) {
    const isCustomSubSectionsSupported = level === 0;
    const collectionFacet = (sections.properties[facetKey] = (0, common_1.createDefaultSection)(appSchema, facet, facetKey));
    const subsections = {
        // Custom subsections are allowed on first level of subsections
        additionalProperties: false,
        type: 'object',
        properties: {},
        description: 'Subsections'
    };
    collectionFacet.properties = {
        subsections
    };
    subsections[ux_specification_types_1.SchemaTag.annotationPath] = facet.annotationPath;
    subsections[ux_specification_types_1.SchemaTag.target] = facet.namespace;
    subsections[ux_specification_types_1.SchemaTag.keys] = [
        {
            name: ux_specification_types_1.SchemaKeyName.id,
            value: facet.ID
        }
    ];
    subsections[ux_specification_types_1.SchemaTag.isViewNode] = true;
    const nextLevel = level + 1;
    for (const key in facet.facets) {
        addSection(generateParameters, facet.facets, key, subsections, appSchema, sectionPrefix, v4Page, nextLevel);
    }
    if (isCustomSubSectionsSupported) {
        applyCustomSections(subsections, appSchema, generateParameters, v4Page, ux_specification_types_1.DefinitionName.ObjectPageCustomSectionFragment, facet, facetKey);
    }
}
/**
 * Creates a section definition in app schema.
 *
 * @param generateParameters - list of API input parameters
 * @param facets - list of all facets
 * @param facetKey - facet key
 * @param sections - schema of current sections definition
 * @param appSchema - app specific schema of the object page that gets enhanced.
 * @param sectionPrefix - prefix to distinguish Section and HeaderSection
 * @param v4Page Current page in manifest
 * @param [level] Section level in tree
 */
function addSection(generateParameters, facets, facetKey, sections, appSchema, sectionPrefix, v4Page, level = 0) {
    const facet = facets[facetKey];
    const facetDefinitionKey = `ObjectPage${sectionPrefix}${facet.base}<${(0, common_1.getFacetKeyInSchema)(facetKey)}>`;
    switch (facet.base) {
        case ux_specification_types_1.FacetBase.PresentationVariant:
        case ux_specification_types_1.FacetBase.SelectionPresentationVariant: {
            handleSectionPresentationVariant(facet, facetKey, appSchema, sections, sectionPrefix, generateParameters, v4Page);
            break;
        }
        case ux_specification_types_1.FacetBase.CollectionFacet: {
            handleCollection(facet, facetKey, appSchema, sections, sectionPrefix, generateParameters, v4Page, level);
            break;
        }
        case ux_specification_types_1.FacetBase.LineItem: {
            if (sectionPrefix !== ux_specification_types_1.SectionType.HeaderSection) {
                const lineItemFacet = facets[facetKey];
                handleSectionTable(facet, facetKey, appSchema, lineItemFacet, generateParameters, v4Page, sections, level > 0 ? true : false);
            }
            break;
        }
        case ux_specification_types_1.FacetBase.Form:
        case ux_specification_types_1.FacetBase.Identification: {
            handleFormIdentification(facet, v4Page, facetKey, sections, appSchema, sectionPrefix, generateParameters);
            break;
        }
        case ux_specification_types_1.FacetBase.DataPoint: {
            handleHeaderFacet(facet, facetKey, sections, appSchema, facetDefinitionKey);
            break;
        }
        case ux_specification_types_1.FacetBase.Chart: {
            if (sectionPrefix === ux_specification_types_1.SectionType.HeaderSection) {
                handleHeaderFacet(facet, facetKey, sections, appSchema, facetDefinitionKey);
            }
            else if (sectionPrefix === ux_specification_types_1.SectionType.Section) {
                handleSectionChart(facet, facetKey, appSchema, sections);
            }
            break;
        }
        case ux_specification_types_1.FacetBase.Address:
        case ux_specification_types_1.FacetBase.Contact: {
            (0, common_1.handleAddressContact)(facet, facetKey, sections, appSchema, sectionPrefix);
            break;
        }
        default: {
            sections['properties'][facetKey] = (0, common_1.createDefaultSection)(appSchema, facet, facetKey);
        }
    }
}
/**
 * Derives the sections from the UI.Facets annotation and adds them to the schema.
 *
 * @param generateParameters - list of API input parameters
 * @param appSchema - application specific JSON schema of the object page
 * @param v4Page - current page
 */
function addSections(generateParameters, appSchema, v4Page) {
    // Get facet annotations
    const facets = (0, common_1.getObjectPageFacets)(generateParameters.entityType, generateParameters.serviceAVT, ux_specification_types_1.FioriElementsVersion.v4, generateParameters.logger);
    if (!facets) {
        delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageSubSections];
        return;
    }
    const sections = appSchema.definitions[ux_specification_types_1.DefinitionName.Sections];
    for (const facetKey in facets) {
        addSection(generateParameters, facets, facetKey, sections, appSchema, ux_specification_types_1.SectionType.Section, v4Page);
    }
    // add custom sections
    applyCustomSections(sections, appSchema, generateParameters, v4Page, ux_specification_types_1.DefinitionName.ObjectPageCustomSectionFragment);
    addManifestPathsToDefinitionPropertiesOP(appSchema, v4Page.id, ux_specification_types_1.DefinitionName.Sections, generateParameters);
}
/**
 * Derives the header sections from the UI.HeaderFacets annotation and adds them to the schema.
 *
 * @param generateParameters - list of API input parameters
 * @param appSchema - application specific JSON schema of the object page
 * @param entityType - current entity type
 * @param v4Page - current page in manifest
 */
function addHeaderSections(generateParameters, appSchema, entityType, v4Page) {
    // Get facet annotations
    const facets = (0, common_1.getObjectPageHeaderFacets)(entityType, generateParameters.serviceAVT, ux_specification_types_1.FioriElementsVersion.v4, generateParameters.logger);
    const sections = appSchema.definitions[ux_specification_types_1.DefinitionName.HeaderSections];
    sections.properties = {};
    sections.additionalProperties = false;
    if (!facets) {
        return;
    }
    // add annotation header sections
    for (const facetKey in facets) {
        addSection(generateParameters, facets, facetKey, sections, appSchema, ux_specification_types_1.SectionType.HeaderSection, v4Page);
    }
    // add custom header sections
    applyCustomSections(sections, appSchema, generateParameters, v4Page, ux_specification_types_1.DefinitionName.ObjectPageCustomHeaderSectionFragment);
    //delete generic definitions
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageHeaderSectionForm];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageHeaderSectionChart];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageHeaderSectionDataPoint];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageHeaderSectionContact];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageHeaderSectionAddress];
}
/**
 * Add Object Page Header to app-specific schema.
 *
 * @param generateParameters - list of API input parameters
 * @param appSchema Schema of the object page
 * @param v4Page - current page in manifest
 */
function addHeader(generateParameters, appSchema, v4Page) {
    const entityType = generateParameters.entityType;
    (0, common_1.addCommonHeaderSchema)(appSchema, entityType);
    // Add header actions
    (0, common_1.addHeaderActions)(appSchema, entityType, generateParameters, addHeaderActionCallBackV4, v4Page);
    addManifestPathsToDefinitionPropertiesOP(appSchema, v4Page.id, ux_specification_types_1.DefinitionName.ObjectPageHeaderActions, generateParameters);
    // Add header sections
    if (entityType) {
        appSchema.definitions[ux_specification_types_1.DefinitionName.HeaderSections][ux_specification_types_1.SchemaTag.annotationPath] =
            `/${entityType.fullyQualifiedName}/@${"com.sap.vocabularies.UI.v1.HeaderFacets" /* UIAnnotationTerms.HeaderFacets */}`;
    }
    addHeaderSections(generateParameters, appSchema, entityType, v4Page);
    addManifestPathsToDefinitionPropertiesOP(appSchema, v4Page.id, ux_specification_types_1.DefinitionName.HeaderSections, generateParameters);
}
/**
 * Add Object Page Footer to app-specific schema.
 *
 * @param generateParameters - list of API input parameters
 * @param appSchema Schema of the object page
 * @param v4Page - current page in manifest
 */
function addFooter(generateParameters, appSchema, v4Page) {
    // Currently only actions are supported for footer
    (0, common_1.addFooterActions)(appSchema, generateParameters, ux_specification_types_1.FioriElementsVersion.v4, addFooterActionCallBackV4);
    addHeaderFooterCustomActionsOP(appSchema, v4Page, ux_specification_types_1.DefinitionName.CustomFooterActionOP, generateParameters);
    (0, utils_2.addEnumForActionAnchor)(appSchema, ux_specification_types_1.DefinitionName.FooterActions, ux_specification_types_1.DefinitionName.CustomFooterActionPositionOP);
    addManifestPathsToDefinitionPropertiesOP(appSchema, v4Page.id, ux_specification_types_1.DefinitionName.FooterActions, generateParameters);
}
/**
 * Adjusts the default creation mode for tables and tree tables in the application schema
 * based on the presence of navigation settings in the provided page configuration.
 *
 * @param {Definition} appSchema - The application schema object where table creation modes are defined.
 * @param {SapUiAppPageV4} v4Page - The V4 page configuration containing navigation settings.
 */
function adjustDefaultCreationMode(appSchema, v4Page) {
    const navigation = v4Page?.options?.settings?.navigation ?? {};
    const isNavigationDefined = Object.keys(navigation).length > 0;
    appSchema.definitions.TableCreationModeInlineOPTable[ux_specification_types_1.SchemaTag.defaultControlProperty] =
        !isNavigationDefined;
    appSchema.definitions.TableCreationModeNewPageOPTable[ux_specification_types_1.SchemaTag.defaultControlProperty] = isNavigationDefined;
    appSchema.definitions.TableCreationModeInlineOPTreeTable[ux_specification_types_1.SchemaTag.defaultControlProperty] = !isNavigationDefined;
    appSchema.definitions.TableCreationModeNewPageOPTreeTable[ux_specification_types_1.SchemaTag.defaultControlProperty] = isNavigationDefined;
}
/**
 * Adjusts the page settings in the schema definition based on the configuration of the v4 page.
 *
 * @param {Definition} appSchema - The application schema definition to be adjusted.
 * @param {SapUiAppPageV4} v4Page - The SAP UI5 V4 Page configuration.
 */
function adjustPageSettings(appSchema, v4Page) {
    adjustDefaultCreationMode(appSchema, v4Page);
}
/**
 * Adds 'manifestPath' to each property in a definition based on metadata sync rules.
 *
 * @param appSchema - Full schema.
 * @param definitionName - The name of the definition/class whose properties are being processed.
 * @param definition - The definition object containing property schemas.
 * @param pathParams - Additional context required to compute manifest paths.
 * @param handleRelative - A flag indicating whether to use relative paths for definition properties.
 */
function addManifestPathsToPropertiesOP(appSchema, definitionName, definition, pathParams, handleRelative = false) {
    (0, utils_1.addManifestPathsToProperties)(appSchema, definitionName, definition, {
        ...pathParams,
        targetAnnotation: pathParams.sectionId?.replace('::', '/'),
        targetAnnotationEncoded: pathParams.sectionId,
        pathsParts: [
            pathParams.sectionId,
            pathParams.columnKey,
            pathParams.targetAnnotation,
            pathParams.configObject,
            pathParams.originalIds
        ]
    }, handleRelative);
}
/**
 * Adds 'manifestPath' to static nodes in schema.
 *
 * @param appSchema - Full schema.
 * @param pathParams - Additional context required to compute manifest paths.
 */
function addManifestPathsToStaticNodes(appSchema, pathParams) {
    // Add "manifestPath" for current page
    appSchema['manifestPath'] = (0, utils_1.getPageManifestPath)(pathParams);
    // Root level - rules stored on page class level
    addManifestPathsToPropertiesOP(appSchema, ux_specification_types_1.PageTypeV4.ObjectPage, appSchema, pathParams);
    // Other definitions
    const definitions = [ux_specification_types_1.DefinitionName.ObjectPageHeader, ux_specification_types_1.DefinitionName.ObjectPageLayout];
    for (const definitionName of definitions) {
        const definition = appSchema.definitions?.[definitionName];
        if (typeof definition === 'object') {
            addManifestPathsToPropertiesOP(appSchema, definitionName, definition, pathParams);
        }
    }
}
/**
 * Generates an app specific schema out of the generic schema.
 * Generic types are replaced by information from the app specific annotations.
 *
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @param {object} genericSchema  - generic JSON schema of an object page
 * @param {string} contextPath - contextPath of the given page
 * @param {object} genericMacrosSchema - generic JSON schema of custom page
 * @returns the app specific JSON schema
 */
function generateObjectPageSchemaV4(generateParameters, genericSchema, contextPath, genericMacrosSchema) {
    const appSchema = JSON.parse(JSON.stringify(genericSchema));
    // Change reference to generated sections
    appSchema.properties.sections = {
        $ref: `${common_1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.Sections}`
    };
    if (!generateParameters.manifest[ux_specification_types_1.ManifestSection.ui5].routing ||
        !generateParameters.manifest[ux_specification_types_1.ManifestSection.ui5].routing.targets) {
        (0, extensionLogger_1.log)(generateParameters.logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('NOROUTING'),
            location: {
                path: ux_specification_types_1.MANIFESTPATH
            }
        });
        return appSchema;
    }
    //initialize sections
    const sections = (appSchema.definitions[ux_specification_types_1.DefinitionName.Sections] = {
        type: 'object',
        properties: {},
        additionalProperties: false,
        description: ux_specification_types_1.DefinitionName.Sections
    });
    sections[ux_specification_types_1.SchemaTag.isViewNode] = true;
    if (generateParameters.entityType) {
        const pages = generateParameters.manifest[ux_specification_types_1.ManifestSection.ui5].routing
            .targets;
        if (!pages) {
            (0, extensionLogger_1.log)(generateParameters.logger, {
                severity: "error" /* LogSeverity.Error */,
                message: i18next_1.default.t('NOPAGES', { appId: generateParameters.manifest['sap.app']['id'] }),
                location: {
                    path: ux_specification_types_1.MANIFESTPATH,
                    range: [ux_specification_types_1.ManifestSection.generic]
                }
            });
            return appSchema;
        }
        const v4Page = (0, utils_2.findPageV4)(pages, ux_specification_types_1.v4.FE_TEMPLATE_V4_OBJECT_PAGE, generateParameters.entitySet, contextPath);
        if (!v4Page) {
            return appSchema;
        }
        // Add Header
        addHeader(generateParameters, appSchema, v4Page);
        // Add sections
        sections[ux_specification_types_1.SchemaTag.isViewNode] = true;
        if (generateParameters.entityType) {
            sections[ux_specification_types_1.SchemaTag.annotationPath] =
                `/${generateParameters.entityType.fullyQualifiedName}/@${"com.sap.vocabularies.UI.v1.Facets" /* UIAnnotationTerms.Facets */}`;
        }
        // Custom extension fragments
        if ((0, common_1.isFeatureSupported)(generateParameters.featureToggles, ux_specification_types_1.Features.BuildingBlocks) && genericMacrosSchema) {
            appSchema['definitions'][ux_specification_types_1.DefinitionName.ObjectPageCustomSectionFragment]['properties']['controls'] = {
                type: 'object'
            };
            try {
                (0, pageExtensions_1.resolveFragments)(appSchema, genericMacrosSchema, generateParameters, v4Page.id);
            }
            catch (error) {
                (0, extensionLogger_1.log)(generateParameters.logger, {
                    severity: "error" /* LogSeverity.Error */,
                    message: error
                });
            }
        }
        addSections(generateParameters, appSchema, v4Page);
        // Add Footer (actions only)
        addFooter(generateParameters, appSchema, v4Page);
        adjustPageSettings(appSchema, v4Page);
        // Add "manifestPath" on root.page level properties
        addManifestPathsToStaticNodes(appSchema, {
            pageName: v4Page.id,
            manifest: generateParameters.manifest
        });
    }
    // Delete generic definitions from schema
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.CommonHeaderFacetSettings];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.GenericColumnsOP];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.GenericSections];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.GenericSubSections];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageChart];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageSectionAddress];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageSectionChart];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageSectionContact];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageSectionDataPoint];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageSectionForm];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageSectionTableV4];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageSectionPresentationVariant];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageSubSections];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageTable];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageToolBar];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageToolBarAction];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageToolBarActions];
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.QuickVariantSelectionV4OP];
    (0, common_1.updatePropertyIndices)(appSchema, ROOT_PROPERTIES_ORDER);
    return appSchema;
}
//
/**
 * Enhances the Object Page schema with custom field definitions for a specific form section.
 *
 * This function extends the app schema (`appSchema`) by adding schema properties for custom fields
 * associated with a section on the Object Page.
 *
 * @param appSchema - The application schema object representing the Object Page structure.
 * @param v4Page - The current Object Page configuration from the manifest (V4 version).
 * @param sectionPrefix - Indicates whether the section is a header or a standard section (from `SectionType` enum).
 * @param formItemId - Unique identifier of the current form within the schema.
 * @param fieldGroupInManifest - Identifier of the corresponding section (facet) in the manifest.
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @returns Schema ID for fields definition.
 */
function addFormCustomFieldsOP(appSchema, v4Page, sectionPrefix, formItemId, fieldGroupInManifest, generateParameters) {
    const customFieldDefinitionKey = `${ux_specification_types_1.DefinitionName.CustomField}<${formItemId}>`;
    const customFieldDefinition = appSchema.definitions[customFieldDefinitionKey];
    customFieldDefinition[ux_specification_types_1.SchemaTag.isViewNode] = true;
    customFieldDefinition.description = CUSTOM_FIELD_DEFINITION_DESCRIPTION;
    const schemaId = `${ux_specification_types_1.DefinitionName.CustomField}<${formItemId}>`;
    const fieldsDefinitionKey = sectionPrefix === ux_specification_types_1.SectionType.HeaderSection ? ux_specification_types_1.DefinitionName.HeaderSectionFields : ux_specification_types_1.DefinitionName.SectionFields;
    const schemaIdForFields = `${fieldsDefinitionKey}<${(0, common_1.prepareRef)(formItemId)}>`;
    (0, utils_1.addCustomFieldDefinition)(appSchema, v4Page, fieldGroupInManifest, generateParameters.logger, schemaId, schemaIdForFields);
    (0, common_1.parseSchemaDefinition)(ux_specification_types_1.DefinitionName.CustomFieldPosition, formItemId, appSchema, true);
    // Anchor selection
    const positionId = `${ux_specification_types_1.DefinitionName.CustomFieldPosition}<${formItemId}>`;
    customFieldDefinition.properties.position.$ref = `${common_1.DEFINITION_LINK_PREFIX}${positionId}`;
    // Add enum for custom field anchor property
    (0, common_1.addDescriptiveEnumDefinition)(appSchema, appSchema.definitions[schemaIdForFields], {
        definition: positionId,
        property: 'anchor'
    }, {
        resolveDefinition: true
    });
    if (appSchema.definitions[schemaIdForFields]) {
        appSchema.definitions[schemaIdForFields].additionalProperties = {
            $ref: `${common_1.DEFINITION_LINK_PREFIX}${customFieldDefinitionKey}`
        };
    }
    return schemaIdForFields;
}
/**
 * Enhances the Object Page schema with manifest paths for definition and properties.
 *
 * This function extends the app schema (`appSchema`) by adding manifestPath to definition and properties on the Object Page.
 *
 * @param {Definition} appSchema - The application schema object representing the Object Page structure.
 * @param {string} pageId - Identifier of the page.
 * @param {string} definitionName - Identifier of the corresponding definition.
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters.
 * @param {string} facetKey - Identifier of the section (facet key or custom section id) in manifest in case of custom columns.
 */
function addManifestPathsToDefinitionPropertiesOP(appSchema, pageId, definitionName, generateParameters, facetKey) {
    const matchingDefinition = appSchema.definitions[definitionName];
    const properties = matchingDefinition?.properties ?? {};
    const isSections = [`${ux_specification_types_1.DefinitionName.HeaderSections}`, `${ux_specification_types_1.DefinitionName.Sections}`].includes(definitionName);
    for (const key in properties) {
        const pathParams = {
            pageName: pageId,
            manifest: generateParameters.manifest,
            sectionId: undefined,
            columnKey: undefined,
            originalIds: undefined
        };
        const property = matchingDefinition.properties[key];
        // Manifest paths for actions inside actions menus have to be resolved from scratch
        // In schema those are considered as view nodes and won't be resolved by "addManifestPathsToPropertiesOP"
        if (property.$ref && property.$ref.endsWith(`ActionMenu<${key}>`)) {
            const menuDefinitionKey = property.$ref.replace(common_1.DEFINITION_LINK_PREFIX, '');
            const menuDefinition = appSchema.definitions[menuDefinitionKey];
            const menuActions = menuDefinition.properties['actions'];
            const menuActionsDefinitionKey = menuActions.$ref.replace(common_1.DEFINITION_LINK_PREFIX, '');
            addManifestPathsToDefinitionPropertiesOP(appSchema, pageId, menuActionsDefinitionKey, generateParameters, facetKey);
        }
        if (isSections) {
            // Current logic checks for subsections at first level, we meed to introduce recursion? for next levels
            const subSections = property.properties?.['subsections']?.['properties'];
            if (subSections) {
                Object.keys(subSections).forEach((subSectionId) => {
                    // subsections requires array like paths for sync rule resolution
                    const subSection = subSections[subSectionId];
                    pathParams.originalIds = ['sections', key, 'subsections', subSectionId];
                    pathParams.sectionId = key;
                    pathParams.columnKey = subSectionId;
                    addManifestPathsToPropertiesOP(appSchema, undefined, subSection, pathParams, true);
                });
            }
            else {
                // Check OP facets for sectionId resolution
                const facets = (0, common_1.getObjectPageHeaderFacets)(generateParameters.entityType, generateParameters.serviceAVT, ux_specification_types_1.FioriElementsVersion.v4, generateParameters.logger);
                pathParams.sectionId = facets[key]?.ID ?? key;
            }
        }
        else {
            pathParams.sectionId = facetKey;
            pathParams.columnKey = key;
        }
        addManifestPathsToPropertiesOP(appSchema, undefined, property, pathParams, true);
    }
}
//# sourceMappingURL=objectPage.js.map