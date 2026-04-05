"use strict";
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregationNodeType = exports.TRANSLATION_BUNDLE_UI5 = exports.TRANSLATION_BUNDLE_SERVICE = exports.TRANSLATION_BUNDLE_ANNOTATION = exports.TRANSLATION_BUNDLE_APP = exports.SAP_ANNOTATION_NAMESPACE = exports.PropertyMessageType = exports.ValidationState = exports.PendingChange = exports.AggregationSortBy = exports.AggregationActions = exports.AggregationType = exports.SortingOptions = exports.PropertiesType = exports.EXTENSION_TABLE_TYPE_MAP = exports.FacetTitlePrefix = exports.EXTERNAL_CREATION_FORM = exports.SCHEMA_CREATION_FORM = exports.ANNOTATION_CREATION_FORM = exports.TABLE_TYPE_EXTENSION_MAP = exports.TableColumnExtensionType = exports.CUSTOM_AGGREGATION_FORMS = exports.AggregationCreationForm = exports.CUSTOM_VIEW_PREFIX = exports.ANNOTATION_TYPES_SEPARATOR = exports.DATA_FIELD_FOR_ACTION_GROUP = exports.DATA_FIELD_FOR_INTENT_BASED_NAVIGATION = exports.DATA_FIELD_ACTION = void 0;
const ux_specification_types_1 = require("@sap/ux-specification-types");
__exportStar(require("./annotations"), exports);
__exportStar(require("./common"), exports);
exports.DATA_FIELD_ACTION = 'DataFieldForAction';
exports.DATA_FIELD_FOR_INTENT_BASED_NAVIGATION = 'DataFieldForIntentBasedNavigation';
exports.DATA_FIELD_FOR_ACTION_GROUP = 'DataFieldForActionGroup';
exports.ANNOTATION_TYPES_SEPARATOR = '::';
exports.CUSTOM_VIEW_PREFIX = 'customView(';
var AggregationCreationForm;
(function (AggregationCreationForm) {
    AggregationCreationForm["AnalyticalChart"] = "AnalyticalChart";
    AggregationCreationForm["AnalyticalChartView"] = "AnalyticalChartView";
    AggregationCreationForm["ChartSection"] = "ChartSection";
    AggregationCreationForm["CustomAction"] = "CustomAction";
    AggregationCreationForm["CustomSection"] = "CustomSection";
    AggregationCreationForm["CustomColumn"] = "CustomColumn";
    AggregationCreationForm["CustomColumnV4"] = "CustomColumnV4";
    AggregationCreationForm["CustomViewV4"] = "CustomViewV4";
    AggregationCreationForm["DataPointSection"] = "DataPointSection";
    AggregationCreationForm["Generic"] = "Generic";
    AggregationCreationForm["MacrosChart"] = "MacrosChart";
    AggregationCreationForm["MacrosFilterBar"] = "MacrosFilterBar";
    AggregationCreationForm["MacrosTable"] = "MacrosTable";
    AggregationCreationForm["NativeAction"] = "NativeAction";
    AggregationCreationForm["NativeNavigation"] = "NativeNavigation";
    AggregationCreationForm["NativeBasicColumn"] = "Basic";
    AggregationCreationForm["NativeChartColumn"] = "Chart";
    AggregationCreationForm["NativeContactColumn"] = "Contact";
    AggregationCreationForm["NativeContactField"] = "NativeContactField";
    AggregationCreationForm["NativeConnectedFields"] = "NativeConnectedFields";
    AggregationCreationForm["NativeField"] = "NativeField";
    AggregationCreationForm["NativeFilterFields"] = "NativeFilterFields";
    AggregationCreationForm["NativeVisualFilters"] = "NativeVisualFilters";
    AggregationCreationForm["NativeGroupSection"] = "NativeGroupSection";
    AggregationCreationForm["NativeIdentification"] = "NativeIdentification";
    AggregationCreationForm["NativeRatingColumn"] = "Rating";
    AggregationCreationForm["NativeProgressColumn"] = "Progress";
    AggregationCreationForm["NativeSection"] = "NativeSection";
    AggregationCreationForm["NativeTableSection"] = "NativeTableSection";
    AggregationCreationForm["ProgressSection"] = "ProgressSection";
    AggregationCreationForm["RatingSection"] = "RatingSection";
    AggregationCreationForm["TableView"] = "TableView";
    AggregationCreationForm["CustomSubSection"] = "CustomSubSection";
    AggregationCreationForm["CustomHeaderSection"] = "CustomHeaderSection";
    AggregationCreationForm["CustomFilterField"] = "CustomFilterField";
})(AggregationCreationForm || (exports.AggregationCreationForm = AggregationCreationForm = {}));
exports.CUSTOM_AGGREGATION_FORMS = [
    AggregationCreationForm.Generic,
    AggregationCreationForm.CustomSection,
    AggregationCreationForm.CustomColumn
];
var TableColumnExtensionType;
(function (TableColumnExtensionType) {
    TableColumnExtensionType["ResponsiveTableColumnsExtension"] = "ResponsiveTableColumnsExtension";
    TableColumnExtensionType["AnalyticalTableColumnsExtension"] = "AnalyticalTableColumnsExtension";
    TableColumnExtensionType["TreeTableColumnsExtension"] = "TreeTableColumnsExtension";
    TableColumnExtensionType["GridTableColumnsExtension"] = "GridTableColumnsExtension";
})(TableColumnExtensionType || (exports.TableColumnExtensionType = TableColumnExtensionType = {}));
exports.TABLE_TYPE_EXTENSION_MAP = new Map([
    [ux_specification_types_1.v2.TableTypeV2.ResponsiveTable, "ResponsiveTableColumnsExtension" /* TableColumnExtensionType.ResponsiveTableColumnsExtension */],
    [ux_specification_types_1.v2.TableTypeV2.GridTable, "GridTableColumnsExtension" /* TableColumnExtensionType.GridTableColumnsExtension */],
    [ux_specification_types_1.v2.TableTypeV2.AnalyticalTable, "AnalyticalTableColumnsExtension" /* TableColumnExtensionType.AnalyticalTableColumnsExtension */],
    [ux_specification_types_1.v2.TableTypeV2.TreeTable, "TreeTableColumnsExtension" /* TableColumnExtensionType.TreeTableColumnsExtension */]
]);
exports.ANNOTATION_CREATION_FORM = 'annotation';
exports.SCHEMA_CREATION_FORM = 'schema';
exports.EXTERNAL_CREATION_FORM = 'external';
exports.FacetTitlePrefix = 'Facet ID: ';
// Inverted map of TABLE_TYPE_EXTENSION_MAP
exports.EXTENSION_TABLE_TYPE_MAP = new Map([...exports.TABLE_TYPE_EXTENSION_MAP.entries()].map(([key, value]) => [value, key]));
var PropertiesType;
(function (PropertiesType) {
    PropertiesType[PropertiesType["Flat"] = 0] = "Flat";
    PropertiesType[PropertiesType["AnyOf"] = 1] = "AnyOf";
})(PropertiesType || (exports.PropertiesType = PropertiesType = {}));
var SortingOptions;
(function (SortingOptions) {
    SortingOptions["Enabled"] = "Enabled";
    SortingOptions["Excluded"] = "Excluded";
    SortingOptions["Readonly"] = "Readonly";
})(SortingOptions || (exports.SortingOptions = SortingOptions = {}));
var AggregationType;
(function (AggregationType) {
    AggregationType["Object"] = "Object";
    AggregationType["Array"] = "Array";
})(AggregationType || (exports.AggregationType = AggregationType = {}));
var AggregationActions;
(function (AggregationActions) {
    AggregationActions["Delete"] = "Delete";
    AggregationActions["OpenSource"] = "OpenSource";
    AggregationActions["Edit"] = "Edit";
})(AggregationActions || (exports.AggregationActions = AggregationActions = {}));
var AggregationSortBy;
(function (AggregationSortBy) {
    AggregationSortBy["ViewNode"] = "ViewNode";
})(AggregationSortBy || (exports.AggregationSortBy = AggregationSortBy = {}));
var PendingChange;
(function (PendingChange) {
    PendingChange["Creation"] = "Creation";
    PendingChange["MoveDnD"] = "MoveDnD";
    PendingChange["MoveButton"] = "MoveButton";
})(PendingChange || (exports.PendingChange = PendingChange = {}));
var ValidationState;
(function (ValidationState) {
    ValidationState[ValidationState["Valid"] = 0] = "Valid";
    ValidationState[ValidationState["Invalid"] = 1] = "Invalid";
    ValidationState[ValidationState["Skipped"] = 2] = "Skipped";
    ValidationState[ValidationState["ReadOnly"] = 3] = "ReadOnly";
})(ValidationState || (exports.ValidationState = ValidationState = {}));
var PropertyMessageType;
(function (PropertyMessageType) {
    /**
     * Reports an error.
     */
    PropertyMessageType["Error"] = "error";
    /**
     * Reports a warning.
     */
    PropertyMessageType["Warning"] = "warning";
    /**
     * Reports an information.
     */
    PropertyMessageType["Info"] = "info";
})(PropertyMessageType || (exports.PropertyMessageType = PropertyMessageType = {}));
exports.SAP_ANNOTATION_NAMESPACE = '@com.sap.vocabularies.UI.v1';
exports.TRANSLATION_BUNDLE_APP = 'app';
exports.TRANSLATION_BUNDLE_ANNOTATION = 'annotation';
exports.TRANSLATION_BUNDLE_SERVICE = 'service';
exports.TRANSLATION_BUNDLE_UI5 = 'ui5';
var AggregationNodeType;
(function (AggregationNodeType) {
    AggregationNodeType["customAction"] = "customAction";
    AggregationNodeType["customColumn"] = "customColumn";
    AggregationNodeType["customSection"] = "customSection";
    AggregationNodeType["customFilterField"] = "customFilterField";
    AggregationNodeType["rootNode"] = "rootNode";
    AggregationNodeType["views"] = "views";
})(AggregationNodeType || (exports.AggregationNodeType = AggregationNodeType = {}));
//# sourceMappingURL=index.js.map