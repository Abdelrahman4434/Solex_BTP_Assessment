import { AppProvider } from '../../../common/appProvider';
import { AppSettings } from '../../application';
import type { ExtensionFiles, Files, Manifest, ImportAllConfigsParameters } from '@sap/ux-specification-types';
import { v4, TemplateType, PageTypeV4 } from '@sap/ux-specification-types';
import type { ExtensionLogger } from '../../../..';
export declare enum Constants {
    OptionalQuery = ":?query:",
    Component = "sap/fe/AppComponent",
    Namespace = "sap.fe.templates"
}
export declare const unhandledControllers: Array<string>;
export type ConversionParameters = {
    target: v4.RoutingTargetOptions;
    pageType: PageTypeV4;
    manifest: Manifest;
    schemas: Files;
    logger: ExtensionLogger;
    page: v4.Page;
    id: string;
    templateType: TemplateType;
    extensionFiles: ExtensionFiles;
};
/**
 * Determines the Pages(app.json) using routing configuration from manifest and creates the configuration for each page.
 *
 * @param {ImportAllConfigsParameters} importParameters - structure comprising all input parameters
 * @returns a list of configs for all pages
 */
export declare function getPagesAndConfigs(importParameters: ImportAllConfigsParameters): v4.Pages;
/**
 * Get the id of the page that is to open when the application is started.
 *
 * @param routing UI5 routing configuration
 * @returns the id of the home page
 */
export declare function getHome(routing: v4.SapUi5RoutingV4): string | undefined;
/**
 * Method which detects app settings from manifest.
 * Currently only some settings are detected - Flexible Column Layout, viewPath, viewType, path.
 *
 * @param routing UI5 routing configuration.
 * @returns {AppSettings} Application settings.
 */
export declare function getSettings(routing: v4.SapUi5RoutingV4): AppSettings;
/**
 * Retrieves the pages from the manifest that match the specified target name.
 *
 * @param manifest - The manifest object containing the routing configuration.
 * @param targetName - The name of the target to filter pages by.
 * @returns An object containing the pages that match the target name.
 */
export declare function getPages(manifest: Manifest, targetName: string): v4.SapUiAppPagesV4;
export declare class V4AppProvider extends AppProvider {
    /**
     *
     * @param importParameters - The parameters required for importing configurations, including manifest, schemas, and other related data.
     */
    constructor(importParameters: ImportAllConfigsParameters);
}
//# sourceMappingURL=appProvider.d.ts.map