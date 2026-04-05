"use strict";
/**
 * @file Test utilities for validating @validity decorator behavior
 *
 * This module provides helper functions for:
 * - Extracting validity metadata from decorated classes
 * - Generating expected vs actual visibility tables
 * - Comparing property visibility across UI5 versions
 * - Formatting results as markdown for snapshot testing
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.INDENT = exports.VERSION_LATEST = exports.EMOJI_DIFF = exports.EMOJI_MATCH = exports.EMOJI_NOT_FOUND = exports.EMOJI_HIDDEN = exports.EMOJI_VISIBLE = void 0;
exports.findTableDefinition = findTableDefinition;
exports.findDefinitionByName = findDefinitionByName;
exports.getEnumValidityFromClass = getEnumValidityFromClass;
exports.generateExpectedVisibilityTable = generateExpectedVisibilityTable;
exports.generateActualVisibilityTable = generateActualVisibilityTable;
exports.generateDiffVisibilityTable = generateDiffVisibilityTable;
exports.formatVisibilityTableMarkdown = formatVisibilityTableMarkdown;
exports.formatDiffTableMarkdown = formatDiffTableMarkdown;
exports.formatEnumValidityTableMarkdown = formatEnumValidityTableMarkdown;
exports.generateSchemasForVersions = generateSchemasForVersions;
exports.getValidityProperties = getValidityProperties;
exports.compareExpectedVsActual = compareExpectedVsActual;
exports.compareExpectedVsActualEnum = compareExpectedVsActualEnum;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const api_1 = require("../../../src/api");
const path_1 = require("path");
const decorators_1 = require("../../../src/sync/common/decoration/decorators");
const utils_1 = require("../../test-utils/utils");
const manifest_json_1 = __importDefault(require("../../test-projects/v4new/webapp/manifest.json"));
// ============================================================================
// Constants
// ============================================================================
/** Emoji indicator for a visible/available property */
exports.EMOJI_VISIBLE = '✅';
/** Emoji indicator for a hidden/unavailable property */
exports.EMOJI_HIDDEN = '🚫';
/** Emoji indicator for property not found in schema */
exports.EMOJI_NOT_FOUND = '❓';
/** Emoji indicator for a match between expected and actual */
exports.EMOJI_MATCH = '✅';
/** Emoji indicator for a mismatch between expected and actual */
exports.EMOJI_DIFF = '⚠️';
/** Special version string representing the latest/newest version */
exports.VERSION_LATEST = 'latest';
/** Indentation for snapshot content (16 spaces to align within toMatchInlineSnapshot) */
exports.INDENT = '                ';
// ============================================================================
// Helper Functions - Schema Operations
// ============================================================================
/**
 * Resolves a definition by following $ref chains in the schema
 */
function resolveDefinition(schema, definitionName) {
    let def = schema.definitions?.[definitionName];
    if (!def) {
        return undefined;
    }
    let depth = 0;
    while (def.$ref && depth < 10) {
        const refName = def.$ref.replace('#/definitions/', '');
        def = schema.definitions?.[refName];
        if (!def) {
            return undefined;
        }
        depth++;
    }
    return def;
}
/**
 * Finds the definition containing table properties by searching common patterns
 */
function findTableDefinition(schema) {
    const definitions = schema.definitions || {};
    // Try common table definition patterns in order of preference
    const patterns = ['TableSPV', 'LRTableView', 'Table'];
    for (const pattern of patterns) {
        const def = definitions[pattern];
        if (def?.properties && Object.keys(def.properties).length > 0) {
            return def;
        }
    }
    // Search for any definition with key table properties
    const keyProps = ['condensedTableLayout', 'enableExport', 'selectionMode'];
    for (const [, def] of Object.entries(definitions)) {
        const d = def;
        if (d?.properties) {
            const hasKeyProps = keyProps.some((p) => p in d.properties);
            if (hasKeyProps) {
                return d;
            }
        }
    }
    return undefined;
}
/**
 * Creates a definition finder function for a specific definition name
 */
function findDefinitionByName(definitionName) {
    return (schema) => {
        const def = schema.definitions?.[definitionName];
        return def?.properties ? def : undefined;
    };
}
/**
 * Gets all property names from a schema definition
 */
function getSchemaPropertyNames(schema, definitionName) {
    const def = resolveDefinition(schema, definitionName);
    return def?.properties ? Object.keys(def.properties) : [];
}
// ============================================================================
// Helper Functions - Version Comparison
// ============================================================================
/**
 * Compares two semantic version strings
 */
function compareVersions(a, b) {
    // Handle 'latest' as a special case - it's always the highest version
    if (a === exports.VERSION_LATEST && b === exports.VERSION_LATEST) {
        return 0;
    }
    if (a === exports.VERSION_LATEST) {
        return 1;
    }
    if (b === exports.VERSION_LATEST) {
        return -1;
    }
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        if ((aParts[i] || 0) !== (bParts[i] || 0)) {
            return (aParts[i] || 0) - (bParts[i] || 0);
        }
    }
    return 0;
}
// ============================================================================
// Helper Functions - Validity Metadata Extraction
// ============================================================================
/**
 * Extracts all properties from a class, including those with @validity decorator
 */
function getValidityPropertiesFromClass(ClassConstructor, schemaPropertyNames = []) {
    const prototype = ClassConstructor.prototype;
    const result = [];
    const candidateProperties = new Set();
    // Walk prototype chain to find all properties
    let current = prototype;
    while (current && current !== Object.prototype) {
        Object.getOwnPropertyNames(current).forEach((name) => {
            if (name !== 'constructor') {
                candidateProperties.add(name);
            }
        });
        current = Object.getPrototypeOf(current);
    }
    // Add schema property names as candidates
    schemaPropertyNames.forEach((p) => candidateProperties.add(p));
    for (const property of candidateProperties) {
        const validity = (0, decorators_1.getValidityMetadata)(prototype, property);
        if (validity?.since) {
            result.push({ property, since: validity.since });
        }
        else if (validity?.enum) {
            // Property has enum validity but no property-level since
            result.push({ property, since: '-' });
        }
        else if (schemaPropertyNames.includes(property)) {
            // Include properties without @validity if they exist in schema
            result.push({ property, since: '-' });
        }
    }
    // Sort: properties without version ('-') first, then by version, then alphabetically
    return result.sort((a, b) => {
        if (a.since === '-' && b.since !== '-') {
            return -1;
        }
        if (a.since !== '-' && b.since === '-') {
            return 1;
        }
        if (a.since === '-' && b.since === '-') {
            return a.property.localeCompare(b.property);
        }
        const versionDiff = compareVersions(a.since, b.since);
        if (versionDiff !== 0) {
            return versionDiff;
        }
        return a.property.localeCompare(b.property);
    });
}
/**
 * Gets all property names that have validity metadata on a class prototype
 */
function getPropertiesWithValidityMetadata(prototype) {
    const properties = [];
    if (typeof Reflect !== 'undefined' && Reflect.getMetadataKeys) {
        const knownProperties = new Set();
        // Walk the prototype chain
        let current = prototype;
        while (current && current !== Object.prototype) {
            const propNames = Object.getOwnPropertyNames(current);
            propNames.forEach((p) => knownProperties.add(p));
            current = Object.getPrototypeOf(current);
        }
        // Common property names that might have enum validity
        const testProperties = [
            'type',
            'personalization',
            'selectionMode',
            'selectAll',
            'selectionLimit',
            'enableExport',
            'quickVariantSelection',
            'condensedTableLayout',
            'hierarchyQualifier',
            'widthIncludingColumnHeader',
            'disableCopyToClipboard',
            'initialLoad',
            'enableMassEdit',
            'creationMode',
            'analyticalConfiguration',
            'popinLayout',
            'rowCountMode',
            ...Array.from(knownProperties)
        ];
        for (const prop of testProperties) {
            if (!properties.includes(prop)) {
                const validity = (0, decorators_1.getValidityMetadata)(prototype, prop);
                if (validity?.enum) {
                    properties.push(prop);
                }
            }
        }
    }
    return properties;
}
/**
 * Extracts enum value validity information from a class's properties
 */
function getEnumValidityFromClass(ClassConstructor) {
    const prototype = ClassConstructor.prototype;
    const result = [];
    const propertiesWithValidity = getPropertiesWithValidityMetadata(prototype);
    for (const property of propertiesWithValidity) {
        const validity = (0, decorators_1.getValidityMetadata)(prototype, property);
        if (validity?.enum) {
            for (const [enumValue, config] of Object.entries(validity.enum)) {
                if (config.since) {
                    result.push({
                        property,
                        enumValue,
                        since: config.since
                    });
                }
            }
        }
    }
    // Sort by property, then by since version, then by enum value
    return result.sort((a, b) => {
        const propCompare = a.property.localeCompare(b.property);
        if (propCompare !== 0) {
            return propCompare;
        }
        const versionCompare = compareVersions(a.since, b.since);
        if (versionCompare !== 0) {
            return versionCompare;
        }
        return a.enumValue.localeCompare(b.enumValue);
    });
}
// ============================================================================
// Helper Functions - Table Generation
// ============================================================================
/**
 * Generates expected visibility table based on @validity decorator metadata
 */
function generateExpectedVisibilityTable(validityInfos, versions) {
    return validityInfos.map((info) => {
        const row = {
            property: info.property,
            since: info.since
        };
        for (const version of versions) {
            const shouldBeVisible = compareVersions(version, info.since) >= 0;
            row[version] = shouldBeVisible ? exports.EMOJI_VISIBLE : exports.EMOJI_HIDDEN;
        }
        return row;
    });
}
/**
 * Generates actual visibility table from generated schemas
 */
function generateActualVisibilityTable(validityInfos, versions, schemaResults, findDefinition) {
    return validityInfos.map((info) => {
        const row = {
            property: info.property,
            since: info.since
        };
        for (const version of versions) {
            const schema = schemaResults.get(version);
            if (!schema) {
                row[version] = '?';
                continue;
            }
            const def = findDefinition(schema);
            if (!def?.properties) {
                row[version] = '?';
                continue;
            }
            const propDef = def.properties[info.property];
            if (!propDef) {
                row[version] = exports.EMOJI_NOT_FOUND;
                continue;
            }
            const hidden = propDef[ux_specification_types_1.SchemaTag.hidden] === true;
            row[version] = hidden ? exports.EMOJI_HIDDEN : exports.EMOJI_VISIBLE;
        }
        return row;
    });
}
/**
 * Generates expected enum visibility table based on @validity decorator enum metadata
 */
function generateExpectedEnumVisibilityTable(enumInfos, versions) {
    return enumInfos.map((info) => {
        const row = {
            property: `${info.property}.${info.enumValue}`,
            since: info.since
        };
        for (const version of versions) {
            const shouldBeVisible = compareVersions(version, info.since) >= 0;
            row[version] = shouldBeVisible ? exports.EMOJI_VISIBLE : exports.EMOJI_HIDDEN;
        }
        return row;
    });
}
/**
 * Resolves enum values from a property definition.
 */
function resolveEnumValues(propDef, schema) {
    // Check for inline enum
    if (propDef.enum && Array.isArray(propDef.enum)) {
        return propDef.enum;
    }
    // Check for anyOf with enums
    if (propDef.anyOf) {
        const values = propDef.anyOf.flatMap((x) => x.enum || []);
        if (values.length > 0) {
            return values;
        }
    }
    // Check for $ref to an enum definition
    if (propDef.$ref) {
        const refName = propDef.$ref.replace('#/definitions/', '');
        const refDef = schema.definitions?.[refName];
        if (refDef?.enum && Array.isArray(refDef.enum)) {
            return refDef.enum;
        }
    }
    return undefined;
}
/**
 * Generates actual enum visibility table from generated schemas
 */
function generateActualEnumVisibilityTable(enumInfos, versions, schemaResults, findDefinition) {
    return enumInfos.map((info) => {
        const row = {
            property: `${info.property}.${info.enumValue}`,
            since: info.since
        };
        for (const version of versions) {
            const schema = schemaResults.get(version);
            if (!schema) {
                row[version] = '?';
                continue;
            }
            const def = findDefinition(schema);
            if (!def?.properties) {
                row[version] = '?';
                continue;
            }
            const propDef = def.properties[info.property];
            if (!propDef) {
                row[version] = exports.EMOJI_NOT_FOUND;
                continue;
            }
            const enumValues = resolveEnumValues(propDef, schema);
            if (!enumValues) {
                row[version] = exports.EMOJI_NOT_FOUND;
                continue;
            }
            const enumExists = enumValues.includes(info.enumValue);
            row[version] = enumExists ? exports.EMOJI_VISIBLE : exports.EMOJI_HIDDEN;
        }
        return row;
    });
}
/**
 * Generates a diff visibility table comparing expected vs actual
 */
function generateDiffVisibilityTable(validityInfos, versions, schemaResults, findDefinition) {
    const expectedTable = generateExpectedVisibilityTable(validityInfos, versions);
    const actualTable = generateActualVisibilityTable(validityInfos, versions, schemaResults, findDefinition);
    return validityInfos.map((info, index) => {
        const row = {
            property: info.property,
            since: info.since
        };
        for (const version of versions) {
            const expected = expectedTable[index][version];
            const actual = actualTable[index][version];
            // Match if both are the same, or if actual is not found (❓) we consider it a mismatch
            const isMatch = expected === actual;
            row[version] = isMatch ? exports.EMOJI_MATCH : exports.EMOJI_DIFF;
        }
        return row;
    });
}
// ============================================================================
// Helper Functions - Table Formatting
// ============================================================================
/**
 * Formats visibility table as a markdown string for snapshot testing
 */
function formatVisibilityTableMarkdown(rows, versions) {
    const lines = [];
    // Calculate column widths
    const propWidth = Math.max(26, ...rows.map((r) => r.property.length));
    const sinceWidth = 7;
    const versionCellWidth = 10;
    // Helper functions for padding
    const padEnd = (str, width) => str.padEnd(width);
    const padCenterVersion = (str, width) => {
        const padding = width - str.length;
        const left = Math.floor(padding / 2);
        return ' '.repeat(left) + str + ' '.repeat(padding - left);
    };
    const padCenterEmoji = (emoji) => `   ${emoji}     `;
    // Header
    const headerCells = [
        padEnd('Property', propWidth),
        padEnd('Since', sinceWidth),
        ...versions.map((v) => padCenterVersion(v, versionCellWidth))
    ];
    lines.push(`| ${headerCells.join(' | ')} |`);
    // Separator
    const sepCells = [
        '-'.repeat(propWidth),
        '-'.repeat(sinceWidth),
        ...versions.map(() => '-'.repeat(versionCellWidth))
    ];
    lines.push(`| ${sepCells.join(' | ')} |`);
    // Data rows
    for (const row of rows) {
        const cells = [
            padEnd(row.property, propWidth),
            padEnd(row.since, sinceWidth),
            ...versions.map((v) => padCenterEmoji(row[v]))
        ];
        lines.push(`| ${cells.join(' | ')} |`);
    }
    // Legend
    lines.push('');
    lines.push(`Legend: ${exports.EMOJI_VISIBLE} = visible (version >= since), ${exports.EMOJI_HIDDEN} = hidden (version < since), ${exports.EMOJI_NOT_FOUND} = not found in schema`);
    return '\n' + lines.map((line) => exports.INDENT + line).join('\n');
}
/**
 * Formats diff table as a markdown string for report generation
 */
function formatDiffTableMarkdown(rows, versions) {
    const lines = [];
    // Calculate column widths
    const propWidth = Math.max(26, ...rows.map((r) => r.property.length));
    const sinceWidth = 7;
    const versionCellWidth = 10;
    // Helper functions for padding
    const padEnd = (str, width) => str.padEnd(width);
    const padCenterVersion = (str, width) => {
        const padding = width - str.length;
        const left = Math.floor(padding / 2);
        return ' '.repeat(left) + str + ' '.repeat(padding - left);
    };
    const padCenterEmoji = (emoji) => `   ${emoji}     `;
    // Header
    const headerCells = [
        padEnd('Property', propWidth),
        padEnd('Since', sinceWidth),
        ...versions.map((v) => padCenterVersion(v, versionCellWidth))
    ];
    lines.push(`| ${headerCells.join(' | ')} |`);
    // Separator
    const sepCells = [
        '-'.repeat(propWidth),
        '-'.repeat(sinceWidth),
        ...versions.map(() => '-'.repeat(versionCellWidth))
    ];
    lines.push(`| ${sepCells.join(' | ')} |`);
    // Data rows
    for (const row of rows) {
        const cells = [
            padEnd(row.property, propWidth),
            padEnd(row.since, sinceWidth),
            ...versions.map((v) => padCenterEmoji(row[v]))
        ];
        lines.push(`| ${cells.join(' | ')} |`);
    }
    // Legend
    lines.push('');
    lines.push(`Legend: ${exports.EMOJI_MATCH} = match (expected === actual), ${exports.EMOJI_DIFF} = mismatch (implementation gap)`);
    return lines.join('\n');
}
/**
 * Formats enum validity information as a markdown table for report generation
 */
function formatEnumValidityTableMarkdown(enumInfos, versions) {
    if (enumInfos.length === 0) {
        return 'No enum values with version requirements found.';
    }
    const lines = [];
    // Calculate column widths
    const propWidth = Math.max(30, ...enumInfos.map((e) => `${e.property}.${e.enumValue}`.length));
    const sinceWidth = 7;
    const versionCellWidth = 10;
    // Helper functions for padding
    const padEnd = (str, width) => str.padEnd(width);
    const padCenterVersion = (str, width) => {
        const padding = width - str.length;
        const left = Math.floor(padding / 2);
        return ' '.repeat(left) + str + ' '.repeat(padding - left);
    };
    const padCenterEmoji = (emoji) => `   ${emoji}     `;
    // Header
    const headerCells = [
        padEnd('Property.EnumValue', propWidth),
        padEnd('Since', sinceWidth),
        ...versions.map((v) => padCenterVersion(v, versionCellWidth))
    ];
    lines.push(`| ${headerCells.join(' | ')} |`);
    // Separator
    const sepCells = [
        '-'.repeat(propWidth),
        '-'.repeat(sinceWidth),
        ...versions.map(() => '-'.repeat(versionCellWidth))
    ];
    lines.push(`| ${sepCells.join(' | ')} |`);
    // Data rows - generate expected visibility based on since version
    for (const info of enumInfos) {
        const rowCells = [
            padEnd(`${info.property}.${info.enumValue}`, propWidth),
            padEnd(info.since, sinceWidth),
            ...versions.map((v) => {
                const shouldBeVisible = compareVersionsExported(v, info.since) >= 0;
                return padCenterEmoji(shouldBeVisible ? exports.EMOJI_VISIBLE : exports.EMOJI_HIDDEN);
            })
        ];
        lines.push(`| ${rowCells.join(' | ')} |`);
    }
    // Legend
    lines.push('');
    lines.push(`Legend: ${exports.EMOJI_VISIBLE} = enum value available, ${exports.EMOJI_HIDDEN} = enum value not available`);
    return lines.join('\n');
}
/**
 * Exported version comparison function for use in formatting functions
 */
function compareVersionsExported(a, b) {
    // Handle 'latest' as a special case - it's always the highest version
    if (a === exports.VERSION_LATEST && b === exports.VERSION_LATEST) {
        return 0;
    }
    if (a === exports.VERSION_LATEST) {
        return 1;
    }
    if (b === exports.VERSION_LATEST) {
        return -1;
    }
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        if ((aParts[i] || 0) !== (bParts[i] || 0)) {
            return (aParts[i] || 0) - (bParts[i] || 0);
        }
    }
    return 0;
}
// ============================================================================
// Helper Functions - Schema Generation
// ============================================================================
/**
 * Generates an app schema with a specific minUI5Version
 */
async function generateSchemaWithVersion(genericSchema, schemaType, minUI5Version) {
    const manifestTemp = JSON.parse(JSON.stringify(manifest_json_1.default));
    manifestTemp['sap.ui5'].dependencies.minUI5Version = minUI5Version;
    const projectRoot = (0, path_1.join)('test', 'test-projects', 'v4new');
    const allAnnotationData = [
        (0, utils_1.prepareFileData)((0, path_1.join)(projectRoot, 'webapp', 'localService', 'metadata.xml')),
        (0, utils_1.prepareFileData)((0, path_1.join)(projectRoot, 'webapp', 'annotations', 'annotation.xml'))
    ];
    const schemaParams = {
        genericSchema,
        contextPath: '/Products',
        annotations: allAnnotationData,
        manifest: manifestTemp
    };
    // Use type assertion to handle dynamic schema type
    // The function only supports ListReport, ObjectPage, and AnalyticalListPage for v4
    const v4Params = { [schemaType]: schemaParams };
    return (0, api_1.generateSchema)({
        [ux_specification_types_1.FioriElementsVersion.v4]: v4Params
    });
}
/**
 * Generates schemas for multiple UI5 versions
 */
async function generateSchemasForVersions(genericSchema, schemaType, versions) {
    const results = new Map();
    for (const version of versions) {
        const schema = await generateSchemaWithVersion(genericSchema, schemaType, version);
        results.set(version, schema);
    }
    return results;
}
// ============================================================================
// Public API
// ============================================================================
/**
 * Gets validity properties for a class from a generic schema
 */
function getValidityProperties(genericSchema, classRef, schemaName) {
    const schemaProps = getSchemaPropertyNames(genericSchema, schemaName || classRef.name);
    return getValidityPropertiesFromClass(classRef, schemaProps);
}
/**
 * Compares expected vs actual visibility and returns both tables for assertion
 */
function compareExpectedVsActual(validityInfos, versions, schemaResults, findDefinition) {
    const expectedTable = generateExpectedVisibilityTable(validityInfos, versions);
    const actualTable = generateActualVisibilityTable(validityInfos, versions, schemaResults, findDefinition);
    return {
        expected: formatVisibilityTableMarkdown(expectedTable, versions),
        actual: formatVisibilityTableMarkdown(actualTable, versions)
    };
}
/**
 * Compares expected vs actual enum visibility and returns both tables for assertion
 */
function compareExpectedVsActualEnum(enumInfos, versions, schemaResults, findDefinition) {
    const expectedTable = generateExpectedEnumVisibilityTable(enumInfos, versions);
    const actualTable = generateActualEnumVisibilityTable(enumInfos, versions, schemaResults, findDefinition);
    return {
        expected: formatVisibilityTableMarkdown(expectedTable, versions),
        actual: formatVisibilityTableMarkdown(actualTable, versions)
    };
}
//# sourceMappingURL=validity-test-utils.js.map