"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Features = exports.CustomExtensionType = exports.TemplateType = exports.PropertyMessageType = exports.logSeverityLabel = exports.LogSeverity = void 0;
var LogSeverity;
(function (LogSeverity) {
    LogSeverity["Error"] = "error";
    LogSeverity["Warning"] = "warning";
    LogSeverity["Info"] = "info";
})(LogSeverity || (exports.LogSeverity = LogSeverity = {}));
exports.logSeverityLabel = {
    ["error" /* LogSeverity.Error */]: 'Error',
    ["warning" /* LogSeverity.Warning */]: 'Warning',
    ["info" /* LogSeverity.Info */]: 'Information'
};
/*********************************************************************
 * Types for app schema generation
 *********************************************************************/
/**
 * Enum representing the types of messages that can be associated with a property.
 *
 * @enum {string}
 * @property Error - Represents an error message type.
 * @property Warning - Represents a warning message type.
 * @property Info - Represents an informational message type.
 */
var PropertyMessageType;
(function (PropertyMessageType) {
    PropertyMessageType["Error"] = "error";
    PropertyMessageType["Warning"] = "warning";
    PropertyMessageType["Info"] = "info";
})(PropertyMessageType || (exports.PropertyMessageType = PropertyMessageType = {}));
var TemplateType;
(function (TemplateType) {
    TemplateType["ListReportObjectPageV2"] = "ListReportObjectPageV2";
    TemplateType["ListReportObjectPageV4"] = "ListReportObjectPageV4";
    TemplateType["OverviewPageV2"] = "OverviewPageV2";
    TemplateType["AnalyticalListPageV2"] = "AnalyticalListPageV2";
    TemplateType["AnalyticalListPageV4"] = "AnalyticalListPageV4";
    TemplateType["FreestylePageV4"] = "FreestylePageV4";
})(TemplateType || (exports.TemplateType = TemplateType = {}));
var CustomExtensionType;
(function (CustomExtensionType) {
    CustomExtensionType["ControllerExtension"] = "ControllerExtension";
    CustomExtensionType["CustomAction"] = "CustomAction";
    CustomExtensionType["ActionMenu"] = "ActionMenu";
    CustomExtensionType["CustomColumn"] = "CustomColumn";
    CustomExtensionType["CustomFilterField"] = "CustomFilterField";
    CustomExtensionType["CustomHeaderSection"] = "CustomHeaderSection";
    CustomExtensionType["CustomPage"] = "CustomPage";
    CustomExtensionType["CustomSection"] = "CustomSection";
    CustomExtensionType["CustomSubSection"] = "CustomSubSection";
    CustomExtensionType["CustomView"] = "CustomView";
    CustomExtensionType["ListReport"] = "ListReport";
    CustomExtensionType["ObjectPage"] = "ObjectPage";
    CustomExtensionType["CustomField"] = "CustomField";
})(CustomExtensionType || (exports.CustomExtensionType = CustomExtensionType = {}));
/**
 * API Feature toggles
 */
var Features;
(function (Features) {
    Features["BuildingBlocks"] = "BuildingBlocks";
})(Features || (exports.Features = Features = {}));
//# sourceMappingURL=apiTypes.js.map