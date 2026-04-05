"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldReference = getFieldReference;
exports.handleForm = handleForm;
exports.replaceAlias = replaceAlias;
exports.getActionNameAndId = getActionNameAndId;
exports.addFooterActions = addFooterActions;
exports.addHeaderActions = addHeaderActions;
exports.addCommonHeaderSchema = addCommonHeaderSchema;
exports.determineEntitySetOfEntityType = determineEntitySetOfEntityType;
exports.addDataFieldDefinition = addDataFieldDefinition;
exports.getPropertiesForStandardActionAndActionGroup = getPropertiesForStandardActionAndActionGroup;
exports.addDataFieldForActionAndActionGroupDefinition = addDataFieldForActionAndActionGroupDefinition;
const StableIdHelper_1 = require("../../v4/utils/StableIdHelper");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const __1 = require("..");
const utils_1 = require("../../v2/generate/utils");
const DataFieldStrategy_1 = require("../DataFieldStrategy");
/**
 * Copies the field properties from the generic definition to the specific field definition.
 *
 * @param {FioriElementsVersion} version - Fiori Elements version
 * @param {Definition} appSchema - App schema in general
 * @param {DataFieldAbstractTypes} field - field definition in parser output (AVT)
 * @param {string} fieldDefinition - the unique ID for the given field definition
 */
function copyFieldProperties(version, appSchema, field, fieldDefinition) {
    if (version === ux_specification_types_1.FioriElementsVersion.v4 && appSchema['definitions']['Field']) {
        switch (field.$Type) {
            case "com.sap.vocabularies.UI.v1.DataField" /* UIAnnotationTypes.DataField */:
            case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" /* UIAnnotationTypes.DataFieldForAnnotation */:
            case "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath" /* UIAnnotationTypes.DataFieldWithNavigationPath */:
            case "com.sap.vocabularies.UI.v1.DataFieldWithUrl" /* UIAnnotationTypes.DataFieldWithUrl */: {
                appSchema.definitions[fieldDefinition].properties =
                    appSchema.definitions.Field['properties'];
                break;
            }
        }
    }
    else if (version === ux_specification_types_1.FioriElementsVersion.v2 && appSchema['definitions']['Field']) {
        switch (field.$Type) {
            case "com.sap.vocabularies.UI.v1.DataField" /* UIAnnotationTypes.DataField */:
            case "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" /* UIAnnotationTypes.DataFieldForAnnotation */:
            case "com.sap.vocabularies.UI.v1.DataFieldWithUrl" /* UIAnnotationTypes.DataFieldWithUrl */: {
                appSchema.definitions[fieldDefinition].properties =
                    appSchema.definitions.Field['properties'];
                break;
            }
        }
    }
}
/**
 * Determines the name for a field definition in app schema.
 *
 * @param {FioriElementsVersion} version - Fiori Elements version
 * @param fieldReferenceId - the stable ID representation of the field
 * @param {string} targetID - unique ID, identifies the parent object (form)
 * @param fieldReference - the reference to the field definition in schema
 * @returns the field definition name in schema
 */
function determineFieldDefinitionName(version, fieldReferenceId, targetID, fieldReference) {
    const fieldReferenceType = version === ux_specification_types_1.FioriElementsVersion.v2 && fieldReferenceId && fieldReferenceId.includes('::')
        ? fieldReferenceId.split('::')[0].replace('DataField', 'Field')
        : undefined;
    if (version === ux_specification_types_1.FioriElementsVersion.v2) {
        return `${fieldReferenceType}<${targetID}::${fieldReference}>`;
    }
    else {
        return `${targetID}::${fieldReference}`;
    }
}
/**
 * Add the keys and target tag for Datafield.
 *
 * @param field - the given field definition
 * @param appSchema - the app schema to be updated
 * @param schemaKeyOfField - key for the given field in the app schema
 */
function addKeysTagForDataField(field, appSchema, schemaKeyOfField) {
    if (typeof field.Value !== 'string' && field.Value.type === 'Path') {
        appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.keys] = [
            {
                name: 'Value',
                value: field.Value.path
            }
        ];
        appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.target] = field.Value.$target
            ? field.Value.$target.fullyQualifiedName.split('/')[0]
            : field.Value.path;
    }
    else if (typeof field.Value === 'string' && field.Value) {
        appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.keys] = [
            {
                name: 'Value',
                value: field.Value
            }
        ];
        appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.target] = field.fullyQualifiedName.split('@')[0];
    }
}
/**
 * Adds the "keys" tag to a field definition in schema.
 *
 * @param field - the given field definition
 * @param appSchema - the app schema to be updated
 * @param schemaKeyOfField - key for the given field in the app schema
 */
function addKeysTagToField(field, appSchema, schemaKeyOfField) {
    if (field.$Type === "com.sap.vocabularies.UI.v1.DataField" /* UIAnnotationTypes.DataField */ ||
        field.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithUrl" /* UIAnnotationTypes.DataFieldWithUrl */ ||
        field.$Type === "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath" /* UIAnnotationTypes.DataFieldWithNavigationPath */) {
        addKeysTagForDataField(field, appSchema, schemaKeyOfField);
    }
    else if (field.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" /* UIAnnotationTypes.DataFieldForAnnotation */) {
        appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.keys] = [
            {
                name: 'Target',
                value: (0, __1.replaceNamespaces)(field.Target.value)
            }
        ];
        appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.target] =
            field.Target.$target.fullyQualifiedName.split('@')[0];
    }
    else if (field.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */) {
        const separator = field.Action.lastIndexOf('.');
        if (separator === -1) {
            appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.keys] = [
                {
                    name: 'Action',
                    value: field.Action
                }
            ];
        }
        else {
            appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.keys] = [
                {
                    name: 'Action',
                    value: field.Action.substring(separator + 1, field.Action.length)
                }
            ];
            appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.target] = field.Action.substring(0, separator);
        }
    }
    else if (field.$Type === "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */) {
        appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.keys] = [
            {
                name: ux_specification_types_1.SchemaKeyName.semanticObject,
                value: field.SemanticObject
            }
        ];
        if (field.Action) {
            appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.keys].push({
                name: 'Action',
                value: field.Action
            });
        }
        appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.target] = field.fullyQualifiedName.split('@')[0];
    }
}
/**
 * Method checks if passed field is connected field.
 *
 * @param field Field to check.
 * @returns True if passed field's target is ConnectedFieldsType.
 */
function isConnectedField(field) {
    return (field.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAnnotation" /* UIAnnotationTypes.DataFieldForAnnotation */ &&
        field.Target?.$target?.$Type === "com.sap.vocabularies.UI.v1.ConnectedFieldsType" /* UIAnnotationTypes.ConnectedFieldsType */);
}
/**
 * Method stores connected fields into schema definitions.
 *
 * @param {SectionType} sectionType - prefix to distinguish Section and HeaderSection
 * @param {Definition} appSchema - App schema in general
 * @param {DataFieldAbstractTypes} field - field definition in parser output (AVT)
 * @param {FacetConfig} section - current section of the object page
 * @param {FioriElementsVersion} version - Fiori Elements version
 * @returns Resolved connected fields with reference to stored schema definitions.
 */
function addConnectedFields(sectionType, appSchema, field, section, version) {
    const target = field.Target.$target;
    const properties = {};
    if (target.$Type === "com.sap.vocabularies.UI.v1.ConnectedFieldsType" /* UIAnnotationTypes.ConnectedFieldsType */) {
        const template = target.Template || '';
        const templateParts = template.match(/(?<=\{)[^}{]*(?=\})/g) || [];
        const targetData = target.Data;
        // Maintain fallback index which should be used for fields which are not listed in 'Template'
        let fallbackIndex = templateParts.length;
        for (const innerKey in targetData) {
            const innerField = targetData[innerKey];
            if (typeof innerField === 'object' && '$Type' in innerField) {
                let index = templateParts.findIndex((templateKey) => templateKey === innerKey);
                if (index === -1) {
                    index = fallbackIndex;
                    fallbackIndex++;
                }
                addField(sectionType, appSchema, innerField, `ConnectedFields::${target.qualifier}`, index.toString(), section, version, undefined, {
                    actions: properties,
                    fields: properties
                }, target.fullyQualifiedName.split('@')[0]);
            }
        }
    }
    return properties;
}
/**
 * Method returns schema container properties where to store fields.
 *
 * @param {Definition} appSchema - App schema in general
 * @param {string} ref - Container reference id.
 * @param {DefinitionsProperties} [properties] - Preferable container properties to use.
 * @returns Schema container properties where to store fields.
 */
function getFieldsSchemaContainer(appSchema, ref, properties) {
    if (properties) {
        return properties;
    }
    const fieldsDefinition = (0, __1.prepareRef)(ref);
    return appSchema.definitions[fieldsDefinition]['properties'];
}
/**
 * Retrieves the modified field reference based on the specified Fiori Elements version
 * and the provided field reference identifier.
 *
 * @param {FioriElementsVersion} version - The Fiori Elements version (e.g., v2, v4).
 * @param {string} fieldReferenceId - The identifier for the field reference to be processed.
 * @returns {string} The transformed field reference if the version is v2 and the identifier contains '::',
 *                   otherwise returns the original field reference identifier.
 */
function getFieldReference(version, fieldReferenceId) {
    return version === ux_specification_types_1.FioriElementsVersion.v2 && fieldReferenceId && fieldReferenceId.includes('::')
        ? fieldReferenceId.split('::').splice(1).join('::')
        : fieldReferenceId;
}
/**
 * Adds a field configuration to the given section type within the application schema.
 *
 * @param sectionType The type of section where the field is to be added.
 * @param appSchema The application schema to which the field configuration should be added.
 * @param field The data field object that contains the field's metadata and properties.
 * @param targetID The target identifier for the field reference within the schema.
 * @param key The unique key of the field in the configuration.
 * @param section The facet configuration for the section to which the field belongs.
 * @param version The version of Fiori Elements being used.
 * @param withActions A boolean indicating whether actions should be included in the field configuration. Defaults to true.
 * @param containersSchema The schema structure for field containers. Defaults to an empty object.
 * @param entityTypeName The name of the entity type associated with the section. Defaults to the fully qualified name of the section's entity type.
 * @param isInnerAction Whether the action belongs to the action group.
 */
function addField(sectionType, appSchema, field, targetID, key, section, version, withActions = true, containersSchema = {}, entityTypeName = section.entityType.fullyQualifiedName, isInnerAction = false) {
    // Evaluate field type, set field reference of properties of fields' or actions' definition
    if (!field || !field.$Type) {
        return;
    }
    const addDefinitionData = {
        appSchema,
        withActions,
        sectionType,
        field,
        targetID,
        containersSchema,
        key,
        version,
        section,
        entityTypeName,
        isInnerAction
    };
    const strategy = DataFieldStrategy_1.dataFieldStrategyContext.getStrategy(field.$Type);
    strategy.addDefinition(addDefinitionData);
}
/**
 * The function determines the target ID that shall be used in the app schema for a form.
 *
 * @param section - object describing the section or facet
 * @returns the target ID (string)
 */
function determineTargetIdOfForm(section) {
    let targetID;
    if (section.target && section.target['qualifier'] && section.entityType) {
        targetID = `${section.entityType.name}::${section.base}::${section.target['qualifier']}`;
    }
    else if (section.entityType) {
        targetID = `${section.entityType.name}::${section.base}`;
    }
    else {
        targetID = section.ID;
    }
    return targetID;
}
/**
 * Adds the specific definitions of the form fields to a schema.
 *
 * @param {FacetConfig} section - section definition, as prepared from the annotations
 * @param {SectionType} sectionType - prefix to distinguish Section and HeaderSection
 * @param {object} appSchema - app specific schema that gets enhanced
 * @param {string } targetID - target id of form
 * @param {FioriElementsVersion} version - Fiori Elements version
 * @param {boolean} withActions - indicates that actions shall be considered
 */
function addFieldsToFormDefinition(section, sectionType, appSchema, targetID, version, withActions) {
    if (section.base === ux_specification_types_1.FacetBase.Identification) {
        for (const key in section.target) {
            const field = section.target[key];
            if (field) {
                addField(sectionType, appSchema, field, targetID, key, section, version, withActions);
            }
        }
    }
    else {
        for (const key in section.target['Data']) {
            const field = section.target['Data'][key];
            addField(sectionType, appSchema, field, targetID, key, section, version);
        }
    }
}
/**
 * Adds the schema tags for a form definition.
 *
 * @param {FacetConfig} section - section definition, as prepared from the annotations
 * @param {object} appSchema - app specific schema that gets enhanced
 * @param {string} formDefinitionKey - key of the form definition in schema
 */
function addTagsToFormDefinition(section, appSchema, formDefinitionKey) {
    if (section.target) {
        const targetValue = section.target['qualifier']
            ? `${section.target['term']}#${section.target['qualifier']}`
            : `${section.target['term']}`;
        appSchema.definitions[formDefinitionKey][ux_specification_types_1.SchemaTag.keys] = [
            {
                name: ux_specification_types_1.SchemaKeyName.target,
                value: targetValue.replace(/com.sap.vocabularies.UI.v1./g, '')
            }
        ];
        appSchema.definitions[formDefinitionKey][ux_specification_types_1.SchemaTag.target] =
            section.target['fullyQualifiedName']?.split('@')[0];
    }
    appSchema.definitions[formDefinitionKey][ux_specification_types_1.SchemaTag.isViewNode] = true;
    if (section.entityType?.name) {
        appSchema.definitions[formDefinitionKey][ux_specification_types_1.SchemaTag.annotationPath] = (0, __1.createAnnotationPath)(section.entityType.fullyQualifiedName, section.target['term'], section.target['qualifier']);
    }
}
/**
 * Adds definitions for forms in object page sections to the app schema.
 *
 * @param {SectionType} sectionType - prefix to distinguish Section and HeaderSection
 * @param {FacetConfig} section - section definition, as prepared from the annotations
 * @param {object} appSchemaSection - current definition of facet or section in the JSON schema
 * @param {object} appSchema - app specific schema that gets enhanced
 * @param {FioriElementsVersion} version - Fiori Elements version
 * @param {string} facetKey - facet key
 * @returns {string | undefined} target id of form
 */
function handleForm(sectionType, section, appSchemaSection, appSchema, version, facetKey) {
    if (!section.target) {
        return;
    }
    const targetID = determineTargetIdOfForm(section);
    const formDefinitionKey = (0, __1.prepareRef)(`${sectionType}${ux_specification_types_1.DefinitionName.Form}<${targetID}>`);
    const fieldsDefinitionKey = (0, __1.prepareRef)(`${sectionType}${ux_specification_types_1.DefinitionName.Fields}<${targetID}>`);
    const actionsDefinitionKey = (0, __1.prepareRef)(`${sectionType}${ux_specification_types_1.DefinitionName.Actions}<${targetID}>`);
    const withActions = section.base === ux_specification_types_1.FacetBase.Identification && facetKey.indexOf('#') < 0 ? false : true;
    // Form definition
    appSchemaSection.properties.form = { $ref: `${__1.DEFINITION_LINK_PREFIX}${formDefinitionKey}` };
    if (sectionType === ux_specification_types_1.SectionType.Section && withActions) {
        appSchema.definitions[formDefinitionKey] = {
            type: 'object',
            properties: {
                actions: {
                    $ref: `${__1.DEFINITION_LINK_PREFIX}${actionsDefinitionKey}`
                },
                fields: { $ref: `${__1.DEFINITION_LINK_PREFIX}${fieldsDefinitionKey}` }
            },
            description: 'Form',
            additionalProperties: false
        };
        appSchema.definitions[actionsDefinitionKey] = {
            type: 'object',
            properties: {},
            description: 'Actions',
            additionalProperties: false
        };
        appSchema.definitions[actionsDefinitionKey][ux_specification_types_1.SchemaTag.isViewNode] = true;
    }
    else {
        appSchema.definitions[formDefinitionKey] = {
            type: 'object',
            properties: {
                fields: { $ref: `${__1.DEFINITION_LINK_PREFIX}${fieldsDefinitionKey}` }
            },
            description: 'Form',
            additionalProperties: false
        };
    }
    //Add schema tags
    addTagsToFormDefinition(section, appSchema, formDefinitionKey);
    // Fields definition
    appSchema.definitions[fieldsDefinitionKey] = {
        type: 'object',
        properties: {},
        description: 'Fields',
        additionalProperties: false
    };
    appSchema.definitions[fieldsDefinitionKey][ux_specification_types_1.SchemaTag.isViewNode] = true;
    // Add fields
    addFieldsToFormDefinition(section, sectionType, appSchema, targetID, version, withActions);
    return targetID;
}
/**
 * Replaces an alias in an annotation ID or reference, based on the AVT references' list.
 *
 * @param annotationIdentifier - annotation ID or reference
 * @param {ConvertedMetadata} oDataServiceAVT - complete service information, as returned by annotation vocabularies tool
 * @returns the converted string
 */
function replaceAlias(annotationIdentifier, oDataServiceAVT) {
    const potentialAlias = annotationIdentifier.indexOf('.') > -1 ? annotationIdentifier.split('.')[0] : undefined;
    let result = annotationIdentifier;
    if (potentialAlias && oDataServiceAVT) {
        const searchTerm = potentialAlias.replace('SAP__', '');
        const reference = oDataServiceAVT.references.find((ref) => {
            return ref.alias === searchTerm;
        });
        if (reference) {
            result = annotationIdentifier.replace(potentialAlias, reference.namespace);
        }
    }
    return result;
}
/**
 * Extracts the action name, action ID, and namespace from the given item and OData service metadata.
 *
 * @param item - The item containing action information.
 * @param oDataServiceAVT - The OData service metadata used for alias replacement.
 * @returns An object containing the action name, action ID, and namespace.
 */
function getActionNameAndId(item, oDataServiceAVT) {
    const action = replaceAlias(item.Action ?? '', oDataServiceAVT);
    let relevantAction = action;
    let separatorIndex = action.indexOf('(');
    if (separatorIndex > 0) {
        relevantAction = action.substring(0, separatorIndex);
    }
    separatorIndex = relevantAction.lastIndexOf('/');
    if (separatorIndex === -1) {
        separatorIndex = relevantAction.lastIndexOf('.');
    }
    let actionName, actionId, namespace;
    if (separatorIndex > -1) {
        actionName = relevantAction.substring(separatorIndex + 1);
        namespace = relevantAction.substring(0, separatorIndex);
        actionId = `${relevantAction.substring(0, separatorIndex)}::${actionName}`;
    }
    else {
        actionName = relevantAction;
        namespace = item.fullyQualifiedName.split('@')[0];
        if (actionName && actionName !== '') {
            actionId = `${namespace.substring(0, namespace.length - 1)}::${actionName}`;
        }
    }
    return { actionName, actionId, namespace };
}
/**
 * Checks if requested Entity Set is same as first Object Page.
 *
 * @param pages - pages found in manifest
 * @param generateParameters - Schema parameters
 * @returns If found Object Page is first Object Page
 */
function isFirstObjectPage(pages, generateParameters) {
    for (const key in pages) {
        const element = pages[key];
        if (element.component?.name === ux_specification_types_1.v2.FE_TEMPLATE_V2_OBJECT_PAGE) {
            if (generateParameters.entitySet?.name === element.entitySet) {
                return true;
            }
            else {
                return false;
            }
        }
        return isFirstObjectPage(element.pages, generateParameters);
    }
}
/**
 * Add Object Page Footer Action Buttons to app-specific schema.
 *
 * @param appSchema Schema of the app
 * @param generateParameters - Schema parameters
 * @param version - Fiori elements versions
 * @param addFooterActionCallBack - Callback function, either V2 or V4
 * @param pages - pages found in manifest
 */
function addFooterActions(appSchema, generateParameters, version, addFooterActionCallBack, pages) {
    appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageFooter] = JSON.parse(JSON.stringify(appSchema.definitions[`${ux_specification_types_1.DefinitionName.ObjectPageFooter}<ObjectPageFooterActions>`]));
    // Change reference of footer
    appSchema.properties['footer'] = {
        $ref: `${__1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.ObjectPageFooter}`
    };
    // Add action to configuration
    appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageFooter].properties[ux_specification_types_1.PropertyName.actions] = {
        $ref: `${__1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.FooterActions}`
    };
    const footerActions = (appSchema.definitions[ux_specification_types_1.DefinitionName.FooterActions] = {
        type: 'object',
        properties: {},
        description: 'Actions',
        additionalProperties: false
    });
    footerActions[ux_specification_types_1.SchemaTag.isViewNode] = true;
    const alias = (0, __1.findAlias)(ux_specification_types_1.UIVOCABULARY, generateParameters.serviceAVT);
    const entitySet = generateParameters.entitySet;
    const entityType = generateParameters.entityType;
    const actionAnnotation = alias && entityType?.annotations?.[alias]?.Identification;
    if (actionAnnotation) {
        const convertedIdentification = actionAnnotation.fullyQualifiedName.replace(`@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`, `/@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`);
        footerActions[ux_specification_types_1.SchemaTag.annotationPath] = `/${convertedIdentification}`;
        //V2 or V4 callback
        addFooterActionCallBack(entityType, appSchema, footerActions, actionAnnotation);
    }
    else if (entityType) {
        footerActions[ux_specification_types_1.SchemaTag.annotationPath] =
            `/${entityType.fullyQualifiedName}/@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`;
    }
    if (version === ux_specification_types_1.FioriElementsVersion.v2 &&
        isFirstObjectPage(pages, generateParameters) &&
        !(0, utils_1.isDraftEnabled)(entitySet)) {
        (0, utils_1.addStandardFooterActionsOP)(appSchema, footerActions);
    }
    delete appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageFooterActions];
    delete appSchema.definitions[`${ux_specification_types_1.DefinitionName.ObjectPageFooter}<${ux_specification_types_1.DefinitionName.ObjectPageFooterActions}>`];
}
/**
 * Add Object Page Header Action Buttons to app-specific schema.
 *
 * @param {Definition} appSchema Schema of the app
 * @param entityType - The entity type for which the entity set is being determined
 * @param {GenerateAppSchemaParameters} generateParameters - list of API input parameters
 * @param {Function} addHeaderActionCallBack - Callback function, either V2 or V4
 * @param page - The page configuration for the object page
 * @param isV2 - Indicates whether the version is V2
 */
function addHeaderActions(appSchema, entityType, generateParameters, addHeaderActionCallBack, page, isV2 = false) {
    const actionsDefinition = ux_specification_types_1.DefinitionName.ObjectPageHeaderActions;
    //Actions as defined by ObjectPageHeaderActionsStandard (V2) or ObjectPageHeaderActions (V4)
    const actions = appSchema.definitions[actionsDefinition];
    appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageHeader].properties[ux_specification_types_1.PropertyName.actions] = {
        $ref: `${__1.DEFINITION_LINK_PREFIX}${actionsDefinition}`
    };
    const headerActions = (appSchema.definitions[actionsDefinition] = {
        type: 'object',
        properties: {},
        description: 'Actions',
        additionalProperties: false
    });
    headerActions[ux_specification_types_1.SchemaTag.isViewNode] = true;
    const alias = (0, __1.findAlias)(ux_specification_types_1.UIVOCABULARY, generateParameters.serviceAVT);
    const identification = alias && entityType?.annotations?.[alias]?.Identification;
    if (identification) {
        headerActions[ux_specification_types_1.SchemaTag.annotationPath] =
            '/' +
                identification.fullyQualifiedName.replace(`@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`, `/@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`);
    }
    else if (entityType) {
        headerActions[ux_specification_types_1.SchemaTag.annotationPath] =
            `/${entityType.fullyQualifiedName}/@${"com.sap.vocabularies.UI.v1.Identification" /* UIAnnotationTerms.Identification */}`;
    }
    addHeaderActionCallBack(entityType, appSchema, identification, headerActions, generateParameters, page);
    if (isV2) {
        // handle header actions
        (0, utils_1.addStandardHeaderActions)(appSchema, true, actions);
    }
}
/**
 * Adds common Object Page Header definitions to the app schema.
 *
 * @param appSchema - app-specific JSOn schema
 * @param entityType - current entity Type
 */
function addCommonHeaderSchema(appSchema, entityType) {
    appSchema.properties['header'] = {
        $ref: `${__1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.ObjectPageHeader}`
    };
    appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageHeader] = JSON.parse(JSON.stringify(appSchema.definitions[`${ux_specification_types_1.DefinitionName.ObjectPageHeader}`]));
    if (entityType) {
        appSchema.definitions[ux_specification_types_1.DefinitionName.ObjectPageHeader][ux_specification_types_1.SchemaTag.annotationPath] =
            `/${entityType.fullyQualifiedName}/@${"com.sap.vocabularies.UI.v1.HeaderInfo" /* UIAnnotationTerms.HeaderInfo */}`;
    }
}
/**
 * Common logic to determine the EntitySet of a given EntityType.
 *
 * @param entityType - The entity type for which the entity set is being determined
 * @param serviceAVT - AVT converter output, comprising all annotation information
 * @returns the entity set as defined in AVT, if found
 */
function determineEntitySetOfEntityType(entityType, serviceAVT) {
    return entityType
        ? serviceAVT.entitySets.find((es) => es.entityType.fullyQualifiedName === entityType.fullyQualifiedName)
        : undefined;
}
/**
 * Adds a data field definition to the application schema based on the provided parameters.
 *
 * @param {AddDefinitionParams} data - An object containing the parameters necessary to define and add the data field.
 * This includes:
 * - `appSchema`: The application schema to which the definition is added
 * - `section`: The section in which the field resides
 * - `sectionType`: The type of the section
 * - `field`: The specific field to be added
 * - `targetID`: The target identifier for the field
 * - `containersSchema`: The schema container for fields
 * - `key`: The key that determines the order of the field
 * - `version`: The version of the schema
 */
function addDataFieldDefinition(data) {
    const { appSchema, section, sectionType, field, targetID, containersSchema, key, version } = data;
    // Calculate field reference
    const fieldReferenceId = (0, StableIdHelper_1.getStableIdPartFromDataField)(field);
    const fieldReference = getFieldReference(version, fieldReferenceId);
    // Determine field definition name
    const schemaKeyOfField = determineFieldDefinitionName(version, fieldReferenceId, targetID, fieldReference);
    const fieldsProperties = getFieldsSchemaContainer(appSchema, `${sectionType}${ux_specification_types_1.DefinitionName.Fields}<${targetID}>`, containersSchema.fields);
    // Field properties
    let properties = {};
    fieldsProperties[fieldReference] = {
        $ref: `${__1.DEFINITION_LINK_PREFIX}${schemaKeyOfField}`,
        propertyIndex: parseInt(key)
    };
    if (isConnectedField(field)) {
        // Populate connected fields
        properties = addConnectedFields(sectionType, appSchema, field, section, version);
    }
    writeDefinitionToSchema(data, schemaKeyOfField, properties);
}
/**
 * Returns standard action and action group properties from the generic definition to the app specific schema.
 *
 * @param appSchema - Schema of the object page.
 * @param definitionName - Name of the generic action defition.
 * @returns Properties for standard action or action group.
 */
function getPropertiesForStandardActionAndActionGroup(appSchema, definitionName) {
    const properties = {};
    // Default action definition
    const objectPageHeaderActionDefinition = appSchema.definitions[definitionName];
    if (objectPageHeaderActionDefinition) {
        const objectPageHeaderActionDefinitionProperties = objectPageHeaderActionDefinition.properties ?? {};
        Object.keys(objectPageHeaderActionDefinitionProperties).forEach((propertyName) => {
            if (typeof objectPageHeaderActionDefinition.properties[propertyName] === 'object') {
                properties[propertyName] = { ...objectPageHeaderActionDefinition.properties[propertyName] };
            }
        });
    }
    return properties;
}
/**
 * Adds a data field to the schema definition for action and action group configurations.
 *
 * @param {AddDefinitionParams} data - The input data required to add the data field, including:
 * - appSchema: The application schema to be updated.
 * - withActions: A flag indicating whether actions are included.
 * - sectionType: The type of the section (e.g., Section).
 * - field: The data field to be added.
 * - targetID: The identifier of the target.
 * - containersSchema: The schema containing action and action groups configurations.
 * - key: The key used for the property's index.
 * - version: The schema version information.
 */
function addDataFieldForActionAndActionGroupDefinition(data) {
    const { appSchema, withActions, sectionType, field, targetID, containersSchema, key, version } = data;
    // Calculate field reference
    const fieldReferenceId = (0, StableIdHelper_1.getStableIdPartFromDataField)(field);
    const fieldReference = getFieldReference(version, fieldReferenceId);
    // Determine field definition name
    const schemaKeyOfField = determineFieldDefinitionName(version, fieldReferenceId, targetID, fieldReference);
    const properties = {};
    if (withActions && sectionType === ux_specification_types_1.SectionType.Section) {
        const actionsProperties = getFieldsSchemaContainer(appSchema, `${sectionType}${ux_specification_types_1.DefinitionName.Actions}<${targetID}>`, containersSchema.actions);
        const fieldInSchema = (actionsProperties[fieldReference] = {
            $ref: `${__1.DEFINITION_LINK_PREFIX}${schemaKeyOfField}`
        });
        fieldInSchema[ux_specification_types_1.SchemaTag.propertyIndex] = parseInt(key);
    }
    addGroupedActionsToDefinition(data, schemaKeyOfField, properties);
    writeDefinitionToSchema(data, schemaKeyOfField, properties);
}
/**
 * Adds each action in the group to the provided schema properties based on the given field and schema key.
 *
 * @param {AddDefinitionParams} data - An object containing details about the application schema, the field, and the version.
 * @param {string} schemaKeyOfField - The schema key corresponding to the field being processed.
 * @param {DefinitionsProperties} properties - The schema definitions properties object where new definitions will be added.
 */
function addGroupedActionsToDefinition(data, schemaKeyOfField, properties) {
    const { appSchema, field, version } = data;
    if (field.$Type !== "com.sap.vocabularies.UI.v1.DataFieldForActionGroup" /* UIAnnotationTypes.DataFieldForActionGroup */) {
        return;
    }
    // read basic properties from the generic schema
    const basicProperties = getPropertiesForStandardActionAndActionGroup(appSchema, ux_specification_types_1.DefinitionName.ObjectPageFormActionGroup);
    for (const propKey in basicProperties) {
        properties[propKey] = basicProperties[propKey];
    }
    (field['Actions'] ?? []).forEach((action) => {
        const dataForGroup = {
            ...data,
            field: action,
            targetID: schemaKeyOfField,
            withActions: false,
            isInnerAction: true
        };
        const actionReferenceId = (0, StableIdHelper_1.getStableIdPartFromDataField)(action);
        const actionReference = getFieldReference(version, actionReferenceId);
        const schemaKeyOfAction = determineFieldDefinitionName(version, actionReferenceId, schemaKeyOfField, actionReference);
        addDataFieldForActionAndActionGroupDefinition(dataForGroup);
        properties[actionReference] = appSchema.definitions[schemaKeyOfAction];
    });
}
/**
 * Writes a definition to the schema based on the provided data and schema key.
 *
 * @param {AddDefinitionParams} data - The parameters containing information about the schema, field, version, section, and entity type name.
 * @param {string} schemaKeyOfField - The key for the schema definition where the field's properties should be added.
 * @param {DefinitionsProperties} [properties] - Optional properties to include in the schema definition.
 * @returns {void} The function does not return a value.
 */
function writeDefinitionToSchema(data, schemaKeyOfField, properties = {}) {
    const { appSchema, field, version, section, sectionType, entityTypeName, isInnerAction } = data;
    appSchema.definitions[schemaKeyOfField] = {
        type: 'object',
        properties,
        description: (0, __1.getDataFieldDescription)(field, section.entityType),
        additionalProperties: false
    };
    //Add tags
    addKeysTagToField(field, appSchema, schemaKeyOfField);
    appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.annotationPath] = `/${entityTypeName}/${field.fullyQualifiedName.split(entityTypeName)[1]}`;
    appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.annotationType] = field.$Type;
    appSchema.definitions[schemaKeyOfField][ux_specification_types_1.SchemaTag.isViewNode] = true;
    (0, __1.addDataTypeToDefinition)(appSchema.definitions[schemaKeyOfField], field);
    // Copy the generic definition of field properties to the specific one
    copyFieldProperties(version, appSchema, field, schemaKeyOfField);
    if (field.$Type === "com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */ && appSchema.definitions?.[ux_specification_types_1.DefinitionName.FormAction]) {
        if (isInnerAction) {
            appSchema.definitions[schemaKeyOfField].$ref = `${__1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.FormActionBase}`;
        }
        else {
            appSchema.definitions[schemaKeyOfField].$ref = `${__1.DEFINITION_LINK_PREFIX}${ux_specification_types_1.DefinitionName.FormAction}`;
        }
        delete appSchema.definitions[schemaKeyOfField].properties;
    }
    if (field.$Type === "com.sap.vocabularies.UI.v1.DataFieldForActionGroup" /* UIAnnotationTypes.DataFieldForActionGroup */ &&
        appSchema.definitions?.[ux_specification_types_1.DefinitionName.ObjectPageFormActionGroup]) {
        /* Create a new ref for the group action definition to follow the common schema definition rules
         * We add the wrapper around `schemaKeyOfField`, either ObjectPageFormActionGroup<...> or ObjectPageHeaderActionGroup<...>
         * For existing action group definition we use newly created definition link as $ref
         * The goal is to have:
         *  PreviousDefinitionKey {$ref: ../../ObjectPageFormActionGroup<PreviousDefinitionKey>  } without properties
         *  ObjectPageFormActionGroup<PreviousDefinitionKey>: with properties
         */
        let referenceDefinitionName = ux_specification_types_1.DefinitionName.ObjectPageFormActionGroup;
        if (sectionType === ux_specification_types_1.SectionType.HeaderSection) {
            referenceDefinitionName = ux_specification_types_1.DefinitionName.ObjectPageHeaderActionGroup;
        }
        const newActionGroupDefinitionName = `${referenceDefinitionName}<${schemaKeyOfField}>`;
        const currentActionGroupDefinition = appSchema.definitions[schemaKeyOfField];
        // Clone action group definition
        appSchema.definitions[newActionGroupDefinitionName] = {
            ...currentActionGroupDefinition
        };
        delete currentActionGroupDefinition.properties;
        // Assign newly cloned action group definition to existing action group definition `$ref`
        currentActionGroupDefinition.$ref = `${__1.DEFINITION_LINK_PREFIX}${newActionGroupDefinitionName}`;
    }
}
//# sourceMappingURL=objectPage.js.map