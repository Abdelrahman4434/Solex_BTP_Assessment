"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareUI5Versions = compareUI5Versions;
const distTagEvaluator_1 = require("../../common/distTagEvaluator");
/**
 * Compares two UI5 version strings to determine if versionToCheck meets or exceeds the minVersion requirement.
 *
 * @param versionToCheck - The version string to check (e.g., "1.84.0", "1.120.5")
 * @param minVersion - The minimum required version string (e.g., "1.84.0")
 * @returns true if versionToCheck is greater than or equal to minVersion, false otherwise
 */
function compareUI5Versions(versionToCheck, minVersion) {
    if (!versionToCheck) {
        return false;
    }
    // If versionToCheck is a variable, we cannot compare it and assume 'latest'
    if ((0, distTagEvaluator_1.isMinUI5VersionVariable)(versionToCheck)) {
        return true;
    }
    // If versionToCheck is 'latest', it's always greater than or equal to any version
    if (versionToCheck === 'latest') {
        return true;
    }
    // Remove any non-numeric prefixes and extract version numbers
    // Kept vague to support versions like "-legacy-free" as variables - can be discussed further if needed
    const cleanVersion = (version) => {
        const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
        if (!match) {
            return [0, 0, 0];
        }
        return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
    };
    const versionParts = cleanVersion(versionToCheck);
    const minParts = cleanVersion(minVersion);
    // Compare major, minor, and patch versions
    for (let i = 0; i < 3; i++) {
        if (versionParts[i] > minParts[i]) {
            return true;
        }
        if (versionParts[i] < minParts[i]) {
            return false;
        }
    }
    // Versions are equal
    return true;
}
//# sourceMappingURL=utils.js.map