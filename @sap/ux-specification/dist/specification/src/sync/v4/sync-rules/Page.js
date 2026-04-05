"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const utils_1 = require("../utils/utils");
/**
 * Represents a single page in a Fiori application.
 * Encapsulates page finding logic and provides convenient access to page properties.
 */
class Page {
    /**
     * Creates a new Page instance by finding the page configuration in the app.
     *
     * @param app - The App instance containing the pages
     * @param template - The template name to search for
     * @param template.name - The name of the template
     * @param template.type - The type of the template
     * @param entitySet - Optional entity set to match
     * @param entityType - Optional entity type to match
     * @param contextPath - Optional context path to match
     */
    constructor(app, template, entitySet, entityType, contextPath) {
        this.app = app;
        this.entity = {
            contextPath: contextPath,
            set: entitySet,
            type: entityType ?? entitySet?.entityType
        };
        this.template = template;
        // Use findPageV4 with app.pages
        this.target = (0, utils_1.findPageV4)(app.pages, template.name, entitySet, contextPath);
    }
    /**
     * Gets the entity type associated with this page.
     *
     * @returns The entity type, or undefined if not found
     */
    getEntityType() {
        return this.entity.type;
    }
    /**
     * Gets the UI annotations for the entity type associated with this page.
     *
     * @returns The UI annotations, or undefined if not found
     */
    getUIAnnotations() {
        return this.getEntityType()?.annotations?.[this.app.alias];
    }
    /**
     * Gets the alias for the UI vocabulary (default "UI").
     *
     * @returns The alias for the UI vocabulary, or default "UI"
     */
    getUIVocabularyAlias() {
        return this.app.getUIVocabularyAlias() || 'UI';
    }
    /**
     * Helper to add configuration properties to the page.
     *
     * @param config Properties to be added to the page
     */
    addConfig(config) {
        this.config = { ...this.config, ...config };
    }
}
exports.Page = Page;
//# sourceMappingURL=Page.js.map