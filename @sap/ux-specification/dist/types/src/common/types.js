"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleName = exports.TRANSLATION_BUNDLE_UI5 = exports.TRANSLATION_BUNDLE_SERVICE = exports.TRANSLATION_BUNDLE_ANNOTATION = exports.TRANSLATION_BUNDLE_APP = exports.MacrosAggregatioCardinality = exports.MacrosPropertyType = exports.FRAGMENTNAMEPART = exports.DATESETTINGSPATH = exports.QUICKVARPATHX = exports.QUICKVARPATH = exports.UIVOCABULARYALPHADOT = exports.UIVOCABULARYDOT = exports.UIVOCABULARY = exports.VOCWITHCOLONS = exports.VOCWITHSLASH = exports.MANIFESTPATH = exports.SchemaKeyName = exports.SchemaTag = exports.CustomUIAnnotationTypes = exports.PropertyName = exports.DefinitionName = exports.ViewTemplateType = exports.BINDINGPROPERTYREGEXSTRING = exports.FacetBase = exports.defaultExportResult = exports.ChangeIndicator = exports.ACTIONTITLEPREFIX = exports.FACETTITLEPREFIX = exports.FileName = exports.DirName = exports.Visualization = exports.ControlType = exports.ActionType = exports.ArtifactType = exports.SectionType = exports.ALPViewType = exports.ExportArtifacts = exports.CreationFieldType = exports.SchemaType = exports.FlexChangeLayer = exports.TemplatePropertyName = exports.FlexibleColumnLayoutType = void 0;
var FlexibleColumnLayoutType;
(function (FlexibleColumnLayoutType) {
    FlexibleColumnLayoutType["OneColumn"] = "OneColumn";
    FlexibleColumnLayoutType["TwoColumnsBeginExpanded"] = "TwoColumnsBeginExpanded";
    FlexibleColumnLayoutType["TwoColumnsMidExpanded"] = "TwoColumnsMidExpanded";
    FlexibleColumnLayoutType["MidColumnFullScreen"] = "MidColumnFullScreen";
    FlexibleColumnLayoutType["ThreeColumnsMidExpanded"] = "ThreeColumnsMidExpanded";
    FlexibleColumnLayoutType["ThreeColumnsEndExpanded"] = "ThreeColumnsEndExpanded";
    FlexibleColumnLayoutType["ThreeColumnsMidExpandedEndHidden"] = "ThreeColumnsMidExpandedEndHidden";
    FlexibleColumnLayoutType["ThreeColumnsBeginExpandedEndHidden"] = "ThreeColumnsBeginExpandedEndHidden";
    FlexibleColumnLayoutType["EndColumnFullScreen"] = "EndColumnFullScreen";
})(FlexibleColumnLayoutType || (exports.FlexibleColumnLayoutType = FlexibleColumnLayoutType = {}));
var TemplatePropertyName;
(function (TemplatePropertyName) {
    TemplatePropertyName["Press"] = "press";
    TemplatePropertyName["Menu"] = "menu";
    TemplatePropertyName["Template"] = "template";
    TemplatePropertyName["Position"] = "position";
})(TemplatePropertyName || (exports.TemplatePropertyName = TemplatePropertyName = {}));
var FlexChangeLayer;
(function (FlexChangeLayer) {
    FlexChangeLayer["Vendor"] = "VENDOR";
    FlexChangeLayer["Customer"] = "CUSTOMER_BASE";
})(FlexChangeLayer || (exports.FlexChangeLayer = FlexChangeLayer = {}));
/**
 * Type for all available schema types, e.g. Application, ListReport, ObjectPage, ...
 */
var SchemaType;
(function (SchemaType) {
    SchemaType["Application"] = "Application";
    SchemaType["ObjectPage"] = "ObjectPage";
    SchemaType["ListReport"] = "ListReport";
    SchemaType["OverviewPage"] = "OverviewPage";
    SchemaType["AnalyticalListPage"] = "AnalyticalListPage";
    SchemaType["FreestylePage"] = "FreestylePage";
    SchemaType["FPMCustomPage"] = "FPMCustomPage";
    SchemaType["BuildingBlocks"] = "BuildingBlocks";
})(SchemaType || (exports.SchemaType = SchemaType = {}));
var CreationFieldType;
(function (CreationFieldType) {
    CreationFieldType["Field"] = "Field";
    CreationFieldType["FieldGroup"] = "FieldGroup";
})(CreationFieldType || (exports.CreationFieldType = CreationFieldType = {}));
var ExportArtifacts;
(function (ExportArtifacts) {
    ExportArtifacts["flex"] = "flex";
    ExportArtifacts["manifest"] = "manifest";
})(ExportArtifacts || (exports.ExportArtifacts = ExportArtifacts = {}));
var ALPViewType;
(function (ALPViewType) {
    ALPViewType["Primary"] = "primary";
    ALPViewType["Secondary"] = "secondary";
})(ALPViewType || (exports.ALPViewType = ALPViewType = {}));
var SectionType;
(function (SectionType) {
    SectionType["Section"] = "Section";
    SectionType["SubSection"] = "SubSection";
    SectionType["HeaderSection"] = "HeaderSection";
})(SectionType || (exports.SectionType = SectionType = {}));
var ArtifactType;
(function (ArtifactType) {
    ArtifactType["Manifest"] = "Manifest";
    ArtifactType["FlexChange"] = "FlexChange";
    ArtifactType["Annotation"] = "Annotation";
    ArtifactType["XMLProperty"] = "XMLProperty";
})(ArtifactType || (exports.ArtifactType = ArtifactType = {}));
var ActionType;
(function (ActionType) {
    ActionType["Annotation"] = "Annotation";
    ActionType["Copy"] = "Copy";
    ActionType["Criticality"] = "Criticality";
    ActionType["Custom"] = "Custom";
    ActionType["CustomMenu"] = "CustomMenu";
    ActionType["RelatedApps"] = "RelatedApps";
    ActionType["Standard"] = "Standard";
})(ActionType || (exports.ActionType = ActionType = {}));
var ControlType;
(function (ControlType) {
    ControlType["Table"] = "sap.m.Table";
    ControlType["TableColumn"] = "sap.m.Column";
    ControlType["SmartTable"] = "sap.ui.comp.smarttable.SmartTable";
    ControlType["SmartFilterBar"] = "sap.ui.comp.smartfilterbar.SmartFilterBar";
    ControlType["SmartChart"] = "sap.ui.comp.smartchart.SmartChart";
    ControlType["Group"] = "sap.ui.comp.smartform.Group";
    ControlType["GroupElement"] = "sap.ui.comp.smartform.GroupElement";
    ControlType["Button"] = "sap.m.Button";
    ControlType["ToolbarButton"] = "sap.m.OverflowToolbarButton";
    ControlType["Avatar"] = "sap.f.Avatar";
    ControlType["ObjectPageDynamicHeaderTitle"] = "sap.uxap.ObjectPageDynamicHeaderTitle";
    ControlType["ObjectPageGridProperties"] = "sap.ui.layout.GridData";
    ControlType["ObjectPageHeader"] = "sap.uxap.ObjectPageHeader";
    ControlType["ObjectPageLayout"] = "sap.uxap.ObjectPageLayout";
    ControlType["HeaderAction"] = "sap.uxap.ObjectPageHeaderActionButton";
    ControlType["ObjectPageHeaderSection"] = "sap.m.VBox";
    ControlType["DynamicPage"] = "sap.f.DynamicPage";
    ControlType["Form"] = "sap.ui.layout.form";
    ControlType["Chart"] = "sap.suite.ui.microchart";
    ControlType["Section"] = "sap.uxap.ObjectPageSection";
    ControlType["SubSection"] = "sap.uxap.ObjectPageSubSection";
})(ControlType || (exports.ControlType = ControlType = {}));
var Visualization;
(function (Visualization) {
    Visualization["LineItem"] = "LineItem";
    Visualization["Chart"] = "Chart";
})(Visualization || (exports.Visualization = Visualization = {}));
var DirName;
(function (DirName) {
    DirName["Sapux"] = "src";
    DirName["Schemas"] = ".schemas";
    DirName["Pages"] = "pages";
    DirName["Webapp"] = "webapp";
    DirName["Temp"] = ".tmp";
    DirName["Changes"] = "changes";
    DirName["LocalService"] = "localService";
    DirName["Controller"] = "controller";
    DirName["View"] = "view";
    DirName["Fragment"] = "fragment";
    DirName["Ext"] = "ext";
    DirName["VSCode"] = ".vscode";
})(DirName || (exports.DirName = DirName = {}));
var FileName;
(function (FileName) {
    FileName["App"] = "app.json";
})(FileName || (exports.FileName = FileName = {}));
exports.FACETTITLEPREFIX = 'Facet ID: ';
exports.ACTIONTITLEPREFIX = 'Action ID: ';
var ChangeIndicator;
(function (ChangeIndicator) {
    ChangeIndicator["NoChange"] = "NoChange";
    ChangeIndicator["Created"] = "Created";
    ChangeIndicator["Updated"] = "Updated";
    ChangeIndicator["Deleted"] = "Deleted";
})(ChangeIndicator || (exports.ChangeIndicator = ChangeIndicator = {}));
exports.defaultExportResult = {
    manifest: {
        'sap.ui5': {
            flexEnabled: true,
            routing: {
                targets: {}
            }
        },
        'sap.app': {}
    },
    manifestChangeIndicator: ChangeIndicator.NoChange,
    flexChanges: [],
    fragments: [],
    views: []
};
var FacetBase;
(function (FacetBase) {
    FacetBase["LineItem"] = "LineItem";
    FacetBase["CollectionFacet"] = "CollectionFacet";
    FacetBase["Chart"] = "Chart";
    FacetBase["Form"] = "Form";
    FacetBase["Identification"] = "Identification";
    FacetBase["DataPoint"] = "DataPoint";
    FacetBase["Address"] = "Address";
    FacetBase["Contact"] = "Contact";
    FacetBase["PresentationVariant"] = "PresentationVariant";
    FacetBase["SelectionPresentationVariant"] = "SelectionPresentationVariant";
    FacetBase["Unknown"] = "";
})(FacetBase || (exports.FacetBase = FacetBase = {}));
exports.BINDINGPROPERTYREGEXSTRING = "^{[A-Za-z0-9{}&$!@#%? _|,<>'()[\\]\\/:=.]+}$";
var ViewTemplateType;
(function (ViewTemplateType) {
    ViewTemplateType["ResponsiveTableColumnsExtension"] = "ResponsiveTableColumnsExtension";
    ViewTemplateType["AnalyticalTableColumnsExtension"] = "AnalyticalTableColumnsExtension";
    ViewTemplateType["TreeTableColumnsExtension"] = "TreeTableColumnsExtension";
    ViewTemplateType["GridTableColumnsExtension"] = "GridTableColumnsExtension";
    ViewTemplateType["ResponsiveTableCellsExtension"] = "ResponsiveTableCellsExtension";
})(ViewTemplateType || (exports.ViewTemplateType = ViewTemplateType = {}));
//Definitions for elements in app schema
var DefinitionName;
(function (DefinitionName) {
    DefinitionName["Action"] = "Action";
    DefinitionName["Actions"] = "Actions";
    DefinitionName["AdditionalPropertiesHeaderActionOP"] = "AdditionalPropertiesHeaderActionOP";
    DefinitionName["ActionsLR"] = "Actions<LineItems>";
    DefinitionName["ALPChart"] = "ALPChart";
    DefinitionName["ALPChartView"] = "ALPChartView";
    DefinitionName["ALPTable"] = "ALPTable";
    DefinitionName["ALPTableView"] = "ALPTableView";
    DefinitionName["AnalyticalListPageFilterBar"] = "AnalyticalListPageFilterBar";
    DefinitionName["AnnotationPathAsObject"] = "AnnotationPathAsObject";
    DefinitionName["ChartSettings"] = "ChartSettings";
    DefinitionName["ChartToolBarAction"] = "ChartToolBarAction";
    DefinitionName["CommonHeaderFacetSettings"] = "CommonHeaderFacetSettings";
    DefinitionName["CompactFilters"] = "CompactFilters";
    DefinitionName["CustomActionMenu"] = "CustomActionMenu";
    DefinitionName["CustomActionMenuActions"] = "CustomActionMenuActions";
    DefinitionName["CustomFooterActionOP"] = "CustomFooterActionOP";
    DefinitionName["CustomHeaderAction"] = "CustomHeaderAction";
    DefinitionName["CustomHeaderActionOP"] = "CustomHeaderActionOP";
    DefinitionName["CustomFormActionOP"] = "CustomFormActionOP";
    DefinitionName["CustomTableAction"] = "CustomTableAction";
    DefinitionName["CustomTableActionOP"] = "CustomTableActionOP";
    DefinitionName["CustomColumn"] = "TableCustomColumn";
    DefinitionName["CustomColumnOP"] = "TableCustomColumnOP";
    DefinitionName["CustomColumns"] = "TableCustomColumns";
    DefinitionName["CustomSections"] = "CustomSections";
    DefinitionName["FieldPath"] = "FieldPath";
    DefinitionName["Field"] = "Field";
    DefinitionName["Fields"] = "Fields";
    DefinitionName["Fields4Dialog"] = "Fields4Dialog";
    DefinitionName["FilterBar"] = "FilterBar";
    DefinitionName["FilterBarVisualFilters"] = "FilterBarVisualFilters";
    DefinitionName["Footer"] = "Footer";
    DefinitionName["FooterAction"] = "FooterAction";
    DefinitionName["FooterActionV4"] = "FooterActionV4";
    DefinitionName["FooterActions"] = "FooterActions";
    DefinitionName["FooterActionsLR"] = "FooterActions<LineItems>";
    DefinitionName["Form"] = "Form";
    DefinitionName["FormAction"] = "FormAction";
    DefinitionName["FormActionBase"] = "FormActionBase";
    DefinitionName["ObjectPageFormActionGroup"] = "ObjectPageFormActionGroup";
    DefinitionName["GenericActions"] = "GenericActions";
    DefinitionName["GenericColumnsOP"] = "GenericColumnsOP";
    DefinitionName["GenericFooter"] = "GenericFooter";
    DefinitionName["GenericColumns"] = "GenericColumns";
    DefinitionName["GenericSections"] = "GenericSections";
    DefinitionName["GenericSubSections"] = "GenericSubSections";
    DefinitionName["GlobalTableSettings"] = "GlobalTableSettings";
    DefinitionName["Header"] = "Header";
    DefinitionName["HeaderActions"] = "HeaderActions";
    DefinitionName["HeaderActionsStandard"] = "HeaderActionsStandard";
    DefinitionName["HeaderActionStandard"] = "HeaderActionStandard";
    DefinitionName["ObjectPageCustomActionMenu"] = "ObjectPageCustomActionMenu";
    DefinitionName["ObjectPageCustomActionMenuActions"] = "ObjectPageCustomActionMenuActions";
    DefinitionName["ObjectPageHeaderAction"] = "ObjectPageHeaderAction";
    DefinitionName["ObjectPageHeaderActionBase"] = "ObjectPageHeaderActionBase";
    DefinitionName["ObjectPageHeaderActionGroup"] = "ObjectPageHeaderActionGroup";
    DefinitionName["ObjectPageHeaderActionStandard"] = "ObjectPageHeaderActionStandard";
    DefinitionName["ObjectPageHeaderActions"] = "ObjectPageHeaderActions";
    DefinitionName["ObjectPageHeaderCustomActionMenu"] = "ObjectPageHeaderCustomActionMenu";
    DefinitionName["ObjectPageHeaderCustomActionMenuActions"] = "ObjectPageHeaderCustomActionMenuActions";
    DefinitionName["HeaderSections"] = "HeaderSections";
    DefinitionName["LineItem"] = "LineItem";
    DefinitionName["LineItems"] = "LineItems";
    DefinitionName["LineItemsOfView"] = "LineItemsOfView";
    DefinitionName["ListReportFilterBar"] = "ListReportFilterBar";
    DefinitionName["LRTableView"] = "LRTableView";
    DefinitionName["LRChartView"] = "LRChartView";
    DefinitionName["MultiEditV2"] = "MultiEdit";
    DefinitionName["MultiTableModeV4"] = "MultiTableModeV4";
    DefinitionName["ObjectPageChart"] = "ObjectPageChart";
    DefinitionName["ObjectPageCustomHeaderSectionFragment"] = "ObjectPageCustomHeaderSectionFragment";
    DefinitionName["ObjectPageCustomSectionFragment"] = "ObjectPageCustomSectionFragment";
    DefinitionName["ObjectPageCustomSubSectionFragment"] = "ObjectPageCustomSubSectionFragment";
    DefinitionName["ObjectPageForm"] = "ObjectPageForm";
    DefinitionName["ObjectPageFooter"] = "ObjectPageFooter";
    DefinitionName["ObjectPageFooterAction"] = "ObjectPageFooterAction";
    DefinitionName["ObjectPageFooterActions"] = "ObjectPageFooterActions";
    DefinitionName["ObjectPageFooterActionStandard"] = "ObjectPageFooterActionStandard";
    DefinitionName["ObjectPageHeader"] = "ObjectPageHeader";
    DefinitionName["ObjectPageHeaderSectionForm"] = "ObjectPageHeaderSectionForm";
    DefinitionName["ObjectPageHeaderSectionChart"] = "ObjectPageHeaderSectionChart";
    DefinitionName["ObjectPageHeaderSectionDataPoint"] = "ObjectPageHeaderSectionDataPoint";
    DefinitionName["ObjectPageHeaderSectionContact"] = "ObjectPageHeaderSectionContact";
    DefinitionName["ObjectPageHeaderSectionAddress"] = "ObjectPageHeaderSectionAddress";
    DefinitionName["ObjectPageLayout"] = "ObjectPageLayout";
    DefinitionName["ObjectPagePresentationVariant"] = "ObjectPagePresentationVariant";
    DefinitionName["ObjectPageSectionAddress"] = "ObjectPageSectionAddress";
    DefinitionName["ObjectPageSectionChart"] = "ObjectPageSectionChart";
    DefinitionName["ObjectPageSectionContact"] = "ObjectPageSectionContact";
    DefinitionName["ObjectPageSectionDataPoint"] = "ObjectPageSectionDataPoint";
    DefinitionName["ObjectPageSectionForm"] = "ObjectPageSectionForm";
    DefinitionName["ObjectPageSectionPresentationVariant"] = "ObjectPageSectionPresentationVariant";
    DefinitionName["ObjectPageSectionTableV4"] = "ObjectPageSectionTableV4";
    DefinitionName["ObjectPageSubSections"] = "ObjectPageSubSections";
    DefinitionName["ObjectPageResponsiveTableV4"] = "ObjectPageResponsiveTableV4";
    DefinitionName["ObjectPageAnalyticalTableV4"] = "ObjectPageAnalyticalTableV4";
    DefinitionName["ObjectPageGridTableV4"] = "ObjectPageGridTableV4";
    DefinitionName["ObjectPageTreeTableV4"] = "ObjectPageTreeTableV4";
    DefinitionName["ObjectPageTable"] = "ObjectPageTable";
    DefinitionName["ObjectPageTableColumn"] = "ObjectPageTableColumn";
    DefinitionName["ObjectPageToolBar"] = "ObjectPageToolBar";
    DefinitionName["ObjectPageToolBarAction"] = "ObjectPageToolBarAction";
    DefinitionName["ObjectPageToolBarActionBase"] = "ObjectPageToolBarActionBase";
    DefinitionName["ObjectPageToolBarActionGroup"] = "ObjectPageToolBarActionGroup";
    DefinitionName["ObjectPageToolBarActions"] = "ObjectPageToolBarActions";
    DefinitionName["Position"] = "Position";
    DefinitionName["PositionOP"] = "PositionOP";
    DefinitionName["QuickVariant"] = "QuickVariant";
    DefinitionName["QuickVariantSelectionOP"] = "QuickVariantSelectionOP";
    DefinitionName["QuickVariantSelectionV4OP"] = "QuickVariantSelectionV4OP";
    DefinitionName["RelatedFacetKeys"] = "RelatedFacetKeys";
    DefinitionName["RowCountMode"] = "RowCountMode";
    DefinitionName["Sections"] = "Sections";
    DefinitionName["SectionActions"] = "SectionActions";
    DefinitionName["SelectionFields"] = "SelectionFields";
    DefinitionName["Table"] = "Table";
    DefinitionName["TableSPV"] = "TableSPV";
    DefinitionName["TableColumn"] = "TableColumn";
    DefinitionName["TableCreationModeLR"] = "TableCreationModeLR";
    DefinitionName["TableViewExtension"] = "TableViewExtension";
    DefinitionName["ToolBarAction"] = "ToolBarAction";
    DefinitionName["ToolBarActionBase"] = "ToolBarActionBase";
    DefinitionName["ToolBarActionGroup"] = "ToolBarActionGroup";
    DefinitionName["ToolBarLR"] = "ToolBar<LineItems>";
    DefinitionName["ToolBar"] = "ToolBar";
    DefinitionName["ViewTableColumn"] = "ViewTableColumn";
    DefinitionName["ViewCustomColumn"] = "ViewTableCustomColumn";
    DefinitionName["ViewCustomAction"] = "ViewTableCustomAction";
    DefinitionName["ViewCustomActionMenu"] = "ViewCustomActionMenu";
    DefinitionName["ViewCustomActionMenuActions"] = "ViewCustomActionMenuActions";
    DefinitionName["ViewChartToolBar"] = "ViewChartToolBar";
    DefinitionName["ViewToolBarActionGroup"] = "ViewToolBarActionGroup";
    DefinitionName["ViewToolBarAction"] = "ViewToolBarAction";
    DefinitionName["ViewToolBarActionBase"] = "ViewToolBarActionBase";
    DefinitionName["ViewPosition"] = "ViewPosition";
    DefinitionName["ViewCustomActionPosition"] = "ViewCustomActionPosition";
    DefinitionName["VisualFilters"] = "VisualFilters";
    DefinitionName["VisualFilter"] = "VisualFilter";
    DefinitionName["CustomActionPosition"] = "CustomActionPosition";
    DefinitionName["CustomActionPositionOP"] = "CustomActionPositionOP";
    DefinitionName["CustomHeaderActionPosition"] = "CustomHeaderActionPosition";
    DefinitionName["CustomHeaderActionPositionOP"] = "CustomHeaderActionPositionOP";
    DefinitionName["CustomFooterActionPositionOP"] = "CustomFooterActionPositionOP";
    DefinitionName["CustomExtensionFragment"] = "CustomExtensionFragment";
    DefinitionName["CustomFilterField"] = "CustomFilterField";
    DefinitionName["CustomFilterFieldPosition"] = "CustomFilterFieldPosition";
    DefinitionName["SaveAndEdit"] = "SaveAndEdit";
    DefinitionName["ObjectPageCustomSectionActions"] = "ObjectPageCustomSectionActions";
    DefinitionName["CustomSectionActionOP"] = "CustomSectionActionOP";
    DefinitionName["CustomSectionActionPositionOP"] = "CustomSectionActionPositionOP";
    DefinitionName["TableCreationModeCreationDialogOPTable"] = "TableCreationModeCreationDialogOPTable";
    DefinitionName["TableCreationModeCreationDialogOPTreeTable"] = "TableCreationModeCreationDialogOPTreeTable";
    DefinitionName["HeaderSectionFields"] = "HeaderSectionFields";
    DefinitionName["SectionFields"] = "SectionFields";
    DefinitionName["CustomField"] = "CustomField";
    DefinitionName["CustomFieldPosition"] = "CustomFieldPosition";
    DefinitionName["AnalyticalConfiguration"] = "AnalyticalConfiguration";
    DefinitionName["ViewAnalyticalConfiguration"] = "ViewAnalyticalConfiguration";
})(DefinitionName || (exports.DefinitionName = DefinitionName = {}));
var PropertyName;
(function (PropertyName) {
    PropertyName["actions"] = "actions";
    PropertyName["annotationPath"] = "annotationPath";
    PropertyName["chart"] = "chart";
    PropertyName["columns"] = "columns";
    PropertyName["createInPlace"] = "createInPlace";
    PropertyName["creationFields"] = "creationFields";
    PropertyName["creationMode"] = "creationMode";
    PropertyName["defaultAction"] = "defaultAction";
    PropertyName["defaultPath"] = "defaultPath";
    PropertyName["defaultTemplateAnnotationPath"] = "defaultTemplateAnnotationPath";
    PropertyName["footer"] = "footer";
    PropertyName["group"] = "group";
    PropertyName["overflowGroup"] = "overflowGroup";
    PropertyName["header"] = "header";
    PropertyName["isCreateEnabled"] = "isCreateEnabled";
    PropertyName["menu"] = "menu";
    PropertyName["oneOf"] = "oneOf";
    PropertyName["priority"] = "priority";
    PropertyName["sections"] = "sections";
    PropertyName["table"] = "table";
    PropertyName["tableSettings"] = "tableSettings";
    PropertyName["text"] = "text";
    PropertyName["views"] = "views";
    PropertyName["visualFilters"] = "visualFilters";
    PropertyName["selectionFields"] = "selectionFields";
    PropertyName["fields"] = "fields";
    PropertyName["analyticalConfiguration"] = "analyticalConfiguration";
    PropertyName["popinLayout"] = "popinLayout";
    PropertyName["position"] = "position";
})(PropertyName || (exports.PropertyName = PropertyName = {}));
var CustomUIAnnotationTypes;
(function (CustomUIAnnotationTypes) {
    CustomUIAnnotationTypes["ManifestBasedActionMenu"] = "ManifestBasedActionMenu";
})(CustomUIAnnotationTypes || (exports.CustomUIAnnotationTypes = CustomUIAnnotationTypes = {}));
/**
 * Additional tags for json schema used in specification. The explanations below specify the meaning of the values for these tags in the schema.
 *
 * @property actionType - type of an action, possible values from enum ActionType
 * @property annotationPath - path to annotation
 * @property annotationType - type, as defined in the annotation
 * @property artifactType - type of the artifact, possible values from enum ArtifactType
 * @property controlId - id of the UI5 control, for flex changes
 * @property controlType - type of the UI5 control, for flex changes
 * @property conversionExit - reference to a conversion exit that transforms values between their manifest representation and their config representation.
 * Structure of the content is defined in function addConversionExit and evaluated in function executeConversionExit in specification/src/sync/v2/utils.ts.
 * @property dataType - EDM data type
 * @property deletable - indicates whether it is allowed to delete a view node (default: false)
 * @property descriptionSrcURL - URL to the description of the artifact in sap.help.com
 * @property fullyQualifiedName
 * @property hidden - flag to indicate if the artifact shall be hidden in the UI
 * @property icon - the icon to be displayed for the artifact. Must be a member of enum UiIcons from @sap-ux/ui-components.
 * @property isViewNode - flag to indicate if the artifact is a view node in the outline
 * @property key - main key of the artifact
 * @property keys - all key elements of the artifact
 * @property manifestPath - an object of type AccessorSpec describing how the setting for the artifact can be identified in the manifest
 * @property messages - an array of messages associated to the current definition
 * @property propertyIndex - index of the property, in any collection
 * @property target - namespace of an annotation
 */
var SchemaTag;
(function (SchemaTag) {
    SchemaTag["actionType"] = "actionType";
    SchemaTag["annotationPath"] = "annotationPath";
    SchemaTag["annotationType"] = "annotationType";
    SchemaTag["artifactType"] = "artifactType";
    SchemaTag["controlId"] = "controlId";
    SchemaTag["controlType"] = "controlType";
    SchemaTag["conversionExit"] = "conversionExit";
    SchemaTag["dataType"] = "dataType";
    SchemaTag["deletable"] = "deletable";
    SchemaTag["descriptionSrcURL"] = "descriptionSrcURL";
    SchemaTag["fullyQualifiedName"] = "fullyQualifiedName";
    SchemaTag["hidden"] = "hidden";
    SchemaTag["icon"] = "icon";
    SchemaTag["isViewNode"] = "isViewNode";
    SchemaTag["key"] = "key";
    SchemaTag["keys"] = "keys";
    SchemaTag["manifestPath"] = "manifestPath";
    SchemaTag["messages"] = "messages";
    SchemaTag["propertyIndex"] = "propertyIndex";
    SchemaTag["target"] = "target";
    SchemaTag["defaultControlProperty"] = "defaultControlProperty";
    SchemaTag["controlProperty"] = "controlProperty";
    SchemaTag["overflowGroup"] = "overflowGroup";
})(SchemaTag || (exports.SchemaTag = SchemaTag = {}));
var SchemaKeyName;
(function (SchemaKeyName) {
    SchemaKeyName["id"] = "ID";
    SchemaKeyName["value"] = "Value";
    SchemaKeyName["action"] = "Action";
    SchemaKeyName["target"] = "Target";
    SchemaKeyName["key"] = "Key";
    SchemaKeyName["semanticObject"] = "SemanticObject";
})(SchemaKeyName || (exports.SchemaKeyName = SchemaKeyName = {}));
exports.MANIFESTPATH = 'webapp/manifest.json';
exports.VOCWITHSLASH = '/@com.sap.vocabularies';
exports.VOCWITHCOLONS = '::@com.sap.vocabularies';
exports.UIVOCABULARY = 'com.sap.vocabularies.UI.v1';
exports.UIVOCABULARYDOT = 'com.sap.vocabularies.UI.v1.';
exports.UIVOCABULARYALPHADOT = '@com.sap.vocabularies.UI.v1.';
exports.QUICKVARPATH = '/quickVariantSelection';
exports.QUICKVARPATHX = '/quickVariantSelectionX';
exports.DATESETTINGSPATH = '/filterSettings/dateSettings';
exports.FRAGMENTNAMEPART = '.fragment.';
var MacrosPropertyType;
(function (MacrosPropertyType) {
    MacrosPropertyType["Control"] = "Control";
    MacrosPropertyType["Property"] = "Property";
    MacrosPropertyType["Aggregation"] = "Aggregation";
    MacrosPropertyType["Event"] = "Event";
})(MacrosPropertyType || (exports.MacrosPropertyType = MacrosPropertyType = {}));
var MacrosAggregatioCardinality;
(function (MacrosAggregatioCardinality) {
    MacrosAggregatioCardinality["Single"] = "Single";
    MacrosAggregatioCardinality["Multiple"] = "Multiple";
})(MacrosAggregatioCardinality || (exports.MacrosAggregatioCardinality = MacrosAggregatioCardinality = {}));
exports.TRANSLATION_BUNDLE_APP = 'app';
exports.TRANSLATION_BUNDLE_ANNOTATION = 'annotation';
exports.TRANSLATION_BUNDLE_SERVICE = 'service';
exports.TRANSLATION_BUNDLE_UI5 = 'ui5';
var RuleName;
(function (RuleName) {
    RuleName["LRCreationModeForAnalyticalTable"] = "LRCreationModeForAnalyticalTable";
    RuleName["LRCreationModeForNonTreeTable"] = "LRCreationModeForNonTreeTable";
    RuleName["LRCreationModeForNonCreationDialogMode"] = "LRCreationModeForNonCreationDialogMode";
    RuleName["LRAnalyticalConfigurationForNonAnalyticalTable"] = "LRAnalyticalConfigurationForNonAnalyticalTable";
    RuleName["LRPopinLayoutForNonResponsiveTable"] = "LRPopinLayoutForNonResponsiveTable";
})(RuleName || (exports.RuleName = RuleName = {}));
//# sourceMappingURL=types.js.map