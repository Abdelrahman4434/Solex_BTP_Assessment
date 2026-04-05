"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationGroupingMode = exports.EMPTY_OPTION = exports.DefaultPathType = exports.InitialLoadType = exports.TableTypeV4 = exports.RowCountMode = exports.SelectionMode = void 0;
/**
 * @artifactType Manifest
 * @descriptionSrcURL https://help.sap.com/docs/SAPUI5/4a476671e9bd4e898445a16858d9cf24/116b5d82e8c545e2a56e1b51b8b0a9bd.html?#additional-features-in-sap-fiori-elements-for-odata-v4
 */
var SelectionMode;
(function (SelectionMode) {
    SelectionMode["Multi"] = "Multi";
    SelectionMode["None"] = "None";
    SelectionMode["Single"] = "Single";
    SelectionMode["Auto"] = "Auto";
})(SelectionMode || (exports.SelectionMode = SelectionMode = {}));
/**
 * @artifactType Manifest
 * @descriptionSrcURL https://ui5.sap.com/#/api/sap.ui.mdc.enums.TableRowCountMode
 */
var RowCountMode;
(function (RowCountMode) {
    RowCountMode["Fixed"] = "Fixed";
    RowCountMode["Auto"] = "Auto";
    // @validity: since: '1.130.0'
    RowCountMode["Interactive"] = "Interactive";
})(RowCountMode || (exports.RowCountMode = RowCountMode = {}));
var TableTypeV4;
(function (TableTypeV4) {
    TableTypeV4["ResponsiveTable"] = "ResponsiveTable";
    TableTypeV4["GridTable"] = "GridTable";
    TableTypeV4["AnalyticalTable"] = "AnalyticalTable";
    TableTypeV4["TreeTable"] = "TreeTable";
})(TableTypeV4 || (exports.TableTypeV4 = TableTypeV4 = {}));
var InitialLoadType;
(function (InitialLoadType) {
    InitialLoadType["Disabled"] = "Disabled";
    InitialLoadType["Enabled"] = "Enabled";
    InitialLoadType["Auto"] = "Auto";
})(InitialLoadType || (exports.InitialLoadType = InitialLoadType = {}));
var DefaultPathType;
(function (DefaultPathType) {
    DefaultPathType["Primary"] = "primary";
    DefaultPathType["Secondary"] = "secondary";
    DefaultPathType["Both"] = "both";
})(DefaultPathType || (exports.DefaultPathType = DefaultPathType = {}));
exports.EMPTY_OPTION = '';
/**
 * @artifactType Manifest
 * @descriptionSrcURL https://ui5.sap.com/sdk/#/topic/965ef5b2895641bc9b6cd44f1bd0eb4d
 */
var OperationGroupingMode;
(function (OperationGroupingMode) {
    OperationGroupingMode["ChangeSet"] = "ChangeSet";
    OperationGroupingMode["Isolated"] = "Isolated";
})(OperationGroupingMode || (exports.OperationGroupingMode = OperationGroupingMode = {}));
//# sourceMappingURL=Table.js.map