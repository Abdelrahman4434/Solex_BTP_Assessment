import type { ArtifactType, Parser } from '@sap/ux-specification-types';
import { v2 } from '@sap/ux-specification-types';
import type { JSONSchema4 } from 'json-schema';
import type { I18nBundle } from '@sap-ux/i18n';
import type { AllowedMoveRange, Location } from './common';
import type { UIDialogsContext, UINode } from './annotations';
export * from './annotations';
export * from './common';
export declare const DATA_FIELD_ACTION = "DataFieldForAction";
export declare const DATA_FIELD_FOR_INTENT_BASED_NAVIGATION = "DataFieldForIntentBasedNavigation";
export declare const DATA_FIELD_FOR_ACTION_GROUP = "DataFieldForActionGroup";
export declare const ANNOTATION_TYPES_SEPARATOR = "::";
export declare const CUSTOM_VIEW_PREFIX = "customView(";
export interface PageData {
    [key: string]: unknown;
}
export declare enum AggregationCreationForm {
    AnalyticalChart = "AnalyticalChart",
    AnalyticalChartView = "AnalyticalChartView",
    ChartSection = "ChartSection",
    CustomAction = "CustomAction",
    CustomSection = "CustomSection",
    CustomColumn = "CustomColumn",
    CustomColumnV4 = "CustomColumnV4",
    CustomViewV4 = "CustomViewV4",
    DataPointSection = "DataPointSection",
    Generic = "Generic",
    MacrosChart = "MacrosChart",
    MacrosFilterBar = "MacrosFilterBar",
    MacrosTable = "MacrosTable",
    NativeAction = "NativeAction",
    NativeNavigation = "NativeNavigation",
    NativeBasicColumn = "Basic",
    NativeChartColumn = "Chart",
    NativeContactColumn = "Contact",
    NativeContactField = "NativeContactField",
    NativeConnectedFields = "NativeConnectedFields",
    NativeField = "NativeField",
    NativeFilterFields = "NativeFilterFields",
    NativeVisualFilters = "NativeVisualFilters",
    NativeGroupSection = "NativeGroupSection",
    NativeIdentification = "NativeIdentification",
    NativeRatingColumn = "Rating",
    NativeProgressColumn = "Progress",
    NativeSection = "NativeSection",
    NativeTableSection = "NativeTableSection",
    ProgressSection = "ProgressSection",
    RatingSection = "RatingSection",
    TableView = "TableView",
    CustomSubSection = "CustomSubSection",
    CustomHeaderSection = "CustomHeaderSection",
    CustomFilterField = "CustomFilterField"
}
export declare const CUSTOM_AGGREGATION_FORMS: AggregationCreationForm[];
export declare const enum TableColumnExtensionType {
    ResponsiveTableColumnsExtension = "ResponsiveTableColumnsExtension",
    AnalyticalTableColumnsExtension = "AnalyticalTableColumnsExtension",
    TreeTableColumnsExtension = "TreeTableColumnsExtension",
    GridTableColumnsExtension = "GridTableColumnsExtension"
}
export declare const TABLE_TYPE_EXTENSION_MAP: Map<v2.TableTypeV2, TableColumnExtensionType>;
export declare const ANNOTATION_CREATION_FORM = "annotation";
export declare const SCHEMA_CREATION_FORM = "schema";
export declare const EXTERNAL_CREATION_FORM = "external";
export declare const FacetTitlePrefix = "Facet ID: ";
export type CreationFormKind = typeof ANNOTATION_CREATION_FORM | typeof SCHEMA_CREATION_FORM | typeof EXTERNAL_CREATION_FORM;
export interface CreationFormOptions {
    name: AggregationCreationForm;
    kind: CreationFormKind;
    /**
     * i18n key for the title
     */
    title: string;
    tooltip?: string;
    disabled: boolean;
    /**
     * Title when form disabled
     */
    disabledTitle?: string;
    visualizationIcon?: string;
    aggregationName?: string;
    buttonText?: string;
    buttonId?: string;
}
export declare const EXTENSION_TABLE_TYPE_MAP: Map<TableColumnExtensionType, v2.TableTypeV2>;
export declare enum PropertiesType {
    Flat = 0,
    AnyOf = 1
}
export declare enum SortingOptions {
    Enabled = "Enabled",
    Excluded = "Excluded",
    Readonly = "Readonly"
}
export declare enum AggregationType {
    Object = "Object",
    Array = "Array"
}
export declare enum AggregationActions {
    Delete = "Delete",
    OpenSource = "OpenSource",
    Edit = "Edit"
}
export interface AggregationSubAction {
    id: string;
    text: string;
}
export interface SupportedAggregationAction {
    type: AggregationActions;
    disabled?: boolean;
    title?: string;
    subActions?: AggregationSubAction[];
}
export type SupportedAggregationActions = Array<SupportedAggregationAction | AggregationActions>;
export declare enum AggregationSortBy {
    ViewNode = "ViewNode"
}
export declare enum PendingChange {
    Creation = "Creation",
    MoveDnD = "MoveDnD",
    MoveButton = "MoveButton"
}
interface ModelParserDefinitions {
    [key: string]: JSONSchema4;
}
export interface ParserContext {
    filePath?: string;
}
type ModelParserMethod<T> = (aggregation: T, currentNode: JSONSchema4, currentAnnotationNode: UINode | undefined, name: string | undefined, path: Parser.PropertyPath, parserContext: ParserContext) => void;
export interface ModelParserParams<T> {
    parse: ModelParserMethod<T>;
    definitions: ModelParserDefinitions;
    annotations?: PageAnnotations;
}
export interface AllowedDropAggregation {
    path: Parser.PropertyPath;
    range?: AllowedMoveRange[];
}
export declare enum ValidationState {
    Valid = 0,
    Invalid = 1,
    Skipped = 2,
    ReadOnly = 3
}
export interface PageAnnotations {
    nodes: UINode[];
    dynamicNodes: {
        [nodeId: string]: UINode;
    };
    dialogsContext?: UIDialogsContext;
    errorMessage?: string;
}
export declare enum PropertyMessageType {
    /**
     * Reports an error.
     */
    Error = "error",
    /**
     * Reports a warning.
     */
    Warning = "warning",
    /**
     * Reports an information.
     */
    Info = "info"
}
export interface PropertyMessage {
    type?: PropertyMessageType;
    text: string;
    dialogText?: string;
    location?: Location;
    deletable?: boolean;
    preventMessagePropagation?: boolean;
}
export interface SettingOption {
    schema: JSONSchema4;
    value?: unknown;
    pattern?: string;
    description?: string;
    state?: ValidationState;
    isAtomic?: boolean;
    i18nClassification?: string;
    name: string;
    freeText?: boolean;
    artifactType?: ArtifactType;
    required?: boolean;
    minimum?: number;
    messages?: PropertyMessage[];
    locations?: Location[];
    disabled?: boolean;
    displayName?: string;
}
export interface CustomNodeAnnotationTarget {
    control: string;
    customSectionKey?: string;
    navProperty?: string;
    qualifier?: string;
}
export declare const SAP_ANNOTATION_NAMESPACE = "@com.sap.vocabularies.UI.v1";
export declare const TRANSLATION_BUNDLE_APP = "app";
export declare const TRANSLATION_BUNDLE_ANNOTATION = "annotation";
export declare const TRANSLATION_BUNDLE_SERVICE = "service";
export declare const TRANSLATION_BUNDLE_UI5 = "ui5";
export interface TranslationBundles {
    [TRANSLATION_BUNDLE_APP]: I18nBundle;
    [TRANSLATION_BUNDLE_ANNOTATION]: I18nBundle;
    [TRANSLATION_BUNDLE_UI5]: I18nBundle;
    [TRANSLATION_BUNDLE_SERVICE]: I18nBundle;
}
export type TranslationBundleKeys = typeof TRANSLATION_BUNDLE_APP | typeof TRANSLATION_BUNDLE_ANNOTATION | typeof TRANSLATION_BUNDLE_SERVICE | typeof TRANSLATION_BUNDLE_UI5;
export declare enum AggregationNodeType {
    customAction = "customAction",
    customColumn = "customColumn",
    customSection = "customSection",
    customFilterField = "customFilterField",
    rootNode = "rootNode",
    views = "views"
}
//# sourceMappingURL=index.d.ts.map