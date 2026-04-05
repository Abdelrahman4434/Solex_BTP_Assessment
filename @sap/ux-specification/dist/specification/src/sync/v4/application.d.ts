import type { v4, ViewTypes, Target, Manifest, Application, Dependencies, CloudDevAdaptationStatus } from '@sap/ux-specification-types';
import type { EmptyOption } from '@sap/ux-specification-types/src/v4/controls/Table';
import type { TableCreationModeType } from '@sap/ux-specification-types/dist/v4/controls/ObjectPageTable';
import type { PopinLayout } from 'sap/m/library';
/**
 * Returns the sync path for a given page name array.
 *
 * @param {string[]} pageName - Array containing the page name(s) for which to generate the manifest path.
 * @returns {string} The sync path string for the specified page.
 */
export declare const getPathForPage: (pageName: string[]) => string;
export declare const getSettingsPathForPage: (pageName: string[]) => string;
export declare const getSettingsPathForLRViewsPaths: (pageName: string[]) => string;
export declare const getSettingsPathForHeaderOP: (pageName: string[]) => string;
export declare const getSettingsPathForFooterOP: (pageName: string[]) => string;
export declare const getControlConfigurationPath: (pageName: string[]) => string;
export declare const getHeaderFacetSettingPath: (pageName: string[], _manifest: Manifest, sectionId: string) => string;
export declare const getSelectionFieldsPath: (pageName: string[]) => string;
/**
 * Common function that calculates the path in manifest for custom filter field.
 *
 * @param pageName - page name in manifest
 * @param _manifest - manifest (not used)
 * @param _sectionId - section id (not used)
 * @param filterFieldId - Custom filter field id
 * @returns - path as string
 */
export declare const getCustomFilterFieldFieldPath: (pageName: string[], _manifest: Manifest, _sectionId: string, filterFieldId: any) => string;
export declare const getFilterFieldPath: (pageName: string[], _manifest: Manifest, _targetAnnotationEncoded: string, fieldId: string) => string;
/**
 * Common function that calculates the path in manifest for table settings of a list report or ALP table view.
 *
 * @param pageName - page name in manifest
 * @param _manifest - manifest (not used)
 * @param _targetAnnotationEncoded - encoded target annotation (not used)
 * @param _viewKey - view key (not used)
 * @param targetAnnotation - target annotation, i.e. the line item (with or without qualifier)
 * @returns - path as string
 */
export declare const getTableSettingsPathForView: (pageName: string[], _manifest: Manifest, _targetAnnotationEncoded: string, _viewKey: string, targetAnnotation: string) => string;
/**
 * Generates the path for table settings within a list report (LR) configuration.
 *
 * This function determines the appropriate path for accessing the table settings
 * based on whether a target annotation is provided or other fallback logic for
 * primary and secondary views.
 *
 * @param pageName The array of strings representing the current page's hierarchy in the manifest.
 * @param manifest The manifest object containing the application configuration.
 * @param targetAnnotationEncoded The encoded string of the target annotation for the table settings.
 * @param columnKey The key of the column for which table settings are to be determined.
 * @param targetAnnotation The decoded target annotation string, if available.
 * @param configObject A record object containing additional configuration details.
 * @param originalIds An array of original table IDs used for validation in creating a view.
 * @returns The path to the table settings as a string. Returns an empty string when the
 *          table is part of a secondary view with missing settings or fallback to a primary view default path.
 */
export declare const getTableSettingsPathForLR: (pageName: string[], manifest: Manifest, targetAnnotationEncoded: string, columnKey: string, targetAnnotation: string, configObject: Record<string, unknown>, originalIds: string[]) => string;
export declare const getQuickVariantPath: (pageName: string[], manifest: Manifest, targetAnnotationEncoded: string, columnKey: string, targetAnnotation: string, configObject: Record<string, unknown>, originalIds: string[]) => string;
export declare const getColumnsPathForView: (pageName: string[], _manifest: Manifest, _targetAnnotationEncoded: string, columnKey: string, targetAnnotation: string) => string | undefined;
/**
 * Returns the sync path for the position of a column in a view.
 *
 * @param pageName page name in manifest
 * @param manifest manifest object containing application configuration.
 * @param sectionId section identifier within the view.
 * @param columnKey key identifying the column.
 * @param targetAnnotation annotation term for the target.
 * @returns Sync path string for the column position, or undefined if not found.
 */
export declare const getColumnPositionPathForView: (pageName: string[], manifest: Manifest, sectionId: string, columnKey: string, targetAnnotation: string) => string | undefined;
export declare const getColumnsPathForLR: (pageName: string[], manifest: Manifest, targetAnnotationEncoded: string, columnKey: string, targetAnnotation: string) => string | undefined;
export declare const getActionsPathForView: (pageName: string[], _manifest: Manifest, _targetAnnotationEncoded: string, columnKey: string, targetAnnotation: string) => string;
export declare const getActionsPathForLR: (pageName: string[], manifest: Manifest, targetAnnotationEncoded: string, columnKey: string, targetAnnotation: string) => string;
/**
 * Returns the sync path for the position of a action in a view.
 *
 * @param pageName page name in manifest
 * @param manifest manifest object containing application configuration.
 * @param sectionId section identifier within the view.
 * @param actionKey key identifying the action.
 * @param targetAnnotation annotation term for the target.
 * @returns Sync path string for the action position, or undefined if not found.
 */
export declare const getActionPositionPathForView: (pageName: string[], manifest: Manifest, sectionId: string, actionKey: string, targetAnnotation: string) => string | undefined;
export declare const getGroupedActionsPathForLR: (pageName: string[], manifest: Manifest, targetAnnotationEncoded: string, columnKey: string, targetAnnotation: string, configObject: object, originalIds: string[]) => string;
export declare const getGroupedActionsPathForOP: (pageName: string[], manifest: Manifest, sectionId: string, columnKey: string, sectionIdEncoded: string, configObject: object, originalIds: string[]) => string;
export declare const getColumnsPathForOP: (pageName: string[], _manifest: Manifest, sectionId: string, columnKey: string) => string;
export declare const getActionsPathForOP: (pageName: string[], _manifest: Manifest, sectionId: string, columnKey: string) => string;
export declare const getHeaderActionsPath: (pageName: string[], _manifest: Manifest, sectionId: string, columnKey?: string) => string;
export declare const getAdditionalSemanticObjectPath: (pageName: string[], _manifest: Manifest, sectionId: string, columnKey: string) => string;
export declare const getFooterActionsPath: (pageName: string[], _manifest: Manifest, sectionId: string, columnKey: string) => string;
export declare const getTableSettingsPathForOP: (pageName: string[], _manifest: Manifest, sectionId: string) => string;
export declare const getTableAnalyticalConfigurationPathForLR: (pageName: string[], manifest: Manifest, targetAnnotationEncoded: string, columnKey: string, targetAnnotation: string, configObject: Record<string, unknown>, originalIds: string[]) => string;
/**
 * Common function that calculates the path in manifest for analytical configuration of a list report or ALP table view.
 *
 * @param pageName - page name in manifest
 * @param _manifest - manifest (not used)
 * @param _targetAnnotationEncoded - encoded target annotation (not used)
 * @param _viewKey - view key (not used)
 * @param targetAnnotation - target annotation, i.e. the line item (with or without qualifier)
 * @returns - path as string
 */
export declare const getTableAnalyticalConfigurationForView: (pageName: string[], _manifest: Manifest, _targetAnnotationEncoded: string, _viewKey: string, targetAnnotation: string) => string;
export declare const getTableAnalyticalConfigurationPathForOP: (pageName: string[], _manifest: Manifest, sectionId: string) => string;
export declare const getCustomSectionPath: (pageName: string[], _manifest: Manifest, sectionId: string, pathPart?: string) => string;
export declare const getCustomSectionActionPath: (pageName: string[], _manifest: Manifest, sectionId: string, actionId: string) => string;
export declare const getObjectPageCustomHeaderSectionPath: (pageName: string[], _manifest: Manifest, sectionId: string, pathPart?: string) => string;
export declare const getCustomSubSectionPath: (pageName: string[], manifest: Manifest, sectionId: string, pathPart?: string, targetAnnotation?: string, configObject?: object, originalIds?: string[]) => string;
/**
 * Function that calculates the path in manifest for custom field.
 *
 * @param pageName - page name in manifest
 * @param _manifest - manifest (not used)
 * @param targetAnnotation - field group annotation path
 * @param fieldKey - field key
 * @returns - path as string
 */
export declare const getCustomFieldPath: (pageName: string[], _manifest: Manifest, targetAnnotation: string, fieldKey: string) => string;
export declare class ApplicationV4 implements Application {
    $schema?: string;
    id?: string;
    pages?: v4.Pages;
    home?: string;
    target?: Target;
    settings?: AppSettings;
}
export declare class AppSettings implements v4.AppSettings {
    title?: string;
    description?: string;
    cloudDevAdaptationStatus?: CloudDevAdaptationStatus;
    flexibleColumnLayout?: v4.FlexibleColumnLayoutV4;
    flexEnabled?: boolean;
    dependencies?: Dependencies;
    hideDraft?: v4.HideDraft;
    defaultCreationMode?: TableCreationModeType.InlineCreationRows | EmptyOption;
    viewType?: ViewTypes;
    path?: string;
    controllerExtensions?: v4.ControllerExtensions;
    defaultPopinLayout?: PopinLayout;
    enableLazyLoading?: boolean;
}
//# sourceMappingURL=application.d.ts.map