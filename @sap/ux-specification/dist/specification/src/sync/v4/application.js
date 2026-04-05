"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppSettings = exports.ApplicationV4 = exports.getCustomFieldPath = exports.getCustomSubSectionPath = exports.getObjectPageCustomHeaderSectionPath = exports.getCustomSectionActionPath = exports.getCustomSectionPath = exports.getTableAnalyticalConfigurationPathForOP = exports.getTableAnalyticalConfigurationForView = exports.getTableAnalyticalConfigurationPathForLR = exports.getTableSettingsPathForOP = exports.getFooterActionsPath = exports.getAdditionalSemanticObjectPath = exports.getHeaderActionsPath = exports.getActionsPathForOP = exports.getColumnsPathForOP = exports.getGroupedActionsPathForOP = exports.getGroupedActionsPathForLR = exports.getActionPositionPathForView = exports.getActionsPathForLR = exports.getActionsPathForView = exports.getColumnsPathForLR = exports.getColumnPositionPathForView = exports.getColumnsPathForView = exports.getQuickVariantPath = exports.getTableSettingsPathForLR = exports.getTableSettingsPathForView = exports.getFilterFieldPath = exports.getCustomFilterFieldFieldPath = exports.getSelectionFieldsPath = exports.getHeaderFacetSettingPath = exports.getControlConfigurationPath = exports.getSettingsPathForFooterOP = exports.getSettingsPathForHeaderOP = exports.getSettingsPathForLRViewsPaths = exports.getSettingsPathForPage = exports.getPathForPage = void 0;
const decorators_1 = require("../common/decoration/decorators");
const ux_specification_types_1 = require("@sap/ux-specification-types");
const controllerExtensions_1 = require("./sync-rules/controllerExtensions");
/**
 * Returns the sync path for a given page name array.
 *
 * @param {string[]} pageName - Array containing the page name(s) for which to generate the manifest path.
 * @returns {string} The sync path string for the specified page.
 */
const getPathForPage = (pageName) => {
    return `sap.ui5/routing/targets/${pageName[0]}`;
};
exports.getPathForPage = getPathForPage;
const getSettingsPathForPage = (pageName) => {
    return `${(0, exports.getPathForPage)(pageName)}/options/settings`;
};
exports.getSettingsPathForPage = getSettingsPathForPage;
const getSettingsPathForLRViewsPaths = (pageName) => {
    return (0, exports.getSettingsPathForPage)(pageName) + `/views/paths`;
};
exports.getSettingsPathForLRViewsPaths = getSettingsPathForLRViewsPaths;
const getSettingsPathForHeaderOP = (pageName) => {
    return (0, exports.getSettingsPathForPage)(pageName) + `/content/header`;
};
exports.getSettingsPathForHeaderOP = getSettingsPathForHeaderOP;
const getSettingsPathForFooterOP = (pageName) => {
    return (0, exports.getSettingsPathForPage)(pageName) + `/content/footer`;
};
exports.getSettingsPathForFooterOP = getSettingsPathForFooterOP;
const getControlConfigurationPath = (pageName) => {
    return (0, exports.getSettingsPathForPage)(pageName) + '/controlConfiguration';
};
exports.getControlConfigurationPath = getControlConfigurationPath;
const getHeaderFacetSettingPath = (pageName, _manifest, sectionId) => {
    return (0, exports.getControlConfigurationPath)(pageName) + `/@${"com.sap.vocabularies.UI.v1.HeaderFacets" /* UIAnnotationTerms.HeaderFacets */}/facets/${sectionId}`;
};
exports.getHeaderFacetSettingPath = getHeaderFacetSettingPath;
const getSelectionFieldsPath = (pageName) => {
    return (0, exports.getControlConfigurationPath)(pageName) + `/@${"com.sap.vocabularies.UI.v1.SelectionFields" /* UIAnnotationTerms.SelectionFields */}`;
};
exports.getSelectionFieldsPath = getSelectionFieldsPath;
/**
 * Common function that calculates the path in manifest for custom filter field.
 *
 * @param pageName - page name in manifest
 * @param _manifest - manifest (not used)
 * @param _sectionId - section id (not used)
 * @param filterFieldId - Custom filter field id
 * @returns - path as string
 */
const getCustomFilterFieldFieldPath = (pageName, _manifest, _sectionId, filterFieldId) => {
    return ((0, exports.getControlConfigurationPath)(pageName) + `/@${"com.sap.vocabularies.UI.v1.SelectionFields" /* UIAnnotationTerms.SelectionFields */}/filterFields/${filterFieldId}`);
};
exports.getCustomFilterFieldFieldPath = getCustomFilterFieldFieldPath;
const getFilterFieldPath = (pageName, _manifest, _targetAnnotationEncoded, fieldId) => {
    return (0, exports.getSelectionFieldsPath)(pageName) + `/filterFields/${fieldId}`;
};
exports.getFilterFieldPath = getFilterFieldPath;
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
const getTableSettingsPathForView = (pageName, _manifest, _targetAnnotationEncoded, _viewKey, targetAnnotation) => {
    const annotationEncoded = targetAnnotation?.replace(/\//gi, '??');
    return annotationEncoded
        ? (0, exports.getControlConfigurationPath)(pageName) + `/${annotationEncoded}/tableSettings`
        : undefined;
};
exports.getTableSettingsPathForView = getTableSettingsPathForView;
/**
 * Determines if the view is newly created based on its identifier structure and annotation state.
 *
 * This function checks if the concatenation of original identifiers starts with the specific prefix
 * 'table/views' and ensures the target annotation is undefined, indicating the view's newly created status.
 *
 * @param {string[]} originalIds - An array of strings representing original identifiers related to the view.
 * @param {string} targetAnnotation - A string representing the current annotation state of the view.
 * @returns {boolean} Returns true if the view is determined to be newly created; otherwise, false.
 */
const isNewlyCreatedView = (originalIds, targetAnnotation) => {
    return (originalIds ?? []).join('/').startsWith('table/views') && targetAnnotation === undefined;
};
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
const getTableSettingsPathForLR = (pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation, configObject, originalIds) => {
    if (targetAnnotation) {
        return (0, exports.getTableSettingsPathForView)(pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation);
    }
    else {
        const isConfigObjectEmpty = Object.keys(configObject ?? {}).length === 0;
        // If the view is newly created, and the table settings are not set, this is the secondary view. The path should be empty
        if (isConfigObjectEmpty && isNewlyCreatedView(originalIds, targetAnnotation)) {
            return '';
        }
        // The primary view may have the table settings set and it uses the default path
        return (0, exports.getControlConfigurationPath)(pageName) + `/@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}/tableSettings`;
    }
};
exports.getTableSettingsPathForLR = getTableSettingsPathForLR;
const getQuickVariantPath = (pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation, configObject, originalIds) => {
    const containerPath = (0, exports.getTableSettingsPathForLR)(pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation, configObject, originalIds);
    return containerPath ? containerPath + ux_specification_types_1.QUICKVARPATH : '';
};
exports.getQuickVariantPath = getQuickVariantPath;
const getColumnsPathForView = (pageName, _manifest, _targetAnnotationEncoded, columnKey, targetAnnotation) => {
    const annotationEncoded = targetAnnotation?.replace(/\//gi, '??');
    return annotationEncoded
        ? (0, exports.getControlConfigurationPath)(pageName) + `/${annotationEncoded}/columns/${columnKey}`
        : undefined;
};
exports.getColumnsPathForView = getColumnsPathForView;
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
const getColumnPositionPathForView = (pageName, manifest, sectionId, columnKey, targetAnnotation) => {
    const columnsPathForView = (0, exports.getColumnsPathForView)(pageName, manifest, sectionId, columnKey, targetAnnotation);
    return columnsPathForView !== undefined ? `${columnsPathForView}/position` : undefined;
};
exports.getColumnPositionPathForView = getColumnPositionPathForView;
const getColumnsPathForLR = (pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation) => {
    if (targetAnnotation) {
        return (0, exports.getColumnsPathForView)(pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation);
    }
    else {
        return (0, exports.getControlConfigurationPath)(pageName) + `/@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}/columns/${columnKey}`;
    }
};
exports.getColumnsPathForLR = getColumnsPathForLR;
const getActionsPathForView = (pageName, _manifest, _targetAnnotationEncoded, columnKey, targetAnnotation) => {
    const annotationEncoded = targetAnnotation?.replace(/\//gi, '??');
    return annotationEncoded
        ? (0, exports.getControlConfigurationPath)(pageName) + `/${annotationEncoded}/actions/${columnKey}`
        : undefined;
};
exports.getActionsPathForView = getActionsPathForView;
const getActionsPathForLR = (pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation) => {
    if (targetAnnotation) {
        return (0, exports.getActionsPathForView)(pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation);
    }
    else {
        return (0, exports.getControlConfigurationPath)(pageName) + `/@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}/actions/${columnKey}`;
    }
};
exports.getActionsPathForLR = getActionsPathForLR;
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
const getActionPositionPathForView = (pageName, manifest, sectionId, actionKey, targetAnnotation) => {
    const actionsPathForView = (0, exports.getActionsPathForView)(pageName, manifest, sectionId, actionKey, targetAnnotation);
    return actionsPathForView !== undefined ? `${actionsPathForView}/position` : undefined;
};
exports.getActionPositionPathForView = getActionPositionPathForView;
const getGroupedActionsPathForLR = (pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation, configObject, originalIds) => {
    // views
    if (originalIds && ['overflowGroup', 'priority'].includes(originalIds[originalIds.length - 1])) {
        columnKey = originalIds[originalIds.length - 2];
    }
    if (targetAnnotation) {
        const annotationEncoded = targetAnnotation?.replace(/\//gi, '??');
        return (0, exports.getControlConfigurationPath)(pageName) + `/${annotationEncoded}/actions/${columnKey}`;
    }
    // no views
    return (0, exports.getControlConfigurationPath)(pageName) + `/@${"com.sap.vocabularies.UI.v1.LineItem" /* UIAnnotationTerms.LineItem */}/actions/${columnKey}`;
};
exports.getGroupedActionsPathForLR = getGroupedActionsPathForLR;
const getGroupedActionsPathForOP = (pageName, manifest, sectionId, columnKey, sectionIdEncoded, configObject, originalIds) => {
    if (originalIds && ['overflowGroup', 'priority'].includes(originalIds[originalIds.length - 1])) {
        columnKey = originalIds[originalIds.length - 2];
    }
    const columnKeyEncoded = columnKey.replace(/\//gi, '??');
    if (sectionId) {
        const sectiondIdEncoded = sectionId.replace(/\//gi, '??');
        return (0, exports.getControlConfigurationPath)(pageName) + `/${sectiondIdEncoded}/actions/${columnKeyEncoded}`;
    }
    else {
        // header action group
        return (0, exports.getSettingsPathForHeaderOP)(pageName) + `/actions/${columnKeyEncoded}`;
    }
};
exports.getGroupedActionsPathForOP = getGroupedActionsPathForOP;
const getColumnsPathForOP = (pageName, _manifest, sectionId, columnKey) => {
    return (0, exports.getControlConfigurationPath)(pageName) + `/${sectionId}/columns/${columnKey}`;
};
exports.getColumnsPathForOP = getColumnsPathForOP;
const getActionsPathForOP = (pageName, _manifest, sectionId, columnKey) => {
    return (0, exports.getControlConfigurationPath)(pageName) + `/${sectionId}/actions/${columnKey.replace('/', '??')}`;
};
exports.getActionsPathForOP = getActionsPathForOP;
const getHeaderActionsPath = (pageName, _manifest, sectionId, columnKey = '') => {
    return (0, exports.getSettingsPathForHeaderOP)(pageName) + `/actions/${columnKey.replace('/', '??')}`;
};
exports.getHeaderActionsPath = getHeaderActionsPath;
const getAdditionalSemanticObjectPath = (pageName, _manifest, sectionId, columnKey) => {
    return (0, exports.getSettingsPathForPage)(pageName) + `/additionalSemanticObjects/${columnKey.replace('/', '??')}`;
};
exports.getAdditionalSemanticObjectPath = getAdditionalSemanticObjectPath;
const getFooterActionsPath = (pageName, _manifest, sectionId, columnKey) => {
    return (0, exports.getSettingsPathForFooterOP)(pageName) + `/actions/${columnKey.replace('/', '??')}`;
};
exports.getFooterActionsPath = getFooterActionsPath;
const getTableSettingsPathForOP = (pageName, _manifest, sectionId) => {
    return (0, exports.getControlConfigurationPath)(pageName) + `/${sectionId}/tableSettings`;
};
exports.getTableSettingsPathForOP = getTableSettingsPathForOP;
const getTableAnalyticalConfigurationPathForLR = (pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation, configObject, originalIds) => {
    return ((0, exports.getTableSettingsPathForLR)(pageName, manifest, targetAnnotationEncoded, columnKey, targetAnnotation, configObject, originalIds) + `/analyticalConfiguration`);
};
exports.getTableAnalyticalConfigurationPathForLR = getTableAnalyticalConfigurationPathForLR;
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
const getTableAnalyticalConfigurationForView = (pageName, _manifest, _targetAnnotationEncoded, _viewKey, targetAnnotation) => {
    const tableSettingsPathForView = (0, exports.getTableSettingsPathForView)(pageName, _manifest, _targetAnnotationEncoded, _viewKey, targetAnnotation);
    return tableSettingsPathForView !== undefined ? `${tableSettingsPathForView}/analyticalConfiguration` : undefined;
};
exports.getTableAnalyticalConfigurationForView = getTableAnalyticalConfigurationForView;
const getTableAnalyticalConfigurationPathForOP = (pageName, _manifest, sectionId) => {
    return (0, exports.getTableSettingsPathForOP)(pageName, _manifest, sectionId) + `/analyticalConfiguration`;
};
exports.getTableAnalyticalConfigurationPathForOP = getTableAnalyticalConfigurationPathForOP;
const getCustomSectionPath = (pageName, _manifest, sectionId, pathPart) => {
    let path = (0, exports.getSettingsPathForPage)(pageName) + `/content/body/sections/${sectionId}`;
    if (pathPart) {
        path += '/' + pathPart;
    }
    return path;
};
exports.getCustomSectionPath = getCustomSectionPath;
const getCustomSectionActionPath = (pageName, _manifest, sectionId, actionId) => {
    return (0, exports.getSettingsPathForPage)(pageName) + `/content/body/sections/${sectionId}/actions/${actionId}`;
};
exports.getCustomSectionActionPath = getCustomSectionActionPath;
const getObjectPageCustomHeaderSectionPath = (pageName, _manifest, sectionId, pathPart) => {
    let path = (0, exports.getSettingsPathForPage)(pageName) + `/content/header/facets/${sectionId}`;
    if (pathPart) {
        path += '/' + pathPart;
    }
    return path;
};
exports.getObjectPageCustomHeaderSectionPath = getObjectPageCustomHeaderSectionPath;
const getCustomSubSectionPath = (pageName, manifest, sectionId, pathPart, targetAnnotation, configObject, originalIds) => {
    let parent = sectionId;
    if (originalIds) {
        if (originalIds[0] === 'sections' && originalIds[1]) {
            parent = originalIds[1];
        }
        if (originalIds[2] === 'subsections' && originalIds[3]) {
            pathPart = `subSections/${originalIds[3]}`;
        }
    }
    let path = (0, exports.getSettingsPathForPage)(pageName) + `/content/body/sections/${parent}`;
    if (pathPart) {
        path += '/' + pathPart;
    }
    return path;
};
exports.getCustomSubSectionPath = getCustomSubSectionPath;
/**
 * Function that calculates the path in manifest for custom field.
 *
 * @param pageName - page name in manifest
 * @param _manifest - manifest (not used)
 * @param targetAnnotation - field group annotation path
 * @param fieldKey - field key
 * @returns - path as string
 */
const getCustomFieldPath = (pageName, _manifest, targetAnnotation, fieldKey) => {
    return (0, exports.getControlConfigurationPath)(pageName) + `/${targetAnnotation}/fields/${fieldKey}`;
};
exports.getCustomFieldPath = getCustomFieldPath;
class ApplicationV4 {
}
exports.ApplicationV4 = ApplicationV4;
__decorate([
    (0, decorators_1.childId)('settings')
], ApplicationV4.prototype, "settings", void 0);
class AppSettings {
}
exports.AppSettings = AppSettings;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.app'
        }
    })
], AppSettings.prototype, "title", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.app'
        }
    })
], AppSettings.prototype, "description", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.fiori'
        }
    })
], AppSettings.prototype, "cloudDevAdaptationStatus", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.ui5/routing/config'
        }
    }),
    (0, decorators_1.validity)({
        since: '1.78.0'
    })
], AppSettings.prototype, "flexibleColumnLayout", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.ui5'
        }
    }),
    (0, decorators_1.validity)({
        since: '1.56.0'
    })
], AppSettings.prototype, "flexEnabled", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.ui5'
        }
    })
], AppSettings.prototype, "dependencies", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.fe/app',
            export: (manifestSection, configObject, key) => {
                if (typeof manifestSection !== 'object') {
                    return;
                }
                const setting = configObject?.['settings']?.[key];
                if (setting && Object.keys(setting).length !== 0) {
                    manifestSection[key] = setting;
                }
                else if (key in manifestSection) {
                    delete manifestSection[key];
                }
            }
        }
    }),
    (0, decorators_1.validity)({
        since: '1.134.0'
    })
], AppSettings.prototype, "hideDraft", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.fe/macros/table',
            export: (manifestSection, configObject, key) => {
                if (typeof manifestSection !== 'object') {
                    return;
                }
                const setting = configObject?.['settings']?.[key];
                if (setting && Object.keys(setting).length !== 0) {
                    manifestSection[key] = setting;
                }
                else if (key in manifestSection) {
                    delete manifestSection[key];
                }
            }
        }
    }),
    (0, decorators_1.validity)({
        since: '1.136.5'
    })
], AppSettings.prototype, "defaultCreationMode", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.ui5/routing/config'
        }
    })
], AppSettings.prototype, "viewType", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.ui5/routing/config'
        }
    })
], AppSettings.prototype, "path", void 0);
__decorate([
    (0, decorators_1.syncRule)(controllerExtensions_1.controllerExtensions)
], AppSettings.prototype, "controllerExtensions", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.fe/macros/table',
            export: (manifestSection, configObject, key) => {
                if (typeof manifestSection !== 'object') {
                    return;
                }
                const setting = configObject?.['settings']?.[key];
                if (setting && Object.keys(setting).length !== 0) {
                    manifestSection[key] = setting;
                }
                else if (key in manifestSection) {
                    delete manifestSection[key];
                }
            }
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    })
], AppSettings.prototype, "defaultPopinLayout", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => 'sap.fe/app'
        }
    }),
    (0, decorators_1.validity)({
        since: '1.144.0'
    })
], AppSettings.prototype, "enableLazyLoading", void 0);
//# sourceMappingURL=application.js.map