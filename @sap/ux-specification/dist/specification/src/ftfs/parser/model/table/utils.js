"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTableChildNodeLocations = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
/**
 * Method checks if passed location is associated with annotation source/artifact.
 *
 * @param location Location object.
 * @returns True if passed location is associated with annotation source/artifact.
 */
const isAnnotationLocation = (location) => {
    return !location.type || location.type === ux_specification_types_1.ArtifactType.Annotation;
};
/**
 * Method updates table and table's child nodes annotation "locations" properties.
 * It is used to handle different schema variations:
 * 1. "AnnotationPath" can be placed in "Table" node;
 * 2. "AnnotationPath" can be missed in "Table" node, but placed in child node;
 * In case of 2nd scenario - we need to copy "locations" from child and apply to "Table" node.
 *
 * @param child Table's child aggregation/node.
 */
const updateTableChildNodeLocations = (child) => {
    const annotationLocations = [];
    const locations = child.locations ? [...child.locations] : [];
    // Remove annotation locations from original aggregation
    for (let i = locations.length - 1; i >= 0; i--) {
        const location = locations[i];
        if (isAnnotationLocation(location)) {
            annotationLocations.push(location);
            locations.splice(i, 1);
        }
    }
    // Add annotation locations to parent aggregation
    if (child.parent && annotationLocations.length) {
        const parentLocations = child.parent.locations || [];
        // Overwrite annotation locations if exists
        child.parent.locations = parentLocations.filter((location) => !isAnnotationLocation(location));
        child.parent.locations.unshift(...annotationLocations);
    }
    child.locations = locations;
};
exports.updateTableChildNodeLocations = updateTableChildNodeLocations;
//# sourceMappingURL=utils.js.map