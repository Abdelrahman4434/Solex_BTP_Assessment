"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStableIdPartFromDataField = exports.getStableIdPartFromSemanticObjectAndAction = exports.prepareId = void 0;
exports.replaceSpecialChars = replaceSpecialChars;
exports.getStableIdPartFromValue = getStableIdPartFromValue;
const utils_1 = require("../../common/utils");
const DataFieldStrategy_1 = require("../../common/DataFieldStrategy");
/**
 * Stable Id helper (parts copied from sap.fe.core/helpers/StableIdHelper.ts)
 */
/**
 * Replaces special characters in the given string to create a stable ID.
 *
 * @param sId - The input string to process.
 * @returns The processed string with special characters replaced.
 */
function replaceSpecialChars(sId) {
    if (typeof sId !== 'string') {
        return;
    }
    sId = sId
        .replace(/^\/|^@|^#|^\*/, '') // remove special characters from the beginning of the string
        .replace(/\/$|@$|#$|\*$/, '') // remove special characters from the end of the string
        .replace(/[/@()#*]/g, '::'); // replace special characters with ::
    // Replace double occurrences of the separator with a single separator
    while (sId.indexOf('::::') > -1) {
        sId = sId.replace('::::', '::');
    }
    // If there is a :: at the end of the ID remove it
    if (sId.slice(-2) === '::') {
        sId = sId.slice(0, -2);
    }
    return sId;
}
const prepareId = function (sId) {
    return replaceSpecialChars((0, utils_1.removeNamespaces)(sId));
};
exports.prepareId = prepareId;
/**
 * Evaluates the concatenation of paths in the given value.
 *
 * @param oValue - The object containing the $Apply array with paths to concatenate.
 * @returns The concatenated path string.
 */
function evaluateConcat(oValue) {
    let sPathConcat = '';
    for (const applyValue of oValue.$Apply) {
        if (applyValue.Path) {
            if (sPathConcat) {
                sPathConcat += '::';
            }
            sPathConcat += applyValue.Path;
        }
    }
    return sPathConcat;
}
/**
 * Generates a stable ID part based on the provided value.
 *
 * @param oValue - The input value used to generate the stable ID part.
 * @returns The stable ID part as a string, or undefined if the input is invalid.
 */
function getStableIdPartFromValue(oValue) {
    if (oValue?.$Path || oValue?.path) {
        return oValue.$Path || oValue.path;
    }
    if (oValue?.$Function === 'odata.concat') {
        return evaluateConcat(oValue);
    }
    if (oValue) {
        if (typeof oValue === 'string') {
            return replaceSpecialChars(oValue.replace(/ /g, '_'));
        }
    }
}
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
const getStableIdPartFromSemanticObjectAndAction = function (oDataField) {
    let sIdPart = '';
    if (typeof oDataField.SemanticObject === 'string') {
        sIdPart += oDataField.SemanticObject;
    }
    else if (oDataField.SemanticObject.$Path) {
        sIdPart += oDataField.SemanticObject.$Path;
    }
    if (typeof oDataField.Action === 'string') {
        sIdPart += '::' + oDataField.Action;
    }
    else if (oDataField.Action && oDataField.Action.$Path) {
        sIdPart += '::' + oDataField.Action.$Path;
    }
    if (oDataField['RequiresContext']) {
        sIdPart += '::RequiresContext';
    }
    return sIdPart;
};
exports.getStableIdPartFromSemanticObjectAndAction = getStableIdPartFromSemanticObjectAndAction;
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
const getStableIdPartFromDataField = function (oDataField) {
    const strategy = DataFieldStrategy_1.dataFieldStrategyContext.getStrategy(oDataField.$Type);
    return strategy?.generateStableId(oDataField);
};
exports.getStableIdPartFromDataField = getStableIdPartFromDataField;
//# sourceMappingURL=StableIdHelper.js.map