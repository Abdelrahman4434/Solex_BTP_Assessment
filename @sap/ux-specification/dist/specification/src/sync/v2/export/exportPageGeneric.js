"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportPage = exportPage;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const utils_1 = require("../utils");
const common_1 = require("../../common");
/**
 * This function is called for every property in the page specific schema with artifactType FlexChange.
 * Thereby, we assume that such a property always corresponds to a control property (with same name) that can be changed via a flex change
 * The function will derive the information about the flex change that should be created (or the information that no flex change is needed)
 * for this property and add it to the list.
 * Note: Currently we assume that conversion exits are only used for manifest based properties. Hence, no extra logic for conversion exits is needed here.
 *
 * @param propertyDefinition - definition of the property in the page specific schema
 * @param value - the value for the property according to the config object that is currently exported
 * @param propertyName - name of the property
 * @param flexList - the list to be enhanced
 */
function addFlexChangeInfoToList(propertyDefinition, value, propertyName, flexList) {
    const newValue = value === undefined ? null : value; // special logic for control properties which are not changed by flex
    const isBinding = typeof newValue === 'string' && newValue.startsWith('{');
    flexList.push({
        controlId: propertyDefinition[ux_specification_types_1.SchemaTag.controlId],
        controlType: propertyDefinition[ux_specification_types_1.SchemaTag.controlType],
        propertyName,
        newValue,
        isBinding
    });
}
/**
 * Returns how a value from the config should be passed to the manifest.
 * This function will be called for all properties with artifactType 'Manifest'.
 * In case the property has type 'object' it will also be recursively be called for all children of the object.
 *
 * @param value - the value for the property in the config currently processed (undefined if the property is not present in the config)
 * @param oldValue - current value for the property in the manifest (resp. undefined if the property is not in the current manifest)
 * @param propertyDefinition - definition of the property in the current schema
 * @param globalInfoForExport - global information valid for the export process
 * @returns the value for the property in the modified manifest, resp. undefined when the property should be removed from the manifest.
 */
function getValueForManifest(value, oldValue, propertyDefinition, globalInfoForExport) {
    if (propertyDefinition[ux_specification_types_1.SchemaTag.conversionExit]) {
        // When a conversion exit has been defined for the property, let it do the job
        return (0, utils_1.executeConversionExit)(false, globalInfoForExport.conversionExitProvider, propertyDefinition, value, globalInfoForExport.fragments, oldValue);
    }
    // Special logic for string arrays. Note that the opposite logic is implemented in function getConfigRep in import.importPage.ts
    if (propertyDefinition.type === 'array' && propertyDefinition.items?.['type'] === 'string') {
        if (!Array.isArray(value) || value.length === 0) {
            return oldValue === '' || typeof oldValue !== 'string' ? oldValue : undefined;
        }
        return value.join(',');
    }
    if (value === oldValue || propertyDefinition.type !== 'object' || !propertyDefinition.properties) {
        return value; // unchanged entries will not be modified. Moreover, only objects with properties need special care
    }
    // In case an object is to be returned this return object is built as follows:
    // Take (a shallow copy of) oldValue as a starting point (resp. an empty object if oldValue was not a valid object) and
    // replace its values for 'known' properties (i.e. the properties defined in the schema) by the corresponding property value from newValue.
    // If this would set the property value to undefined remove the property instead.
    // Note that this procedure guarantees that the values for unknown properties stay as they are in oldValue.
    const returnObject = typeof oldValue === 'object' && oldValue !== null ? { ...oldValue } : {};
    let hasNewValueDefinedChildProperty = false;
    let hasOldValueDefinedChildProperty = false;
    for (const childProperty in propertyDefinition.properties) {
        let childPropertyDefinition = propertyDefinition.properties[childProperty];
        if (!(0, utils_1.isDefinition)(childPropertyDefinition)) {
            continue; // ignore properties defined as boolean (should not appear in our schemas anyway)
        }
        const refType = (0, common_1.getRefType)(childPropertyDefinition);
        childPropertyDefinition =
            (refType && globalInfoForExport.globalTypeDefinitions[refType]) || childPropertyDefinition;
        const oldChildValue = returnObject[childProperty];
        hasOldValueDefinedChildProperty = hasOldValueDefinedChildProperty || oldChildValue !== undefined;
        const newChildValue = getValueForManifest(value ? value[childProperty] : undefined, oldChildValue, childPropertyDefinition, globalInfoForExport);
        if (newChildValue === undefined) {
            delete returnObject[childProperty];
        }
        else {
            returnObject[childProperty] = newChildValue;
            hasNewValueDefinedChildProperty = true;
        }
    }
    // If the object which was built in the way described above has at least one known property value we can safely return it as the new value
    if (hasNewValueDefinedChildProperty) {
        return returnObject;
    }
    // When we reach this point newValue does not contain a value for any known property. If the same was true for oldValue we can safely return the oldValue as
    // no changes have been applied to this object.
    if (!hasOldValueDefinedChildProperty) {
        return oldValue;
    }
    // When we reach this point then newValue contains the information that all known properties should be removed from the oldValue
    // and that this has happened for at least one property. We still distinguish two cases:
    // - oldValues contains no unknown properties. As all known properties have been removed, returnObject has been stripped to be an empty object.
    //   In this case we return undefined to indicate that the object should be removed from the manifest as well.
    // - oldValue contains at least one unknown property. In this case we want to keep the object alive, now containing only the unknown properties.
    //   This is, what we get from returnObject.
    return Object.keys(oldValue).every((oldValueKey) => (0, utils_1.isDefinition)(propertyDefinition.properties[oldValueKey]))
        ? undefined
        : returnObject;
}
/**
 * Returns whether two java script instances should be considered as different manifest entries.
 *
 * @param obj1 the first instance
 * @param obj2 the second instance
 * @returns whether obj1 and obj2 should be considered different.
 */
function isDifferent(obj1, obj2) {
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
        return obj1 !== obj2;
    }
    // This if-block is probably superfluous, since manifests of v2 apps should not contain any
    // arrays. We leave it in for completeness.
    if (Array.isArray(obj1) || Array.isArray(obj2)) {
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            return (obj1.length !== obj2.length ||
                obj1.some(function (entry1, i) {
                    return isDifferent(entry1, obj2[i]);
                }));
        }
        return true;
    }
    const keys1 = Object.keys(obj1).filter((key) => obj1[key] !== undefined);
    const keys2 = Object.keys(obj2).filter((key) => obj2[key] !== undefined);
    return (keys1.length !== keys2.length ||
        keys1.some(function (key) {
            return isDifferent(obj1[key], obj2[key]);
        }));
}
/**
 * This function is called by transferConfigPropertyToExportResults (see below) for schema properties that have artifactType 'Manifest'.
 * It is responsible for transferring the config value of this property to the manifest and the fragments (not implemented yet).
 *
 * @param fullManifestPath - the path in the manifest (ending with the name of the property itself) the value should be passed to
 * @param value - content of the property according to the config, resp. undefined if the property is not present in the config.
 * In the later case the property should (normally) be removed from the manifest.
 * @param target - the results of the export to be updated
 * @param propertyDefinition - definition of the property in the page specific schema
 * @param globalInfoForExport - global information valid for the export process
 */
function applyManifestChange(fullManifestPath, value, target, propertyDefinition, globalInfoForExport) {
    let manifestSection = target.manifest; // will be used to step down in the hierarchy of the manifest to the parent of the target property
    const lengthToParent = fullManifestPath.length - 1;
    const finalProperty = fullManifestPath[lengthToParent]; // name of the property which should be updated
    const backPath = []; // Will be set to contain the (not null) objects in the current manifest which lie on the path to the parent of the target property
    // Step down in the manifest to the parent of the target property. Stop if an entry on that path is missing (or not an object).
    fullManifestPath.some(function (property, i) {
        if (i === lengthToParent) {
            // as we only want to navigate to the parent, stop now
            return true;
        }
        const nextSection = manifestSection[property];
        if (typeof nextSection !== 'object' || nextSection === null) {
            return true; // do not step down to something which is not an object (normally that means that we reached undefined, but incorrect manifests may also contain other values where an object is expected)
        }
        // Safely step down to the object on the next level
        manifestSection = nextSection;
        backPath.push(manifestSection);
    });
    // If the length of backPath is lengthToParent the parent object already exists in the manifest (and is an object). So we (potentially) have an old value for the target property
    const oldValue = backPath.length === lengthToParent ? manifestSection[finalProperty] : undefined;
    const newValue = getValueForManifest(value, oldValue, propertyDefinition, globalInfoForExport);
    if (!isDifferent(newValue, oldValue)) {
        return; // nothing to do
    }
    // newValue and oldValue are different
    if (newValue === undefined || (typeof oldValue === 'object' && typeof newValue === 'object' && (0, utils_1.isEmpty)(newValue))) {
        // Two scenarios in which the target property should be removed from the manifest:
        // - newValue is undefined
        // - both oldValue and newValue are objects and newValue is empty (indicating that all properties have been removed)
        // Note: In both scenarios oldValue cannot be undefined (in the first since it is different from newValue). Hence, backPath.length === lengthToParent according to the definition of oldValue.
        target.manifestChangeIndicator = ux_specification_types_1.ChangeIndicator.Deleted;
        // Remove the specified property from its parent. Then loop the object hierarchy upwards and delete all objects which have been made empty by this process.
        for (let i = lengthToParent; i > 0; i--) {
            const candidateForRemove = backPath[i]; // will be undefined in the first run
            if (!(0, utils_1.isEmpty)(candidateForRemove)) {
                break; // stop the process when finding an object that is not empty after deleting the specified entry. Will not happen in the first run.
            }
            // As the object is empty: Remove it from its parent. Will be executed at least once, thereby removing the specified property from its parent.
            const parent = backPath[i - 1];
            const prop = fullManifestPath[i];
            delete parent[prop];
        }
    }
    else {
        // Create a path of empty objects to the parent of target, if the manifest is not structured deep enough yet
        for (let i = backPath.length; i < lengthToParent; i++) {
            const newEmptyObject = {};
            manifestSection[fullManifestPath[i]] = newEmptyObject;
            manifestSection = newEmptyObject;
        }
        // Now manifestSection is the parent object of the property to be set -> update it with the new value
        manifestSection[finalProperty] = newValue;
        target.manifestChangeIndicator = oldValue === undefined ? ux_specification_types_1.ChangeIndicator.Created : ux_specification_types_1.ChangeIndicator.Updated;
    }
}
/**
 * This function is called by function transferConfigToExportResults (see below) for all properties contained in the
 * schema element processed by this function.
 * It is responsible for transferring the content of the config for this property to the export results.
 *
 * @param source - the section of the config that potentially contains the property
 * @param target - the results of the export to be updated
 * @param property - name of the property to be handled
 * @param propertyDefinition - definition of the property in the page specific schema
 * @param globalInfoForExport - global information valid for the export process
 */
function transferConfigPropertyToExportResults(source, target, property, propertyDefinition, globalInfoForExport) {
    const sourcePart = source?.[property];
    const artifactType = propertyDefinition[ux_specification_types_1.SchemaTag.artifactType];
    // We distinguish three cases:
    // - current property is handled by flex
    // - current property can be mapped onto a manifest property (or a section within the manifest)
    // - property is still complex and points to a global type which describes how the content should be processed
    // Note that the inline definition of a complex type is not yet supported.
    if (artifactType === ux_specification_types_1.ArtifactType.FlexChange) {
        // Case 1
        addFlexChangeInfoToList(propertyDefinition, sourcePart, property, target.flexList);
    }
    else if (artifactType === ux_specification_types_1.ArtifactType.Manifest && propertyDefinition[ux_specification_types_1.SchemaTag.manifestPath]) {
        // Case 2
        // propertyDefinition.manifestPath is a JSONPath that describes how to find
        // the place in the manifest representing the property.
        // manifestPath contains the same information but in the more convenient AccessorPath format.
        const manifestPath = (0, common_1.jsonPathToArray)(propertyDefinition[ux_specification_types_1.SchemaTag.manifestPath]);
        applyManifestChange(manifestPath, sourcePart, target, propertyDefinition, globalInfoForExport);
    }
    else {
        // Note: inline type definitions currently not supported
        const refType = (0, common_1.getRefType)(propertyDefinition);
        const refTypeDefinition = refType ? globalInfoForExport.globalTypeDefinitions[refType] : undefined;
        if ((0, utils_1.isDefinition)(refTypeDefinition)) {
            transferConfigToExportResults(sourcePart, target, refTypeDefinition, globalInfoForExport);
        }
    }
}
/**
 * This function is used by function exportPage (see below).
 * It (recursively) transfers the content of the config or one of its sub-objects to the export results.
 * Note that the process is driven by the structure of the schema and not by the structure of the current config.
 * This means that we will finally process all properties defined directly or indirectly within the given schema element, even if they are not contained in the config
 * (which means that no change for the corresponding property should be there).
 * This ensures that properties which have been removed from the config are handled correctly as well (for manifest based properties this means that they are removed from the manifest,
 * for flex changes this means that a flex change with value null is created).
 *
 * @param source - the section of the config to be transferred
 * @param target - the results of the export to be updated
 * @param definition - schema element describing the section of the config currently processed
 * @param globalInfoForExport - global information valid for the export process
 */
function transferConfigToExportResults(source, target, definition, globalInfoForExport) {
    const properties = definition.properties || {};
    // Perform the update for all available properties
    for (const property in properties) {
        // propertyDefinition tells us how to handle the property
        const propertyDefinition = definition.properties[property];
        if ((0, utils_1.isDefinition)(propertyDefinition)) {
            // ignore properties that are null or boolean (should not occur in our schemas anyway)
            transferConfigPropertyToExportResults(source, target, property, propertyDefinition, globalInfoForExport);
        }
    }
}
/**
 * This function implements the generic export for a page.
 * More precisely it takes the current state of the app (manifest, flex changes, fragments), the page specific schema for a page within the app, and the
 * config for this page. It returns the information how the app should be adapted.
 * Thereby, we assume that the config was created by function getConfigForPage (in importPage.ts) from the current state of the page
 * and then potentially modified (e.g. by user interaction).
 *
 * @param inParameters - an object containing all information relevant for the export process
 * @returns the information about the updated state of the app
 */
function exportPage(inParameters) {
    const config = inParameters.config;
    const globalTypeDefinitions = inParameters.jsonSchema.definitions;
    // As a starting point create a return object representing the current state of the app
    const fragmentResults = (inParameters.fragments || []).map(function (fragment) {
        const result = {
            ...fragment,
            changeIndicator: ux_specification_types_1.ChangeIndicator.NoChange
        };
        return result;
    });
    const globalInfoForExport = {
        globalTypeDefinitions,
        conversionExitProvider: inParameters.conversionExitProvider,
        fragments: fragmentResults
    };
    // TODO: Check whether property 'views' needs to be initialized as well
    const returnObject = {
        manifest: structuredClone(inParameters.manifest),
        manifestChangeIndicator: ux_specification_types_1.ChangeIndicator.NoChange,
        flexList: [],
        fragments: fragmentResults
    };
    // Adapt returnObject according to the state of the config. This is driven by the page specific schema.
    transferConfigToExportResults(config, returnObject, inParameters.jsonSchema, globalInfoForExport);
    return returnObject;
}
//# sourceMappingURL=exportPageGeneric.js.map