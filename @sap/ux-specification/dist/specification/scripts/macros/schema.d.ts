import type { SchemaDefinition } from '@sap/ux-specification-types';
import type { MacrosAPI } from './types';
import type { JSONSchema7TypeName } from 'json-schema';
export declare const UI5_TO_JSON_SCHEMA_TYPE_MAP: Map<string, JSONSchema7TypeName>;
/**
 * Semantic classification patterns for properties
 * Used to determine if a property should be visible (isViewNode = true/false)
 */
export declare const PROPERTY_SEMANTICS: {
    AGGREGATIONS: RegExp[];
};
/**
 * Method generates generic schema for passed "sap.fe.macros" api.
 *
 * @param {MacrosAPI} api SAPUI5 "sap.fe.macros" api.
 * @returns {SchemaDefinition} JSON schema for "sap.fe.macros" api.
 */
export declare function generateSchema(api: MacrosAPI): SchemaDefinition;
//# sourceMappingURL=schema.d.ts.map