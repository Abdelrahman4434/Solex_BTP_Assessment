import { v4 } from '@sap/ux-specification-types';
import type { ToolBar } from './ToolBar';
import { Decorator } from '../../sync-rules';
import type { PopinLayout } from 'sap/m/library';
/**
 * Deletes a property from the creation mode section of the manifest object,
 * and removes the creation mode section if it becomes empty.
 *
 * @param {unknown} manifestSection - The section of the manifest object containing the creation mode property.
 * @param {object} _configObject - Configuration object (not currently used in the method logic).
 * @param {string} _key - The specific key (not currently used in the method logic).
 * @param {string} manifestKey - The key identifying the property in the creation mode to be deleted.
 */
export declare function deleteCreationModeProperty(manifestSection: unknown, _configObject: object, _key: string, manifestKey: string): void;
/**
 * Exports the creation mode property from a given configuration object to a manifest section.
 *
 * @param {unknown} manifestSection - The section of the manifest where the creation mode property will be updated.
 * @param {unknown} configObject - The configuration object containing the creation mode property.
 * @param {string} key - The key used to identify the specific property within the creation mode section.
 */
export declare function exportCreationModeProperty(manifestSection: unknown, configObject: unknown, key: string): void;
/**
 * Updates the 'creationMode.creationFields' property in the manifestSection object
 * by joining the 'creationFields' array from the configObject into a string separated by commas.
 *
 * @param {object} manifestSection - The object where the 'creationMode.creationFields' property will be updated.
 * @param {object} configObject - The object containing the 'creationFields' array to be used for the update.
 */
export declare function exportCreationModeCreationFieldsProperty(manifestSection: unknown, configObject: unknown): void;
/**
 * Extracts and processes the `creationFields` property from the provided manifest section.
 *
 * @param {object[]} manifestSection - An array of objects representing the manifest section,
 * where the `creationFields` property might exist.
 * @returns {string[] | undefined} An array of strings representing the split values of the `creationFields`
 * property if it exists and is a valid string, otherwise `undefined`.
 */
export declare function importCreationModeCreationFieldsProperty(manifestSection: object[]): string[] | undefined;
/**
 * Sync rule for importing personalization. This function performs an implicit conversion of a former boolean value to the new object representation.
 *
 * @param tableSettings - table settings in manifest, to be analyzed
 * @returns - object representing the value(s) for the config file
 */
export declare function importCreationMode(tableSettings: object): object | undefined;
/**
 * If a view index was changed we need to adapt the order of views in manifest.
 *
 * @param manifestSection - section in manifest comprising the table settings
 * @param configObject - section in config.json describing the table settings
 */
export declare function checkViewOrder(manifestSection: unknown, configObject: unknown): void;
/**
 * Common sync rule function for export of creation for personalization object.
 *
 * @param manifestSection - section in manifest comprising the table settings
 * @param configObject - section in config.json describing the table settings
 * @param key - key or property in config.json
 * @param manifestKey - key or property in manifest
 */
export declare function exportPersonalization(manifestSection: unknown, configObject: unknown, key: string, manifestKey?: string): void;
/**
 * Common sync rule function for export of personalization properties.
 *
 * @param manifestSection - section in manifest comprising the table settings
 * @param configObject - section in config.json describing the table settings
 * @param key - key or property in config.json
 * @param manifestKey - key or property in manifest
 */
export declare function exportPersonalizationProperty(manifestSection: unknown, configObject: unknown, key: string, manifestKey: string): void;
/**
 * Common sync rule function for the deletion of any property of personalization.
 *
 * @param manifestSection - section in manifest comprising the table settings
 * @param _configObject - page config object
 * @param _key - key or property in page config object
 * @param manifestKey - key or property in manifest
 */
export declare function deletePersonalizationProperty(manifestSection: unknown, _configObject: object, _key: string, manifestKey: string): void;
/**
 * Imports enableMassEdit settings from the manifest section.
 *
 * @param manifestSection - The section of the manifest containing multi-edit settings.
 * @returns The enableMassEdit manifest boolean/object or undefined if not present.
 */
export declare function importEnableMassEdit(manifestSection: any): v4.EnableMassEdit;
/**
 * Exports enableMassEdit settings from the config.
 *
 * @param manifestSection - The section of the manifest containing multi-edit settings.
 * @param configObject - section in config.json describing the table settings.
 * @param key - key or property in config.json.
 */
export declare function exportEnableMassEdit(manifestSection: unknown, configObject: unknown, key: string): void;
/**
 * Sync class for PersonalizationType.
 */
export declare class PersonalizationType implements v4.PersonalizationType {
    column?: boolean;
    sort?: boolean;
    filter?: boolean;
}
export declare class ViewPersonalizationType implements v4.ViewPersonalizationType {
    column?: boolean;
    sort?: boolean;
    filter?: boolean;
}
/****************************************
 * Sync class for QuickVariantSelectionV4
 */
export declare class QuickVariantSelectionV4 implements v4.QuickVariantSelectionV4 {
    paths: v4.AnnotationPathAsObject[];
    hideTableTitle?: boolean;
    showCounts?: boolean;
}
/****************************************
 * Sync class for TableSettings
 */
export declare class TableSettings extends Decorator implements v4.TableSettings {
    /**
     * Returns the schema definition name to use for applying decorators.
     * The schema uses 'Table' as the definition name, not 'TableSettings'.
     *
     * @returns The class name 'Table'
     */
    getClassName(): string;
    type?: v4.TableTypeV4;
    personalization?: PersonalizationType | boolean;
    selectionMode?: v4.SelectionMode;
    selectAll?: boolean;
    selectionLimit?: number;
    enableExport?: boolean;
    quickVariantSelection?: QuickVariantSelectionV4;
    condensedTableLayout?: boolean;
    hierarchyQualifier?: string;
    widthIncludingColumnHeader?: boolean;
    disableCopyToClipboard?: boolean;
}
/****************************************
 * Sync class for ALPChartView (renamed due to indirection in app schema)
 */
export declare class ALPChart extends Decorator implements v4.ALPChartView {
    annotationPath: string;
    toolBar?: v4.ViewChartToolBar;
}
export declare class CommonViewSettings extends Decorator implements v4.CommonViewSettings {
    key: string;
    index: number;
    annotationPath: string;
    entitySet?: string;
}
/****************************************
 * Sync class for view table settings
 */
export declare class TableViewSettings extends CommonViewSettings implements v4.TableSettings {
    /**
     * Returns the schema definition name to use for applying decorators.
     * The schema uses 'LRTableView' as the definition name for table view settings.
     *
     * @returns The class name 'LRTableView'
     */
    getClassName(): string;
    type?: v4.TableTypeV4;
    personalization?: ViewPersonalizationType | boolean;
    selectionMode?: v4.SelectionMode;
    selectAll?: boolean;
    selectionLimit?: number;
    enableExport?: boolean;
    quickVariantSelection?: QuickVariantSelectionV4;
    condensedTableLayout?: boolean;
    widthIncludingColumnHeader?: boolean;
    hierarchyQualifier?: string;
    disableCopyToClipboard?: boolean;
    enableMassEdit?: v4.EnableMassEdit;
    creationMode?: TableCreationModeLR;
    analyticalConfiguration?: ViewAnalyticalConfiguration;
}
/****************************************
 * Sync class for ALPTableView (renamed due to indirection in app schema)
 */
export declare class ALPTable extends TableViewSettings implements v4.ALPTableView {
    annotationPath: string;
    initialLoad?: v4.InitialLoadType;
    toolBar?: ToolBar;
    columns?: v4.ViewColumns;
}
/****************************************
 * Sync class for LRChartView
 */
export declare class LRChartView extends CommonViewSettings implements v4.LRChartView {
    toolBar?: v4.ViewChartToolBar;
    visible?: boolean;
}
/****************************************
 * Sync class for LRTableView
 */
export declare class LRTableView extends TableViewSettings {
    keepPreviousPersonalization?: boolean;
    visible?: boolean;
    toolBar?: ToolBar;
    analyticalConfiguration?: ViewAnalyticalConfiguration;
    popinLayout?: PopinLayout;
}
export declare class TableViewExtension implements v4.TableViewExtension {
    key: string;
    index: number;
    label?: string;
    template: string;
    visible?: boolean;
}
export declare class AnalyticalConfiguration extends Decorator implements v4.AnalyticalConfiguration {
    aggregationOnLeafLevel?: boolean;
}
export declare class ViewAnalyticalConfiguration extends Decorator implements v4.ViewAnalyticalConfiguration {
    aggregationOnLeafLevel?: boolean;
}
/**
 * LR multi-view: own class for properties on views' level
 */
export declare class MultiTableModeV4 implements v4.MultiTableModeV4 {
    [key: string]: v4.ViewTypeV4;
    showCounts?: boolean;
}
/****************************************
 * Sync class for Table
 */
export declare class Table extends TableSettings implements v4.Table {
    annotationPath?: string;
    views?: MultiTableModeV4;
    initialLoad?: v4.InitialLoadType;
    toolBar?: ToolBar;
    enableMassEdit?: v4.EnableMassEdit;
    creationMode?: TableCreationModeLR;
    analyticalConfiguration?: AnalyticalConfiguration;
    popinLayout?: PopinLayout;
}
export declare class TableCreationModeLR extends Decorator implements v4.TableCreationModeLR {
    /**
     * Returns the schema definition name to use for applying decorators.
     *
     * @returns The class name 'TableCreationModeLR'
     */
    getClassName(): string;
    name?: v4.TableCreationModeType.NewPage | v4.TableCreationModeType.CreationDialog;
    creationFields?: string[];
    createInPlace?: boolean;
    isCreateEnabled?: string;
}
//# sourceMappingURL=Table.d.ts.map