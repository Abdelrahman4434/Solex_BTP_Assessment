"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
exports.createApp = createApp;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const extensionLogger_1 = require("../../../extensionLogger");
const i18next_1 = __importDefault(require("i18next"));
/**
 * Generic App class that implements the App interface.
 * Contains general, reusable methods applicable to any Fiori application.
 * Provides utilities for accessing manifest data, entity information, page discovery, and more.
 * Automatically extracts pages from the manifest during construction.
 */
class App {
    /**
     * Constructor for the App class.
     *
     * @param manifest The application manifest
     * @param avt The converted metadata from annotation vocabulary tools
     * @param logger Optional logger for error messages
     */
    constructor(manifest, avt, logger) {
        this.manifest = manifest;
        this.avt = avt;
        this.logger = logger;
        this.alias = this.getUIVocabularyAlias();
        this.setMinUI5Version();
        this.extractPagesFromManifest();
        // Initialize config for decorator context
        this.config = {
            manifest: this.manifest
        };
    }
    /**
     * Extracts pages from the manifest's routing targets.
     * Called automatically during construction.
     */
    extractPagesFromManifest() {
        const pages = this.manifest?.[ux_specification_types_1.ManifestSection.ui5]?.routing?.targets;
        // Validate pages and log error if no pages found
        if (!pages || pages.length === 0) {
            if (this.logger) {
                (0, extensionLogger_1.log)(this.logger, {
                    severity: "info" /* LogSeverity.Info */,
                    message: i18next_1.default.t('NOPAGES', { appId: this.getAppId() }),
                    location: {
                        path: ux_specification_types_1.MANIFESTPATH,
                        range: [ux_specification_types_1.ManifestSection.ui5, 'routing']
                    }
                });
            }
        }
        this.pages = pages;
    }
    // ==================== UI5 Version Management ====================
    /**
     * Sets the minimum UI5 version.
     */
    setMinUI5Version() {
        this.minUI5Version = this.manifest?.['sap.ui5']?.dependencies?.minUI5Version;
    }
    /**
     * Gets the minimum UI5 version as a string.
     * If minUI5Version is an array, returns the first element.
     *
     * @todo Handle array case properly if needed.
     * @returns The minimum UI5 version as a string, or undefined if not set
     */
    getMinUI5Version() {
        return typeof this.minUI5Version === 'string' ? this.minUI5Version : this.minUI5Version?.[0];
    }
    // ==================== Manifest Access ====================
    /**
     * Gets the manifest.
     *
     * @returns The application manifest
     */
    getManifest() {
        return this.manifest;
    }
    /**
     * Gets the application ID from the manifest.
     *
     * @returns The application ID, or undefined if not found
     */
    getAppId() {
        return this.manifest?.['sap.app']?.id;
    }
    /**
     * Gets the application version from the manifest.
     *
     * @returns The application version, or undefined if not found
     */
    getAppVersion() {
        return this.manifest?.['sap.app']?.applicationVersion?.version;
    }
    /**
     * Gets the application title from the manifest.
     *
     * @returns The application title, or undefined if not found
     */
    getAppTitle() {
        return this.manifest?.['sap.app']?.title;
    }
    // ==================== AVT (Annotation Vocabulary Tools) Access ====================
    /**
     * Gets the converted metadata (AVT).
     *
     * @returns The converted metadata containing entity types, entity sets, and annotations
     */
    getAVT() {
        return this.avt;
    }
    /**
     * Gets a specific entity set by name.
     *
     * @param name - The name of the entity set to find
     * @returns The entity set, or undefined if not found
     */
    getEntitySet(name) {
        return this.avt?.entitySets?.find((es) => es.name === name);
    }
    /**
     * Gets the entity type for a given entity set.
     *
     * @param entitySetName - The name of the entity set
     * @returns The entity type, or undefined if not found
     */
    getEntityType(entitySetName) {
        const entitySet = this.getEntitySet(entitySetName);
        return entitySet?.entityType;
    }
    /**
     * Finds the annotation alias for a given vocabulary namespace.
     *
     * @param vocabulary - The vocabulary namespace to search for (e.g., 'com.sap.vocabularies.UI.v1')
     * @returns The alias for the vocabulary, or undefined if not found
     */
    findAnnotationAlias(vocabulary) {
        if (!this.avt?.references) {
            return undefined;
        }
        let aliasReference = this.avt.references.find((reference) => {
            return reference.namespace === vocabulary;
        });
        if (!aliasReference) {
            aliasReference = this.avt.references.find((reference) => {
                return reference.alias === vocabulary;
            });
        }
        if (!aliasReference) {
            aliasReference = this.avt.references.find((reference) => {
                return (reference.alias.toUpperCase() ===
                    vocabulary.split('SAP__')[vocabulary.split('SAP__').length - 1].toUpperCase());
            });
        }
        return aliasReference?.alias;
    }
    /**
     * Gets the alias for the UI vocabulary (com.sap.vocabularies.UI.v1).
     * This is a convenience method for the commonly-used UI vocabulary.
     *
     * @param vocabulary - The vocabulary namespace to search for (default is UIVOCABULARY)
     * @returns The alias for the UI vocabulary, or undefined if not found
     */
    getUIVocabularyAlias(vocabulary = ux_specification_types_1.UIVOCABULARY) {
        return this.findAnnotationAlias(vocabulary);
    }
    // ==================== Page Management ====================
    /**
     * Gets all pages.
     *
     * @returns Array of page configurations
     */
    getPages() {
        return this.pages;
    }
    /**
     * Checks if the application has any pages configured.
     *
     * @returns True if pages exist, false otherwise
     */
    hasPages() {
        return this.pages && this.pages.length > 0;
    }
}
exports.App = App;
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
function createApp(manifest, avt, logger) {
    return new App(manifest, avt, logger);
}
//# sourceMappingURL=App.js.map