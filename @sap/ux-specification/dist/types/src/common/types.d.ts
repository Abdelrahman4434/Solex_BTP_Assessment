import type { EntityType } from '@sap-ux/vocabularies-types';
import type { Definition } from 'typescript-json-schema';
import type { Manifest } from './webapp/manifest';
import type { ExtensionLogger, GenerateAppSchemaParameters } from '../apiTypes';
export declare enum FlexibleColumnLayoutType {
    OneColumn = "OneColumn",
    TwoColumnsBeginExpanded = "TwoColumnsBeginExpanded",
    TwoColumnsMidExpanded = "TwoColumnsMidExpanded",
    MidColumnFullScreen = "MidColumnFullScreen",
    ThreeColumnsMidExpanded = "ThreeColumnsMidExpanded",
    ThreeColumnsEndExpanded = "ThreeColumnsEndExpanded",
    ThreeColumnsMidExpandedEndHidden = "ThreeColumnsMidExpandedEndHidden",
    ThreeColumnsBeginExpandedEndHidden = "ThreeColumnsBeginExpandedEndHidden",
    EndColumnFullScreen = "EndColumnFullScreen"
}
export declare enum TemplatePropertyName {
    Press = "press",
    Menu = "menu",
    Template = "template",
    Position = "position"
}
export declare const enum FlexChangeLayer {
    Vendor = "VENDOR",
    Customer = "CUSTOMER_BASE"
}
export type ManifestSettingsType = boolean | number | string | object;
/**
 * Type for all available schema types, e.g. Application, ListReport, ObjectPage, ...
 */
export declare enum SchemaType {
    Application = "Application",
    ObjectPage = "ObjectPage",
    ListReport = "ListReport",
    OverviewPage = "OverviewPage",
    AnalyticalListPage = "AnalyticalListPage",
    FreestylePage = "FreestylePage",
    FPMCustomPage = "FPMCustomPage",
    BuildingBlocks = "BuildingBlocks"
}
export declare enum CreationFieldType {
    Field = "Field",
    FieldGroup = "FieldGroup"
}
export declare enum ExportArtifacts {
    flex = "flex",
    manifest = "manifest"
}
export declare enum ALPViewType {
    Primary = "primary",
    Secondary = "secondary"
}
export declare enum SectionType {
    Section = "Section",
    SubSection = "SubSection",
    HeaderSection = "HeaderSection"
}
export declare enum ArtifactType {
    Manifest = "Manifest",
    FlexChange = "FlexChange",
    Annotation = "Annotation",
    XMLProperty = "XMLProperty"
}
export declare enum ActionType {
    Annotation = "Annotation",
    Copy = "Copy",
    Criticality = "Criticality",
    Custom = "Custom",
    CustomMenu = "CustomMenu",
    RelatedApps = "RelatedApps",
    Standard = "Standard"
}
export declare enum ControlType {
    Table = "sap.m.Table",
    TableColumn = "sap.m.Column",
    SmartTable = "sap.ui.comp.smarttable.SmartTable",
    SmartFilterBar = "sap.ui.comp.smartfilterbar.SmartFilterBar",
    SmartChart = "sap.ui.comp.smartchart.SmartChart",
    Group = "sap.ui.comp.smartform.Group",
    GroupElement = "sap.ui.comp.smartform.GroupElement",
    Button = "sap.m.Button",
    ToolbarButton = "sap.m.OverflowToolbarButton",
    Avatar = "sap.f.Avatar",
    ObjectPageDynamicHeaderTitle = "sap.uxap.ObjectPageDynamicHeaderTitle",
    ObjectPageGridProperties = "sap.ui.layout.GridData",
    ObjectPageHeader = "sap.uxap.ObjectPageHeader",
    ObjectPageLayout = "sap.uxap.ObjectPageLayout",
    HeaderAction = "sap.uxap.ObjectPageHeaderActionButton",
    ObjectPageHeaderSection = "sap.m.VBox",
    DynamicPage = "sap.f.DynamicPage",
    Form = "sap.ui.layout.form",
    Chart = "sap.suite.ui.microchart",
    Section = "sap.uxap.ObjectPageSection",
    SubSection = "sap.uxap.ObjectPageSubSection"
}
export interface ChangeContent {
    property: string;
    newValue?: ManifestSettingsType;
    newBinding?: string | object;
}
export declare enum Visualization {
    LineItem = "LineItem",
    Chart = "Chart"
}
export declare enum DirName {
    Sapux = "src",
    Schemas = ".schemas",
    Pages = "pages",
    Webapp = "webapp",
    Temp = ".tmp",
    Changes = "changes",
    LocalService = "localService",
    Controller = "controller",
    View = "view",
    Fragment = "fragment",
    Ext = "ext",
    VSCode = ".vscode"
}
export declare enum FileName {
    App = "app.json"
}
export declare const FACETTITLEPREFIX = "Facet ID: ";
export declare const ACTIONTITLEPREFIX = "Action ID: ";
export declare enum ChangeIndicator {
    NoChange = "NoChange",
    Created = "Created",
    Updated = "Updated",
    Deleted = "Deleted"
}
export interface FileData {
    dataSourceUri: string;
    fileContent: string;
}
export interface FileDataResult extends FileData {
    changeIndicator: ChangeIndicator;
}
export interface ExportResults {
    manifest: Manifest;
    flexChanges?: string[];
    fragments?: FileDataResult[];
    views?: FileDataResult[];
    manifestChangeIndicator: ChangeIndicator;
}
export declare const defaultExportResult: ExportResults;
/**
 * Taken over from https://github.com/sap-staging/ui5-flexibility-utils/blob/origin/master/src/changeUtils.js
 */
export interface ChangeDefinition {
    controlId: string;
    controlType: string;
    type: string;
    content: ChangeContent;
    isCustomer: boolean;
    sapui5Version: string;
    creatingTool: string;
    id: string;
    reference: string;
    appVersion: string;
    creation: string;
}
/**
 * Taken over from https://github.com/sap-staging/ui5-flexibility-utils/blob/origin/master/src/changeUtils.js
 */
export interface ChangeDefinitionInCreation {
    controlId: string;
    controlType: string;
    type?: string;
    content: ChangeContent;
    isCustomer?: boolean;
    sapui5Version?: string;
    creatingTool?: string;
}
export type exportFlexValue = (flexChange: ChangeDefinitionInCreation, configObject: object, key: string) => void;
export type importFlexValue = (flexChange: ChangeDefinitionInCreation, configObject: object, key: string) => void;
export type ControlTypeFunction = () => ControlType;
export type ControlIdFunction = (baseId: string, idBreadcrumbs: string[], breadcrumbs: string[], controlType?: ControlTypeFunction, title?: string) => string;
export interface FlexAdapter {
    controlId?: ControlIdFunction;
    controlType: ControlTypeFunction;
    exportFlexValue?: exportFlexValue;
    importFlexValue?: importFlexValue;
}
export type ManifestPath = (pageKeys?: string[], manifest?: Manifest, ...pathParts: any[]) => string | undefined;
export type ExportHandlerFunction = (manifestSection: unknown, configObject: unknown, key: string, manifestKey?: string, ...pathParts: string[]) => unknown;
export interface ManifestConverter {
    path?: ManifestPath;
    key?: string;
    import?: ((manifestSection: unknown, sectionId?: string, propertyKey?: string, breadcrumbs?: string[]) => unknown) | boolean;
    export?: ExportHandlerFunction | boolean;
    delete?: ((manifestSection: unknown, configObject: unknown, key: string, manifestKey: string, syncRuleKey?: string, config?: object) => unknown) | boolean;
}
/**
 * Retrieves the validity metadata for a given property on the target object.
 */
export interface GenerateInterface {
    generate: (id: string, parent?: Definition) => void;
}
/**
 * Type describing the parameters being used by a step in the schema generation. Will be evaluated by the ProcessingRule(s)Adapter.
 *
 * @property pageInfo - generic information applicable to all levels of the type hierarchy. Prepared by getAdaptedSchema and unchanged afterwards.
 * @property pageInfo.appId - Information about the page the schema is generated for
 * @property pageInfo.componentName - the Fiori Elements template component for the page
 * @property pageInfo.entitySet - the entity set for the page
 * @property pageInfo.controlId - the id of the view FE runtime will generate for the page
 * @property pageInfo.pagePath - the page path to the page for which the schema is generated
 * @property specificParams - object that contains information specific for the current step of schema generation. processingRuleAdapter adapts the content of this property if necessary for the next level.
 */
export type SchemaHandlingParams = {
    pageInfo: {
        appId: string;
        componentName: string;
        entitySet: string;
        controlId: string;
        pagePath: AccessorPath;
    };
    specificParams?: object;
};
/**
 * An instance of this type can process all properties of a record type.
 * For each property it has the same task as an instance of type ProcessingRuleAdapter (see below) for one property.
 * Instances of this type will be provided as values of referenceAdaptation.processingRulesAdapter of the ProcessingRule valid for the record type (dynamic case).
 * If such a value does not exist (static case) an instance of this type will be created on the fly based on the processingRuleAdapters in the syncRules of the properties of the record type.
 */
export type ProcessingRulesAdapter = (property: string, processingRule: ProcessingRule) => void;
/**
 * Instances of this type are the parameter-less constructors of classes which represent a section within the config for a FE v2 page.
 * The corresponding class should be annotated with a syncRule.
 * This syncRule must provide a processingRuleAdapter determining the process of generating the corresponding section in the specific schema.
 */
export type SyncRuleProvider = {
    new (): object;
};
/**
 * Represents an option for a single selectable choice within a larger schema or set of rules.
 * This interface models the structure and information associated with a specific option.
 *
 * @property const - The unique value representing this option. Typically used for identification or enumeration.
 * @property description - An optional text description of the option, providing additional context or explanation.
 * @property custom - An optional boolean flag indicating whether this option is user-defined or custom.
 * @property hidden - An optional boolean flag specifying whether this option should be hidden from display or selection.
 */
export interface OneOfOption {
    const: string;
    description?: string;
    custom?: boolean;
    hidden?: boolean;
}
/**
 * Represents an interface for a creation field option that extends the `OneOfOption` interface.
 * This interface includes an optional `type` property that specifies the type of creation field.
 *
 * @extends OneOfOption
 * @interface CreationFieldOneOfOption
 * @property {CreationFieldType} [type] - The type of creation field, if specified.
 */
export interface CreationFieldOneOfOption extends OneOfOption {
    groupType?: CreationFieldType;
}
/**
 * Instances of this interface are used within type ProcessingRule. An instance provides information how to transform the next level of the generic schema to the page specific schema.
 *
 * @property suffix - If truthy, for referred types a copy with this suffix will be generated and the reference will be adapted accordingly. Needed if more than one instance of the referred type is required.
 * Example: The specific schema should contain a list of fields that depends on the entity set of the page. Each of these fields will have a type specific for this field.
 * In this case the generic schema will only contain one generic type 'Field' serving as a blueprint for the specific types.
 * When generating the specific schema a specific copy of this type will be created for each field. The name of this type could e.g. be build according to the pattern `Field<${fieldname}>`.
 * In this case fieldname should be used as suffix to trigger this behavior.
 * @property specificParams - If truthy this replaces the content of property specificParams of the SchemaHandlingParams-instance passed to the next level
 * @property syncRuleProvider - provides the syncRule for the next level
 * @property refTypeDefinition - is needed if the currently processed schema section refers to a type which is not contained in the static schema. In this case the property contains the definition of this new type.
 */
export interface AdaptationInfo {
    suffix?: string;
    specificParams?: object;
    syncRuleProvider?: SyncRuleProvider;
    refTypeDefinition?: Definition;
}
/**
 * An instance of this interface describes the way the properties of the currently processed schema section should be processed.
 *
 * @property processingRuleProvider - only needed when the list of properties is determined dynamically. In this case the list of properties
 * must be added to the schema section by the ProcessingRuleAdapter.
 */
export interface ReferenceAdaptationInfo extends AdaptationInfo {
    processingRulesAdapter?: ProcessingRulesAdapter;
}
/**
 * A path of accessors (property names resp. array indices) which can be used to navigate to a child object inside a javascript object. The length of the path corresponds to the sub-object level.
 * In the context of this project instances of this type are used to describe a 'manifest path' (i.e. a path from manifest root to a property or a section within the manifest).
 */
export type AccessorPath = (string | number)[];
/**
 * An instance of this type specifies how to access one or a number of sub-objects inside a javascript object.
 *
 * @property addTargetPropertyToPath - if true the given path only specifies the parent object of the target object.
 * In this case it is assumed that there is another property name known from the context which can be used to do the last step.
 * If addTargetPropertyToPath is false this additional assumption is not true and a context (even if it is there) will be ignored.
 * This is used in case the sub-object to be found does not have the same accessor as defined by the context.
 * The first option (addTargetPropertyToPath = true) is considered to be the default option. Therefore, it is possible to directly use the AccessorPath.
 * @property path - the path to the parent object of the target resp. to the target object itself, depending on addTargetPropertyToPath
 */
export type AccessorSpec = AccessorPath | {
    addTargetPropertyToPath: boolean;
    path: AccessorPath;
};
/**
 * An instance of this type provides information how a section of the specific schema will be adapted.
 * Instances of this type will be initialized by function adjustElement in specification/src/sync/v2/generate/schemaAdaptation.ts.
 * Thereby, only property element will be set. The instance is then passed to an instance of ProcessingRuleAdapter (static case) or ProcessingRulesAdapter (dynamic case)
 * that can modify the instance in order to provide information how the element should be processed.
 *
 * @property element - represents the section currently processed. This may be a global type definition, the items or additionalProperties section of a type, or a property of a type.
 * The adapter can modify this instance, and/or add information to the ProcessingRule that tells adjustElement how to proceed with this section.
 * In case of an element representing a property the adapter may also remove it from the ProcessingRule in order to indicate that the property should be removed from the schema.
 * @property controlId - should be added for properties which are realized by flex changes. Provides the id of the control the flex change applies to. Will be added to the schema then.
 * @property manifestPath - should be added for properties which are realized in the manifest. Specifies the corresponding place in the manifest. Will be added to the schema then.
 * @property referenceAdaptation - Information how the link to the next hierarchy level should be processed
 * @property additionalPropertiesAdaptation - Information how the additionalProperties section should be processed
 * @property itemsAdaptation - Information how the items section should be processed
 */
export type ProcessingRule = {
    element?: Definition;
    controlId?: string;
    manifestPath?: AccessorSpec;
    referenceAdaptation?: ReferenceAdaptationInfo;
    additionalPropertiesAdaptation?: AdaptationInfo;
    itemsAdaptation?: AdaptationInfo;
};
/**
 * An instance of this type is needed when the representation of a property value in the property editor differs from the representation of the same property in the manifest.
 * In this case this instance provides two conversion functions responsible for mapping the manifest representation to the config representation (used in the property editor) and vice versa.
 * The corresponding functions will be called by the generic import resp. export process via function executeConversionExit in specification/src/sync/v2/utils.ts.
 * Note that there is one conversion which is already implemented in the generic import/export process itself: The conversion of arrays of strings which are represented as comma separated strings in the manifest.
 * Moreover, note that currently no such conversion is supported for flex based properties.
 * Instances of this type need to be made accessible to the generic import/export process via an instance of ConversionExitProvider which is passed to the generic import/export process.
 * Moreover, the conversion exit must be registered in the schema definition of the property in the app specific schema via function addConversionExit in specification/src/sync/v2/utils.ts.
 *
 * @property appToConfig - function to convert the value from the manifest representation to the config representation
 * @property configToApp - function to convert the value from the config representation to the manifest representation
 */
export type ConversionExit = {
    /**
     * Converts a value from the manifest representation to the config representation. Called within the generic import process (getConfigForPage).
     *
     * @param appValue - the value of the property in the manifest. Note that the function will NOT be called when the value is not present in the manifest
     * @param parameters - parameters that have been added to the conversion exit definition in the schema definition of the property in the app specific schema when calling addConversionExit
     * @param fragments - the fragments valid for the app
     * @param definition - the definition of the property in the app specific schema
     * @param logger - if present can be used to log information about unexpected manifest values
     * @returns the representation of the (value for the) property in the config
     */
    appToConfig: (appValue: unknown, parameters: unknown, fragments: FileData[], definition: Definition, logger?: ExtensionLogger) => unknown;
    /**
     * Converts a value from the config representation to the manifest representation. Called within the generic export process (exportPage).
     *
     * @param configValue - the value of the property in the config. Currently this is also called when the value is undefined.
     * Probably all implementations will return undefined in this case as well.
     * -> Maybe modified in future such that the generic functionality already handles this case.
     * @param parameters - parameters that have been added to the conversion exit definition in the schema definition of the property in the app specific schema when calling addConversionExit
     * @param fragments - the fragments valid for the app. As a side-effect this function may also update the list or entries of the list, thereby also setting the changeIndicator-flag accordingly.
     * @param definition - the definition of the property in the app specific schema
     * @param oldAppValue - the current value of the property in the manifest. This value can be used in case there is more than one value in the manifest having the same representation in the config (because they are logically equivalent).
     * In this case the function may return a value that is 'as equal as possible' to the old manifest value while still logically representing the previous manifest value.
     * However, note that if such cases there will be scenarios where an undo only recreates the previous state logically, but not in the exact same representation (restriction due to the current implementation of undo/redo).
     * @returns the representation of the (value for the) property in the manifest
     */
    configToApp: (configValue: unknown, parameters: unknown, fragments: FileDataResult[], definition: Definition, oldAppValue: unknown) => unknown;
};
/**
 * An instance of this type should be able to return a the ConversionExits for the conversion exit names used in the page specific schemas of one page type.
 * The instances will be made available to the generic import/export functions (getConfigForPage, exportPage).
 *
 * @param conversionExitName - the name of the conversion exit as passed to addConversionExit when the conversion exit was registered in the app specific schema.
 * @returns the implementation of the conversion exit
 */
export type ConversionExitProvider = (conversionExitName: string) => ConversionExit | undefined;
/**
 * An instance of this type determines the way a certain section from the generic schema will be processed when translating it to the specific schema.
 *
 * @param processingRule - represents the information how the section should be processed. When passed to the adapter only property element will be set.
 * The adapter may modify the content of this object in order to influence the further processing of the section (see jsdoc of ProcessingRule).
 * @param schemaHandlingParams - information provided by the hierarchy level above
 * @param generateParameters - input parameters for the schema generation process
 */
type ProcessingRuleAdapter = (processingRule: ProcessingRule, schemaHandlingParams: SchemaHandlingParams, generateParameters: GenerateAppSchemaParameters) => void;
/**
 * Use function syncRule in class specification/src/sync/common/decoration/decorators to annotate classes and properties built for schema generation.
 * This way the generation of generic and specific schemas is controlled by the syncRules.
 *
 * @property flex
 * @property manifest
 * @property processingRuleAdapter - this property is used when the specific schema is created via getAdaptedSchema
 * @property generate
 * @property xml
 */
export interface SyncRule {
    flex?: FlexAdapter;
    manifest?: ManifestConverter;
    processingRuleAdapter?: ProcessingRuleAdapter;
    generate?: (schema: object, definition: object, propertyName: string) => unknown;
    xml?: (config: any) => string;
}
export interface Content {
    property: string;
    oldValue?: ManifestSettingsType;
    newValue: ManifestSettingsType;
}
export interface Selector {
    id: string;
    type: string;
    idIsLocal?: boolean;
}
export interface PageLayoutInformation {
    id: string;
    pageId: string;
}
export interface FakeLRepSettings {
    isKeyUser: boolean;
    isAtoAvailable: boolean;
    isProductiveSystem: boolean;
}
export type BooleanCondition = (value: unknown) => boolean;
/**
 * Object with key-value pairs for dependency matching.
 * Keys can use 'config.' prefix to specify the source.
 * All properties must match their expected values (AND logic within the object).
 *
 * @example
 * ```typescript
 * // All conditions must match (AND logic)
 * { 'config.isMultiView': true, 'config.visualization': 'Chart' }
 * ```
 */
export type DependsOnConditionObject = Record<string, unknown>;
export interface MessageParameters {
    /**
     * Optional message to display when dependency is not met.
     */
    text: string;
    deletable?: boolean;
    quickFix?: {
        text?: string;
        values?: {
            [key: string]: unknown;
        };
        remove?: boolean;
    };
    type?: 'error' | 'warning' | 'info';
}
export type DependsOnMessage = Omit<MessageParameters, 'text'> & {
    /**
     * Optional message to display when dependency is not met.
     */
    text?: ((context: unknown) => string) | string | boolean;
};
/**
 * Base dependency configuration for conditional properties.
 *
 * @property dependsOn - Either a condition function or an expected value for equality check
 * @property message - Optional message parameter. Can be:
 *   - A function (value) => string for custom messages
 *   - true to generate a standard message with the current value
 */
export interface DependsOn {
    /**
     * The condition/truthy function to evaluate the property value.
     */
    dependsOn?: BooleanCondition;
    /**
     * Optional message to display when dependency is not met.
     */
    message?: DependsOnMessage;
}
/**
 * Source from which to resolve the property path.
 *
 * - 'app': The app configuration (app.config, includes manifest)
 * - 'page': The page configuration (page.config)
 * - 'custom': Custom context provided via init()
 */
export type DependsOnSource = 'app' | 'page' | 'custom';
/**
 * Single condition specification for a property dependency.
 * Used when checking individual property values.
 *
 * @property path - The property path to check (e.g., 'isALP' or 'settings.enabled')
 * @property source - The source from which to resolve the path ('app', 'page', or 'custom')
 * @property dependsOn - Condition function to evaluate the property value
 * @property expectedValue - Expected value for simple equality check
 * @example
 * ```typescript
 * // Using path builders with @hide decorator
 * \@hide(page.isALP)                           // Truthy check on page config
 * \@hide(when(page.type, 'GridTable'))         // Equality check
 * \@hide(when(app.manifest.type, 'ovp'))       // Check app manifest
 * ```
 */
export interface SingleDependsOnCondition extends DependsOn {
    /**
     * The property path to check (e.g., 'visualFilters' or 'settings.enabled')
     */
    path: string;
    /**
     * The source from which to resolve the property path.
     * - 'app': The app configuration (app.config, includes manifest)
     * - 'page': The page configuration (page.config)
     * - 'custom': Custom context provided via init()
     */
    source?: DependsOnSource;
    /**
     * Expected value for simple equality check (alternative to condition function)
     */
    expectedValue?: unknown;
    /**
     * When true, the condition result is inverted.
     * Used by the `not()` helper to create negated conditions.
     */
    negate?: boolean;
}
/**
 * Multi-condition configuration - array of conditions where ALL must be met (AND logic).
 * Used when a property depends on multiple conditions simultaneously.
 * Supports nested OR groups via OrConditionGroup.
 */
export type MultiDependsOnCondition = AndConditionItem[];
/**
 * Represents a nested AND condition group within an OR condition.
 * All conditions in the array must be met for this group to pass.
 *
 * @example
 * ```typescript
 * // AND group: both conditions must match
 * { __andConditions: [{ path: 'type', expectedValue: 'GridTable' }, { path: 'enabled', expectedValue: true }] }
 * ```
 */
export interface AndConditionGroup {
    __andConditions: AndConditionItem[];
}
/**
 * Represents a nested OR condition group within an AND condition.
 * At least one condition must pass for this group to pass.
 *
 * @example
 * ```typescript
 * // OR group: either condition can match
 * { __orConditions: [{ path: 'type', expectedValue: 'GridTable' }, { path: 'type', expectedValue: 'TreeTable' }] }
 * ```
 */
export interface OrConditionGroup {
    __orConditions: OrConditionItem[];
}
/**
 * Item in an AND condition array - either a single condition or a nested OR group.
 */
export type AndConditionItem = SingleDependsOnCondition | OrConditionGroup;
/**
 * Item in an OR condition array - either a single condition or a nested AND group.
 */
export type OrConditionItem = SingleDependsOnCondition | AndConditionGroup;
/**
 * OR-logic array of conditions.
 * At least one condition in the array must match for the overall condition to pass.
 * Supports nested AND groups via AndConditionGroup.
 *
 * @example
 * ```typescript
 * // Either condition can match (OR logic) - uses SingleDependsOnCondition format
 * [
 *   { path: 'custom.actionType', expectedValue: 'Bound', source: 'custom' },
 *   { path: 'custom.actionType', expectedValue: 'Custom', source: 'custom' }
 * ]
 *
 * // OR with nested AND groups
 * [
 *   { __andConditions: [{ path: 'type', expectedValue: 'GridTable' }, { path: 'enabled', expectedValue: true }] },
 *   { __andConditions: [{ path: 'mode', expectedValue: 'edit' }, { path: 'visible', expectedValue: true }] }
 * ]
 * ```
 */
export type OrDependsOnCondition = OrConditionItem[];
/**
 * Dependency configuration for conditional property visibility.
 * Used by @hide, @message, @readonly decorators and enum validity decorators.
 * Supports single, multi-condition, and OR-logic configurations.
 *
 * @property path - The property path to check (for single condition)
 * @property expectedValue - Expected value for simple equality check
 * @property conditions - Array of conditions for AND logic (all must be met)
 * @property orConditions - Array of condition objects for OR logic matching
 */
export interface DependsOnCondition extends Omit<SingleDependsOnCondition, 'path'> {
    /**
     * The property path to check (e.g., 'isALP' or 'settings.enabled')
     */
    path?: string;
    /**
     * Array of conditions (SingleDependsOnCondition) for multi-condition support.
     * When specified, ALL conditions must be met (AND logic).
     * Use the `and()` helper to create this.
     */
    conditions?: MultiDependsOnCondition;
    /**
     * Array of condition objects for OR logic matching.
     * At least one object must match for the condition to pass.
     * Use the `or()` helper to create this.
     */
    orConditions?: OrDependsOnCondition;
}
/**
 * Unified type for conditional decorator inputs.
 * Supports all condition patterns used by hide, message, and readonly decorators.
 */
export type ConditionalDecorator = string | SingleDependsOnCondition | DependsOnConditionObject | MultiDependsOnCondition | OrDependsOnCondition;
/**
 * Condition information for a specific enum value.
 * Combines UI5 version requirements and property dependencies.
 */
export type EnumValueCondition = ValidityInformation & DependsOn;
/**
 * Configuration object mapping enum values to their conditions.
 */
export interface EnumValidityConfig {
    [enumValue: string]: EnumValueCondition;
}
export interface ValidityInformation {
    /**
     * UI5 version requirement
     */
    since?: string;
    deprecated?: Deprecated;
}
export interface Validity extends ValidityInformation {
    enum?: EnumValidityConfig;
}
export interface DeprecatedProperties {
    [key: string]: ValidityInformation;
}
export interface Deprecated {
    since: string;
    text?: string;
}
export declare enum FacetBase {
    LineItem = "LineItem",
    CollectionFacet = "CollectionFacet",
    Chart = "Chart",
    Form = "Form",
    Identification = "Identification",
    DataPoint = "DataPoint",
    Address = "Address",
    Contact = "Contact",
    PresentationVariant = "PresentationVariant",
    SelectionPresentationVariant = "SelectionPresentationVariant",
    Unknown = ""
}
export interface FacetConfig {
    base: FacetBase;
    lineItem?: string[];
    Label?: string;
    ID?: string;
    entityType?: EntityType;
    annotationPath?: string;
    target?: object;
    Title?: string;
    facets?: FacetConfigs;
    namespace?: string;
}
export interface SubSectionConfig {
    base: FacetBase;
    Label?: string;
    ID?: string;
    facets: FacetConfigs;
    annotationPath?: string;
    entityType?: EntityType;
    target?: object;
    namespace?: string;
}
export interface FacetConfigs {
    [key: string]: FacetConfig | SubSectionConfig;
}
export interface File {
    dataSourceUri: string;
    fileContent: string;
}
export interface Files {
    [name: string]: object;
}
export interface FacetSection {
    key: string;
    label?: string;
    ID?: string;
    custom?: boolean;
    entityType?: EntityType;
    namespace?: string;
    title?: string;
}
export interface SchemaFilePath {
    filename: string;
    path: string;
}
export interface ObjectPageSectionData {
    target: string;
    key?: string;
}
export declare const BINDINGPROPERTYREGEXSTRING = "^{[A-Za-z0-9{}&$!@#%? _|,<>'()[\\]\\/:=.]+}$";
export declare enum ViewTemplateType {
    ResponsiveTableColumnsExtension = "ResponsiveTableColumnsExtension",
    AnalyticalTableColumnsExtension = "AnalyticalTableColumnsExtension",
    TreeTableColumnsExtension = "TreeTableColumnsExtension",
    GridTableColumnsExtension = "GridTableColumnsExtension",
    ResponsiveTableCellsExtension = "ResponsiveTableCellsExtension"
}
export declare enum DefinitionName {
    Action = "Action",
    Actions = "Actions",
    AdditionalPropertiesHeaderActionOP = "AdditionalPropertiesHeaderActionOP",
    ActionsLR = "Actions<LineItems>",
    ALPChart = "ALPChart",
    ALPChartView = "ALPChartView",
    ALPTable = "ALPTable",
    ALPTableView = "ALPTableView",
    AnalyticalListPageFilterBar = "AnalyticalListPageFilterBar",
    AnnotationPathAsObject = "AnnotationPathAsObject",
    ChartSettings = "ChartSettings",
    ChartToolBarAction = "ChartToolBarAction",
    CommonHeaderFacetSettings = "CommonHeaderFacetSettings",
    CompactFilters = "CompactFilters",
    CustomActionMenu = "CustomActionMenu",
    CustomActionMenuActions = "CustomActionMenuActions",
    CustomFooterActionOP = "CustomFooterActionOP",
    CustomHeaderAction = "CustomHeaderAction",
    CustomHeaderActionOP = "CustomHeaderActionOP",
    CustomFormActionOP = "CustomFormActionOP",
    CustomTableAction = "CustomTableAction",
    CustomTableActionOP = "CustomTableActionOP",
    CustomColumn = "TableCustomColumn",
    CustomColumnOP = "TableCustomColumnOP",
    CustomColumns = "TableCustomColumns",
    CustomSections = "CustomSections",
    FieldPath = "FieldPath",
    Field = "Field",
    Fields = "Fields",
    Fields4Dialog = "Fields4Dialog",
    FilterBar = "FilterBar",
    FilterBarVisualFilters = "FilterBarVisualFilters",
    Footer = "Footer",
    FooterAction = "FooterAction",
    FooterActionV4 = "FooterActionV4",
    FooterActions = "FooterActions",
    FooterActionsLR = "FooterActions<LineItems>",
    Form = "Form",
    FormAction = "FormAction",
    FormActionBase = "FormActionBase",
    ObjectPageFormActionGroup = "ObjectPageFormActionGroup",
    GenericActions = "GenericActions",
    GenericColumnsOP = "GenericColumnsOP",
    GenericFooter = "GenericFooter",
    GenericColumns = "GenericColumns",
    GenericSections = "GenericSections",
    GenericSubSections = "GenericSubSections",
    GlobalTableSettings = "GlobalTableSettings",
    Header = "Header",
    HeaderActions = "HeaderActions",
    HeaderActionsStandard = "HeaderActionsStandard",
    HeaderActionStandard = "HeaderActionStandard",
    ObjectPageCustomActionMenu = "ObjectPageCustomActionMenu",
    ObjectPageCustomActionMenuActions = "ObjectPageCustomActionMenuActions",
    ObjectPageHeaderAction = "ObjectPageHeaderAction",
    ObjectPageHeaderActionBase = "ObjectPageHeaderActionBase",
    ObjectPageHeaderActionGroup = "ObjectPageHeaderActionGroup",
    ObjectPageHeaderActionStandard = "ObjectPageHeaderActionStandard",
    ObjectPageHeaderActions = "ObjectPageHeaderActions",
    ObjectPageHeaderCustomActionMenu = "ObjectPageHeaderCustomActionMenu",
    ObjectPageHeaderCustomActionMenuActions = "ObjectPageHeaderCustomActionMenuActions",
    HeaderSections = "HeaderSections",
    LineItem = "LineItem",
    LineItems = "LineItems",
    LineItemsOfView = "LineItemsOfView",
    ListReportFilterBar = "ListReportFilterBar",
    LRTableView = "LRTableView",
    LRChartView = "LRChartView",
    MultiEditV2 = "MultiEdit",
    MultiTableModeV4 = "MultiTableModeV4",
    ObjectPageChart = "ObjectPageChart",
    ObjectPageCustomHeaderSectionFragment = "ObjectPageCustomHeaderSectionFragment",
    ObjectPageCustomSectionFragment = "ObjectPageCustomSectionFragment",
    ObjectPageCustomSubSectionFragment = "ObjectPageCustomSubSectionFragment",
    ObjectPageForm = "ObjectPageForm",
    ObjectPageFooter = "ObjectPageFooter",
    ObjectPageFooterAction = "ObjectPageFooterAction",
    ObjectPageFooterActions = "ObjectPageFooterActions",
    ObjectPageFooterActionStandard = "ObjectPageFooterActionStandard",
    ObjectPageHeader = "ObjectPageHeader",
    ObjectPageHeaderSectionForm = "ObjectPageHeaderSectionForm",
    ObjectPageHeaderSectionChart = "ObjectPageHeaderSectionChart",
    ObjectPageHeaderSectionDataPoint = "ObjectPageHeaderSectionDataPoint",
    ObjectPageHeaderSectionContact = "ObjectPageHeaderSectionContact",
    ObjectPageHeaderSectionAddress = "ObjectPageHeaderSectionAddress",
    ObjectPageLayout = "ObjectPageLayout",
    ObjectPagePresentationVariant = "ObjectPagePresentationVariant",
    ObjectPageSectionAddress = "ObjectPageSectionAddress",
    ObjectPageSectionChart = "ObjectPageSectionChart",
    ObjectPageSectionContact = "ObjectPageSectionContact",
    ObjectPageSectionDataPoint = "ObjectPageSectionDataPoint",
    ObjectPageSectionForm = "ObjectPageSectionForm",
    ObjectPageSectionPresentationVariant = "ObjectPageSectionPresentationVariant",
    ObjectPageSectionTableV4 = "ObjectPageSectionTableV4",
    ObjectPageSubSections = "ObjectPageSubSections",
    ObjectPageResponsiveTableV4 = "ObjectPageResponsiveTableV4",
    ObjectPageAnalyticalTableV4 = "ObjectPageAnalyticalTableV4",
    ObjectPageGridTableV4 = "ObjectPageGridTableV4",
    ObjectPageTreeTableV4 = "ObjectPageTreeTableV4",
    ObjectPageTable = "ObjectPageTable",
    ObjectPageTableColumn = "ObjectPageTableColumn",
    ObjectPageToolBar = "ObjectPageToolBar",
    ObjectPageToolBarAction = "ObjectPageToolBarAction",
    ObjectPageToolBarActionBase = "ObjectPageToolBarActionBase",
    ObjectPageToolBarActionGroup = "ObjectPageToolBarActionGroup",
    ObjectPageToolBarActions = "ObjectPageToolBarActions",
    Position = "Position",
    PositionOP = "PositionOP",
    QuickVariant = "QuickVariant",
    QuickVariantSelectionOP = "QuickVariantSelectionOP",
    QuickVariantSelectionV4OP = "QuickVariantSelectionV4OP",
    RelatedFacetKeys = "RelatedFacetKeys",
    RowCountMode = "RowCountMode",
    Sections = "Sections",
    SectionActions = "SectionActions",
    SelectionFields = "SelectionFields",
    Table = "Table",
    TableSPV = "TableSPV",
    TableColumn = "TableColumn",
    TableCreationModeLR = "TableCreationModeLR",
    TableViewExtension = "TableViewExtension",
    ToolBarAction = "ToolBarAction",
    ToolBarActionBase = "ToolBarActionBase",
    ToolBarActionGroup = "ToolBarActionGroup",
    ToolBarLR = "ToolBar<LineItems>",
    ToolBar = "ToolBar",
    ViewTableColumn = "ViewTableColumn",
    ViewCustomColumn = "ViewTableCustomColumn",
    ViewCustomAction = "ViewTableCustomAction",
    ViewCustomActionMenu = "ViewCustomActionMenu",
    ViewCustomActionMenuActions = "ViewCustomActionMenuActions",
    ViewChartToolBar = "ViewChartToolBar",
    ViewToolBarActionGroup = "ViewToolBarActionGroup",
    ViewToolBarAction = "ViewToolBarAction",
    ViewToolBarActionBase = "ViewToolBarActionBase",
    ViewPosition = "ViewPosition",
    ViewCustomActionPosition = "ViewCustomActionPosition",
    VisualFilters = "VisualFilters",
    VisualFilter = "VisualFilter",
    CustomActionPosition = "CustomActionPosition",
    CustomActionPositionOP = "CustomActionPositionOP",
    CustomHeaderActionPosition = "CustomHeaderActionPosition",
    CustomHeaderActionPositionOP = "CustomHeaderActionPositionOP",
    CustomFooterActionPositionOP = "CustomFooterActionPositionOP",
    CustomExtensionFragment = "CustomExtensionFragment",
    CustomFilterField = "CustomFilterField",
    CustomFilterFieldPosition = "CustomFilterFieldPosition",
    SaveAndEdit = "SaveAndEdit",
    ObjectPageCustomSectionActions = "ObjectPageCustomSectionActions",
    CustomSectionActionOP = "CustomSectionActionOP",
    CustomSectionActionPositionOP = "CustomSectionActionPositionOP",
    TableCreationModeCreationDialogOPTable = "TableCreationModeCreationDialogOPTable",
    TableCreationModeCreationDialogOPTreeTable = "TableCreationModeCreationDialogOPTreeTable",
    HeaderSectionFields = "HeaderSectionFields",
    SectionFields = "SectionFields",
    CustomField = "CustomField",
    CustomFieldPosition = "CustomFieldPosition",
    AnalyticalConfiguration = "AnalyticalConfiguration",
    ViewAnalyticalConfiguration = "ViewAnalyticalConfiguration"
}
export declare enum PropertyName {
    actions = "actions",
    annotationPath = "annotationPath",
    chart = "chart",
    columns = "columns",
    createInPlace = "createInPlace",
    creationFields = "creationFields",
    creationMode = "creationMode",
    defaultAction = "defaultAction",
    defaultPath = "defaultPath",
    defaultTemplateAnnotationPath = "defaultTemplateAnnotationPath",
    footer = "footer",
    group = "group",
    overflowGroup = "overflowGroup",
    header = "header",
    isCreateEnabled = "isCreateEnabled",
    menu = "menu",
    oneOf = "oneOf",
    priority = "priority",
    sections = "sections",
    table = "table",
    tableSettings = "tableSettings",
    text = "text",
    views = "views",
    visualFilters = "visualFilters",
    selectionFields = "selectionFields",
    fields = "fields",
    analyticalConfiguration = "analyticalConfiguration",
    popinLayout = "popinLayout",
    position = "position"
}
export declare enum CustomUIAnnotationTypes {
    ManifestBasedActionMenu = "ManifestBasedActionMenu"
}
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
export declare enum SchemaTag {
    actionType = "actionType",
    annotationPath = "annotationPath",
    annotationType = "annotationType",
    artifactType = "artifactType",
    controlId = "controlId",
    controlType = "controlType",
    conversionExit = "conversionExit",
    dataType = "dataType",
    deletable = "deletable",
    descriptionSrcURL = "descriptionSrcURL",
    fullyQualifiedName = "fullyQualifiedName",
    hidden = "hidden",
    icon = "icon",
    isViewNode = "isViewNode",
    key = "key",
    keys = "keys",
    manifestPath = "manifestPath",
    messages = "messages",
    propertyIndex = "propertyIndex",
    target = "target",
    defaultControlProperty = "defaultControlProperty",
    controlProperty = "controlProperty",
    overflowGroup = "overflowGroup"
}
export declare enum SchemaKeyName {
    id = "ID",
    value = "Value",
    action = "Action",
    target = "Target",
    key = "Key",
    semanticObject = "SemanticObject"
}
export declare const MANIFESTPATH = "webapp/manifest.json";
export declare const VOCWITHSLASH = "/@com.sap.vocabularies";
export declare const VOCWITHCOLONS = "::@com.sap.vocabularies";
export declare const UIVOCABULARY = "com.sap.vocabularies.UI.v1";
export declare const UIVOCABULARYDOT = "com.sap.vocabularies.UI.v1.";
export declare const UIVOCABULARYALPHADOT = "@com.sap.vocabularies.UI.v1.";
export declare const QUICKVARPATH = "/quickVariantSelection";
export declare const QUICKVARPATHX = "/quickVariantSelectionX";
export declare const DATESETTINGSPATH = "/filterSettings/dateSettings";
export declare const FRAGMENTNAMEPART = ".fragment.";
export interface MacrosXMLPathInfo {
    name: string;
    index: number;
}
export type MacrosXMLPath = Array<MacrosXMLPathInfo>;
export declare enum MacrosPropertyType {
    Control = "Control",
    Property = "Property",
    Aggregation = "Aggregation",
    Event = "Event"
}
export declare enum MacrosAggregatioCardinality {
    Single = "Single",
    Multiple = "Multiple"
}
export interface SelectionPositionRange {
    startOffset: number;
    endOffset: number;
    startLine: number;
    endLine: number;
    startColumn: number;
    endColumn: number;
}
/**
 * Structured display information for a macro node in the UI.
 * - `name`: Main label for macro (e.g., "Table").
 * - `value`: Optional detail, such as "(#My_ID_Table)" or "(Sales in Europe)".
 */
export interface MacroDisplayInfo {
    name: string;
    value?: string;
}
export interface MacrosSchemaMetadata {
    path?: MacrosXMLPath;
    controlName?: string;
    type?: MacrosPropertyType;
    position?: SelectionPositionRange;
    filePath?: string;
    internalId?: string;
    defaultAggregation?: string;
    namespaces?: string[];
    macroDisplayInfo?: MacroDisplayInfo;
    aggregationCardinality?: MacrosAggregatioCardinality;
}
export interface SchemaDefinitionKey {
    name: SchemaKeyName;
    value: string;
}
export interface SchemaDefinitionMessage {
    text: string;
}
export declare const TRANSLATION_BUNDLE_APP = "app";
export declare const TRANSLATION_BUNDLE_ANNOTATION = "annotation";
export declare const TRANSLATION_BUNDLE_SERVICE = "service";
export declare const TRANSLATION_BUNDLE_UI5 = "ui5";
export type TranslationBundleKeys = typeof TRANSLATION_BUNDLE_APP | typeof TRANSLATION_BUNDLE_ANNOTATION | typeof TRANSLATION_BUNDLE_SERVICE | typeof TRANSLATION_BUNDLE_UI5;
export interface SchemaDefinition extends Definition {
    isViewNode?: boolean;
    propertyIndex?: number;
    icon?: string;
    metadata?: MacrosSchemaMetadata;
    hidden?: boolean;
    disabled?: boolean;
    annotationPath?: string;
    keys?: SchemaDefinitionKey[];
    messages?: SchemaDefinitionMessage[];
    manifestPath?: string;
    multiSelect?: boolean;
    i18nBundle?: TranslationBundleKeys;
}
export declare enum RuleName {
    LRCreationModeForAnalyticalTable = "LRCreationModeForAnalyticalTable",
    LRCreationModeForNonTreeTable = "LRCreationModeForNonTreeTable",
    LRCreationModeForNonCreationDialogMode = "LRCreationModeForNonCreationDialogMode",
    LRAnalyticalConfigurationForNonAnalyticalTable = "LRAnalyticalConfigurationForNonAnalyticalTable",
    LRPopinLayoutForNonResponsiveTable = "LRPopinLayoutForNonResponsiveTable"
}
export {};
//# sourceMappingURL=types.d.ts.map