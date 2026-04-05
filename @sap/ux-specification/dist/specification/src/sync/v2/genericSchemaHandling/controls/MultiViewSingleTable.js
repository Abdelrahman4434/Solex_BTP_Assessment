"use strict";
/**
 * @file This file is a helper class for its sibling class Table.ts. It provides the logic needed to support the multi-view single-table scenario.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiViewsOnTable = exports.ViewOnTable = void 0;
exports.getSyncRuleForQuickVariantSelection = getSyncRuleForQuickVariantSelection;
const i18next_1 = __importDefault(require("i18next"));
const ux_specification_types_1 = require("@sap/ux-specification-types");
const common_1 = require("../../../common");
const decoration_1 = require("../../../common/decoration");
const utils_1 = require("../../utils");
const manifestPropertyUtils_1 = require("../../generate/manifestPropertyUtils");
class ViewOnTable {
}
exports.ViewOnTable = ViewOnTable;
__decorate([
    (0, decoration_1.syncRule)({
        manifest: {},
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const quickVariantSelectionParams = schemaHandlingParams.specificParams;
            processingRule.element.enum = quickVariantSelectionParams.selectionVariants;
        }
    })
], ViewOnTable.prototype, "annotationPath", void 0);
class MultiViewsOnTable {
}
exports.MultiViewsOnTable = MultiViewsOnTable;
__decorate([
    (0, decoration_1.syncRule)({
        manifest: {},
        processingRuleAdapter(processingRule, schemaHandlingParams, generateParameters) {
            processingRule.manifestPath = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath, [
                'quickVariantSelection'
            ]);
            const quickVariantSelection = (0, utils_1.getManifestPropertyByPath)(generateParameters.manifest, processingRule.manifestPath);
            if (!(0, manifestPropertyUtils_1.hasPropertyTypeError)(quickVariantSelection, 'showCounts', generateParameters.logger, 'boolean') &&
                !(0, manifestPropertyUtils_1.hasPropertyTypeError)(quickVariantSelection, 'variants', generateParameters.logger, 'object') &&
                quickVariantSelection?.['showCounts'] !== undefined &&
                (0, utils_1.isEmpty)(quickVariantSelection['variants'])) {
                processingRule.element[ux_specification_types_1.SchemaTag.messages] = [
                    {
                        text: i18next_1.default.t('QUICKVARIANTSELECTIONNOVARIANTS'),
                        deletable: true,
                        type: ux_specification_types_1.PropertyMessageType.Warning
                    }
                ];
            }
        }
    })
], MultiViewsOnTable.prototype, "showCounts", void 0);
__decorate([
    (0, decoration_1.syncRule)({
        manifest: {},
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const quickVariantSelectionParams = schemaHandlingParams.specificParams;
            processingRule.manifestPath = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath, [
                'quickVariantSelection'
            ]);
            processingRule.additionalPropertiesAdaptation = {
                suffix: quickVariantSelectionParams.suffix,
                syncRuleProvider: ViewOnTable
            };
        }
    })
], MultiViewsOnTable.prototype, "variants", void 0);
/**
 * Provides the syncRule for the quickVariantSelection property of a table.
 *
 * @returns the syncRule
 */
function getSyncRuleForQuickVariantSelection() {
    return {
        processingRuleAdapter(processingRule, schemaHandlingParams, generateParameters) {
            const tableParams = schemaHandlingParams.specificParams;
            let disallowedReason;
            let quickVariantSelectionParams;
            if (tableParams.multiTableInfo) {
                if (tableParams.multiTableInfo.variantInfo) {
                    // The quickVariantSelection property is not valid for the views in a multi-table scenario
                    delete processingRule.element;
                    return;
                }
                disallowedReason = i18next_1.default.t('QUICKVARIANTSELECTIONDUPLICATE');
            }
            else {
                const selectionVariants = (0, common_1.getListOfValidAnnotations)(tableParams.entityType, [
                    "com.sap.vocabularies.UI.v1.SelectionPresentationVariant" /* UIAnnotationTerms.SelectionPresentationVariant */,
                    "com.sap.vocabularies.UI.v1.SelectionVariant" /* UIAnnotationTerms.SelectionVariant */
                ]);
                if (selectionVariants.length === 0) {
                    disallowedReason = i18next_1.default.t('QUICKVARIANTSELECTIONNOSELECTIONVARIANTANNOTATIONS');
                }
                quickVariantSelectionParams = {
                    // suffix: tableParams.facet?.stableIdPart, only relevant for tables on OP
                    selectionVariants
                };
            }
            if (disallowedReason) {
                const manifestPath = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath);
                const { value } = (0, utils_1.getManifestPropertyByPath)(generateParameters.manifest, manifestPath, 'quickVariantSelection');
                (0, manifestPropertyUtils_1.handleDisallowedProperty)(disallowedReason, processingRule, value, manifestPath);
                processingRule.element[ux_specification_types_1.SchemaTag.artifactType] = 'Manifest';
            }
            else {
                processingRule.referenceAdaptation = {
                    suffix: quickVariantSelectionParams.suffix,
                    syncRuleProvider: MultiViewsOnTable,
                    specificParams: quickVariantSelectionParams
                };
            }
        }
    };
}
//# sourceMappingURL=MultiViewSingleTable.js.map