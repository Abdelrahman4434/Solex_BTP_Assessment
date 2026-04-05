"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigForPage = getConfigForPage;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../../common");
const utils_1 = require("../utils");
/**
 * This function provides the flex changes contained in the parameters passed to the import process in a way that can be more easily consumed
 * by that process.
 *
 * @param importParameters the parameters of an import process
 * @returns the flex changes contained in the import parameters in a format that can be easily consumed
 */
function getChangeMapFormImportParameters(importParameters) {
    const changeMap = {}; // The object to be returned, will be filled one by one
    const changeStrings = importParameters.flex;
    changeStrings.forEach(function (changeString) {
        const deserializedChangeString = (0, common_1.parseChangeString)(changeString);
        if (deserializedChangeString) {
            const change = deserializedChangeString;
            // Add the change to the array of changes for the target control. Thereby, create this array when this change is the first one for that control.
            const changes = changeMap[change.controlId] || [];
            changes.push(change);
            changeMap[change.controlId] = changes;
        }
    });
    return changeMap;
}
/* Begin: Helper functions for getConfigForPage */
/**
 * This function is used to get the config representation of a manifest value or a flex change value.
 * Thereby, we assume that the corresponding property in the schema has artifactType 'Manifest' or artifact type 'Flex Change'.
 *
 * @param value - the value contained in the manifest resp. in the flex change for the property
 * @param propertyDefinition - metadata for the property to be processed (taken from the page specific schema)
 * @param globalTypeDefinitions - global type definitions that may be referred from within propertyDefinition
 * @param importParameters - parameters of the current import process
 * @param importConfigInfo - page specific information for the import process
 * @returns the value that should be added to the config
 */
function getConfigRep(value, propertyDefinition, globalTypeDefinitions, importParameters, importConfigInfo) {
    if (value === undefined) {
        return undefined;
    }
    const refType = (0, common_1.getRefType)(propertyDefinition);
    const refTypeDefinition = refType ? globalTypeDefinitions[refType] : undefined;
    if (propertyDefinition[ux_specification_types_1.SchemaTag.conversionExit]) {
        // If a conversion exit has been specified for this property let it do the job
        value = (0, utils_1.executeConversionExit)(true, importConfigInfo.conversionExitProvider, propertyDefinition, value, importParameters.fragments, undefined, importParameters.logger);
        if (!refTypeDefinition) {
            return value;
        }
    }
    // If propertyDefinition refers to another (global) definition, execute the logic based on this reference
    if (refTypeDefinition) {
        return getConfigRep(value, refTypeDefinition, globalTypeDefinitions, importParameters, importConfigInfo);
    }
    if (propertyDefinition.type === 'object' && propertyDefinition.properties && typeof value === 'object') {
        // If the value to be transferred is an object perform the transfer recursively for each property.
        // If the resulting object is empty (hasProperty is still false) return undefined
        const returnObject = {};
        let hasProperty = false;
        for (const property in propertyDefinition.properties) {
            const propDef = propertyDefinition.properties[property];
            const valueForProp = getConfigRep(value[property], propDef, globalTypeDefinitions, importParameters, importConfigInfo);
            if (valueForProp !== undefined) {
                hasProperty = true;
                returnObject[property] = valueForProp;
            }
        }
        return hasProperty ? returnObject : undefined;
    }
    if (propertyDefinition.type === 'array' && !Array.isArray(value)) {
        // Special logic for arrays which are represented as comma separated strings within the manifest.
        // Opposite logic can be found in function getValueForManifest in export.exportPageGeneric.ts
        return typeof value === 'string' && value !== '' ? value.split(',') : undefined;
    }
    // If none of the above special cases applies: Simply return the value
    return value;
}
/**
 * This function transfers a property value from the manifest or a flex change into the config.
 * Thereby, we assume that the corresponding property in the schema has artifactType 'Manifest' or artifact type 'Flex Change'.
 *
 * @param config - the configuration the value should be passed to
 * @param importConfigInfo - page specific information for the import process
 * @param propertyPath - information about the types from config root down to the parent of the property currently processed
 * @param property - name of property currently processed
 * @param propValue - value to be transferred from manifest or flex change
 * @param propertyDefinition - metadata for the property to be processed (taken from the page specific schema)
 * @param globalTypeDefinitions - global type definitions that may be referred from within propertyDefinition
 * @param importParameters - parameters of the current import process
 */
function transferValueToConfig(config, importConfigInfo, propertyPath, property, propValue, propertyDefinition, globalTypeDefinitions, importParameters) {
    // Get the config representation of propValue (in most cases identical to propValue itself)
    const targetValue = getConfigRep(propValue, propertyDefinition, globalTypeDefinitions, importParameters, importConfigInfo);
    if (targetValue === undefined) {
        // In some cases getConfigRep may still find out that the value needs not to be transferred -> end here
        return;
    }
    // Now we are sure that a value has to be added to config.
    // Navigate to the parent object for the property along the specified path, thereby creating empty objects
    // where no object is yet available.
    let settingTarget = config;
    const prefixPath = [];
    propertyPath.forEach(function (propertyTypeInfo) {
        prefixPath.push(propertyTypeInfo);
        const propertyName = propertyTypeInfo.propertyName;
        // Create the object on next level if it is not yet there
        settingTarget[propertyName] =
            settingTarget[propertyName] || importConfigInfo.propertyInstanceProvider(prefixPath);
        settingTarget = settingTarget[propertyName]; // Step down to the object on the next level
    });
    // Finally transfer the value
    settingTarget[property] = targetValue;
}
/**
 * This function is called for schema properties which are flagged as artifactType 'FlexChange'.
 * The function checks whether a flex change is available for the specified property.
 * If yes, it transfers the corresponding value to the given config.
 *
 * @param config - the potential transfer target
 * @param importConfigInfo - page specific information for the import process
 * @param propertyPath - information about the types from config root down to the parent of the property currently processed
 * @param property - name of property currently processed
 * @param propertyDefinition - metadata for the property to be processed (taken from the page specific schema)
 * @param globalTypeDefinitions - global type definitions that may be referred from within propertyDefinition
 * @param importParameters - parameters of the current import process
 * @param changeMap - collection of applicable flex changes in a format that is easier to consume than importParameters.flex.
 * Note that flex changes which are evaluated by this function are removed from the map, since we do not expect any flex change to be applicable twice.
 */
function importFlexChangesToConfigProperty(config, importConfigInfo, propertyPath, property, propertyDefinition, globalTypeDefinitions, importParameters, changeMap) {
    const controlId = propertyDefinition[ux_specification_types_1.SchemaTag.controlId]; // the id of the control the flex change would be applied to
    const applicableChangeDefinitions = changeMap[controlId];
    if (!applicableChangeDefinitions) {
        // No flex changes for that control available at all -> nothing to do
        return;
    }
    // Search whether there is a flex change for property within the list of flex changes for the relevant control
    let position = -1;
    const changeDefinition = applicableChangeDefinitions.find(function (changeDefinition, i) {
        if (changeDefinition.content.property === property) {
            position = i;
            return true;
        }
        return false;
    });
    if (changeDefinition) {
        // There is a change for the specified property in the specified control -> transfer it to target
        transferValueToConfig(config, importConfigInfo, propertyPath, property, changeDefinition.type === 'propertyBindingChange'
            ? changeDefinition.content.newBinding
            : changeDefinition.content.newValue, propertyDefinition, globalTypeDefinitions, importParameters);
        // As this change has already been processed, remove it from the list of all changes
        if (applicableChangeDefinitions.length === 1) {
            delete changeMap[controlId];
        }
        else {
            applicableChangeDefinitions.splice(position, 1);
        }
    }
}
/**
 * This function is called for schema properties which are flagged as artifactType 'Manifest'.
 * The function checks whether a manifest entry is available for the specified property.
 * If yes, it transfers the corresponding value to the given config.
 *
 * @param config - the potential transfer target
 * @param importConfigInfo - page specific information for the import process
 * @param propertyPath - information about the types from config root down to the parent of the property currently processed
 * @param property - name of property currently processed
 * @param propertyDefinition - metadata for the property to be processed (taken from the page specific schema)
 * @param globalTypeDefinitions - global type definitions that may be referred from within propertyDefinition
 * @param importParameters - parameters of the current import process
 */
function importManifestToConfigProperty(config, importConfigInfo, propertyPath, property, propertyDefinition, globalTypeDefinitions, importParameters) {
    const jsonPath = propertyDefinition[ux_specification_types_1.SchemaTag.manifestPath];
    let addTargetPropertyToPath; // decision whether property belongs to the full path in the manifest
    const accessorPath = (0, common_1.jsonPathToArray)(jsonPath);
    if (accessorPath.at(-1) === property) {
        // default case where property is also contained in the manifest path
        accessorPath.pop();
        addTargetPropertyToPath = true;
    }
    else {
        // more complex case supporting scenario in which property is a name which is only used within the config but does not occur in the manifest
        // example for that would be config property 'custom' which is hard-coded in the tools logic but actually does not occur in the manifest
        addTargetPropertyToPath = false;
    }
    const { hasPath, value, parent } = (0, utils_1.getManifestPropertyByPath)(importParameters.manifest, accessorPath, addTargetPropertyToPath ? property : undefined);
    if (!hasPath) {
        return;
    }
    const propValue = addTargetPropertyToPath ? value : parent;
    transferValueToConfig(config, importConfigInfo, propertyPath, property, propValue, propertyDefinition, globalTypeDefinitions, importParameters);
}
/**
 * The task of this function is to pass values from manifest and flex changes to the given config.
 * Thereby, values from all properties defined within the given Definition are processed (including child objects).
 *
 * @param config - the potential transfer target
 * @param importConfigInfo - page specific information for the import process
 * @param definition - the properties of this Definition will be processed
 * @param propertyPath - the path from the root of the schema to the specified Definition
 * @param globalTypeDefinitions - global type definitions that may be referred from within definition
 * @param importParameters - parameters of the current import process
 * @param changeMap - collection of applicable flex changes in a format that is easier to consume than importParameters.flex.
 * Note that flex changes which are evaluated by this function are removed from the map, since we do not expect any flex change to be applicable twice.
 */
function importDefinitionIntoConfig(config, importConfigInfo, definition, propertyPath, globalTypeDefinitions, importParameters, changeMap) {
    if (!(0, utils_1.isDefinition)(definition.properties)) {
        return; // no properties to be processed
    }
    for (const property in definition.properties) {
        const propertyDefinition = definition.properties[property];
        if (!(0, utils_1.isDefinition)(propertyDefinition)) {
            continue; // ignore properties that are null or boolean (should not occur in our schemas anyway)
        }
        // Now propertyDefinition is actually an instance of Definition
        // We distinguish three cases:
        // - current property is handled by flex
        // - current property can be mapped onto a manifest property (or a section within the manifest)
        // - property is still complex and points to a global type which describes how the content should be processed
        // Note that the inline definition of a complex type is not yet supported.
        const artifactType = propertyDefinition[ux_specification_types_1.SchemaTag.artifactType];
        if (artifactType === ux_specification_types_1.ArtifactType.FlexChange) {
            // case 1
            importFlexChangesToConfigProperty(config, importConfigInfo, propertyPath, property, propertyDefinition, globalTypeDefinitions, importParameters, changeMap);
        }
        else if (artifactType === ux_specification_types_1.ArtifactType.Manifest && propertyDefinition[ux_specification_types_1.SchemaTag.manifestPath]) {
            // case 2
            importManifestToConfigProperty(config, importConfigInfo, propertyPath, property, propertyDefinition, globalTypeDefinitions, importParameters);
        }
        else {
            const refType = (0, common_1.getRefType)(propertyDefinition);
            const refTypeDefinition = refType ? globalTypeDefinitions[refType] : undefined;
            if ((0, utils_1.isDefinition)(refTypeDefinition)) {
                // case 3 -> Recursively step down
                const nextLevelPropertyPath = propertyPath.concat([
                    {
                        propertyName: property,
                        propertyType: refType.split('<')[0] // Remove a potential suffix from the global type to get the type name in the generic schema
                    }
                ]);
                importDefinitionIntoConfig(config, importConfigInfo, refTypeDefinition, nextLevelPropertyPath, globalTypeDefinitions, importParameters, changeMap);
            }
        }
    }
}
/**
 * This function creates and returns a config for a page of an FE v2 app (executes the 'import').
 *
 * @param importParameters - required information from the app
 * @param pagePath - specifies the page within the app. Note that importParameters.jsonSchema must be
 * consistent with this path. That means that this schema must be the schema that is generated by getAdaptedSchema
 * in schemaAdaptation.ts for this page. This function does not check this consistency.
 * @param getConfigInfo - a function that can provide the ImportConfigInfo to be used for the specified page type
 * @returns the (filled) config for the specified page
 */
function getConfigForPage(importParameters, pagePath, getConfigInfo) {
    const templateType = (0, common_1.getTemplateTypeFromManifest)(importParameters.manifest, ux_specification_types_1.FioriElementsVersion.v2, importParameters.logger);
    if (!templateType || templateType === ux_specification_types_1.TemplateType.OverviewPageV2) {
        return; // not supported (yet)
    }
    const { parent: pageDefinition } = (0, utils_1.getManifestPropertyByPath)(importParameters.manifest, pagePath);
    const componentName = pageDefinition?.['component']?.name;
    const importConfigInfo = typeof componentName === 'string' ? getConfigInfo(componentName) : undefined;
    if (!importConfigInfo) {
        return;
    }
    const changeMap = getChangeMapFormImportParameters(importParameters); // Prepare a consumable format of the flex changes
    const schema = importParameters.jsonSchema;
    const globalTypeDefinitions = schema.definitions;
    const config = importConfigInfo.propertyInstanceProvider([]); // instantiate the empty config
    importDefinitionIntoConfig(config, importConfigInfo, schema, [], globalTypeDefinitions, importParameters, changeMap); // and fill it
    return config;
}
//# sourceMappingURL=importPage.js.map