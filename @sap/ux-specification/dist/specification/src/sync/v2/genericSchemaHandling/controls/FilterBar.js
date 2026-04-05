"use strict";
/**
 * @file This file contains the classes implementing the interfaces defined in the corresponding types file.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListReportFilterBar = exports.FilterFields = exports.FilterField = exports.DefaultDateRange = exports.DateRange = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../../../common");
const decoration_1 = require("../../../common/decoration");
const utils_1 = require("../../utils");
const manifestPropertyUtils_1 = require("../../generate/manifestPropertyUtils");
/**
 * Validity information for properties connected to the date range feature.
 */
const dateRangeValidity = {
    since: '1.77.0'
};
/* End: Types being used for schemaHandlingParams.specificParams */
/**
 * Common syncRule for all properties of the filter bar with artifactType FlexChange.
 */
const syncRuleForFlexSmartFilterBar = {
    flex: {
        controlType: () => ux_specification_types_1.ControlType.SmartFilterBar
    },
    processingRuleAdapter(processingRule) {
        processingRule.controlId = 'listReportFilter';
    }
};
/**
 * This function generates a sync rule for a manifest based property specifying the behavior of filter fields that can potentially be displayed with date range options.
 * Note that these properties are only relevant when at least one filter field has this option.
 *
 * @param property - name of the manifest based property
 * @returns a SyncRule for the specified property
 */
function getSyncRuleForDateRangeProperty(property) {
    return (0, manifestPropertyUtils_1.getSyncRuleForManifestProperty)(property, 
    // analyze:
    function (element, schemaHandlingParams) {
        // As described in the syncRule of the dateSettings property of class CommonFilterBar below,
        // we currently enable the date range properties unconditionally, since the exact condition when the filter bar contains a potential date range field is not yet implemented.
        // Therefore, the following code is temporarily disabled.
        /*            const filterBarInfo = schemaHandlingParams.specificParams as FilterBarInfo;
        // If the filter bar has no date fields, we have a reason why this property is disallowed:
        const disallowedReason = filterBarInfo.hasFieldWithDateRangeOption ? undefined : i18next.t('NODATEFIELD'); */
        const manifestPath = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath, [
            'filterSettings',
            'dateSettings'
        ]);
        return {
            //                disallowedReason,
            manifestPath
        };
    } // analyze
    );
}
class DateRange {
}
exports.DateRange = DateRange;
__decorate([
    (0, decoration_1.syncRule)(getSyncRuleForDateRangeProperty('useDateRange')),
    (0, decoration_1.validity)(dateRangeValidity)
], DateRange.prototype, "useDateRange", void 0);
__decorate([
    (0, decoration_1.syncRule)(getSyncRuleForDateRangeProperty('selectedValues')),
    (0, decoration_1.validity)(dateRangeValidity)
], DateRange.prototype, "selectedValues", void 0);
__decorate([
    (0, decoration_1.syncRule)(getSyncRuleForDateRangeProperty('exclude')),
    (0, decoration_1.validity)(dateRangeValidity)
], DateRange.prototype, "exclude", void 0);
/**
 * Sync rule for properties that are only relevant for filter fields that can potentially be displayed with date range options.
 */
const onlyDateFieldsPropertySyncRule = {
    manifest: {},
    processingRuleAdapter(processingRule, schemaHandlingParams) {
        const filterFieldInfo = schemaHandlingParams.specificParams;
        if (!filterFieldInfo.selectionFieldInfo.hasDateRangeOption) {
            delete processingRule.element;
            return;
        }
        processingRule.manifestPath = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath, [
            'filterSettings',
            'dateSettings',
            'fields',
            filterFieldInfo.accessor
        ]);
    }
};
class DefaultDateRange {
}
exports.DefaultDateRange = DefaultDateRange;
// FilterField
// Note that filter fields only have manifest properties and these properties are only relevant when they can potentially be displayed with date range options
let FilterField = class FilterField {
};
exports.FilterField = FilterField;
__decorate([
    (0, decoration_1.syncRule)(onlyDateFieldsPropertySyncRule),
    (0, decoration_1.validity)(dateRangeValidity)
], FilterField.prototype, "selectedValues", void 0);
__decorate([
    (0, decoration_1.syncRule)(onlyDateFieldsPropertySyncRule),
    (0, decoration_1.validity)(dateRangeValidity)
], FilterField.prototype, "exclude", void 0);
__decorate([
    (0, decoration_1.syncRule)(onlyDateFieldsPropertySyncRule),
    (0, decoration_1.validity)(dateRangeValidity)
], FilterField.prototype, "customDateRangeImplementation", void 0);
__decorate([
    (0, decoration_1.syncRule)(onlyDateFieldsPropertySyncRule),
    (0, decoration_1.validity)(dateRangeValidity)
], FilterField.prototype, "filter", void 0);
__decorate([
    (0, decoration_1.syncRule)(onlyDateFieldsPropertySyncRule),
    (0, decoration_1.validity)({
        since: '1.90.0'
    })
], FilterField.prototype, "defaultValue", void 0);
exports.FilterField = FilterField = __decorate([
    (0, decoration_1.syncRule)({
        // Task of this function is to add information to the field definition that is not already part of the generic schema (because it is specific for this field)
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const filterFieldInfo = schemaHandlingParams.specificParams;
            const selectionField = filterFieldInfo.selectionFieldInfo.field;
            const entityTypeDefinition = filterFieldInfo.entityType;
            const value = selectionField['value'];
            const description = selectionField['type'] === 'PropertyPath'
                ? (0, common_1.getLabelForPropertyPath)(selectionField, entityTypeDefinition)
                : value;
            processingRule.element.description = description;
            processingRule.element[ux_specification_types_1.SchemaTag.dataType] = filterFieldInfo.selectionFieldInfo.dataType;
            processingRule.element[ux_specification_types_1.SchemaTag.keys] = [{ name: ux_specification_types_1.SchemaKeyName.value, value: `${value}` }];
        }
    })
], FilterField);
// FilterFields
let FilterFields = class FilterFields {
};
exports.FilterFields = FilterFields;
exports.FilterFields = FilterFields = __decorate([
    (0, decoration_1.syncRule)({
        // Task of this function is to process the list of filter fields (provided in the FilterBarInfo) and transform them into properties
        // of processingRule.element. Moreover, the further processing of these child properties is prepared by creating a suitable ProcessingRulesAdapter.
        processingRuleAdapter(processingRule, schemaHandlingParams, generateParameters) {
            const filterBarInfo = schemaHandlingParams.specificParams;
            const fieldDefinitions = filterBarInfo.fieldDefinitions;
            let properties;
            for (const accessor in fieldDefinitions) {
                const fieldDefinition = fieldDefinitions[accessor];
                // initialize schema representation of the filter field with a link to the generic type definition, adaptation to a specific type will be ensured below:
                const propertyDefinition = {
                    $ref: common_1.DEFINITION_LINK_PREFIX + 'FilterField'
                };
                propertyDefinition[ux_specification_types_1.SchemaTag.propertyIndex] = fieldDefinition.position;
                properties = properties || {};
                properties[accessor] = propertyDefinition;
            }
            processingRule.element.properties = properties;
            delete processingRule.element.additionalProperties;
            const processingRulesAdapter = function (property, processingRule) {
                const filterFieldInfo = {
                    accessor: property,
                    selectionFieldInfo: fieldDefinitions[property],
                    entityType: filterBarInfo.entityType
                };
                processingRule.referenceAdaptation = {
                    suffix: (0, common_1.prepareRef)(property), // ensure that a specific copy of type FilterField will be created in the specific schema
                    syncRuleProvider: FilterField,
                    specificParams: filterFieldInfo // Pass the information about the filter field to the next processing level
                };
            };
            processingRule.referenceAdaptation = {
                processingRulesAdapter
            };
        }
    })
], FilterFields);
class CommonFilterBar {
}
__decorate([
    (0, decoration_1.syncRule)(syncRuleForFlexSmartFilterBar)
], CommonFilterBar.prototype, "liveMode", void 0);
__decorate([
    (0, decoration_1.syncRule)(manifestPropertyUtils_1.standardSyncRuleForManifestSettingsProperty),
    (0, decoration_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/094fe8c8d8ac4f0eb4724b1a52d2ad61')
], CommonFilterBar.prototype, "smartVariantManagement", void 0);
__decorate([
    (0, decoration_1.syncRule)(manifestPropertyUtils_1.standardSyncRuleForManifestSettingsProperty),
    (0, decoration_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/094fe8c8d8ac4f0eb4724b1a52d2ad61')
], CommonFilterBar.prototype, "variantManagementHidden", void 0);
__decorate([
    (0, decoration_1.syncRule)(manifestPropertyUtils_1.standardSyncRuleForManifestSettingsProperty),
    (0, decoration_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/094fe8c8d8ac4f0eb4724b1a52d2ad61')
], CommonFilterBar.prototype, "subTitleIfVariantMgmtHidden", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForFlexSmartFilterBar)
], CommonFilterBar.prototype, "showClearOnFB", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForFlexSmartFilterBar)
], CommonFilterBar.prototype, "showFilterConfiguration", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForFlexSmartFilterBar)
], CommonFilterBar.prototype, "showRestoreOnFB", void 0);
__decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule, schemaHandlingParams, generateParameters) {
            // Preferably, the dateSettings property should only be visible when there is at least one potential date range field in the filter bar, since otherwise it is meaningless.
            // However, the exact condition when a field is a potential date range field is currently not implemented.
            // Moreover, it needs to be checked whether we should also consider fields not belonging to the filter bar, but potentially added by end-users via the 'Adapt filters' button.
            // Therefore, the following logic is temporarily disabled. Like in the 'old' implementation we simply provide the property unconditionally.
            /*            const filterBarInfo = schemaHandlingParams.specificParams as FilterBarInfo;
            if (!filterBarInfo.hasFieldWithDateRangeOption) {
                const manifestPath = getManifestPathToPageSettings(schemaHandlingParams.pageInfo.pagePath, [
                    'filterSettings'
                ]);
                const { hasPath } = getManifestPropertyByPath(
                    generateParameters.manifest,
                    manifestPath,
                    'dateSettings'
                );
                // If the filter bar does not contain any date fields and there are no date settings in the manifest yet: Do not bother user with meaningless date settings.
                // Possible future improvement: Add a warning message when date settings are present but meaningless because there is no date field.
                if (!hasPath) {
                    delete processingRule.element;
                    return;
                }
            } */
            processingRule.referenceAdaptation = {
                syncRuleProvider: DateRange
            };
        }
    }),
    (0, decoration_1.validity)(dateRangeValidity)
], CommonFilterBar.prototype, "dateSettings", void 0);
__decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule) {
            processingRule.referenceAdaptation = {
                syncRuleProvider: FilterFields
            };
        }
    })
], CommonFilterBar.prototype, "selectionFields", void 0);
// ListReportFilterBar
let ListReportFilterBar = class ListReportFilterBar extends CommonFilterBar {
};
exports.ListReportFilterBar = ListReportFilterBar;
__decorate([
    (0, decoration_1.syncRule)({
        manifest: {},
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const validAnnotations = [
                "com.sap.vocabularies.UI.v1.SelectionPresentationVariant" /* UIAnnotationTerms.SelectionPresentationVariant */,
                "com.sap.vocabularies.UI.v1.SelectionVariant" /* UIAnnotationTerms.SelectionVariant */,
                "com.sap.vocabularies.UI.v1.PresentationVariant" /* UIAnnotationTerms.PresentationVariant */
            ];
            const filterBarInfo = schemaHandlingParams.specificParams;
            // set the list of possible values:
            (0, common_1.addEnumForValidAnnotations)(filterBarInfo.entityType, validAnnotations, processingRule.element);
            // set the manifest path for the property:
            const manifestPath = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath);
            processingRule.manifestPath = manifestPath;
        }
    }),
    (0, decoration_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/49a6ba5b8d6946208322a9f7e16837c2'),
    (0, decoration_1.validity)({
        since: '1.86.0'
    })
], ListReportFilterBar.prototype, "annotationPath", void 0);
exports.ListReportFilterBar = ListReportFilterBar = __decorate([
    (0, decoration_1.syncRule)({
        // The task of this function is to create an instance of type FilterBarInfo and pass it to the next processing level.
        // Moreover, the icon to be used for this artifact im Page Map is specified.
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            processingRule.element[ux_specification_types_1.SchemaTag.icon] = 'Filter'; // do not use member of enum UiIcons in @sap-ux/ui-components to avoid unwanted dependency
            const lrParams = schemaHandlingParams.specificParams;
            // Collect selection fields (the fields belonging to the filter bar) and thereby determine whether there is at least one field that can potentially be displayed with date range options
            const selectionFieldAnnotation = lrParams.uIAnnotations?.SelectionFields ?? [];
            const fieldDefinitions = {};
            let hasFieldWithDateRangeOption = false;
            selectionFieldAnnotation.forEach((selectionField, i) => {
                const dataType = (0, common_1.determineDataType)(selectionField);
                // The following logic is identical to the 'old' logic as implemented in function addSelectionFields of class v2/generate/utils.ts.
                // However, this logic seems to deviate from the logic implemented in function isDateRange in class semanticDateRangeHelper of Fiori Elements runtime.
                // Therefore, we may need to adapt the logic as soon as the exact condition when a field is a potential date range field is clarified.
                const hasDateRangeOption = ['Date', 'DateTime', 'DateTimeOffset'].includes(dataType);
                hasFieldWithDateRangeOption = hasFieldWithDateRangeOption || hasDateRangeOption;
                fieldDefinitions[selectionField.value] = {
                    field: selectionField,
                    dataType,
                    hasDateRangeOption,
                    position: i
                };
            });
            const specificParams = {
                entityType: lrParams.entityType,
                fieldDefinitions,
                hasFieldWithDateRangeOption
            };
            processingRule.referenceAdaptation = {
                specificParams
            };
        }
    })
], ListReportFilterBar);
//# sourceMappingURL=FilterBar.js.map