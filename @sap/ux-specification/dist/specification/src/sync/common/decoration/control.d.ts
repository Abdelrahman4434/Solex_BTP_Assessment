import type { ControlTypeFunction } from '@sap/ux-specification-types';
/**
 * General export rule, joining all given breadcrumbs to the base ID.
 *
 * @param baseId - base ID, first part of the stable ID
 * @param idBreadcrumbs - array of ID parts
 * @returns the constructed stable ID as a string
 */
export declare const buildControlIdFromParent: (baseId: string, idBreadcrumbs: string[]) => string;
/**
 * Constructs a stable ID for pages by combining the base ID, ID breadcrumbs, and the first breadcrumb.
 *
 * @param baseId - base ID, first part of the stable ID
 * @param idBreadcrumbs - array of ID parts
 * @param breadcrumbs - array of breadcrumbs
 * @returns the constructed stable ID as a string
 */
export declare const buildControlIdForPage: (baseId: string, idBreadcrumbs: string[], breadcrumbs: string[]) => string;
/**
 * Converts the section id to the right string for the stable id:
 * If the corresponding facet has ID maintained, we must take this ID. If ID is not present, take the navigation path.
 *
 * @param sectionId - old ID that shall get converted
 * @param title - title from JSON schema, comprising the facet ID
 * @returns the converted section ID as a string
 */
export declare const convertSectionId: (sectionId: string, title: string) => string;
/**
 * Escapes all characters not allowed in stable IDs with a colon followed by their hexadecimal code.
 *
 * @param sParam - The string to be escaped.
 * @returns The escaped string.
 */
export declare function escapeId(sParam: string): string;
/**
 * V2 - Binding Change values, will be added on object pages
 */
export declare enum BindingValue {
    Editable = "{ui>/editable}",
    NotEditable = "{= !${ui>/editable}}"
}
/**
 * V4 - Binding Change values, will be added on object pages
 */
export declare enum BindingValueV4 {
    Editable = "{ui>/isEditable}",
    NotEditable = "{= !${ui>/isEditable}}"
}
/**
 * Export rule for table columns.
 *
 * @param baseId - base ID, first part of the stable ID. Represents the stableId of the table.
 * @param idBreadcrumbs - array of ID parts, these are ID's that had been calculated on higher levels of the hierarchy
 * @param breadcrumbs - array of breadcrumbs, i.e. the path elements to the column in the config file
 * @param _controlType - controlType function of decorators, not used here
 * @param title - title from JSON schema, comprising the facet ID
 * @returns the constructed stable ID as a string
 */
export declare const buildColumnControlId: (baseId: string, idBreadcrumbs: string[], breadcrumbs: string[], _controlType: ControlTypeFunction, title: string) => string;
/**
 * Split up action breadcrumb and return different parts from it.
 *
 * @param breadcrumbs - array of breadcrumbs
 * @returns {object} - actionType, semanticObjectId, actionId of action
 */
export declare const getActionBreadcrumbParts: (breadcrumbs: string[]) => {
    actionType: string | undefined;
    semanticObjectId: string | undefined;
    actionId: string;
};
export declare const addPatternForBindingChangeOfEnumLR: (schema: object, definition: object, propertyName: string) => void;
export declare const addPatternForBindingChangeOfEnumOP: (schema: object, definition: object, propertyName: string) => void;
export declare const addPatternForBindingChangeOfEnumOPV4: (schema: object, definition: object, propertyName: string) => void;
/**
 * Sync rule for preventing the deletion of a property.
 */
export declare function doNotDelete(): void;
//# sourceMappingURL=control.d.ts.map