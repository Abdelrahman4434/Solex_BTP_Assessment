"use strict";
/**
 * @file This file hosts the entry point for generating the schema of a v2 List Report Page.
 * The schema is yet incomplete and is normally ignored by the runtime.
 * For manual tests it can be made active by switching useGenericSchemaHandling in pageAccess.ts to true.
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
exports.ListReportNew = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
const decorators_1 = require("../../../common/decoration/decorators");
const v2_1 = require("@sap/ux-specification-types/src/v2");
const Table_1 = require("@sap/ux-specification-types/src/v2/genericSchemaHandling/controls/Table");
const extensionLogger_1 = require("../../../../extensionLogger");
const i18next_1 = __importDefault(require("i18next"));
const utils_1 = require("../../utils");
const ListHeader_1 = require("../controls/ListHeader");
const FilterBar_1 = require("../controls/FilterBar");
const Table_2 = require("../controls/Table");
const Action_1 = require("../controls/Action");
const manifestPropertyUtils_1 = require("../../generate/manifestPropertyUtils");
const utils_2 = require("../../generate/utils");
// ListReportNew
let ListReportNew = class ListReportNew {
};
exports.ListReportNew = ListReportNew;
__decorate([
    (0, decorators_1.syncRule)({
        flex: {
            controlType: () => ux_specification_types_1.ControlType.DynamicPage
        },
        processingRuleAdapter(processingRule) {
            processingRule.controlId = 'page';
        }
    })
], ListReportNew.prototype, "fitContent", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        processingRuleAdapter(processingRule) {
            processingRule.element[ux_specification_types_1.SchemaTag.propertyIndex] = 0;
            processingRule.referenceAdaptation = {
                syncRuleProvider: ListHeader_1.ListHeader
            };
        }
    })
], ListReportNew.prototype, "header", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const lRSchemaHandlingParams = schemaHandlingParams.specificParams;
            if (lRSchemaHandlingParams.settings?.isWorklist) {
                // no filterbar shown in worklist apps
                delete processingRule.element;
                return;
            }
            processingRule.element[ux_specification_types_1.SchemaTag.propertyIndex] = 1;
            processingRule.referenceAdaptation = {
                syncRuleProvider: FilterBar_1.ListReportFilterBar
            };
        }
    })
], ListReportNew.prototype, "filterBar", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        processingRuleAdapter(processingRule, schemaHandlingParams, generateParameters) {
            const lRSchemaHandlingParams = schemaHandlingParams.specificParams;
            processingRule.element[ux_specification_types_1.SchemaTag.icon] = 'Table'; // do not use member of enum UiIcons in @sap-ux/ui-components to avoid unwanted dependency
            processingRule.element[ux_specification_types_1.SchemaTag.propertyIndex] = 2;
            const lrSettings = lRSchemaHandlingParams.settings;
            const tableType = lRSchemaHandlingParams.tableType;
            const tableParams = {
                settings: lrSettings,
                tableType,
                tableId: 'listReport',
                lineItemInfo: lRSchemaHandlingParams.lineItemInfo,
                entityType: lRSchemaHandlingParams.entityType
            };
            // Check whether we are in a multi-view multi-table scenario.
            const quickVariantSelectionX = !(0, manifestPropertyUtils_1.hasPropertyTypeError)(lrSettings, 'quickVariantSelectionX', generateParameters.logger, 'object') &&
                lrSettings?.quickVariantSelectionX;
            let suffix;
            if (quickVariantSelectionX) {
                if ((0, utils_1.isEmpty)(quickVariantSelectionX['variants'])) {
                    (0, extensionLogger_1.log)(generateParameters.logger, {
                        severity: "warning" /* LogSeverity.Warning */,
                        message: i18next_1.default.t('QUICKVARIANTSELECTIONXNOVARIANTS')
                    });
                }
                else {
                    suffix = 'Top';
                    if (lrSettings.quickVariantSelection) {
                        // Do not use quickVariantSelection and quickVariantSelectionX together
                        (0, extensionLogger_1.log)(generateParameters.logger, {
                            severity: "error" /* LogSeverity.Error */,
                            message: i18next_1.default.t('QUICKVARIANTSELECTIONDUPLICATE')
                        });
                    }
                    // Preliminary setting of multiTableInfo. Will be enhanced later.
                    tableParams.multiTableInfo = {
                        usedTableTypes: {
                            nonResponsive: tableType === Table_1.TableTypeV2Enum.ResponsiveTable ? 0 : 1,
                            responsive: tableType === Table_1.TableTypeV2Enum.ResponsiveTable ? 1 : 0
                        }
                    };
                }
            }
            processingRule.referenceAdaptation = {
                suffix,
                specificParams: tableParams,
                syncRuleProvider: Table_2.Table
            };
        }
    })
], ListReportNew.prototype, "table", void 0);
__decorate([
    (0, decorators_1.syncRule)({
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const lRSchemaHandlingParams = schemaHandlingParams.specificParams;
            processingRule.element[ux_specification_types_1.SchemaTag.propertyIndex] = 3;
            (0, Action_1.adaptProcessingRuleForToolbar)(processingRule, utils_2.DataFieldTarget.Footer, lRSchemaHandlingParams.lineItemInfo?.dataFieldInfos);
        }
    })
], ListReportNew.prototype, "footer", void 0);
exports.ListReportNew = ListReportNew = __decorate([
    (0, decorators_1.pageLayoutInformation)({
        id: v2_1.SAPUI5_VIEW_EXTENSION_LIST_REPORT,
        pageId: v2_1.FE_TEMPLATE_V2_LIST_REPORT
    }),
    (0, decorators_1.syncRule)({
        processingRuleAdapter(processingRule, schemaHandlingParams, generateParameters) {
            const { entityType, uIAnnotations } = (0, utils_2.getUIAnnotationForEntitySet)(generateParameters); // would log an error in case these entities are missing
            const manifestPathToPageSettings = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath);
            const { parent: pageSettings } = (0, utils_1.getManifestPropertyByPath)(generateParameters.manifest, manifestPathToPageSettings);
            const settings = pageSettings;
            const tableSettings = settings?.tableSettings;
            const tableType = tableSettings?.['type'] || settings?.tableType || (0, Table_2.getDefaultTableType)(entityType);
            const lineItemAnnotation = (0, utils_2.getLineItemAnnotation)(uIAnnotations, settings, generateParameters.logger);
            let lineItemInfo;
            if (lineItemAnnotation) {
                const lineItemName = lineItemAnnotation.term + (lineItemAnnotation.qualifier ? `#${lineItemAnnotation.qualifier}` : '');
                const accessor = lineItemName.replace(ux_specification_types_1.UIVOCABULARYDOT, '');
                const lineItemDefinition = uIAnnotations[accessor];
                lineItemInfo = (0, utils_2.getLineItemInfo)(lineItemName, lineItemDefinition, entityType, tableType, generateParameters, false);
            }
            const specificParams = {
                settings,
                entityType,
                uIAnnotations,
                tableType,
                lineItemInfo
            };
            // Further processing will be done on level of properties of this class
            processingRule.referenceAdaptation = {
                specificParams
            };
        }
    })
], ListReportNew);
//# sourceMappingURL=ListReportNew.js.map