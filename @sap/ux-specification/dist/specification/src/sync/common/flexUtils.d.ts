import type { Manifest, UI5Version, ChangeDefinition, ChangeDefinitionInCreation, SyncRule } from '@sap/ux-specification-types';
/**
 * Creates a serialized string representation of a flex change using ui5-flexibility-utils.
 *
 * @param change - Properties required to create the change.
 * @param manifest - The manifest.json file.
 * @returns {string} - The serialized change string.
 */
export declare function createChangeString(change: ChangeDefinitionInCreation, manifest: Manifest): string;
/**
 * Parse string and return the change as object (calls changeUtils from ui5-flexibility-utils).
 *
 * @param changeString - string with serialized change
 * @returns {ChangeDefinition | boolean} - The parsed change object or false if parsing fails.
 */
export declare function parseChangeString(changeString: string): ChangeDefinition | boolean;
/**
 * Creates a flex change based on the given config information.
 *
 * @param configObject - current (sub)object of the configuration file
 * @param syncRule - export rule from the object classes decorator
 * @param ui5Version - SAP UI5 version
 * @param key - key of the given property
 * @param controlId - The ID of the control for which the flex change is being created.
 * @returns {ChangeDefinitionInCreation} - the newly created flex change
 */
export declare function fillFlexChangeContent(configObject: object, syncRule: SyncRule, ui5Version: UI5Version, key: string, controlId: string): ChangeDefinitionInCreation;
//# sourceMappingURL=flexUtils.d.ts.map