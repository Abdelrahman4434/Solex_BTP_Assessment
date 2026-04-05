"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataFieldStrategyContext = exports.DataFieldStrategyContext = exports.DataFieldStrategy = void 0;
const utils_1 = require("./utils");
const StableIdHelper_1 = require("../v4/utils/StableIdHelper");
const objectPage_1 = require("./generate/objectPage");
const utils_2 = require("../v4/utils/utils");
const ux_specification_types_1 = require("@sap/ux-specification-types");
/**
 * Strategy interface for handling UI "data field"-like items during schema generation/import.
 *
 * Terminology:
 * In this module, "data field" refers to annotation-based UI DataFields and other artifacts with a similar nature
 * that participate in the same schema/config generation flow (for example, manifest-based actions / action menus).
 *
 * A concrete strategy implementation is selected by item type and can be used to:
 * - create/extend schema definitions (fields/actions),
 * - generate stable IDs and user-facing descriptions,
 * - import action settings from schema references.
 *
 * Some methods provide a default (fallback) implementation. Specialized strategies may override them
 * to apply type-specific handling (e.g. action groups, manifest-based action menus, etc.).
 */
class DataFieldStrategy {
    /**
     * Adds a new definition based on the provided parameters.
     *
     * @param {AddDefinitionParams} data - An object containing the parameters required to add the definition.
     */
    addDefinition(data) {
        (0, objectPage_1.addDataFieldDefinition)(data);
    }
    /**
     * Adds a new line item definition to the system based on the provided parameters.
     *
     * @param {AddLineItemDefinitionParams} data - The parameters used to define the new line item.
     */
    addLineItemDefinition(data) {
        (0, utils_2.addLineItemRecordToSchema)(data);
    }
    /**
     * Imports the action settings of a specified reference.
     * Default implementation: imports a single action’s settings from the referenced definition.
     * Specialized strategies override this for other cases (e.g. group actions, manifest-based action menus).
     *
     * @param {ImportActionSettingsOfReferenceParams} importActionParams - The parameters required to import action settings.
     * @param {Definition} definitionOfReference - The definition object of the reference.
     * @param {string} [definitionKey] - Optional schema-definition key providing additional context about the *target*
     * configuration scope. Some strategies use it as a discriminator to resolve special schema shapes (e.g. wrapper
     * definitions for action groups) and to pick the correct definition to read settings from / write settings into.
     *
     * Usage notes:
     * - Pass `definitionKey` when the caller knows the surrounding definition context (e.g. current facet/section key).
     * - Strategies must handle `definitionKey` being omitted; default implementation may ignore it.
     */
    importActionSettingsOfReference(importActionParams, definitionOfReference, definitionKey) {
        (0, utils_2.importSingleActionSettingsOfReference)(importActionParams, definitionOfReference);
    }
}
exports.DataFieldStrategy = DataFieldStrategy;
class DataFieldForActionStrategy extends DataFieldStrategy {
    /**
     * Generates a stable identifier based on the given data field.
     *
     * @param {DataFieldForActionAbstractTypes} dataField - The data field used to generate the stable identifier.
     * @returns {string} A stable identifier string derived from the provided data field.
     */
    generateStableId(dataField) {
        return (0, StableIdHelper_1.prepareId)('DataFieldForAction::' + dataField.Action);
    }
    /**
     * Generates a description for the provided data field based on its label and context.
     *
     * @param {DataFieldForActionAbstractTypes} dataField - The data field for which the description is generated.
     * @param {EntityType} entityType - The type of the entity associated with the data field.
     * @returns {string} The generated description for the specified data field.
     */
    generateDescription(dataField, entityType) {
        const dataFieldLabel = (0, utils_1.getLabel)(dataField.Label, entityType);
        return (0, utils_1.getDescriptionForActionBasedDataFields)(dataField, dataFieldLabel);
    }
    /**
     * Adds a new definition for an action.
     * This method processes the given data and integrates it into the action definition structure.
     *
     * @param {AddDefinitionParams} data - An object containing the necessary parameters for the action definition.
     */
    addDefinition(data) {
        (0, objectPage_1.addDataFieldForActionAndActionGroupDefinition)(data);
    }
    /**
     * Adds a line item definition to the schema based on the provided data.
     * Determines the appropriate action based on the properties of the line item record.
     *
     * @param {object} data - The parameters for adding the line item definition.
     * @param {object} data.lineItemRecord - The line item record object containing specific properties.
     * @param {object} data.lineItemDefinition - The line item definition object.
     */
    addLineItemDefinition(data) {
        (0, utils_2.addLineItemActionDefinition)(data);
    }
}
class DataFieldForActionGroupStrategy extends DataFieldStrategy {
    /**
     * Generates a stable identifier for a given data field.
     *
     * @param {DataFieldForActionGroupTypes} dataField - The data field object containing necessary details for generating the stable ID.
     * @returns {string} A stable identifier string based on the provided data field.
     */
    generateStableId(dataField) {
        return (0, StableIdHelper_1.prepareId)('DataFieldForActionGroup::' + dataField.ID);
    }
    /**
     * Generates a description based on the provided data field, entity type, and label.
     *
     * @param {DataFieldForActionGroupTypes} dataField - The data field object used to generate the description.
     * @param {EntityType} entityType - The entity type associated with the data field.
     * @returns {string} The generated description, which will be the data field's label, ID, or the provided default label.
     */
    generateDescription(dataField, entityType) {
        const dataFieldLabel = (0, utils_1.getLabel)(dataField.Label, entityType);
        return dataField.Label ?? dataField.ID ?? dataFieldLabel;
    }
    /**
     * Adds a definition using the given data.
     *
     * @param {AddDefinitionParams} data - The data object containing the definition details to be added.
     */
    addDefinition(data) {
        (0, objectPage_1.addDataFieldForActionAndActionGroupDefinition)(data);
    }
    /**
     * Adds a new line item definition to the schema.
     *
     * @param {AddLineItemDefinitionParams} data - The data for the line item definition to be added.
     */
    addLineItemDefinition(data) {
        // Action definitions in the Macro table do not use references, so group actions are written directly to the schema
        (0, utils_2.addGroupActionRecordToSchema)(data, !data.lineItemData?.isMacro);
    }
    /**
     * @inheritDoc
     *
     * Why override:
     * Action groups can have wrapper/nested schema definitions, so importing settings requires resolving the correct
     * target scope. The group-specific import supports `definitionKey` to disambiguate the surrounding definition
     * context when available.
     * @param {ImportActionSettingsOfReferenceParams} importActionParams - Parameters required for importing action settings of a reference.
     * @param {Definition} definitionOfReference - The definition of the reference for which the action settings are being imported.
     * @param {string} [definitionKey] - An optional key that may be used to identify or process the reference definition.
     */
    importActionSettingsOfReference(importActionParams, definitionOfReference, definitionKey) {
        (0, utils_2.importGroupActionSettingsOfReference)(importActionParams, definitionOfReference, definitionKey);
    }
}
class DataFieldForIntentBasedNavigationStrategy extends DataFieldStrategy {
    /**
     * Generates a stable ID for the given data field by concatenating a prefix with a part derived
     * from the semantic object and action of the data field.
     *
     * @param {DataFieldForActionAbstractTypes} dataField - The data field for which the stable ID is to be generated.
     * @returns {string} The generated stable ID as a string.
     */
    generateStableId(dataField) {
        return 'DataFieldForIntentBasedNavigation::' + (0, StableIdHelper_1.getStableIdPartFromSemanticObjectAndAction)(dataField);
    }
    /**
     * Generates a description for the given data field based on the provided entity type and label.
     *
     * @param {DataFieldForActionAbstractTypes} dataField - The data field for which the description is to be generated.
     * @param {EntityType} entityType - The type of the entity associated with the data field.
     * @returns {string} The generated description for the given data field.
     */
    generateDescription(dataField, entityType) {
        const dataFieldLabel = (0, utils_1.getLabel)(dataField.Label, entityType);
        return (0, utils_1.getDescriptionForActionBasedDataFields)(dataField, dataFieldLabel);
    }
    /**
     * Adds a new definition based on the provided data.
     *
     * @param {AddDefinitionParams} data - The data used to create the new definition.
     */
    addDefinition(data) {
        (0, objectPage_1.addDataFieldForActionAndActionGroupDefinition)(data);
    }
    /**
     * Adds a line item definition to the schema based on the provided data.
     * Determines the appropriate action based on the properties of the line item record.
     *
     * @param {object} data - The parameters for adding the line item definition.
     * @param {object} data.lineItemRecord - The line item record object containing specific properties.
     * @param {object} data.lineItemDefinition - The line item definition object.
     */
    addLineItemDefinition(data) {
        (0, utils_2.addLineItemActionDefinition)(data);
    }
}
class DataFieldForAnnotationStrategy extends DataFieldStrategy {
    /**
     * Generates a stable identifier for a given data field.
     *
     * @param {DataFieldForAnnotationTypes} dataField - The data field for which the stable identifier will be generated.
     * This parameter includes information about annotations and target paths related to the field.
     * @returns {string} The stable identifier created by combining specific parts of the data field's annotation path.
     */
    generateStableId(dataField) {
        const annotationPath = dataField.Target?.$AnnotationPath ?? dataField.Target?.value ?? '';
        return 'DataFieldForAnnotation::' + (0, StableIdHelper_1.prepareId)(annotationPath);
    }
    /**
     * Generates a description for a given data field based on its label, common label, or target metadata.
     *
     * @param {DataFieldForAnnotationTypes} dataField - The data field object containing metadata for the data annotation.
     * @param {EntityType} entityType - The entity type associated with the data field.
     * @returns {string} A string representing the generated description based on the provided data field and entity type.
     */
    generateDescription(dataField, entityType) {
        const propertyCommonLabel = (0, utils_1.getLabelForDataField)(dataField, entityType);
        const dataFieldLabel = (0, utils_1.getLabel)(dataField.Label, entityType);
        return (dataFieldLabel ||
            propertyCommonLabel ||
            dataField?.Target?.$target?.Title ||
            dataField?.Target?.value?.split('UI.v1.')[1]);
    }
}
class DataFieldWithActionStrategy extends DataFieldStrategy {
    /**
     * Generates a stable identifier for a given data field with action.
     * The stable ID is constructed based on the Value property of the data field
     * (if it exists) and the Action property of the data field.
     *
     * @param {DataFieldForActionAbstractTypes} dataField - The data field containing
     * the action and optionally a value, used to generate the stable identifier.
     * @returns {string} A stable identifier string constructed based on the data field's
     * Value and Action properties.
     */
    generateStableId(dataField) {
        let sIdPart = 'DataFieldWithAction::';
        if ('Value' in dataField && dataField.Value) {
            sIdPart += (0, StableIdHelper_1.getStableIdPartFromValue)(dataField.Value) + '::';
        }
        sIdPart += dataField.Action;
        return (0, StableIdHelper_1.prepareId)(sIdPart);
    }
    /**
     * Generates a description based on the provided data field, entity type, and data field label.
     *
     * @param {DataFieldForActionAbstractTypes} dataField - The data field for which the description is to be generated.
     * @param {EntityType} entityType - The entity type that is associated with the data field.
     * @returns {string} The generated description for the specified data field and entity type.
     */
    generateDescription(dataField, entityType) {
        const dataFieldLabel = (0, utils_1.getLabel)(dataField.Label, entityType);
        return (0, utils_1.getDescriptionForActionBasedDataFields)(dataField, dataFieldLabel);
    }
}
class DataFieldStrategyDefault extends DataFieldStrategy {
    /**
     * Generates a stable identifier string for a provided data field.
     *
     * @param {DataField} dataField - The data field object containing the value to generate the stable identifier from.
     * @returns {string} A stable identifier string derived from the data field value.
     */
    generateStableId(dataField) {
        return (0, StableIdHelper_1.prepareId)('DataField::' + (0, StableIdHelper_1.getStableIdPartFromValue)(dataField.Value));
    }
    /**
     * Generates a descriptive title for the given data field.
     *
     * @param {DataField} dataField - The data field for which the description will be generated.
     * @param {EntityType} entityType - The entity type associated with the data field.
     * @returns {string} The generated description for the data field.
     */
    generateDescription(dataField, entityType) {
        const dataFieldLabel = (0, utils_1.getLabel)(dataField.Label, entityType);
        return (0, utils_1.getTitleForDataField)(dataField, entityType, dataFieldLabel);
    }
}
class DataFieldWithIntentBasedNavigationStrategy extends DataFieldStrategy {
    /**
     * Generates a stable ID for a given DataFieldWithIntentBasedNavigationTypes object.
     *
     * @param {DataFieldWithIntentBasedNavigationTypes} dataField - The data field object containing information for intent-based navigation.
     * @returns {string} A stable ID string created based on the provided data field.
     */
    generateStableId(dataField) {
        let sIdPart = 'DataFieldWithIntentBasedNavigation::';
        sIdPart += (0, StableIdHelper_1.getStableIdPartFromValue)(dataField.Value) + '::';
        sIdPart += (0, StableIdHelper_1.getStableIdPartFromSemanticObjectAndAction)(dataField);
        return (0, StableIdHelper_1.prepareId)(sIdPart);
    }
    /**
     * Generates a description for the given data field based on its intent-based navigation or common label.
     *
     * @param {DataFieldWithIntentBasedNavigationTypes} dataField - The data field for which the description is to be generated.
     * @param {EntityType} entityType - The entity type to be used for retrieving the label of the data field.
     * @returns {string} The generated description, either derived from the common label or the value path of the data field.
     */
    generateDescription(dataField, entityType) {
        const propertyCommonLabel = (0, utils_1.getLabelForDataField)(dataField, entityType);
        return propertyCommonLabel || dataField.Value.path;
    }
}
class DataFieldWithNavigationPathStrategy extends DataFieldStrategy {
    /**
     * Generates a stable ID based on the given DataFieldWithNavigationPath object.
     *
     * @param {DataFieldWithNavigationPath} dataField - The data field from which the stable ID will be generated. It should include properties like Value and optionally Target with a $NavigationPropertyPath.
     * @returns {string} The generated stable ID as a string.
     */
    generateStableId(dataField) {
        let sIdPart = 'DataFieldWithNavigationPath::' + (0, StableIdHelper_1.getStableIdPartFromValue)(dataField.Value);
        if (dataField.Target && dataField.Target['$NavigationPropertyPath']) {
            sIdPart += '::' + dataField.Target['$NavigationPropertyPath'];
        }
        return (0, StableIdHelper_1.prepareId)(sIdPart);
    }
    /**
     * Generates a description for a given data field based on the entity type and label provided.
     *
     * @param {DataField} dataField - The data field for which the description is being generated.
     * @param {EntityType} entityType - The type of the entity associated with the data field.
     * @returns {string} The generated description for the data field.
     */
    generateDescription(dataField, entityType) {
        const dataFieldLabel = (0, utils_1.getLabel)(dataField.Label, entityType);
        return (0, utils_1.getTitleForDataField)(dataField, entityType, dataFieldLabel);
    }
}
class DataFieldWithUrlStrategy extends DataFieldStrategy {
    /**
     * Generates a stable ID based on the provided data field.
     *
     * @param {DataFieldWithUrl} dataField - An object containing the data field information, including a URL and a value used to generate the ID.
     * @returns {string} A stable and unique string ID derived from the data field's value.
     */
    generateStableId(dataField) {
        return (0, StableIdHelper_1.prepareId)('DataFieldWithUrl::' + (0, StableIdHelper_1.getStableIdPartFromValue)(dataField.Value));
    }
    /**
     * Generates a description based on the provided data field, entity type, and label.
     *
     * @param {DataFieldWithUrl} dataField - The data field containing the information needed to generate the description.
     * @param {EntityType} entityType - The type of entity associated with the data field.
     * @returns {string} The generated description, which is determined by the provided label, the common label for the data field, or the data field's value.
     */
    generateDescription(dataField, entityType) {
        const propertyCommonLabel = (0, utils_1.getLabelForDataField)(dataField, entityType);
        const dataFieldLabel = (0, utils_1.getLabel)(dataField.Label, entityType);
        return (dataFieldLabel ||
            propertyCommonLabel ||
            (typeof dataField.Value === 'string' ? dataField.Value : dataField.Value.path));
    }
}
class ManifestBasedActionMenuStrategy extends DataFieldStrategy {
    /**
     * @inheritDoc
     *
     * Why override:
     * Manifest-based action menus store their settings differently than annotation-based actions,
     * so the default single-action import does not apply.
     * @param {ImportActionSettingsOfReferenceParams} importActionParams - The parameters required for importing action settings.
     * @param {Definition} definitionOfReference - The reference definition to retrieve action settings from.
     */
    importActionSettingsOfReference(importActionParams, definitionOfReference) {
        (0, utils_2.importManifestBasedActionMenuSettingsOfReference)(importActionParams, definitionOfReference);
    }
}
class DataFieldStrategyContext {
    /**
     * Constructor to initialize the strategies map with various DataFieldStrategyTypes and their corresponding strategies.
     * It registers predefined strategies to handle different UI annotation types by mapping each type
     * to the appropriate strategy instance.
     *
     */
    constructor() {
        this.strategies = new Map();
        this.registerStrategy("com.sap.vocabularies.UI.v1.DataFieldForAction" /* UIAnnotationTypes.DataFieldForAction */, new DataFieldForActionStrategy());
        this.registerStrategy("com.sap.vocabularies.UI.v1.DataFieldForActionGroup" /* UIAnnotationTypes.DataFieldForActionGroup */, new DataFieldForActionGroupStrategy());
        this.registerStrategy("com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation" /* UIAnnotationTypes.DataFieldForIntentBasedNavigation */, new DataFieldForIntentBasedNavigationStrategy());
        this.registerStrategy("com.sap.vocabularies.UI.v1.DataFieldForAnnotation" /* UIAnnotationTypes.DataFieldForAnnotation */, new DataFieldForAnnotationStrategy());
        this.registerStrategy("com.sap.vocabularies.UI.v1.DataFieldWithAction" /* UIAnnotationTypes.DataFieldWithAction */, new DataFieldWithActionStrategy());
        this.registerStrategy("com.sap.vocabularies.UI.v1.DataField" /* UIAnnotationTypes.DataField */, new DataFieldStrategyDefault());
        this.registerStrategy("com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation" /* UIAnnotationTypes.DataFieldWithIntentBasedNavigation */, new DataFieldWithIntentBasedNavigationStrategy());
        this.registerStrategy("com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath" /* UIAnnotationTypes.DataFieldWithNavigationPath */, new DataFieldWithNavigationPathStrategy());
        this.registerStrategy("com.sap.vocabularies.UI.v1.DataFieldWithUrl" /* UIAnnotationTypes.DataFieldWithUrl */, new DataFieldWithUrlStrategy());
        this.registerStrategy(ux_specification_types_1.CustomUIAnnotationTypes.ManifestBasedActionMenu, new ManifestBasedActionMenuStrategy());
    }
    /**
     * Registers a strategy for a specific type of data field.
     *
     * @param {string} type - The type of data field to associate with the strategy.
     * @param {DataFieldStrategy} strategy - The strategy to be registered for the specified type.
     */
    registerStrategy(type, strategy) {
        this.strategies.set(type, strategy);
    }
    /**
     * Retrieves the strategy associated with the given type.
     *
     * @param {string} type - The key representing the type of strategy to retrieve.
     * @returns {DataFieldStrategy | undefined} The strategy corresponding to the provided type, or undefined if no strategy is found.
     */
    getStrategy(type) {
        return this.strategies.get(type);
    }
}
exports.DataFieldStrategyContext = DataFieldStrategyContext;
exports.dataFieldStrategyContext = new DataFieldStrategyContext();
//# sourceMappingURL=DataFieldStrategy.js.map