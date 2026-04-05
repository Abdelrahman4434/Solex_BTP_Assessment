import type { v4 } from '@sap/ux-specification-types';
/**
 * Method updates passed dependency lib in passed manifest.
 *
 * @param manifest - Manifest "sap.ui5" object.
 * @param name - Library name to check.
 * @param [add] - Add or remove library.
 */
export declare function updateDependencyLib(manifest: v4.SapUi5V4, name: string, add?: boolean): void;
/**
 * Looks for <...> pattern in the input string; if found, extracts this last part of the string.
 *
 * @param longId - schema ID in its long format
 * @returns the converted ID
 */
export declare function extractLastIdPart(longId: string): string;
//# sourceMappingURL=utils.d.ts.map