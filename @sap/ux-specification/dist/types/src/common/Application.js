"use strict";
// we need to disable two eslint rules because we use @internal true as custom parameter,
// which is actually a valid jsdoc tag, that has no value true.
/* eslint-disable jsdoc/valid-types */
/* eslint-disable jsdoc/empty-tags */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudDevAdaptationStatus = exports.FlexibleColumnLayoutAggregations = exports.StatePreservationMode = exports.TableColumnVerticalAlignment = exports.DraftDiscardEnabledSettings = void 0;
var DraftDiscardEnabledSettings;
(function (DraftDiscardEnabledSettings) {
    DraftDiscardEnabledSettings["restricted"] = "restricted";
})(DraftDiscardEnabledSettings || (exports.DraftDiscardEnabledSettings = DraftDiscardEnabledSettings = {}));
var TableColumnVerticalAlignment;
(function (TableColumnVerticalAlignment) {
    TableColumnVerticalAlignment["Top"] = "Top";
    TableColumnVerticalAlignment["Middle"] = "Middle";
    TableColumnVerticalAlignment["Bottom"] = "Bottom";
})(TableColumnVerticalAlignment || (exports.TableColumnVerticalAlignment = TableColumnVerticalAlignment = {}));
var StatePreservationMode;
(function (StatePreservationMode) {
    StatePreservationMode["persistence"] = "persistence";
    StatePreservationMode["discovery"] = "discovery";
})(StatePreservationMode || (exports.StatePreservationMode = StatePreservationMode = {}));
var FlexibleColumnLayoutAggregations;
(function (FlexibleColumnLayoutAggregations) {
    FlexibleColumnLayoutAggregations["BeginColumnPages"] = "beginColumnPages";
    FlexibleColumnLayoutAggregations["MidColumnPages"] = "midColumnPages";
    FlexibleColumnLayoutAggregations["EndColumnPages"] = "endColumnPages";
})(FlexibleColumnLayoutAggregations || (exports.FlexibleColumnLayoutAggregations = FlexibleColumnLayoutAggregations = {}));
/**
 * @internal true
 */
var CloudDevAdaptationStatus;
(function (CloudDevAdaptationStatus) {
    CloudDevAdaptationStatus["Released"] = "released";
    CloudDevAdaptationStatus["Deprecated"] = "deprecated";
    CloudDevAdaptationStatus["Obsolete"] = "obsolete";
})(CloudDevAdaptationStatus || (exports.CloudDevAdaptationStatus = CloudDevAdaptationStatus = {}));
//# sourceMappingURL=Application.js.map