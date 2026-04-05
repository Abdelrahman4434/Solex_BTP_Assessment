#!/usr/bin/env ts-node
"use strict";
/**
 * @file Script to generate a validity decorator overview report
 *
 * This script generates a markdown report showing:
 * - All classes with @validity decorated properties
 * - Expected vs Actual visibility across UI5 versions
 * - A diff table highlighting implementation gaps
 *
 * Usage: npx ts-node packages/specification/scripts/generate-validity-report.ts
 *
 * Output: packages/specification/doc/validity-overview.md
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ux_specification_types_1 = require("@sap/ux-specification-types");
const api_1 = require("../src/api");
const Table_1 = require("../src/sync/v4/export/controls/Table");
const HeaderAction_1 = require("../src/sync/v4/export/controls/HeaderAction");
const Header_1 = require("../src/sync/v4/export/controls/Header");
const FilterBar_1 = require("../src/sync/v4/export/controls/FilterBar");
const ToolBarAction_1 = require("../src/sync/v4/export/controls/ToolBarAction");
const ObjectPageTable_1 = require("../src/sync/v4/export/controls/ObjectPageTable");
const validity_test_utils_1 = require("../test/unit/decorators/validity-test-utils");
/** UI5 versions to test property visibility against */
const TEST_VERSIONS = ['1.84.0', '1.96.0', '1.108.0', '1.124.0', '1.136.0', '1.142.0', validity_test_utils_1.VERSION_LATEST];
const CLASSES_TO_REPORT = [
    { name: 'Table', classRef: Table_1.TableSettings, schemaName: 'Table', definitionFinder: validity_test_utils_1.findTableDefinition },
    { name: 'Header', classRef: Header_1.Header },
    { name: 'HeaderActions', classRef: Header_1.HeaderActions },
    { name: 'CustomHeaderAction', classRef: HeaderAction_1.CustomHeaderAction },
    { name: 'CustomFilterFieldPosition', classRef: FilterBar_1.CustomFilterFieldPosition },
    { name: 'ViewToolBarAction', classRef: ToolBarAction_1.ViewToolBarAction },
    { name: 'ToolBarAction', classRef: ToolBarAction_1.ToolBarAction },
    { name: 'ALPChart', classRef: Table_1.ALPChart, schemaName: 'ALPChart' },
    { name: 'ObjectPageTable', classRef: ObjectPageTable_1.ObjectPageTableRowCountable, schemaName: 'ObjectPageTable' }
];
/**
 * Counts the number of mismatches (gaps) in the diff results.
 *
 * @param diffMarkdown - The markdown string containing the diff table
 * @returns An object with gaps (mismatch count) and total (total cell count)
 */
function countGaps(diffMarkdown) {
    const lines = diffMarkdown.split('\n').filter((line) => line.startsWith('|') && !line.includes('---'));
    // Skip header line
    const dataLines = lines.slice(1);
    let gaps = 0;
    let total = 0;
    for (const line of dataLines) {
        const matches = line.match(/⚠️/g);
        const checkmarks = line.match(/✅/g);
        if (matches) {
            gaps += matches.length;
        }
        if (checkmarks) {
            total += checkmarks.length;
        }
        if (matches) {
            total += matches.length;
        }
    }
    return { gaps, total };
}
async function generateReport() {
    console.log('Generating validity decorator overview report...\n');
    // Load generic schema
    console.log('Loading generic schema...');
    const genericSchema = (await (0, api_1.getGenericSchema)(ux_specification_types_1.FioriElementsVersion.v4, ux_specification_types_1.SchemaType.ListReport));
    // Generate schemas for all versions
    console.log('Generating schemas for versions:', TEST_VERSIONS.join(', '));
    const schemaResults = await (0, validity_test_utils_1.generateSchemasForVersions)(genericSchema, ux_specification_types_1.SchemaType.ListReport, TEST_VERSIONS);
    const reports = [];
    // Process each class
    for (const config of CLASSES_TO_REPORT) {
        console.log(`Processing ${config.name}...`);
        const validityProperties = (0, validity_test_utils_1.getValidityProperties)(genericSchema, config.classRef, config.schemaName || config.classRef.name);
        // Get enum validity information
        const enumValidityInfos = (0, validity_test_utils_1.getEnumValidityFromClass)(config.classRef);
        const enumValidityTable = (0, validity_test_utils_1.formatEnumValidityTableMarkdown)(enumValidityInfos, TEST_VERSIONS);
        if (validityProperties.length === 0) {
            reports.push({
                name: config.name,
                hasValidityProperties: false,
                propertyCount: 0,
                expectedTable: '',
                actualTable: '',
                diffTable: '',
                gapCount: 0,
                totalCells: 0,
                enumValidityTable,
                enumValueCount: enumValidityInfos.length
            });
            continue;
        }
        const definitionFinder = config.definitionFinder || (0, validity_test_utils_1.findDefinitionByName)(config.schemaName || config.name);
        // Generate tables
        const expectedTableData = (0, validity_test_utils_1.generateExpectedVisibilityTable)(validityProperties, TEST_VERSIONS);
        const actualTableData = (0, validity_test_utils_1.generateActualVisibilityTable)(validityProperties, TEST_VERSIONS, schemaResults, definitionFinder);
        const diffTableData = (0, validity_test_utils_1.generateDiffVisibilityTable)(validityProperties, TEST_VERSIONS, schemaResults, definitionFinder);
        const expectedTable = (0, validity_test_utils_1.formatVisibilityTableMarkdown)(expectedTableData, TEST_VERSIONS);
        const actualTable = (0, validity_test_utils_1.formatVisibilityTableMarkdown)(actualTableData, TEST_VERSIONS);
        const diffTable = (0, validity_test_utils_1.formatDiffTableMarkdown)(diffTableData, TEST_VERSIONS);
        const { gaps, total } = countGaps(diffTable);
        reports.push({
            name: config.name,
            hasValidityProperties: true,
            propertyCount: validityProperties.length,
            expectedTable,
            actualTable,
            diffTable,
            gapCount: gaps,
            totalCells: total,
            enumValidityTable,
            enumValueCount: enumValidityInfos.length
        });
    }
    // Calculate summary stats
    const totalGaps = reports.reduce((sum, r) => sum + r.gapCount, 0);
    const totalCells = reports.reduce((sum, r) => sum + r.totalCells, 0);
    const classesWithGaps = reports.filter((r) => r.gapCount > 0);
    const classesWithoutValidity = reports.filter((r) => !r.hasValidityProperties);
    const totalEnumValues = reports.reduce((sum, r) => sum + r.enumValueCount, 0);
    const classesWithEnumValidity = reports.filter((r) => r.enumValueCount > 0);
    // Generate markdown
    const md = [];
    md.push('# @validity Decorator Implementation Overview');
    md.push('');
    md.push(`> Generated: ${new Date().toISOString()}`);
    md.push('');
    md.push('This report shows the implementation status of the `@validity` decorator across all decorated classes.');
    md.push('It compares expected visibility (based on decorator metadata) with actual visibility (from generated schemas).');
    md.push('');
    // Summary
    md.push('## Summary');
    md.push('');
    md.push('| Metric | Value |');
    md.push('| ------ | ----- |');
    md.push(`| Total Classes Analyzed | ${reports.length} |`);
    md.push(`| Classes with @validity Properties | ${reports.filter((r) => r.hasValidityProperties).length} |`);
    md.push(`| Classes without @validity Properties | ${classesWithoutValidity.length} |`);
    md.push(`| Total Property/Version Cells | ${totalCells} |`);
    md.push(`| Implementation Gaps (mismatches) | ${totalGaps} |`);
    md.push(`| Implementation Coverage | ${totalCells > 0 ? ((1 - totalGaps / totalCells) * 100).toFixed(1) : 100}% |`);
    md.push(`| Total Enum Values with Version Requirements | ${totalEnumValues} |`);
    md.push(`| Classes with Enum Validity | ${classesWithEnumValidity.length} |`);
    md.push('');
    // Overall status table
    md.push('### Class Status Overview');
    md.push('');
    md.push('| Class | Status | Properties | Gaps | Coverage | Enum Values |');
    md.push('| ----- | ------ | ---------- | ---- | -------- | ----------- |');
    for (const r of reports) {
        let status;
        let coverage;
        if (!r.hasValidityProperties) {
            status = '⬜ No @validity';
            coverage = 'N/A';
        }
        else if (r.gapCount === 0) {
            status = '✅ Complete';
            coverage = '100%';
        }
        else {
            status = '⚠️ Gaps';
            coverage = `${((1 - r.gapCount / r.totalCells) * 100).toFixed(1)}%`;
        }
        md.push(`| [${r.name}](#${r.name.toLowerCase()}) | ${status} | ${r.propertyCount || '-'} | ${r.gapCount || '-'} | ${coverage} | ${r.enumValueCount || '-'} |`);
    }
    md.push('');
    // Gap overview
    if (classesWithGaps.length > 0) {
        md.push('## Implementation Gaps');
        md.push('');
        md.push('Classes with mismatches between expected and actual visibility:');
        md.push('');
        md.push('| Class | Properties | Gaps | Gap % |');
        md.push('| ----- | ---------- | ---- | ----- |');
        for (const r of classesWithGaps) {
            const gapPct = ((r.gapCount / r.totalCells) * 100).toFixed(1);
            md.push(`| [${r.name}](#${r.name.toLowerCase()}) | ${r.propertyCount} | ${r.gapCount} | ${gapPct}% |`);
        }
        md.push('');
        // Quick overview of all diff tables
        md.push('### Quick Diff Overview');
        md.push('');
        md.push('Only showing classes with implementation gaps. See [detailed reports](#detailed-class-reports) for full information.');
        md.push('');
        for (const r of classesWithGaps) {
            md.push('<details open>');
            md.push(`<summary><strong>${r.name}</strong> - ${r.gapCount} gaps (${r.propertyCount} properties)</summary>`);
            md.push('');
            md.push('```');
            md.push(r.diffTable);
            md.push('```');
            md.push('');
            md.push('</details>');
            md.push('');
        }
    }
    // Classes without validity properties
    if (classesWithoutValidity.length > 0) {
        md.push('## Classes Without @validity Properties');
        md.push('');
        md.push('These classes have no properties decorated with `@validity`:');
        md.push('');
        for (const r of classesWithoutValidity) {
            md.push(`- **${r.name}**`);
        }
        md.push('');
    }
    // Legend
    md.push('## Legend');
    md.push('');
    md.push('### Expected/Actual Tables');
    md.push(`- ${validity_test_utils_1.EMOJI_VISIBLE} = Property is visible (version >= since, or "-" for always visible)`);
    md.push(`- ${validity_test_utils_1.EMOJI_HIDDEN} = Property is hidden (version < since)`);
    md.push(`- ${validity_test_utils_1.EMOJI_NOT_FOUND} = Property not found in schema definition`);
    md.push('');
    md.push('### Diff Tables');
    md.push(`- ${validity_test_utils_1.EMOJI_MATCH} = Match (expected === actual)`);
    md.push(`- ${validity_test_utils_1.EMOJI_DIFF} = Mismatch (expected !== actual) - **Implementation gap**`);
    md.push('');
    // Detailed class reports
    md.push('## Detailed Class Reports');
    md.push('');
    for (const r of reports) {
        md.push(`### ${r.name}`);
        md.push('');
        if (!r.hasValidityProperties && r.enumValueCount === 0) {
            md.push('*No @validity decorated properties found.*');
            md.push('');
            continue;
        }
        if (!r.hasValidityProperties && r.enumValueCount > 0) {
            md.push('*No @validity decorated properties, but has enum values with version requirements.*');
            md.push('');
            // Show enum validity section
            md.push('<details open>');
            md.push(`<summary>🔢 <strong>Enum Value Validity</strong> - ${r.enumValueCount} enum values with version requirements</summary>`);
            md.push('');
            md.push('```');
            md.push(r.enumValidityTable);
            md.push('```');
            md.push('');
            md.push('</details>');
            md.push('');
            continue;
        }
        md.push(`**Properties:** ${r.propertyCount} | **Gaps:** ${r.gapCount} | **Coverage:** ${((1 - r.gapCount / r.totalCells) * 100).toFixed(1)}%`);
        md.push('');
        // Expected Visibility - collapsible
        md.push('<details>');
        md.push('<summary><strong>Expected Visibility</strong> (based on @validity decorator metadata)</summary>');
        md.push('');
        md.push('```');
        md.push(r.expectedTable);
        md.push('```');
        md.push('');
        md.push('</details>');
        md.push('');
        // Actual Visibility - collapsible
        md.push('<details>');
        md.push('<summary><strong>Actual Visibility</strong> (from generated version-specific schemas)</summary>');
        md.push('');
        md.push('```');
        md.push(r.actualTable);
        md.push('```');
        md.push('');
        md.push('</details>');
        md.push('');
        // Differences - open by default if there are gaps
        const openAttr = r.gapCount > 0 ? ' open' : '';
        md.push(`<details${openAttr}>`);
        if (r.gapCount === 0) {
            md.push('<summary>✅ <strong>Differences</strong> - No implementation gaps</summary>');
        }
        else {
            md.push(`<summary>⚠️ <strong>Differences</strong> - ${r.gapCount} implementation gaps found</summary>`);
        }
        md.push('');
        md.push('```');
        md.push(r.diffTable);
        md.push('```');
        md.push('');
        md.push('</details>');
        md.push('');
        // Enum Validity - only if there are enum values with version requirements
        if (r.enumValueCount > 0) {
            md.push('<details>');
            md.push(`<summary>🔢 <strong>Enum Value Validity</strong> - ${r.enumValueCount} enum values with version requirements</summary>`);
            md.push('');
            md.push('```');
            md.push(r.enumValidityTable);
            md.push('```');
            md.push('');
            md.push('</details>');
            md.push('');
        }
    }
    // Action items
    if (classesWithGaps.length > 0) {
        md.push('## Action Items');
        md.push('');
        md.push('To fix implementation gaps, ensure the schema generation respects the `@validity(since)` decorator:');
        md.push('');
        md.push('1. Properties should be **hidden** when `minUI5Version < since`');
        md.push('2. Properties should be **visible** when `minUI5Version >= since`');
        md.push('');
        md.push('Check the following files for potential fixes:');
        md.push('');
        md.push('- `packages/specification/src/sync/common/decoration/decorators.ts` - Decorator implementation');
        md.push('- `packages/specification/src/sync/v4/export/` - Export control classes');
        md.push('');
    }
    // Write file
    const outputPath = path.join(__dirname, '..', 'doc', 'validity-overview.md');
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(outputPath, md.join('\n'));
    console.log(`\nReport written to: ${outputPath}`);
    console.log(`\nSummary: ${totalGaps} gaps found across ${classesWithGaps.length} classes`);
}
// Run the report
generateReport().catch((err) => {
    console.error('Error generating report:', err);
    process.exit(1);
});
//# sourceMappingURL=generate-validity-report.js.map