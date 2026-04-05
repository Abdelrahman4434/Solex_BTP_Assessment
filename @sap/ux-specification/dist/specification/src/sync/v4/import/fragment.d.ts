import type { Manifest, FileData } from '@sap/ux-specification-types';
export interface FragmentData {
    manifestPart: object;
    fragmentFileContent: string;
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
export declare function readHeaderFacetExtensions(manifest: Manifest, target: string, appId: string, fragmentFiles: FileData[]): FragmentData[];
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
export declare function readSectionExtensions(manifest: Manifest, target: string, appId: string, fragmentFiles: FileData[]): FragmentData[];
/**
 * Reads the column extensions from the control configuration of the specified target in the manifest.
 *
 * @param manifest - The manifest object containing application configuration.
 * @param target - The target page key in the manifest routing targets.
 * @param appId - The application ID used to resolve fragment paths.
 * @param fragmentFiles - A list of available fragment files with their content.
 * @returns An array of FragmentData objects containing the manifest part and fragment file content.
 */
export declare function readColumnExtensions(manifest: Manifest, target: string, appId: string, fragmentFiles: FileData[]): FragmentData[];
/**
 * Reads the filter fields extensions (from control configuration).
 *
 * @param manifest - The manifest object containing application configuration.
 * @param target - The target page key in the manifest routing targets.
 * @param appId - The application ID used to resolve fragment paths.
 * @param fragmentFiles - A list of available fragment files with their content.
 * @returns An array of FragmentData objects containing the manifest part and fragment file content.
 */
export declare function readFilterFieldsExtensions(manifest: Manifest, target: string, appId: string, fragmentFiles: FileData[]): FragmentData[];
//# sourceMappingURL=fragment.d.ts.map