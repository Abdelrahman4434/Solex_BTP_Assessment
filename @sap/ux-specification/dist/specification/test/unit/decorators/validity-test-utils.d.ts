/**
 * @file Test utilities for validating @validity decorator behavior
 *
 * This module provides helper functions for:
 * - Extracting validity metadata from decorated classes
 * - Generating expected vs actual visibility tables
 * - Comparing property visibility across UI5 versions
 * - Formatting results as markdown for snapshot testing
 */
import type { Definition } from 'typescript-json-schema';
import type { SchemaType } from '@sap/ux-specification-types';
/** Emoji indicator for a visible/available property */
export declare const EMOJI_VISIBLE = "\u2705";
/** Emoji indicator for a hidden/unavailable property */
export declare const EMOJI_HIDDEN = "\uD83D\uDEAB";
/** Emoji indicator for property not found in schema */
export declare const EMOJI_NOT_FOUND = "\u2753";
/** Emoji indicator for a match between expected and actual */
export declare const EMOJI_MATCH = "\u2705";
/** Emoji indicator for a mismatch between expected and actual */
export declare const EMOJI_DIFF = "\u26A0\uFE0F";
/** Special version string representing the latest/newest version */
export declare const VERSION_LATEST = "latest";
/** Indentation for snapshot content (16 spaces to align within toMatchInlineSnapshot) */
export declare const INDENT = "                ";
/**
 * Information about a property with a @validity decorator
 */
export interface ValidityInfo {
    /** The property name */
    property: string;
    /** The UI5 version since which the property is available */
    since: string;
}
/**
 * Information about an enum value with conditional availability
 */
interface EnumValueInfo {
    /** The property name that has this enum */
    property: string;
    /** The enum value */
    enumValue: string;
    /** The UI5 version since which the enum value is available */
    since: string;
}
/**
 * A row in the version visibility table showing property availability across versions
 */
interface VersionVisibilityRow {
    /** The property name */
    property: string;
    /** The UI5 version since which the property is available */
    since: string;
    /** Dynamic keys for each version (e.g., '1.84.0': '✅') */
    [version: string]: string;
}
/**
 * Function type for finding a specific definition within a schema
 */
export type DefinitionFinder = (schema: Definition) => Definition | undefined;
/**
 * Finds the definition containing table properties by searching common patterns
 */
export declare function findTableDefinition(schema: Definition): Definition | undefined;
/**
 * Creates a definition finder function for a specific definition name
 */
export declare function findDefinitionByName(definitionName: string): DefinitionFinder;
/**
 * Extracts enum value validity information from a class's properties
 */
export declare function getEnumValidityFromClass(ClassConstructor: new () => object): EnumValueInfo[];
/**
 * Generates expected visibility table based on @validity decorator metadata
 */
export declare function generateExpectedVisibilityTable(validityInfos: ValidityInfo[], versions: string[]): VersionVisibilityRow[];
/**
 * Generates actual visibility table from generated schemas
 */
export declare function generateActualVisibilityTable(validityInfos: ValidityInfo[], versions: string[], schemaResults: Map<string, Definition>, findDefinition: DefinitionFinder): VersionVisibilityRow[];
/**
 * A row in the diff visibility table showing matches/mismatches between expected and actual
 */
interface DiffVisibilityRow {
    /** The property name */
    property: string;
    /** The UI5 version since which the property is available */
    since: string;
    /** Dynamic keys for each version (e.g., '1.84.0': '✅' or '⚠️') */
    [version: string]: string;
}
/**
 * Generates a diff visibility table comparing expected vs actual
 */
export declare function generateDiffVisibilityTable(validityInfos: ValidityInfo[], versions: string[], schemaResults: Map<string, Definition>, findDefinition: DefinitionFinder): DiffVisibilityRow[];
/**
 * Formats visibility table as a markdown string for snapshot testing
 */
export declare function formatVisibilityTableMarkdown(rows: VersionVisibilityRow[], versions: string[]): string;
/**
 * Formats diff table as a markdown string for report generation
 */
export declare function formatDiffTableMarkdown(rows: DiffVisibilityRow[], versions: string[]): string;
/**
 * Formats enum validity information as a markdown table for report generation
 */
export declare function formatEnumValidityTableMarkdown(enumInfos: EnumValueInfo[], versions: string[]): string;
/**
 * Generates schemas for multiple UI5 versions
 */
export declare function generateSchemasForVersions(genericSchema: Definition, schemaType: SchemaType, versions: string[]): Promise<Map<string, Definition>>;
/**
 * Gets validity properties for a class from a generic schema
 */
export declare function getValidityProperties(genericSchema: Definition, classRef: new () => object, schemaName?: string): ValidityInfo[];
/**
 * Compares expected vs actual visibility and returns both tables for assertion
 */
export declare function compareExpectedVsActual(validityInfos: ValidityInfo[], versions: string[], schemaResults: Map<string, Definition>, findDefinition: DefinitionFinder): {
    expected: string;
    actual: string;
};
/**
 * Compares expected vs actual enum visibility and returns both tables for assertion
 */
export declare function compareExpectedVsActualEnum(enumInfos: EnumValueInfo[], versions: string[], schemaResults: Map<string, Definition>, findDefinition: DefinitionFinder): {
    expected: string;
    actual: string;
};
export {};
//# sourceMappingURL=validity-test-utils.d.ts.map