import type { Manifest } from '../../../..';
import type { GeneralSettings } from '../../sync-rules';
import { BaseConstruct } from '../../sync-rules';
import type { Definition } from 'typescript-json-schema';
/**
 * Add general settings to schema (LR or ALP).
 *
 * - Adds Selection-(PresentationVariant) related enums to the schema.
 */
export declare class GeneralListReportSettings extends BaseConstruct {
    /**
     * Constructor for general settings of ListReport.
     *
     * @param settings - general settings (App, Page, AppSchema, Logger)
     */
    constructor(settings: GeneralSettings);
    init(): void;
    /**
     * Adds Selection-(PresentationVariant) related enums to the schema.
     *
     * @param definitionName - definition name
     */
    private addSPVEnums;
}
/**
 * Add filter bar to schema (LR or ALP).
 */
export declare class FilterBar extends BaseConstruct {
    /**
     *
     * @param settings - general settings (App, Page, AppSchema, Logger)
     */
    constructor(settings: GeneralSettings);
    /**
     * Initializes the filter bar adjustments.
     */
    init(): void;
    private addVisualFilters;
    private addSelectionFields;
    /**
     * Adds filter bar to schema (LR or ALP).
     *
     * @param entityType - the entity type
     * @param schema - the application schema
     * @param v4Page - the actual page in the manifest
     * @param alias - alias definition for the UI vocabulary
     */
    private addFilterBar;
}
export declare class TableAndViews extends BaseConstruct {
    /**
     * Initializes the addition of table and views to the schema.
     */
    init(): void;
    /**
     * Adds table and views to the schema.
     */
    private addTableAndViews;
}
/**
 * Enhances the List Report schema with manifest paths for definition and properties.
 *
 * This function extends the app schema (`appSchema`) by adding manifestPath to definition and properties on the List Report.
 *
 * @param {Definition} appSchema - The application schema object representing the List Report structure.
 * @param {string} pageId - Identifier of the page.
 * @param {string} definitionName - Identifier of the corresponding definition.
 * @param {Manifest} manifest - The application manifest.
 * @param {string} targetAnnotation - Target annotation.
 * @param {string} entitySet - Entity set.
 */
export declare function addManifestPathsToDefinitionPropertiesLR(appSchema: Definition, pageId: string, definitionName: string, manifest: Manifest, targetAnnotation?: string, entitySet?: string): void;
//# sourceMappingURL=ListReportUtils.d.ts.map