"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableCreationModeLR = exports.Table = exports.MultiTableModeV4 = exports.ViewAnalyticalConfiguration = exports.AnalyticalConfiguration = exports.TableViewExtension = exports.LRTableView = exports.LRChartView = exports.ALPTable = exports.TableViewSettings = exports.CommonViewSettings = exports.ALPChart = exports.TableSettings = exports.QuickVariantSelectionV4 = exports.ViewPersonalizationType = exports.PersonalizationType = void 0;
exports.deleteCreationModeProperty = deleteCreationModeProperty;
exports.exportCreationModeProperty = exportCreationModeProperty;
exports.exportCreationModeCreationFieldsProperty = exportCreationModeCreationFieldsProperty;
exports.importCreationModeCreationFieldsProperty = importCreationModeCreationFieldsProperty;
exports.importCreationMode = importCreationMode;
exports.checkViewOrder = checkViewOrder;
exports.exportPersonalization = exportPersonalization;
exports.exportPersonalizationProperty = exportPersonalizationProperty;
exports.deletePersonalizationProperty = deletePersonalizationProperty;
exports.importEnableMassEdit = importEnableMassEdit;
exports.exportEnableMassEdit = exportEnableMassEdit;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const ux_specification_types_2 = require("@sap/ux-specification-types");
const common_1 = require("../../../common");
const decorators_1 = require("../../../common/decoration/decorators");
const decorator_paths_1 = require("../../../common/decoration/decorator-paths");
const application_1 = require("../../application");
const utils_1 = require("../../utils/utils");
const sync_rules_1 = require("../../sync-rules");
/**
 * Deletes a property from the creation mode section of the manifest object,
 * and removes the creation mode section if it becomes empty.
 *
 * @param {unknown} manifestSection - The section of the manifest object containing the creation mode property.
 * @param {object} _configObject - Configuration object (not currently used in the method logic).
 * @param {string} _key - The specific key (not currently used in the method logic).
 * @param {string} manifestKey - The key identifying the property in the creation mode to be deleted.
 */
function deleteCreationModeProperty(manifestSection, _configObject, _key, manifestKey) {
    if (typeof manifestSection[ux_specification_types_1.PropertyName.creationMode] === 'object' &&
        manifestSection[ux_specification_types_1.PropertyName.creationMode][manifestKey] !== undefined) {
        delete manifestSection[ux_specification_types_1.PropertyName.creationMode][manifestKey];
        if (Object.keys(manifestSection[ux_specification_types_1.PropertyName.creationMode]).length === 0) {
            delete manifestSection[ux_specification_types_1.PropertyName.creationMode];
        }
    }
}
/**
 * Exports the creation mode property from a given configuration object to a manifest section.
 *
 * @param {unknown} manifestSection - The section of the manifest where the creation mode property will be updated.
 * @param {unknown} configObject - The configuration object containing the creation mode property.
 * @param {string} key - The key used to identify the specific property within the creation mode section.
 */
function exportCreationModeProperty(manifestSection, configObject, key) {
    if (manifestSection[ux_specification_types_1.PropertyName.creationMode] && typeof manifestSection[ux_specification_types_1.PropertyName.creationMode] === 'object') {
        manifestSection[ux_specification_types_1.PropertyName.creationMode][key] = configObject[key];
    }
}
/**
 * Updates the 'creationMode.creationFields' property in the manifestSection object
 * by joining the 'creationFields' array from the configObject into a string separated by commas.
 *
 * @param {object} manifestSection - The object where the 'creationMode.creationFields' property will be updated.
 * @param {object} configObject - The object containing the 'creationFields' array to be used for the update.
 */
function exportCreationModeCreationFieldsProperty(manifestSection, configObject) {
    if (manifestSection[ux_specification_types_1.PropertyName.creationMode]) {
        const creationFields = configObject[ux_specification_types_1.PropertyName.creationFields] ?? [];
        if (creationFields.length > 0) {
            manifestSection[ux_specification_types_1.PropertyName.creationMode][ux_specification_types_1.PropertyName.creationFields] = creationFields
                .map((field) => field.replace(utils_1.FIELD_SEPARATOR, utils_1.QUALIFIER_SEPARATOR))
                .join(',');
        }
        else {
            delete manifestSection[ux_specification_types_1.PropertyName.creationMode][ux_specification_types_1.PropertyName.creationFields];
        }
    }
}
/**
 * Extracts and processes the `creationFields` property from the provided manifest section.
 *
 * @param {object[]} manifestSection - An array of objects representing the manifest section,
 * where the `creationFields` property might exist.
 * @returns {string[] | undefined} An array of strings representing the split values of the `creationFields`
 * property if it exists and is a valid string, otherwise `undefined`.
 */
function importCreationModeCreationFieldsProperty(manifestSection) {
    const creationFields = manifestSection?.[ux_specification_types_1.PropertyName.creationFields];
    if (creationFields !== undefined && typeof creationFields === 'string') {
        return creationFields === ''
            ? []
            : creationFields.split(',').map((field) => field.replace(utils_1.QUALIFIER_SEPARATOR, utils_1.FIELD_SEPARATOR));
    }
    return undefined;
}
/**
 * Sync rule for importing personalization. This function performs an implicit conversion of a former boolean value to the new object representation.
 *
 * @param tableSettings - table settings in manifest, to be analyzed
 * @returns - object representing the value(s) for the config file
 */
function importCreationMode(tableSettings) {
    const value = structuredClone(tableSettings?.[ux_specification_types_1.PropertyName.creationMode]);
    const creationFields = value?.[ux_specification_types_1.PropertyName.creationFields];
    if (creationFields !== undefined && typeof creationFields === 'string') {
        value[ux_specification_types_1.PropertyName.creationFields] =
            creationFields === ''
                ? []
                : creationFields.split(',').map((field) => field.replace(utils_1.QUALIFIER_SEPARATOR, utils_1.FIELD_SEPARATOR));
    }
    return value;
}
/**
 * Special edition of the global function getManifestSectionByPathV4 that initializes the views array if empty.
 *
 * @param manifest - manifest.json
 * @param path - path to the views array in manifest
 * @returns the paths array of the views
 */
const getManifestSectionByPathV4 = (manifest, path) => {
    let manifestSection = manifest;
    for (const element of path.split('/')) {
        if (!manifestSection[element]) {
            if (element === 'paths') {
                manifestSection[element] = [];
            }
            else {
                manifestSection[element] = {};
            }
        }
        manifestSection = manifestSection[element];
    }
    return manifestSection;
};
/**
 * Common function for determining the path in manifest of a list report view's path.
 *
 * @param pageName - page name in manifest
 * @param manifest - manifest.json
 * @param _targetAnnotationEncoded - target annotation (not used here)
 * @param viewKey - value of the key property of the view
 * @param _targetAnnotation - target annotation used for additional configuration
 * @param configObject - configuration object containing key-value pairs for the view
 * @returns the path to the entry in manifest
 */
function getSettingsPathForLRViewsPath(pageName, manifest, _targetAnnotationEncoded, viewKey, _targetAnnotation, configObject) {
    const viewsPath = (0, application_1.getSettingsPathForLRViewsPaths)(pageName);
    const manifestSection = getManifestSectionByPathV4(JSON.parse(JSON.stringify(manifest)), viewsPath);
    let path;
    for (let index = 0; index < manifestSection.length; index++) {
        const view = manifestSection[index];
        if (view && (view[ux_specification_types_2.SchemaTag.key] === configObject?.['key'] || view[ux_specification_types_2.SchemaTag.key] === viewKey)) {
            path = `${viewsPath}/[]/${index}`;
            break;
        }
    }
    if (!path) {
        path = `${viewsPath}/[]`;
    }
    return path;
}
/**
 * Subroutine of checkViewOrder that creates a new list of views for the manifest with updated order.
 *
 * @param manifestSection - The section of the manifest containing the views.
 * @param keyInConfig - The key of the view in the configuration object.
 * @param newIndex - The new index for the view in the manifest.
 * @param minIndex - The minimum index of the range to be reordered.
 * @param maxIndex - The maximum index of the range to be reordered.
 * @param direction - The direction of reordering, where -1 indicates moving down and 1 indicates moving up.
 * @returns A new array of objects representing the reordered views.
 */
function fillNewlyOrderedViews(manifestSection, keyInConfig, newIndex, minIndex, maxIndex, direction) {
    const newlyOrderedViews = JSON.parse(JSON.stringify(manifestSection));
    const viewKeys = Object.keys(manifestSection);
    for (const index of viewKeys) {
        const indexInManifest = Number(index);
        const view = manifestSection[index];
        if (keyInConfig === view['key']) {
            newlyOrderedViews[newIndex] = view;
        }
        else {
            if (indexInManifest >= minIndex && indexInManifest <= maxIndex) {
                newlyOrderedViews[Math.max(0, indexInManifest + direction)] = view;
            }
            else {
                newlyOrderedViews[index] = view;
            }
        }
    }
    return newlyOrderedViews;
}
/**
 * If a view index was changed we need to adapt the order of views in manifest.
 *
 * @param manifestSection - section in manifest comprising the table settings
 * @param configObject - section in config.json describing the table settings
 */
function checkViewOrder(manifestSection, configObject) {
    const keyInConfig = configObject['key'];
    const oldIndex = manifestSection.findIndex((view) => {
        return view?.['key'] === keyInConfig;
    });
    const newIndex = configObject['index'];
    if (oldIndex > -1 && oldIndex !== newIndex) {
        const direction = newIndex > oldIndex ? -1 : 1;
        const minIndex = Math.min(Number(oldIndex), newIndex);
        const maxIndex = Math.max(Number(oldIndex), newIndex);
        const newlyOrderedViews = fillNewlyOrderedViews(manifestSection, keyInConfig, newIndex, minIndex, maxIndex, direction);
        for (const index of Object.keys(newlyOrderedViews)) {
            manifestSection[index] = newlyOrderedViews[index];
        }
    }
}
/**
 * Common sync rule function for export of creation for personalization object.
 *
 * @param manifestSection - section in manifest comprising the table settings
 * @param configObject - section in config.json describing the table settings
 * @param key - key or property in config.json
 * @param manifestKey - key or property in manifest
 */
function exportPersonalization(manifestSection, configObject, key, manifestKey) {
    const value = configObject[key];
    const oldValue = manifestSection[manifestKey];
    if (typeof value === 'object') {
        if (!Object.keys(value).length && typeof oldValue === 'object' && Object.keys(oldValue).length) {
            // Delete property
            delete manifestSection[manifestKey];
        }
        else if (Object.keys(value).length) {
            manifestSection[manifestKey] = value;
        }
    }
    else if (typeof value === 'boolean') {
        manifestSection[manifestKey] = value;
    }
}
/**
 * Common sync rule function for export of personalization properties.
 *
 * @param manifestSection - section in manifest comprising the table settings
 * @param configObject - section in config.json describing the table settings
 * @param key - key or property in config.json
 * @param manifestKey - key or property in manifest
 */
function exportPersonalizationProperty(manifestSection, configObject, key, manifestKey) {
    if (typeof manifestSection['personalization'] === 'boolean' || !manifestSection['personalization']) {
        manifestSection['personalization'] = {};
    }
    manifestSection['personalization'][manifestKey] = configObject[key];
}
/**
 * Common sync rule function for the deletion of any property of personalization.
 *
 * @param manifestSection - section in manifest comprising the table settings
 * @param _configObject - page config object
 * @param _key - key or property in page config object
 * @param manifestKey - key or property in manifest
 */
function deletePersonalizationProperty(manifestSection, _configObject, _key, manifestKey) {
    if (typeof manifestSection['personalization'] === 'object' &&
        manifestSection['personalization'][manifestKey] !== undefined) {
        delete manifestSection['personalization'][manifestKey];
        if (Object.keys(manifestSection['personalization']).length === 0) {
            delete manifestSection['personalization'];
        }
    }
    else if (typeof manifestSection['personalization'] === 'string' &&
        manifestSection['personalization'] !== undefined) {
        delete manifestSection['personalization'];
    }
}
/**
 * Sync rule deleting a view if the index gets deleted.
 *
 * @param manifestSection - manifest section of the given view
 * @param configObject - section of the configuration JSON
 * @param _configPropertyKey - The key of the property in the configuration object (not used here)
 * @param _manifestKey - The key or property in the manifest (not used here)
 * @param syncRuleKey - key of the view
 * @param config - the complete config JSON
 */
function deleteView(manifestSection, configObject, _configPropertyKey, _manifestKey, syncRuleKey, config) {
    let deletedViewIndex;
    if (!configObject || Object.keys(configObject).length === 0) {
        const viewsInManifest = manifestSection;
        Object.keys(viewsInManifest).forEach((index) => {
            if (viewsInManifest[index] && viewsInManifest[index].key === syncRuleKey) {
                manifestSection[Number(index)] = {};
                deletedViewIndex = index;
            }
        });
    }
    if (deletedViewIndex) {
        const viewsInConfig = config['table']?.['views'];
        for (const key in viewsInConfig) {
            if (viewsInConfig[key].index > deletedViewIndex) {
                viewsInConfig[key].index--;
            }
        }
    }
}
/**
 * Sync rule for the import of the index of a table view.
 *
 * @param manifestSection - manifest section, as determined by synRule.path
 * @param _sectionId  - not used
 * @param _propertyKey - not used
 * @param breadcrumbs - list if breadcrumbs, includes the given view key
 * @returns index of the view in manifest, undefined if not found
 */
function determineIndexOfView(manifestSection, _sectionId, _propertyKey, breadcrumbs) {
    const viewIndex = manifestSection.findIndex((view) => view['key'] === breadcrumbs[0]);
    return viewIndex === -1 ? undefined : viewIndex;
}
/**
 * Imports enableMassEdit settings from the manifest section.
 *
 * @param manifestSection - The section of the manifest containing multi-edit settings.
 * @returns The enableMassEdit manifest boolean/object or undefined if not present.
 */
function importEnableMassEdit(manifestSection) {
    if (!manifestSection || manifestSection['enableMassEdit'] === undefined) {
        return undefined;
    }
    const manifestPart = JSON.parse(JSON.stringify(manifestSection['enableMassEdit']));
    if (typeof manifestPart === 'boolean' || Object.keys(manifestPart).length === 0) {
        return manifestPart;
    }
    // convert CSV format to array of strings
    if (manifestPart.visibleFields !== undefined) {
        manifestPart.visibleFields = manifestSection['enableMassEdit']?.['visibleFields']?.split(',');
    }
    if (manifestPart.ignoredFields !== undefined) {
        manifestPart.ignoredFields = manifestSection['enableMassEdit']?.['ignoredFields']?.split(',');
    }
    return manifestPart;
}
/**
 * Exports enableMassEdit settings from the config.
 *
 * @param manifestSection - The section of the manifest containing multi-edit settings.
 * @param configObject - section in config.json describing the table settings.
 * @param key - key or property in config.json.
 */
function exportEnableMassEdit(manifestSection, configObject, key) {
    const supportedProperties = ['visibleFields', 'ignoredFields', 'operationGroupingMode'];
    if (typeof configObject[key] === 'boolean') {
        manifestSection[key] = configObject[key];
    }
    else if (configObject[key] !== undefined) {
        const massEditTransferObject = typeof manifestSection[key] === 'object' ? { ...manifestSection[key] } : {};
        for (const propertyName of supportedProperties) {
            let exportValue;
            if (Array.isArray(configObject[key][propertyName]) && configObject[key][propertyName].length > 0) {
                // convert to the string format that is supported by manifest
                exportValue = configObject[key][propertyName].join(',');
            }
            else if (!Array.isArray(configObject[key][propertyName]) && configObject[key][propertyName]) {
                // for fields stored as simple values
                exportValue = configObject[key][propertyName];
            }
            if (exportValue !== undefined) {
                // Update with export value
                massEditTransferObject[propertyName] = exportValue;
            }
            else if (propertyName in massEditTransferObject) {
                // Property was deleted from configuration - remove in manifest
                delete massEditTransferObject[propertyName];
            }
        }
        manifestSection[key] = massEditTransferObject;
    }
}
/**
 * Sync class for PersonalizationType.
 */
class PersonalizationType {
}
exports.PersonalizationType = PersonalizationType;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR, // Here we are using path of parent to have correct value for manifestSection
            export: exportPersonalizationProperty,
            delete: deletePersonalizationProperty
        }
    })
], PersonalizationType.prototype, "column", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            export: exportPersonalizationProperty,
            delete: deletePersonalizationProperty
        }
    })
], PersonalizationType.prototype, "sort", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            export: exportPersonalizationProperty,
            delete: deletePersonalizationProperty
        }
    })
], PersonalizationType.prototype, "filter", void 0);
class ViewPersonalizationType {
}
exports.ViewPersonalizationType = ViewPersonalizationType;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView, // Here we are using path of parent to have correct value for manifestSection
            export: exportPersonalizationProperty,
            delete: deletePersonalizationProperty
        }
    })
], ViewPersonalizationType.prototype, "column", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView,
            export: exportPersonalizationProperty,
            delete: deletePersonalizationProperty
        }
    })
], ViewPersonalizationType.prototype, "sort", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            export: exportPersonalizationProperty,
            delete: deletePersonalizationProperty
        }
    })
], ViewPersonalizationType.prototype, "filter", void 0);
/****************************************
 * Sync class for QuickVariantSelectionV4
 */
class QuickVariantSelectionV4 {
}
exports.QuickVariantSelectionV4 = QuickVariantSelectionV4;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getQuickVariantPath
        }
    })
], QuickVariantSelectionV4.prototype, "paths", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getQuickVariantPath
        }
    })
], QuickVariantSelectionV4.prototype, "hideTableTitle", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getQuickVariantPath
        }
    })
], QuickVariantSelectionV4.prototype, "showCounts", void 0);
/****************************************
 * Sync class for TableSettings
 */
class TableSettings extends sync_rules_1.Decorator {
    /**
     * Returns the schema definition name to use for applying decorators.
     * The schema uses 'Table' as the definition name, not 'TableSettings'.
     *
     * @returns The class name 'Table'
     */
    getClassName() {
        return 'Table';
    }
}
exports.TableSettings = TableSettings;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7f844f1021cd4791b8f7408eac7c1cec')
], TableSettings.prototype, "type", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            export: exportPersonalization
        }
    }),
    (0, decorators_1.validity)({
        since: '1.86.0'
    })
], TableSettings.prototype, "personalization", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/116b5d82e8c545e2a56e1b51b8b0a9bd')
], TableSettings.prototype, "selectionMode", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], TableSettings.prototype, "selectAll", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], TableSettings.prototype, "selectionLimit", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/4bab6f2043814257974b52d4dafe1dcd')
], TableSettings.prototype, "enableExport", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], TableSettings.prototype, "quickVariantSelection", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/f3cc057e405c4fd58ee2ed42c557797c')
], TableSettings.prototype, "condensedTableLayout", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.117.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7f844f1021cd4791b8f7408eac7c1cec')
], TableSettings.prototype, "hierarchyQualifier", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.120.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/c0f6592a592e47f9bb6d09900de47412')
], TableSettings.prototype, "widthIncludingColumnHeader", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.123.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/c0f6592a592e47f9bb6d09900de47412')
], TableSettings.prototype, "disableCopyToClipboard", void 0);
/****************************************
 * Sync class for ALPChartView (renamed due to indirection in app schema)
 */
class ALPChart extends sync_rules_1.Decorator {
}
exports.ALPChart = ALPChart;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName) => (0, application_1.getSettingsPathForPage)(pageName) + '/views/paths/0/primary/0',
            delete: deleteView
        }
    })
], ALPChart.prototype, "annotationPath", void 0);
class CommonViewSettings extends sync_rules_1.Decorator {
}
exports.CommonViewSettings = CommonViewSettings;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath,
            delete: common_1.doNotDelete
        }
    })
], CommonViewSettings.prototype, "key", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getSettingsPathForLRViewsPaths,
            import: determineIndexOfView,
            export: (manifestSection, configObject) => {
                checkViewOrder(manifestSection, configObject);
            },
            delete: deleteView
        }
    })
], CommonViewSettings.prototype, "index", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath,
            delete: common_1.doNotDelete
        }
    })
], CommonViewSettings.prototype, "annotationPath", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath
        }
    })
], CommonViewSettings.prototype, "entitySet", void 0);
/****************************************
 * Sync class for view table settings
 */
class TableViewSettings extends CommonViewSettings {
    /**
     * Returns the schema definition name to use for applying decorators.
     * The schema uses 'LRTableView' as the definition name for table view settings.
     *
     * @returns The class name 'LRTableView'
     */
    getClassName() {
        return 'LRTableView';
    }
}
exports.TableViewSettings = TableViewSettings;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], TableViewSettings.prototype, "type", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.86.0'
    })
], TableViewSettings.prototype, "personalization", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], TableViewSettings.prototype, "selectionMode", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], TableViewSettings.prototype, "selectAll", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], TableViewSettings.prototype, "selectionLimit", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/4bab6f2043814257974b52d4dafe1dcd')
], TableViewSettings.prototype, "enableExport", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    })
], TableViewSettings.prototype, "quickVariantSelection", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/f3cc057e405c4fd58ee2ed42c557797c')
], TableViewSettings.prototype, "condensedTableLayout", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.120.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/c0f6592a592e47f9bb6d09900de47412')
], TableViewSettings.prototype, "widthIncludingColumnHeader", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.117.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7f844f1021cd4791b8f7408eac7c1cec')
], TableViewSettings.prototype, "hierarchyQualifier", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.123.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/c0f6592a592e47f9bb6d09900de47412')
], TableViewSettings.prototype, "disableCopyToClipboard", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView,
            import: importEnableMassEdit,
            export: exportEnableMassEdit
        }
    }),
    (0, decorators_1.validity)({
        since: '1.126.0'
    })
], TableViewSettings.prototype, "enableMassEdit", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView,
            import: importCreationMode
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/ceb9284b16f64f30865ce999dbd56064'),
    (0, decorators_1.validity)({
        since: '1.130.0'
    }),
    (0, decorators_1.hide)((0, decorator_paths_1.and)((0, decorator_paths_1.when)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.not)((0, decorator_paths_1.exists)(decorator_paths_1.tableContext.creationMode))))
    // The properties messages will be evaluated on the children level and will not be decorated to avoid duplicate messages.
], TableViewSettings.prototype, "creationMode", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.136.0'
    }),
    (0, decorators_1.hide)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.not)((0, decorator_paths_1.exists)(decorator_paths_1.tableContext.analyticalConfiguration))))
    // The properties messages will be evaluated on the children level and will not be decorated to avoid duplicate messages.
], TableViewSettings.prototype, "analyticalConfiguration", void 0);
/****************************************
 * Sync class for ALPTableView (renamed due to indirection in app schema)
 */
class ALPTable extends TableViewSettings {
}
exports.ALPTable = ALPTable;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName) => (0, application_1.getSettingsPathForPage)(pageName) + '/views/paths/0/secondary/0',
            delete: common_1.doNotDelete
        }
    })
], ALPTable.prototype, "annotationPath", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName) => (0, application_1.getSettingsPathForPage)(pageName)
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/9f4e1192f1384b85bc160288e17f69c4')
], ALPTable.prototype, "initialLoad", void 0);
/****************************************
 * Sync class for LRChartView
 */
class LRChartView extends CommonViewSettings {
}
exports.LRChartView = LRChartView;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath
        },
        generate: common_1.addPatternForBindingChangeOfEnumLR
    })
], LRChartView.prototype, "visible", void 0);
/****************************************
 * Sync class for LRTableView
 */
class LRTableView extends TableViewSettings {
}
exports.LRTableView = LRTableView;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath
        }
    })
], LRTableView.prototype, "keepPreviousPersonalization", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath
        },
        generate: common_1.addPatternForBindingChangeOfEnumLR
    })
], LRTableView.prototype, "visible", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.136.0'
    }),
    (0, decorators_1.hide)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.not)((0, decorator_paths_1.exists)(decorator_paths_1.tableContext.analyticalConfiguration))))
    // The properties messages will be evaluated on the children level and will not be decorated to avoid duplicate messages.
], LRTableView.prototype, "analyticalConfiguration", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    }),
    (0, decorators_1.hide)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.ResponsiveTable)),
    (0, decorators_1.message)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.ResponsiveTable), (0, decorator_paths_1.exists)(decorator_paths_1.tableContext.popinLayout)), (0, decorator_paths_1.msg)('PROPERTY_NOT_ALLOWED_FOR_TABLE_TYPE', { propertyName: 'popinLayout', tableType: decorator_paths_1.tableContext.type }, { deletable: true }))
], LRTableView.prototype, "popinLayout", void 0);
class TableViewExtension {
}
exports.TableViewExtension = TableViewExtension;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath
        }
    })
], TableViewExtension.prototype, "key", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getSettingsPathForLRViewsPaths,
            import: determineIndexOfView,
            export: (manifestSection, configObject) => {
                checkViewOrder(manifestSection, configObject);
            },
            delete: deleteView
        }
    })
], TableViewExtension.prototype, "index", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath
        }
    })
], TableViewExtension.prototype, "label", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath
        }
    })
], TableViewExtension.prototype, "template", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: getSettingsPathForLRViewsPath
        },
        generate: common_1.addPatternForBindingChangeOfEnumLR
    })
], TableViewExtension.prototype, "visible", void 0);
class AnalyticalConfiguration extends sync_rules_1.Decorator {
}
exports.AnalyticalConfiguration = AnalyticalConfiguration;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableAnalyticalConfigurationPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.136.0'
    }),
    (0, decorators_1.hide)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable)),
    (0, decorators_1.message)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.exists)(decorator_paths_1.tableContext.analyticalConfiguration.aggregationOnLeafLevel)), (0, decorator_paths_1.msg)('PROPERTY_NOT_ALLOWED_FOR_TABLE_TYPE', { propertyName: 'analyticalConfiguration', tableType: decorator_paths_1.tableContext.type }, { deletable: true }))
], AnalyticalConfiguration.prototype, "aggregationOnLeafLevel", void 0);
class ViewAnalyticalConfiguration extends sync_rules_1.Decorator {
}
exports.ViewAnalyticalConfiguration = ViewAnalyticalConfiguration;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableAnalyticalConfigurationForView
        }
    }),
    (0, decorators_1.validity)({
        since: '1.136.0'
    }),
    (0, decorators_1.hide)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable)),
    (0, decorators_1.message)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.exists)(decorator_paths_1.tableContext.analyticalConfiguration.aggregationOnLeafLevel)), (0, decorator_paths_1.msg)('PROPERTY_NOT_ALLOWED_FOR_TABLE_TYPE', { propertyName: 'analyticalConfiguration', tableType: decorator_paths_1.tableContext.type }, { deletable: true }))
], ViewAnalyticalConfiguration.prototype, "aggregationOnLeafLevel", void 0);
/**
 * LR multi-view: own class for properties on views' level
 */
class MultiTableModeV4 {
}
exports.MultiTableModeV4 = MultiTableModeV4;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName) => (0, application_1.getSettingsPathForPage)(pageName) + '/views'
        }
    })
], MultiTableModeV4.prototype, "showCounts", void 0);
/****************************************
 * Sync class for Table
 */
class Table extends TableSettings {
}
exports.Table = Table;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName) => (0, application_1.getSettingsPathForPage)(pageName) + '/views/paths/0/secondary/0',
            delete: common_1.doNotDelete
        }
    })
], Table.prototype, "annotationPath", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: (pageName) => (0, application_1.getSettingsPathForPage)(pageName)
        }
    }),
    (0, decorators_1.validity)({
        since: '1.84.0'
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/9f4e1192f1384b85bc160288e17f69c4')
], Table.prototype, "initialLoad", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            import: importEnableMassEdit,
            export: exportEnableMassEdit
        }
    }),
    (0, decorators_1.validity)({
        since: '1.126.0'
    })
], Table.prototype, "enableMassEdit", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            import: importCreationMode
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/ceb9284b16f64f30865ce999dbd56064'),
    (0, decorators_1.validity)({
        since: '1.130.0'
    }),
    (0, decorators_1.hide)((0, decorator_paths_1.and)((0, decorator_paths_1.when)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.not)((0, decorator_paths_1.exists)(decorator_paths_1.tableContext.creationMode))))
    // The properties messages will be evaluated on the children level and will not be decorated to avoid duplicate messages.
], Table.prototype, "creationMode", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.136.0'
    }),
    (0, decorators_1.hide)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.not)((0, decorator_paths_1.exists)(decorator_paths_1.tableContext.analyticalConfiguration))))
    // The properties messages will be evaluated on the children level and will not be decorated to avoid duplicate messages.
], Table.prototype, "analyticalConfiguration", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR
        }
    }),
    (0, decorators_1.validity)({
        since: '1.139.0'
    }),
    (0, decorators_1.hide)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.ResponsiveTable)),
    (0, decorators_1.message)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.ResponsiveTable), (0, decorator_paths_1.exists)(decorator_paths_1.tableContext.popinLayout)), (0, decorator_paths_1.msg)('PROPERTY_NOT_ALLOWED_FOR_TABLE_TYPE', { propertyName: 'popinLayout', tableType: decorator_paths_1.tableContext.type }, { deletable: true }))
], Table.prototype, "popinLayout", void 0);
class TableCreationModeLR extends sync_rules_1.Decorator {
    /**
     * Returns the schema definition name to use for applying decorators.
     *
     * @returns The class name 'TableCreationModeLR'
     */
    getClassName() {
        return 'TableCreationModeLR';
    }
}
exports.TableCreationModeLR = TableCreationModeLR;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            export: exportCreationModeProperty,
            delete: deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/ceb9284b16f64f30865ce999dbd56064'),
    (0, decorators_1.hide)((0, decorator_paths_1.when)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable)),
    (0, decorators_1.message)((0, decorator_paths_1.and)((0, decorator_paths_1.when)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.exists)(decorator_paths_1.tableContext.creationMode.name)), (0, decorator_paths_1.msg)('PROPERTY_NOT_ALLOWED_FOR_TABLE_TYPE', { propertyName: 'creationMode', tableType: decorator_paths_1.tableContext.type }, { deletable: true }))
], TableCreationModeLR.prototype, "name", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            export: exportCreationModeCreationFieldsProperty,
            import: importCreationModeCreationFieldsProperty,
            delete: deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7fee938d7cba4bfd86810cfe6d011eb0'),
    (0, decorators_1.hide)((0, decorator_paths_1.or)((0, decorator_paths_1.when)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.not)(decorator_paths_1.tableContext.creationMode.name, ux_specification_types_1.v4.TableCreationModeType.CreationDialog))),
    (0, decorators_1.message)((0, decorator_paths_1.and)((0, decorator_paths_1.when)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.AnalyticalTable), (0, decorator_paths_1.exists)(decorator_paths_1.tableContext.creationMode.creationFields)), (0, decorator_paths_1.msg)('PROPERTY_NOT_ALLOWED_FOR_TABLE_TYPE', { propertyName: 'creationFields', tableType: decorator_paths_1.tableContext.type }, { deletable: true })),
    (0, decorators_1.message)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.creationMode.name, ux_specification_types_1.v4.TableCreationModeType.CreationDialog), (0, decorator_paths_1.exists)(decorator_paths_1.tableContext.creationMode.creationFields)), (0, decorator_paths_1.msg)('ENTITY_IS_ALLOWED_ONLY_FOR_CREATION_DIALOG_MODE', {}, { deletable: true }))
], TableCreationModeLR.prototype, "creationFields", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            export: exportCreationModeProperty,
            delete: deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7cf7a31fd1ee490ab816ecd941bd2f1f'),
    (0, decorators_1.hide)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.TreeTable)),
    (0, decorators_1.message)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.TreeTable), (0, decorator_paths_1.exists)(decorator_paths_1.tableContext.creationMode.createInPlace)), (0, decorator_paths_1.msg)('PROPERTY_NOT_ALLOWED_FOR_NON_TREE_TABLE_TYPE', { propertyName: 'createInPlace' }, { deletable: true }))
], TableCreationModeLR.prototype, "createInPlace", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: application_1.getTableSettingsPathForLR,
            export: exportCreationModeProperty,
            delete: deleteCreationModeProperty
        }
    }),
    (0, decorators_1.descriptionSrcURL)('https://ui5.sap.com/#/topic/7cf7a31fd1ee490ab816ecd941bd2f1f'),
    (0, decorators_1.hide)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.TreeTable)),
    (0, decorators_1.message)((0, decorator_paths_1.and)((0, decorator_paths_1.not)(decorator_paths_1.tableContext.type, ux_specification_types_1.v4.TableTypeV4.TreeTable), (0, decorator_paths_1.exists)(decorator_paths_1.tableContext.creationMode.isCreateEnabled)), (0, decorator_paths_1.msg)('PROPERTY_NOT_ALLOWED_FOR_NON_TREE_TABLE_TYPE', { propertyName: 'isCreateEnabled' }, { deletable: true }))
], TableCreationModeLR.prototype, "isCreateEnabled", void 0);
//# sourceMappingURL=Table.js.map