import type { ExtensionLogger } from '@sap/ux-specification-types';
/**
 * Checks if the provided minUI5Version is a variable (starts with '$').
 *
 * @param minUI5Version - The minimum UI5 version to check.
 * @returns {boolean} - true if minUI5Version is a variable, false otherwise.
 */
export declare function isMinUI5VersionVariable(minUI5Version: string): boolean;
export declare class DistTagEvaluator {
    static distTagsOfSpec: string[];
    constructor();
    /**
     * Resets the buffered list of dist tags (used for unit tests).
     */
    static resetDistTagsOfSpec(): void;
    /**
     * Retrieves the actual spec version from package.json.
     *
     * @returns the version, if found in package.json
     */
    getSpecVersion(): string | undefined;
    /**
     * Determines the relevant list of dist tags for the current spec version.
     * The dist tags are read from the dist_tag.json (copy from https://github.wdf.sap.corp/NPMJS/FIORI_ELEMENT_SPECIFICATION-1.0.0/blob/master/dist_tag.json).
     * The spec vrsion is read from package.json.
     *
     * @returns an array of the dist tags
     */
    getDistTagsOfVersion(): string[];
    /**
     * Checks if the given minUI5Version and spec version fit together, based on the distTags stord in ./dist_tag.json.
     *
     * @param {string} minUI5Version - minUI5Version from manifest
     * @param {ExtensionLogger} logger - logger as passed from the API
     */
    doesUi5VersionFitDistTags(minUI5Version: string | string[], logger: ExtensionLogger): void;
    /**
     * Basic check if the minUI5Version is set and not a variable in the manifest.json.
     *
     * @param minUI5Version - The minimum UI5 version to validate.
     * @param logger - Instance of the extension logger
     * @returns {boolean} - true if minUI5Version is set and not a variable
     */
    private checkVersionName;
}
//# sourceMappingURL=distTagEvaluator.d.ts.map