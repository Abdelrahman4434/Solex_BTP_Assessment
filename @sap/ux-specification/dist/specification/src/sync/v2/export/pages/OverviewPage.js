"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OverviewPage = void 0;
exports.importDateSettingsOVP = importDateSettingsOVP;
exports.importFilterSettings = importFilterSettings;
exports.exportFilterSettings = exportFilterSettings;
const decorators_1 = require("../../../common/decoration/decorators");
const application_1 = require("../../application");
/**
 * Imports date settings fields for the Overview Page.
 *
 * @param manifestSection - The manifest section containing date settings.
 * @param configPart - The configuration part to populate.
 */
function importDateSettingsFieldsOVP(manifestSection, configPart) {
    for (const propertyKey in manifestSection['dateSettings']['fields']) {
        configPart.fields[propertyKey] = manifestSection['dateSettings']['fields'][propertyKey];
        const selectedValues = manifestSection['dateSettings']['fields'][propertyKey].selectedValues;
        if (typeof selectedValues === 'string') {
            configPart.fields[propertyKey].selectedValues = selectedValues.split(',');
        }
        for (const filterKey in manifestSection['dateSettings']['fields'][propertyKey].filter) {
            const filterValue = manifestSection['dateSettings']['fields'][propertyKey].filter[filterKey];
            configPart.fields[propertyKey].filter[filterKey] = filterValue;
            if (filterValue.equals && typeof filterValue.equals === 'string') {
                configPart.fields[propertyKey].filter[filterKey].equals = filterValue.equals.split(',');
            }
        }
    }
}
/**
 * Imports date settings for the Overview Page.
 *
 * @param manifestSection - The manifest section containing date settings.
 * @returns The imported date settings as a `v2.DateRange` object.
 */
function importDateSettingsOVP(manifestSection) {
    if (!manifestSection || !manifestSection['dateSettings']) {
        return undefined;
    }
    const configPart = JSON.parse(JSON.stringify(manifestSection['dateSettings']));
    // Convert CSV format to an array of strings
    if (typeof manifestSection['dateSettings']['selectedValues'] === 'string') {
        configPart.selectedValues = manifestSection['dateSettings']['selectedValues'].split(',');
    }
    if (manifestSection['dateSettings']['fields']) {
        importDateSettingsFieldsOVP(manifestSection, configPart);
    }
    return configPart;
}
/**
 * Imports filter settings for the Overview Page.
 *
 * @param manifestSection - The manifest section containing filter settings.
 * @returns The imported filter settings as an object.
 */
function importFilterSettings(manifestSection) {
    const configPart = {};
    configPart['dateSettings'] = importDateSettingsOVP(manifestSection['filterSettings']);
    return configPart;
}
/**
 * Exports filter fields for the Overview Page.
 *
 * @param configPart - The configuration part containing filter settings.
 * @param key - The key for the filter settings.
 * @param manifestSection - The manifest section to populate.
 */
function exportFilterFields(configPart, key, manifestSection) {
    for (const fieldName in configPart['filterSettings'][key]['fields']) {
        const field = configPart['filterSettings'][key]['fields'][fieldName];
        if (field.selectedValues) {
            manifestSection['filterSettings'][key]['fields'][fieldName].selectedValues = field.selectedValues.join();
        }
        if (field.filter) {
            for (const filterKey in field.filter) {
                const filterValue = field.filter[filterKey];
                if (filterValue.equals && Array.isArray(filterValue.equals)) {
                    manifestSection['filterSettings'][key]['fields'][fieldName].filter[filterKey].equals =
                        filterValue.equals.join();
                }
            }
        }
    }
}
/**
 * Exports filter settings for the Overview Page.
 *
 * @param manifestSection - The manifest section to populate.
 * @param configPart - The configuration part containing filter settings.
 */
function exportFilterSettings(manifestSection, configPart) {
    if (!manifestSection['filterSettings']) {
        manifestSection['filterSettings'] = {};
    }
    const key = 'dateSettings';
    if (configPart['filterSettings'][key] === undefined) {
        delete manifestSection['filterSettings'][key];
    }
    else {
        manifestSection['filterSettings'][key] = JSON.parse(JSON.stringify(configPart['filterSettings'][key]));
        // Convert enum array to joined string
        if (configPart['filterSettings'][key]['selectedValues']) {
            manifestSection['filterSettings'][key]['selectedValues'] =
                configPart['filterSettings'][key]['selectedValues'].join();
        }
        if (configPart['filterSettings'][key]['fields']) {
            exportFilterFields(configPart, key, manifestSection);
        }
    }
}
/**
 * Represents the Overview Page configuration.
 */
let OverviewPage = class OverviewPage {
};
exports.OverviewPage = OverviewPage;
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "globalFilterModel", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "globalFilterEntityType", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "globalFilterEntitySet", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "showBasicSearch", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "disableErrorPage", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "smartVariantRequired", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "bHeaderExpanded", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "containerLayout", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "showDateInRelativeFormat", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "disableTableCardFlexibility", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "enableLiveFilter", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "enableLazyRendering", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "refreshStrategyOnAppRestore", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "considerAnalyticalParameters", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "refreshIntervalInMinutes", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: { path: () => (0, application_1.getOVPsettingPath)() }
    })
], OverviewPage.prototype, "useDateRangeType", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)(),
            import: importFilterSettings,
            export: exportFilterSettings
        }
    }),
    (0, decorators_1.validity)({
        since: '1.80.0'
    })
], OverviewPage.prototype, "filterSettings", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "dataLoadSettings", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        manifest: {
            path: () => (0, application_1.getOVPsettingPath)()
        }
    })
], OverviewPage.prototype, "resizableLayout", void 0);
exports.OverviewPage = OverviewPage = __decorate([
    (0, decorators_1.pageLayoutInformation)({
        id: 'sap.suite.ui.generic.template.OverviewPage.view.Details',
        pageId: 'sap.suite.ui.generic.template.OverviewPage'
    })
], OverviewPage);
//# sourceMappingURL=OverviewPage.js.map