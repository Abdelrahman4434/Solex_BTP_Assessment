import type { Manifest, ExtensionLogger } from '@sap/ux-specification-types';
import type { ConvertedMetadata, EntitySet, EntityType } from '@sap-ux/vocabularies-types';
import type { SapUiAppPageV4 } from '@sap/ux-specification-types/src/v4/webapp/manifest/sapUiPageV4';
/**
 * Interface representing a Fiori application's core metadata.
 * Contains manifest, annotation vocabulary tools (AVT), and page configurations.
 */
export interface AppInterface {
    manifest: Manifest;
    avt: ConvertedMetadata;
    pages: SapUiAppPageV4[];
    alias?: string;
}
/**
 * Generic App class that implements the App interface.
 * Contains general, reusable methods applicable to any Fiori application.
 * Provides utilities for accessing manifest data, entity information, page discovery, and more.
 * Automatically extracts pages from the manifest during construction.
 */
export declare class App implements AppInterface {
    manifest: Manifest;
    avt: ConvertedMetadata;
    pages: SapUiAppPageV4[];
    alias?: string;
    private minUI5Version?;
    logger?: ExtensionLogger;
    /**
     * Configuration object for decorator context.
     * Provides access to app-level configuration via `app.*` path builders.
     */
    config: {
        /** The application manifest */
        manifest: Manifest;
    };
    /**
     * Constructor for the App class.
     *
     * @param manifest The application manifest
     * @param avt The converted metadata from annotation vocabulary tools
     * @param logger Optional logger for error messages
     */
    constructor(manifest: Manifest, avt: ConvertedMetadata, logger?: ExtensionLogger);
    /**
     * Extracts pages from the manifest's routing targets.
     * Called automatically during construction.
     */
    private extractPagesFromManifest;
    /**
     * Sets the minimum UI5 version.
     */
    private setMinUI5Version;
    /**
     * Gets the minimum UI5 version as a string.
     * If minUI5Version is an array, returns the first element.
     *
     * @todo Handle array case properly if needed.
     * @returns The minimum UI5 version as a string, or undefined if not set
     */
    getMinUI5Version(): string;
    /**
     * Gets the manifest.
     *
     * @returns The application manifest
     */
    getManifest(): Manifest;
    /**
     * Gets the application ID from the manifest.
     *
     * @returns The application ID, or undefined if not found
     */
    getAppId(): string | undefined;
    /**
     * Gets the application version from the manifest.
     *
     * @returns The application version, or undefined if not found
     */
    getAppVersion(): string | undefined;
    /**
     * Gets the application title from the manifest.
     *
     * @returns The application title, or undefined if not found
     */
    getAppTitle(): string | undefined;
    /**
     * Gets the converted metadata (AVT).
     *
     * @returns The converted metadata containing entity types, entity sets, and annotations
     */
    getAVT(): ConvertedMetadata;
    /**
     * Gets a specific entity set by name.
     *
     * @param name - The name of the entity set to find
     * @returns The entity set, or undefined if not found
     */
    getEntitySet(name: string): EntitySet | undefined;
    /**
     * Gets the entity type for a given entity set.
     *
     * @param entitySetName - The name of the entity set
     * @returns The entity type, or undefined if not found
     */
    getEntityType(entitySetName: string): EntityType | undefined;
    /**
     * Finds the annotation alias for a given vocabulary namespace.
     *
     * @param vocabulary - The vocabulary namespace to search for (e.g., 'com.sap.vocabularies.UI.v1')
     * @returns The alias for the vocabulary, or undefined if not found
     */
    private findAnnotationAlias;
    /**
     * Gets the alias for the UI vocabulary (com.sap.vocabularies.UI.v1).
     * This is a convenience method for the commonly-used UI vocabulary.
     *
     * @param vocabulary - The vocabulary namespace to search for (default is UIVOCABULARY)
     * @returns The alias for the UI vocabulary, or undefined if not found
     */
    getUIVocabularyAlias(vocabulary?: string): string | undefined;
    /**
     * Gets all pages.
     *
     * @returns Array of page configurations
     */
    getPages(): SapUiAppPageV4[];
    /**
     * Checks if the application has any pages configured.
     *
     * @returns True if pages exist, false otherwise
     */
    hasPages(): boolean;
}
/**
 * Factory function to create an App instance.
 * Provides a convenient way to instantiate the App class.
 * Pages are automatically extracted from the manifest.
 *
 * @param manifest - The application manifest
 * @param avt - The converted metadata from annotation vocabulary tools
 * @param logger - Optional logger for error messages
 * @returns A new App instance with pages automatically extracted
 */
export declare function createApp(manifest: Manifest, avt: ConvertedMetadata, logger?: ExtensionLogger): App;
//# sourceMappingURL=App.d.ts.map