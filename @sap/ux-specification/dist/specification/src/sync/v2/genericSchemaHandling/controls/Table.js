"use strict";
/**
 * @file This file contains the classes implementing the interfaces defined in the corresponding types file.
 * Note that the logic for dealing with the multi-table scenario is implemented in the sibling file MultiTable.ts.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
exports.getDefaultTableType = getDefaultTableType;
exports.checkTableType = checkTableType;
const i18next_1 = __importDefault(require("i18next"));
const ux_specification_types_1 = require("@sap/ux-specification-types");
const v2 = __importStar(require("@sap/ux-specification-types/src/v2/genericSchemaHandling/controls/Table"));
const decoration_1 = require("../../../common/decoration");
const extensionLogger_1 = require("../../../../extensionLogger");
const MultiTable_1 = require("./MultiTable");
const MultiViewSingleTable_1 = require("./MultiViewSingleTable");
/**
 * This function should return the information whether the given entity type is analytical.
 * Unfortunately this is currently impossible due to missing information provided by the annotation api.
 * As soon as the annotation api has been enhanced accordingly, this function should be enhanced.
 *
 * @param entityTypeDefinition - the entity type to be checked
 * @returns true if the entity type is analytical, false otherwise
 */
function isTypeAnalytical(entityTypeDefinition) {
    return false; // todo: enhance
}
/**
 * Returns the default table type used for tables for the given entity type (i.e. the table type which will be used by Fiori Elements if no manifest setting for the table type is available).
 *
 * @param entityTypeDefinition - the entity type for which the table is created
 * @returns the default table type for the given entity type
 */
function getDefaultTableType(entityTypeDefinition) {
    const isAnalytical = isTypeAnalytical(entityTypeDefinition);
    return isAnalytical ? v2.TableTypeV2Enum.AnalyticalTable : v2.TableTypeV2Enum.ResponsiveTable;
}
/**
 * Checks whether a given table type is valid. Thereby undefined and empty string are also considered as valid (they represent the default table type).
 *
 * @param tableType - the table type to be checked
 * @param logger - would log an error if tableType is invalid
 * @returns - information whether the tableType is valid
 */
function checkTableType(tableType, logger) {
    if (tableType === undefined ||
        tableType === '' ||
        Object.values(v2.TableTypeV2Enum).includes(tableType)) {
        return true;
    }
    (0, extensionLogger_1.log)(logger, {
        severity: "error" /* LogSeverity.Error */,
        message: i18next_1.default.t('ILLEGALTABLETYPE', {
            property: tableType
        })
    });
    return false;
}
/** SyncRule which should be used for all properties with artifact type 'FlexChange' belonging to the SmartTable. */
const syncRuleForFlexSmartTable = {
    flex: {
        controlType: () => ux_specification_types_1.ControlType.SmartTable
    },
    processingRuleAdapter: function (processingRule, schemaHandlingParams) {
        const tableParams = schemaHandlingParams.specificParams;
        const isPropertyValid = !((tableParams.multiTableInfo && !tableParams.multiTableInfo.variantInfo) ||
            tableParams.multiTableInfo?.variantInfo.isChart); // the property is invalid on top-level of a multi-table scenario and on a view displaying a chart
        if (isPropertyValid) {
            processingRule.controlId = tableParams.multiTableInfo
                ? tableParams.multiTableInfo.variantInfo.smartControlId
                : tableParams.tableId;
        }
        else {
            delete processingRule.element;
        }
    }
};
class Table {
} // Table
exports.Table = Table;
__decorate([
    (0, decoration_1.syncRule)((0, MultiTable_1.getSyncRuleForMultiTableManifestProperty)('entitySet')),
    (0, decoration_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/b6b59e4a4c3548cf83ff9c3b955d3ba3')
], Table.prototype, "entitySet", void 0);
__decorate([
    (0, decoration_1.syncRule)((0, MultiTable_1.getSyncRuleForMultiTableManifestProperty)('annotationPath')),
    (0, decoration_1.descriptionSrcURL)('https://ui5.sap.com/sdk/#/topic/37aeed74e17a42caa2cba3123f0c15fc')
], Table.prototype, "annotationPath", void 0);
__decorate([
    (0, decoration_1.syncRule)((0, MultiTable_1.getSyncRuleForMultiTableManifestProperty)('showItemNavigationOnChart'))
], Table.prototype, "showItemNavigationOnChart", void 0);
__decorate([
    (0, decoration_1.syncRule)((0, MultiTable_1.getSyncRuleForMultiTableManifestProperty)('views'))
], Table.prototype, "views", void 0);
__decorate([
    (0, decoration_1.syncRule)((0, MultiViewSingleTable_1.getSyncRuleForQuickVariantSelection)())
], Table.prototype, "quickVariantSelection", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForFlexSmartTable)
], Table.prototype, "showTablePersonalisation", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForFlexSmartTable),
    (0, decoration_1.validity)({
        since: '1.50.0'
    })
], Table.prototype, "exportType", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForFlexSmartTable)
], Table.prototype, "useExportToExcel", void 0);
//# sourceMappingURL=Table.js.map