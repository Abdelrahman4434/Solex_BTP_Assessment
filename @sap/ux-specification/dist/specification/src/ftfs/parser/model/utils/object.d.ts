/**
 * Method checks if arrays are same - check is performed without deep equality.
 *
 * @param arr1 - First array.
 * @param arr2 - Second array.
 * @returns Is arrays are same.
 */
export declare const isArrayEqual: (arr1: Array<unknown> | null | undefined, arr2: Array<unknown> | null | undefined) => boolean;
/**
 * Method checks if array 'arr1' ends with all entries from 'arr2'.
 *
 * @param arr1 - First array.
 * @param arr2 - Second array.
 * @returns Is 'arr1' ends with entries from 'arr2'.
 */
export declare const isArrayEndsWith: <T>(arr1: Array<T> | null, arr2: Array<T> | null) => boolean;
/**
 * Method to get value for passed path in passed object.
 *
 * @param obj - Object to use.
 * @param paths - Path for searching property/value.
 * @returns Found value for passed path.
 */
export declare const getProperty: (obj: object, paths: Array<string | number>) => unknown;
//# sourceMappingURL=object.d.ts.map