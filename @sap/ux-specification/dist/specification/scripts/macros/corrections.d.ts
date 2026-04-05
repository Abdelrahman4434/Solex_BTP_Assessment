import type { MacrosAPI, UI5Aggregation, UI5Symbol, UI5Property } from './types';
interface APICorrection {
    defaultAggregation?: string;
    aggregations?: UI5Aggregation[];
    removeAggregations?: string[];
    properties?: Array<UI5Property | (Partial<UI5Property> & {
        extend: true;
    })>;
    metadata?: UI5Symbol;
}
/**
 * Describes a map of enum entries that may depend on another property.
 */
interface MacrosEnumEntriesMap {
    /**
     * Name of the property whose value determines which enum entries are valid.
     */
    dependentProperty: string;
    /**
     * Map of dependent property values to their corresponding enum entries.
     */
    values: {
        [key: string]: string[];
    };
}
/**
 * Map defining enum entries for macro controls and their properties.
 *
 * Structure:
 * - First key: control name
 * - Second key: property name
 * - Value: describing dependent values and enum entries
 */
export declare const MACROS_ENUM_ENTRIES_MAP: {
    [key: string]: {
        [key: string]: MacrosEnumEntriesMap;
    };
};
/**
 * Returns the enum entries for a given control and property.
 * If a dependent value is provided and exists in the map, only the enum entries
 * associated with that dependent value are returned.
 * Otherwise, all enum entries for the property are returned as a flat array.
 *
 * @param control - The macro control class name
 * @param property - The property name of the control
 * @param dependentValue - Optional value of the dependent property
 * @returns An array of enum entry strings, or `undefined` if the control or property is not found
 */
export declare function getEnumEntriesFromMap(control: string, property: string, dependentValue?: string): string[] | undefined;
export declare const macrosCorrection: {
    [key: string]: APICorrection;
};
/**
 * Method applies missing aggregations and properties for "sap.fe.macros" api object.
 * We notice that api object of "sap.fe.macros" is missing some aggregation and properties information
 * - in result we apply missing data on top of received api object.
 *
 * @param {MacrosAPI} api "sap.fe.macros" api object.
 */
export declare function applyCorrections(api: MacrosAPI): void;
export {};
//# sourceMappingURL=corrections.d.ts.map