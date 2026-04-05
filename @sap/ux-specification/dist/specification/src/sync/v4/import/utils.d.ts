import type { Definition, DefinitionOrBoolean } from 'typescript-json-schema';
import type { ExtensionLogger } from '../../..';
import { type Manifest } from '@sap/ux-specification-types';
/**
 * Transfers settings from manifest to object page config.
 *
 * @param {object} configPart - The configuration object that contains the settings to be imported.
 * @param {Manifest} manifest - The manifest object where the settings will be imported.
 * @param {Definition | DefinitionOrBoolean} appSchema - The application schema used for validation and structure.
 * @param {string} pageKey - The key representing the specific page in the manifest.
 * @param {string[]} breadcrumbs - The breadcrumb hierarchy guiding the location of the target settings.
 * @param {string} [sectionId] - The optional section ID for locating specific sections in the manifest.
 * @param {ExtensionLogger} [logger] - A logger instance used for logging deprecation warnings and issues.
 * @param {Definition | DefinitionOrBoolean} [schemaDefinitions] - Optional schema definitions that further specify the configuration structure.
 */
export declare function importSettingsOfObject(configPart: {
    [key: string]: any;
}, manifest: Manifest, appSchema: Definition | DefinitionOrBoolean, pageKey: string, breadcrumbs: string[], sectionId?: string, logger?: ExtensionLogger, schemaDefinitions?: Definition | DefinitionOrBoolean): void;
//# sourceMappingURL=utils.d.ts.map