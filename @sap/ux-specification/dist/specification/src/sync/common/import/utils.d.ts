import type { Definition } from 'typescript-json-schema';
import type { SyncRule, DeprecatedProperties, ExtensionLogger } from '@sap/ux-specification-types/dist';
/**
 * Transfers the value of a single manifest setting to the config.
 *
 * @param {SyncRule} syncRule - The synchronization rule containing information about the manifest key and import handler.
 * @param {{}} manifestSection - The manifest section from which the property will be imported.
 * @param {string} propertyKey - The key of the property to be imported.
 * @param {{ [key: string]: any }} configPart - The configuration object where the property will be added.
 * @param {string} [sectionId] - Optional identifier for the section in the manifest.
 * @param {string[]} [breadcrumbs] - Optional array of path breadcrumbs for context.
 * @param {Definition} [propertyDefinition] - Optional definition object for validating the manifest value.
 */
export declare function importProperty(syncRule: SyncRule, manifestSection: {}, propertyKey: string, configPart: {
    [key: string]: any;
}, sectionId?: string, breadcrumbs?: string[], propertyDefinition?: Definition): void;
/**
 * Validation during import: check if properties are marked as deprecated.
 * If so, log them.
 *
 * @param deprecatedProperties - existing list, to be actualized
 * @param manifestSection - Section in manifest.json
 * @param path - path to the section in manifest
 * @param {ExtensionLogger} logger - Logger class for logging messages
 */
export declare function checkDeprecatedProperties(deprecatedProperties: DeprecatedProperties | undefined, manifestSection: {}, path: string, logger?: ExtensionLogger): void;
/**
 * Determines the title of a section representation in the app schema, main aspect is checking the facet ID.
 *
 * @param schemaSection - Section in manifest.json
 * @param jsonSchema - app specific schema
 * @returns {string | undefined} - title of the section
 */
export declare function getSectionTitle(schemaSection: Definition, jsonSchema: Definition): string | undefined;
/**
 * Method returns target by resolving custom column reference name.
 * For example - 'TableCustomColumns<dummyTarget>' is resolved as 'dummyTarget'.
 *
 * @param {string} ref Reference key.
 * @returns {string | undefined} Resolved target.
 */
export declare function getTargetFromCustomColumnRef(ref: string): string | undefined;
/**
 * Removes part of a given config, if empty.
 *
 * @param {object} config - config part
 * @param {string} structure - part of config to be removed
 */
export declare function removeEmptyStructure(config: object, structure: string): void;
//# sourceMappingURL=utils.d.ts.map