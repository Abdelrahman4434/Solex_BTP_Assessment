import type { ExtensionLogger, Application, Files, PagesBase, v2, v4, ImportAllConfigsParameters } from '@sap/ux-specification-types';
export interface Controllers {
    [key: string]: string;
}
export declare abstract class AppProvider {
    readonly app: Application;
    readonly logger: ExtensionLogger;
    readonly schemas: Files;
    unhandledControllers: Array<string>;
    /**
     * Creates an instance of AppProvider.
     *
     * @param importParameters - Parameters required for importing configurations, including manifest and schemas.
     * @param home - The home page ID of the application.
     * @param pages - The pages object containing all application pages.
     * @param settings - Optional application settings for V2 or V4.
     */
    protected constructor(importParameters: ImportAllConfigsParameters, home: string, pages: PagesBase, settings?: v2.AppSettings | v4.AppSettings);
    /**
     * Creates configuration files for the app (app.json) and pages (pages/{name}.json).
     * This is essentially a copy of createFiles optimized for use in FTFS:
     * It always uses POSIX path notation with forward slashes (/).
     *
     * @returns app and page files as separate objects
     */
    createConfigFiles(): {
        appConfig: Files;
        pageConfigs: Files;
    };
    /**
     * Method returns page's config object to store in file for passed page.
     *
     * @param {v2.Page | v4.Page} page Page from 'app.json'.
     * @param {string} pageId - ID of the page or entity set in case of V2.
     * @returns {PageConfig | undefined} The page's config object to store in a file.
     */
    private getPageConfigFile;
    /**
     * Method updates "$filePath" property for custom page's config object.
     *
     * @param {v4.Page} page Custom page from 'app.json'.
     * @param {CustomPageConfig} config Custom page's config object.
     */
    private applyCustomPageFilePath;
}
//# sourceMappingURL=appProvider.d.ts.map