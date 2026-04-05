import type { EntitySet, EntityType } from '@sap-ux/vocabularies-types';
import type { TemplateType, v4 } from '@sap/ux-specification-types';
import type { App } from './App';
import type { EntityTypeAnnotations_UI } from '@sap-ux/vocabularies-types/vocabularies/UI_Edm';
export type PageConfig = {
    [key: string]: any;
};
/**
 * Represents a single page in a Fiori application.
 * Encapsulates page finding logic and provides convenient access to page properties.
 */
export declare class Page<Config extends PageConfig = PageConfig> {
    private readonly app;
    readonly target?: v4.SapUiAppPageV4;
    template: {
        name: string;
        type: TemplateType;
    };
    entity?: {
        type?: EntityType;
        set?: EntitySet;
        contextPath?: string;
    };
    config?: Config;
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
    constructor(app: App, template: {
        name: string;
        type: TemplateType;
    }, entitySet?: EntitySet, entityType?: EntityType, contextPath?: string);
    /**
     * Gets the entity type associated with this page.
     *
     * @returns The entity type, or undefined if not found
     */
    getEntityType(): EntityType | undefined;
    /**
     * Gets the UI annotations for the entity type associated with this page.
     *
     * @returns The UI annotations, or undefined if not found
     */
    getUIAnnotations(): EntityTypeAnnotations_UI | undefined;
    /**
     * Gets the alias for the UI vocabulary (default "UI").
     *
     * @returns The alias for the UI vocabulary, or default "UI"
     */
    getUIVocabularyAlias(): string;
    /**
     * Helper to add configuration properties to the page.
     *
     * @param config Properties to be added to the page
     */
    addConfig(config: Config): void;
}
//# sourceMappingURL=Page.d.ts.map