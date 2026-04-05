/**
 * Stable Id helper (parts copied from sap.fe.core/helpers/StableIdHelper.ts)
 */
/**
 * Replaces special characters in the given string to create a stable ID.
 *
 * @param sId - The input string to process.
 * @returns The processed string with special characters replaced.
 */
export declare function replaceSpecialChars(sId: string): string;
export declare const prepareId: (sId: string) => string;
/**
 * Generates a stable ID part based on the provided value.
 *
 * @param oValue - The input value used to generate the stable ID part.
 * @returns The stable ID part as a string, or undefined if the input is invalid.
 */
export declare function getStableIdPartFromValue(oValue: any): string | undefined;
/**
 * Generates a stable ID part using the provided semantic object and action from the given data field.
 * Combines the semantic object and action properties into a string formatted as `SemanticObject::Action`.
 * If the `RequiresContext` property exists in the data field, it appends `::RequiresContext` to the ID.
 *
 * @param {object} oDataField - The data field containing SemanticObject, Action, and optionally RequiresContext properties.
 * @param {string|object} oDataField.SemanticObject - The semantic object, which can be a string or an object with a $Path property.
 * @param {string|object} oDataField.Action - The action, which can be a string or an object with a $Path property.
 * @param {boolean} [oDataField.RequiresContext] - Indicates if RequiresContext should be appended to the ID.
 * @returns {string} The constructed stable ID part.
 */
export declare const getStableIdPartFromSemanticObjectAndAction: (oDataField: any) => string;
/**
 * Extracts a stable ID part from the provided data field object by utilizing
 * a strategy defined in the data field strategy context.
 *
 * The function determines the appropriate strategy for the given data field type
 * and invokes the `generateStableId` method of the strategy to create the stable ID part.
 *
 * @param {any} oDataField - The data field object from which the stable ID part is to be generated.
 * @returns {string | undefined} The generated stable ID part as a string, or undefined if no strategy is available or applicable.
 */
export declare const getStableIdPartFromDataField: (oDataField: any) => string | undefined;
//# sourceMappingURL=StableIdHelper.d.ts.map