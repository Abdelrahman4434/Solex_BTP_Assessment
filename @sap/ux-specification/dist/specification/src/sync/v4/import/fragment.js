"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readHeaderFacetExtensions = readHeaderFacetExtensions;
exports.readSectionExtensions = readSectionExtensions;
exports.readColumnExtensions = readColumnExtensions;
exports.readFilterFieldsExtensions = readFilterFieldsExtensions;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const path_1 = require("path");
/**
 * Determines a related fragment file and returns its content.
 *
 * @param fragmentName - The name of the fragment to be located.
 * @param fragmentFiles - A list of available fragment files with their content.
 * @param manifestPart - The part of the manifest associated with the fragment.
 * @param appId - The application ID used to resolve the fragment path.
 * @returns An object containing the manifest part and the content of the fragment file, or undefined if not found.
 */
function readFragmentFile(fragmentName, fragmentFiles, manifestPart, appId) {
    let fragmentData;
    if (fragmentName) {
        const fragmentId = fragmentName.substring(appId.length + 1);
        const pathParts = fragmentId.split('.');
        pathParts[pathParts.length - 1] = pathParts[pathParts.length - 1] + '.fragment.xml';
        const extensionPath = (0, path_1.join)('webapp', ...pathParts);
        for (const file of fragmentFiles) {
            if (file.dataSourceUri.endsWith(extensionPath)) {
                fragmentData = {
                    manifestPart,
                    fragmentFileContent: file.fileContent
                };
                break;
            }
        }
    }
    return fragmentData;
}
/**
 * Finds fragment information in a control configuration segment.
 *
 * @param segment - Segment of the control configuration
 * @param fragmentFiles - list of all fragment files' content
 * @param appId - Application ID
 * @returns a list of fragment data from the given segment
 */
function findFragmentInSegment(segment, fragmentFiles, appId) {
    const fragmentData = [];
    for (const key in segment) {
        //extension as part of controlConfiguration
        const fragment = readFragmentFile(segment[key]['template'], fragmentFiles, segment[key], appId);
        if (fragment) {
            fragmentData.push(fragment);
        }
    }
    return fragmentData;
}
/**
 * Reads an extension from a specific segment of a V4 target's control configuration and retrieves related fragment data.
 *
 * @param manifest - The manifest object containing application configuration.
 * @param target - The target page key in the manifest routing targets.
 * @param targetSegment - The segment of the control configuration to read extensions from.
 * @param appId - The application ID used to resolve fragment paths.
 * @param fragmentFiles - A list of available fragment files with their content.
 * @returns An array of FragmentData objects containing the manifest part and fragment file content.
 */
function readControlConfigurationExtension(manifest, target, targetSegment, appId, fragmentFiles) {
    const targets = manifest[ux_specification_types_1.ManifestSection.ui5].routing.targets;
    let fragmentData = [];
    for (const pageKey in targets) {
        if (pageKey === target) {
            const controlConfiguration = targets[pageKey].options?.settings?.['controlConfiguration'];
            for (const configKey in controlConfiguration) {
                const dataOfSegment = findFragmentInSegment(controlConfiguration[configKey][targetSegment], fragmentFiles, appId);
                fragmentData = [...dataOfSegment];
            }
        }
    }
    return fragmentData;
}
/**
 * Note: header or footer actions are not linked to a fragment, thus cannot be found here
 */
/**
 * Reads the header facet extensions from the manifest and retrieves related fragment data.
 *
 * @param manifest - The manifest object containing application configuration.
 * @param target - The target page key in the manifest routing targets.
 * @param appId - The application ID used to resolve fragment paths.
 * @param fragmentFiles - A list of available fragment files with their content.
 * @returns An array of FragmentData objects containing the manifest part and fragment file content.
 */
function readHeaderFacetExtensions(manifest, target, appId, fragmentFiles) {
    const fragmentData = [];
    const targets = manifest[ux_specification_types_1.ManifestSection.ui5].routing.targets;
    for (const pageKey in targets) {
        if (pageKey === target) {
            const targetSettings = targets[pageKey].options?.settings;
            // Read extensions for header facets
            const configBasedFacets = targetSettings?.controlConfiguration?.[`@${"com.sap.vocabularies.UI.v1.HeaderFacets" /* UIAnnotationTerms.HeaderFacets */}`]?.facets;
            const contentBasedFacets = targetSettings?.content?.header?.facets;
            const headerFacets = Object.assign({}, configBasedFacets, contentBasedFacets);
            for (const key in headerFacets) {
                const fragment = readFragmentFile(headerFacets[key]['name'], fragmentFiles, headerFacets[key], appId);
                if (fragment) {
                    fragmentData.push(fragment);
                }
            }
        }
    }
    return fragmentData;
}
/**
 * Reads the section extensions by merging content-based definitions with control configuration,
 * where content-based definitions take precedence.
 *
 * @param manifest - The manifest object containing application configuration.
 * @param target - The target page key in the manifest routing targets.
 * @param appId - The application ID used to resolve fragment paths.
 * @param fragmentFiles - A list of available fragment files with their content.
 * @returns An array of FragmentData objects containing the manifest part and fragment file content.
 */
function readSectionExtensions(manifest, target, appId, fragmentFiles) {
    const fragmentData = [];
    const targets = manifest[ux_specification_types_1.ManifestSection.ui5].routing.targets;
    for (const pageKey in targets) {
        if (pageKey === target) {
            const targetSettings = targets[pageKey].options?.settings;
            // Read extensions for sections
            const contentBasedSections = targetSettings?.content?.body?.sections;
            const configBasedSections = targetSettings?.controlConfiguration?.[`@${"com.sap.vocabularies.UI.v1.Facets" /* UIAnnotationTerms.Facets */}`]?.sections;
            const sections = Object.assign({}, configBasedSections, contentBasedSections);
            for (const key in sections) {
                const fragment = readFragmentFile(sections[key]['name'], fragmentFiles, sections[key], appId);
                if (fragment) {
                    fragmentData.push(fragment);
                }
            }
        }
    }
    return fragmentData;
}
/**
 * Reads the column extensions from the control configuration of the specified target in the manifest.
 *
 * @param manifest - The manifest object containing application configuration.
 * @param target - The target page key in the manifest routing targets.
 * @param appId - The application ID used to resolve fragment paths.
 * @param fragmentFiles - A list of available fragment files with their content.
 * @returns An array of FragmentData objects containing the manifest part and fragment file content.
 */
function readColumnExtensions(manifest, target, appId, fragmentFiles) {
    return readControlConfigurationExtension(manifest, target, 'columns', appId, fragmentFiles);
}
/**
 * Reads the filter fields extensions (from control configuration).
 *
 * @param manifest - The manifest object containing application configuration.
 * @param target - The target page key in the manifest routing targets.
 * @param appId - The application ID used to resolve fragment paths.
 * @param fragmentFiles - A list of available fragment files with their content.
 * @returns An array of FragmentData objects containing the manifest part and fragment file content.
 */
function readFilterFieldsExtensions(manifest, target, appId, fragmentFiles) {
    return readControlConfigurationExtension(manifest, target, 'filterFields', appId, fragmentFiles);
}
//# sourceMappingURL=fragment.js.map