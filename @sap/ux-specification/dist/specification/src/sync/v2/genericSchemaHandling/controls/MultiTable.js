"use strict";
/**
 * @file This file is a helper class for its sibling class Table.ts. It provides the logic needed to support the multi-view multi-table scenario (in LR and ALP).
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
exports.MultiViewsDefinition = exports.MultiViewsVariants = void 0;
exports.getSyncRuleForMultiTableManifestProperty = getSyncRuleForMultiTableManifestProperty;
const i18next_1 = __importDefault(require("i18next"));
const ux_specification_types_1 = require("@sap/ux-specification-types");
const v2 = __importStar(require("@sap/ux-specification-types/src/v2/genericSchemaHandling/controls/Table"));
const extensionLogger_1 = require("../../../../extensionLogger");
const decoration_1 = require("../../../common/decoration");
const utils_1 = require("../../utils");
const utils_2 = require("../../generate/utils");
const manifestPropertyUtils_1 = require("../../generate/manifestPropertyUtils");
const stableIdUtils_1 = require("../../generate/stableIdUtils");
const Table_1 = require("./Table");
const common_1 = require("../../../common");
// MultiViewsVariants
let MultiViewsVariants = class MultiViewsVariants {
};
exports.MultiViewsVariants = MultiViewsVariants;
exports.MultiViewsVariants = MultiViewsVariants = __decorate([
    (0, decoration_1.syncRule)({
        // Task of this function is to process the list of views (provided in MultiTableAllVariantsInfo.variantsToInfo) and transform them into properties
        // of processingRule.element. Moreover, the further processing of these child properties is prepared by creating a suitable ProcessingRulesAdapter.
        processingRuleAdapter(processingRule, schemaHandlingParams) {
            const multiTableAllVariantsInfo = schemaHandlingParams.specificParams;
            const properties = {};
            let i = 1;
            for (const key in multiTableAllVariantsInfo.variantsToInfo) {
                const variantInfo = multiTableAllVariantsInfo.variantsToInfo[key];
                const propertyDefinition = {
                    $ref: common_1.DEFINITION_LINK_PREFIX + 'Table'
                };
                propertyDefinition[ux_specification_types_1.SchemaTag.propertyIndex] = i;
                propertyDefinition[ux_specification_types_1.SchemaTag.descriptionSrcURL] =
                    'https://ui5.sap.com/sdk/#/topic/37aeed74e17a42caa2cba3123f0c15fc';
                propertyDefinition[ux_specification_types_1.SchemaTag.icon] = variantInfo.isChart ? 'Chart' : 'Table';
                propertyDefinition[ux_specification_types_1.SchemaTag.deletable] = true;
                propertyDefinition.description = variantInfo.description;
                properties[key] = propertyDefinition;
                i++;
            }
            processingRule.element.additionalProperties = false;
            processingRule.element.properties = properties;
            const processingRulesAdapter = function (property, processingRule) {
                const tableParams = { ...multiTableAllVariantsInfo.tableParams };
                const variantInfo = multiTableAllVariantsInfo.variantsToInfo[property];
                tableParams.multiTableInfo = {
                    usedTableTypes: tableParams.multiTableInfo.usedTableTypes,
                    variantInfo
                };
                processingRule.referenceAdaptation = {
                    suffix: `View-${variantInfo.iconTabFilterKey}`, // ensure that a specific copy of type Table will be created in the specific schema
                    syncRuleProvider: Table_1.Table,
                    specificParams: tableParams
                };
            };
            processingRule.referenceAdaptation = {
                processingRulesAdapter
            };
        }
    })
], MultiViewsVariants);
/**
 * The syncRule for all manifest based direct child properties of quickVariantSelectionX.
 */
const syncRuleForQuickVariantSelectionXProperty = {
    manifest: {},
    processingRuleAdapter(processingRule, schemaHandlingParams) {
        processingRule.manifestPath = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath, [
            'quickVariantSelectionX'
        ]);
    }
};
/**
 * Gets the entity type definition for a view.
 *
 * @param variantDefinition - definition of the view from the manifest
 * @param entityType - the entity type of the entity set which is defined for this LR (used for all views which do not explicitly use a different entity set)
 * @param generateParameters - list of API input parameters
 * @returns the definition of the relevant entity type (or undefined when no entity type could be determined)
 */
function getEntityDefinition(variantDefinition, entityType, generateParameters) {
    if ((0, manifestPropertyUtils_1.hasPropertyTypeError)(variantDefinition, 'entitySet', generateParameters.logger, 'string')) {
        // problem is already logged by helper method
        return;
    }
    const entitySetName = variantDefinition['entitySet']; // if undefined the main entity set of the LR is used
    const entitySetDefinition = entitySetName
        ? generateParameters.serviceAVT.entitySets.find((entitySetDefinition) => entitySetDefinition.name === entitySetName)
        : undefined;
    if (entitySetName && !entitySetDefinition) {
        // illegal entity set specified in the manifest
        (0, extensionLogger_1.log)(generateParameters.logger, {
            severity: "error" /* LogSeverity.Error */,
            message: i18next_1.default.t('NOENTITYTYPE4SET', { property: entitySetName })
        });
        return;
    }
    const entityTypeDefinition = entitySetDefinition ? entitySetDefinition.entityType : entityType;
    return { entitySetDefinition, entityTypeDefinition };
}
/**
 * This function retrieves the annotation based information for a view that has been defined in the manifest (under quickVariantSelectionX.variants).
 * Note that the logic needs to be consistent with the corresponding logic in Fiori Elements.
 * In Fiori Elements this logic is spread around and partially redundant.
 * A starting point may be function getLineItemFromVariant in sap.suite.ui.generic.template.js.preparationHelper.
 *
 * @param variant - the view definition from the manifest
 * @param getUiAnnotation - function to retrieve ui annotations based on their path
 * @returns -  variantDescription: human readable description of this view
 * - isChart: is this view a chart?
 * - lineItemName: name of the line item annotation used for this view (undefined if the view is a chart)
 */
function retrieveInfoForVariant(variant, getUiAnnotation) {
    const annotationPath = variant['annotationPath'];
    let variantDescription;
    let isChart = false;
    let lineItemName;
    if (annotationPath) {
        const uiAnnotation = getUiAnnotation(annotationPath);
        if (uiAnnotation) {
            variantDescription = uiAnnotation['Text'];
            let presentationVariant = uiAnnotation[ux_specification_types_1.FacetBase.PresentationVariant];
            if (presentationVariant?.Path) {
                presentationVariant = getUiAnnotation(presentationVariant.Path);
            }
            if (presentationVariant) {
                const visualizations = presentationVariant.Visualizations;
                // In multi-table scenarios Fiori Elements only considers the first visualization entry
                const relevantVisualization = visualizations && visualizations[0];
                if (relevantVisualization) {
                    const chartName = (0, utils_2.retrieveNameWithoutVocabularyFromVisualization)(ux_specification_types_1.FacetBase.Chart, relevantVisualization);
                    if (chartName) {
                        isChart = true;
                    }
                    else {
                        lineItemName = (0, utils_2.retrieveNameWithoutVocabularyFromVisualization)(ux_specification_types_1.FacetBase.LineItem, relevantVisualization);
                    }
                }
            }
        }
    }
    if (!isChart) {
        lineItemName = lineItemName || ux_specification_types_1.FacetBase.LineItem;
    }
    variantDescription = variantDescription || variant['key']; // take the Text from the annotation and use the specified key as a fallback
    return { variantDescription, isChart, lineItemName };
}
/**
 * Provide the VariantInfo instance for a view defined in the manifest.
 *
 * @param variantSelector - the property name in manifest which is used to address the view
 * @param variantDefinition - the definition of the view from the manifest
 * @param usedTableTypes - reference to the object collecting the usage information of different table types
 * @param generateParameters - parameters used for generating the app schema
 * @param tableParams - parameters for the table view node hosting the collection of views
 * @param defaultTableSettings - the page global tableSettings object from the manifest, resp. an empty object if not defined
 * @returns the instance of VariantInfo representing the view
 */
function getVariantInfo(variantSelector, variantDefinition, usedTableTypes, generateParameters, tableParams, defaultTableSettings) {
    // Note that the id of SmartTable and SmartChart in the multi-table case are built in the same way.
    // For SmartTable this is defined in sap.suite.ui.generic.template.ListReport.view.fragments.SmartTable.fragment.xml together with
    // sap.suite.ui.generic.template.lib.StableIdDefinition, type: ListReport, subType: SmartTable.
    // Note that sap.suite.ui.generic.template.js.StableIdHelper.getStableId will not call escapeIdParameter on the parameter (sQuickVariantKey),
    // since the definition provides a value function.
    // For charts the same pattern is used. In this case it is defined in sap.suite.ui.generic.template.ListReport.view.fragments.SmartChart.fragment.xml
    // using function getSuffixFromIconTabFilterKey in class sap.suite.ui.generic.template.js.AnnotationHelper which also does not perform any escaping.
    const smartControlId = `${tableParams.tableId}-${variantDefinition['key']}`;
    const metaInfo = getEntityDefinition(variantDefinition, tableParams.entityType, generateParameters);
    const entityTypeDefinition = metaInfo?.entityTypeDefinition;
    if (!entityTypeDefinition || !entityTypeDefinition?.annotations?.UI) {
        return {
            accessor: variantSelector,
            iconTabFilterKey: (0, stableIdUtils_1.replaceSpecialCharsInId)(variantDefinition['key'], generateParameters),
            variantDefinition,
            isChart: false,
            smartControlId,
            description: variantDefinition['key']
        };
    }
    // convenience function for accessing the ui annotations (removing unwanted prefixes)
    const getUiAnnotation = function (path) {
        if (!path) {
            return;
        }
        const accessor = path.replace(ux_specification_types_1.UIVOCABULARYDOT, '');
        return entityTypeDefinition.annotations.UI[accessor];
    };
    const { variantDescription, isChart, lineItemName } = retrieveInfoForVariant(variantDefinition, getUiAnnotation);
    let lineItemInfo;
    let tableType;
    if (!isChart) {
        if ((0, manifestPropertyUtils_1.hasPropertyTypeError)(variantDefinition, 'tableSettings', generateParameters.logger, 'object')) {
            return {
                accessor: variantSelector,
                iconTabFilterKey: (0, stableIdUtils_1.replaceSpecialCharsInId)(variantDefinition['key'], generateParameters),
                variantDefinition: variantDefinition,
                isChart: false,
                smartControlId,
                description: variantDescription
            };
        }
        const variantTableSettings = variantDefinition['tableSettings'] || undefined;
        if (variantTableSettings) {
            if ((0, manifestPropertyUtils_1.hasPropertyTypeError)(variantTableSettings, 'type', generateParameters.logger, 'string') ||
                !(0, Table_1.checkTableType)(variantTableSettings['type'], generateParameters.logger)) {
                return {
                    accessor: variantSelector,
                    iconTabFilterKey: (0, stableIdUtils_1.replaceSpecialCharsInId)(variantDefinition['key'], generateParameters),
                    variantDefinition: variantDefinition,
                    isChart: false,
                    smartControlId,
                    description: variantDescription
                };
            }
            tableType = variantTableSettings['type'];
        }
        tableType = tableType || defaultTableSettings['type'] || (0, Table_1.getDefaultTableType)(entityTypeDefinition);
        if (tableType === v2.TableTypeV2Enum.ResponsiveTable) {
            usedTableTypes.responsive = usedTableTypes.responsive + 1;
        }
        else {
            usedTableTypes.nonResponsive = usedTableTypes.nonResponsive + 1;
        }
        const lineItemDefinition = getUiAnnotation(lineItemName);
        if (lineItemDefinition) {
            lineItemInfo = (0, utils_2.getLineItemInfo)(lineItemName, lineItemDefinition, entityTypeDefinition, tableType, generateParameters, false);
        }
    }
    const entitySetDefinition = metaInfo.entitySetDefinition; // if metaInfo would have been undefined we would have returned already
    return {
        accessor: variantSelector,
        iconTabFilterKey: (0, stableIdUtils_1.replaceSpecialCharsInId)(variantDefinition['key'], generateParameters),
        variantDefinition,
        isChart,
        smartControlId,
        description: variantDescription,
        lineItemInfo,
        entityTypeDefinition,
        entitySetDefinition,
        tableType
    };
}
/**
 * This function analyses all views defined in the manifest and collects information about them.
 *
 * @param variants - the views defined in the manifest
 * @param generateParameters - parameters used for generating the app schema
 * @param tableParams - parameters for the table view node hosting the collection of views
 * @param defaultTableSettings - the page global tableSettings object from the manifest, resp. an empty object if not defined
 * @returns the instance of VariantInfo representing the views and the usage information of different table types.
 * Note that variantsToInfo will be undefined in case there is a severe inconsistency in the manifest definition of the views.
 * In this case an error will also have been logged.
 */
function getVariantsToInfo(variants, generateParameters, tableParams, defaultTableSettings) {
    const variantsToInfo = {};
    const usedTableTypes = {
        responsive: 0,
        nonResponsive: 0
    };
    const hasErrors = Object.keys(variants).some(function (variantSelector) {
        if ((0, manifestPropertyUtils_1.hasPropertyTypeError)(variants, variantSelector, generateParameters.logger, 'object', true)) {
            return true;
        }
        const variantDefinition = variants[variantSelector]; // the variant definition from the manifest
        if (!variantDefinition['key']) {
            (0, extensionLogger_1.log)(generateParameters.logger, {
                severity: "error" /* LogSeverity.Error */,
                message: i18next_1.default.t('NOKEY4VIEW', { property: variantSelector })
            });
            return true;
        }
        const variantInfo = getVariantInfo(variantSelector, variantDefinition, usedTableTypes, generateParameters, tableParams, defaultTableSettings);
        variantsToInfo[variantSelector] = variantInfo;
    });
    return { variantsToInfo: hasErrors ? undefined : variantsToInfo, usedTableTypes };
}
/**
 * Retrieves the information about all views defined in the manifest for a multi-view multi-table scenario and returns them as instance of MultiTableAllVariantsInfo.
 *
 * @param tableParams - parameters for the table view node hosting the collection of views
 * @param generateParameters - parameters used for generating the app schema
 * @returns the instance of MultiTableAllVariantsInfo representing the views. Undefined in case there is a severe inconsistency in the manifest definition of the views.
 * In this case an error will also have been logged.
 */
function getMultiTableAllVariantsInfo(tableParams, generateParameters) {
    const quickVariantSelectionX = tableParams.settings.quickVariantSelectionX;
    if ((0, manifestPropertyUtils_1.hasPropertyTypeError)(quickVariantSelectionX, 'variants', generateParameters.logger, 'object', true)) {
        return undefined;
    }
    const defaultTableSettings = (tableParams.settings?.tableSettings || {});
    const { variantsToInfo, usedTableTypes } = getVariantsToInfo(quickVariantSelectionX['variants'], generateParameters, tableParams, defaultTableSettings);
    if (!variantsToInfo) {
        return undefined;
    }
    const multiTableParams = { ...tableParams };
    multiTableParams.multiTableInfo = {
        usedTableTypes
    };
    return {
        tableParams: multiTableParams,
        variantsToInfo
    };
}
class MultiViewsDefinition {
}
exports.MultiViewsDefinition = MultiViewsDefinition;
__decorate([
    (0, decoration_1.syncRule)(syncRuleForQuickVariantSelectionXProperty)
], MultiViewsDefinition.prototype, "enableAutoBinding", void 0);
__decorate([
    (0, decoration_1.syncRule)(syncRuleForQuickVariantSelectionXProperty)
], MultiViewsDefinition.prototype, "showCounts", void 0);
__decorate([
    (0, decoration_1.syncRule)({
        processingRuleAdapter(processingRule, schemaHandlingParams, generateParameters) {
            const tableParams = schemaHandlingParams.specificParams;
            const multiTableAllVariantsInfo = getMultiTableAllVariantsInfo(tableParams, generateParameters);
            if (multiTableAllVariantsInfo) {
                processingRule.referenceAdaptation = {
                    specificParams: multiTableAllVariantsInfo,
                    syncRuleProvider: MultiViewsVariants
                };
            }
            else {
                delete processingRule.element;
            }
        }
    })
], MultiViewsDefinition.prototype, "variants", void 0);
/**
 * This Map collects the SyncRules for those properties of class Table that are only relevant in the multi-view multi-table scenario.
 * They are exposed via function getSyncRuleForMultiTableManifestProperty (and used in class Table).
 */
const syncRulesForMultiTable = new Map();
// Define SyncRule for property 'views'
syncRulesForMultiTable.set('views', {
    processingRuleAdapter(processingRule, schemaHandlingParams, generateParameters) {
        // The views node should only be there when we are indeed in a multi-view multi-table scenario and we are still on the top level (not on the level of a view).
        const tableParams = schemaHandlingParams.specificParams;
        if (tableParams.multiTableInfo && !tableParams.multiTableInfo.variantInfo) {
            processingRule.referenceAdaptation = {
                syncRuleProvider: MultiViewsDefinition
            };
        }
        else {
            delete processingRule.element;
        }
    }
});
/**
 * Define a SyncRule for one of the properties of Table that are only relevant for the single views but not for the top level table node.
 *
 * @param property - name of the property
 * @param adapt - function that adapts the schema element
 * @param onlyChartI18nKey - if provided this property will only be valid for chart variants. The value is the i18n key for the message that will be shown if the property has been set for a non-chart view.
 */
function setQuickVariantSelectionXOnlySyncRule(property, adapt, onlyChartI18nKey) {
    // Build the analyze-function for getSyncRuleForManifestProperty:
    const analyze = function (element, schemaHandlingParams) {
        const tableParams = schemaHandlingParams.specificParams;
        let manifestPath;
        let disallowedReason;
        if (tableParams.multiTableInfo?.variantInfo) {
            // If we are on the level of a variant
            manifestPath = (0, utils_1.getManifestPathToPageSettings)(schemaHandlingParams.pageInfo.pagePath, [
                'quickVariantSelectionX',
                'variants',
                tableParams.multiTableInfo.variantInfo.accessor
            ]);
            if (onlyChartI18nKey && !tableParams.multiTableInfo.variantInfo.isChart) {
                disallowedReason = i18next_1.default.t(onlyChartI18nKey);
            }
        }
        else {
            disallowedReason = manifestPropertyUtils_1.DISALLOWED_WITHOUT_EXPLANATION; // As this property is only valid for quickVariantSelectionX variants we simply ignore it on top table level
        }
        return { manifestPath, disallowedReason };
    };
    syncRulesForMultiTable.set(property, (0, manifestPropertyUtils_1.getSyncRuleForManifestProperty)(property, analyze, adapt));
}
// Define SyncRule for property 'entitySet'
setQuickVariantSelectionXOnlySyncRule('entitySet', 
// adapt:
function (element, schemaHandlingParams, generateParameters) {
    const possibleEntitySets = generateParameters.serviceAVT.entitySets.map((entitySet) => entitySet.name);
    (0, common_1.addEnumToSchema)(possibleEntitySets, element);
} // adapt
);
// Define SyncRule for property 'annotationPath'
setQuickVariantSelectionXOnlySyncRule('annotationPath', 
// adapt:
function (element, schemaHandlingParams) {
    const tableParams = schemaHandlingParams.specificParams;
    (0, common_1.addEnumForValidAnnotations)(tableParams.multiTableInfo.variantInfo.entityTypeDefinition, ["com.sap.vocabularies.UI.v1.SelectionPresentationVariant" /* UIAnnotationTerms.SelectionPresentationVariant */, "com.sap.vocabularies.UI.v1.SelectionVariant" /* UIAnnotationTerms.SelectionVariant */], element);
} // adapt
);
// Define SyncRule for property 'showItemNavigationOnChart'
setQuickVariantSelectionXOnlySyncRule('showItemNavigationOnChart', undefined, 'SHOWITEMNAVIGATIONONCHARTONLYCHART');
/**
 * Expose SyncRules for those properties of class Table that are only relevant in the multi-view multi-table scenario.
 *
 * @param property - name of the property
 * @returns the SyncRule for the given property (if the property is relevant in multi-view multi-table scenario), undefined otherwise
 */
function getSyncRuleForMultiTableManifestProperty(property) {
    return syncRulesForMultiTable.get(property);
}
//# sourceMappingURL=MultiTable.js.map