"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperty = exports.isArrayEndsWith = exports.isArrayEqual = void 0;
/**
 * Method checks if arrays are same - check is performed without deep equality.
 *
 * @param arr1 - First array.
 * @param arr2 - Second array.
 * @returns Is arrays are same.
 */
const isArrayEqual = (arr1, arr2) => {
    if (!arr1 || !arr2) {
        return arr1 === arr2;
    }
    return (arr1.length === arr2.length &&
        arr1.every(function (value, index) {
            return value === arr2[index];
        }));
};
exports.isArrayEqual = isArrayEqual;
/**
 * Method checks if array 'arr1' ends with all entries from 'arr2'.
 *
 * @param arr1 - First array.
 * @param arr2 - Second array.
 * @returns Is 'arr1' ends with entries from 'arr2'.
 */
const isArrayEndsWith = (arr1, arr2) => {
    if (!arr1 || !arr2 || arr2.length > arr1.length) {
        return false;
    }
    let index1 = arr1.length - 1;
    let index2 = arr2.length - 1;
    while (index2 >= 0) {
        if (arr2[index2] !== arr1[index1]) {
            return false;
        }
        index1--;
        index2--;
    }
    return true;
};
exports.isArrayEndsWith = isArrayEndsWith;
/**
 * Method to get value for passed path in passed object.
 *
 * @param obj - Object to use.
 * @param paths - Path for searching property/value.
 * @returns Found value for passed path.
 */
const getProperty = (obj, paths) => {
    let current = obj;
    for (const path of paths) {
        if (path === undefined) {
            continue;
        }
        if (typeof current === 'object' && path in current) {
            // found and continue
            current = current[path];
        }
        else {
            return undefined;
        }
    }
    return current;
};
exports.getProperty = getProperty;
//# sourceMappingURL=object.js.map