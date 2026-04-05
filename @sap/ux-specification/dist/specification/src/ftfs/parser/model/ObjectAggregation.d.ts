import type { PageData, CreationFormOptions, AggregationCreationForm, PendingChange, SupportedAggregationActions, ModelParserParams, PageAnnotations, PropertyMessage, Location, UINode, AllowedMoveRange } from './types';
import { AggregationActions, AggregationType, AggregationSortBy, SortingOptions, ValidationState } from './types';
import type { JSONSchema4 } from 'json-schema';
import { NodeProperty, type PageProperties } from './NodeProperty';
import type { I18nBundle } from '@sap-ux/i18n';
import type { ArtifactType, PageConfig, PageType, Parser } from '@sap/ux-specification-types';
export interface PageAggregations {
    [key: string]: ObjectAggregation;
}
export interface PageEditAggregationData {
    aggregations: PageAggregations;
    properties: PageProperties;
    additionalProperties?: ObjectAggregation;
    propertiesVariants?: Array<PageProperties>;
}
export interface AggregationVariant {
    properties: PageProperties;
    aggregations: PageAggregations;
}
export type SpecificationKey = {
    name: string;
    value: string;
};
export type SpecificationKeysTag = Array<SpecificationKey>;
interface AggregationUnion {
    name: string;
    originalNames: string[];
}
export declare const CUSTOM_EXTENSION_ANCHOR_PROPERTIES: string[];
/**
 * Represents an aggregation for objects.
 */
export declare class ObjectAggregation implements Parser.TreeAggregation {
    path: Parser.PropertyPath;
    aggregations: PageAggregations;
    properties: PageProperties;
    additionalProperties?: ObjectAggregation;
    variants: Array<AggregationVariant>;
    childClass?: typeof ObjectAggregation;
    additionalText?: string;
    locations?: Location[];
    actions?: SupportedAggregationActions;
    inactive?: boolean;
    schema?: JSONSchema4;
    annotationCreationForms: CreationFormOptions[];
    allowedAnnotationCreationForms?: AggregationCreationForm[];
    schemaCreationForms: CreationFormOptions[];
    formSchema?: ObjectAggregation;
    sortableList?: boolean;
    sortableItem?: SortingOptions;
    sortableReadonlyTooltip?: string;
    sortableConfigOnly?: boolean;
    order?: number;
    description?: string;
    i18nKey?: string;
    state?: ValidationState;
    messages?: PropertyMessage[];
    value: unknown;
    readonly type: AggregationType;
    readonly parent?: ObjectAggregation;
    custom: boolean;
    isViewNode?: boolean;
    isTable: boolean;
    pattern?: string;
    name?: string;
    union?: AggregationUnion;
    sortableCollection?: string;
    annotationNodeId?: number[];
    dropUINodes?: Record<string, boolean>;
    pending?: PendingChange;
    hidden?: boolean;
    artifactType?: ArtifactType;
    virtual?: boolean;
    icon?: string;
    isAtomic?: boolean;
    /**
     * Creates an instance of `ObjectAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Method adds aggregation object.
     *
     * @param name Name of aggregation.
     * @param aggregation Aggregation to add.
     * @param path Array of path to aggregation.
     * @param order Order index.
     * @param overwrite Overwrite existing aggregation.
     * @returns Added aggregation.
     */
    addAggregation(name: string, aggregation: ObjectAggregation, path: Parser.PropertyPath, order?: number, overwrite?: boolean): ObjectAggregation;
    /**
     * Method adds property object.
     *
     * @param name Name of property.
     * @param schema Schema object of property.
     * @returns Instance of new property.
     */
    addProperty(name: string, schema: JSONSchema4): NodeProperty;
    /**
     * Public method returns display name of aggregation.
     * Is used as display name in outline.
     *
     * @param i18nBundle I18n translation entries which should be looked up if display value persists.
     * @returns Display name of aggregation with applied i18n.
     */
    getDisplayName(i18nBundle?: I18nBundle): string;
    /**
     * Retrieves the supported aggregation actions for this instance.
     *
     * @returns A list of supported aggregation actions.
     */
    getSupportedActions(): SupportedAggregationActions;
    /**
     * Public method that returns keys from schema for an aggregation object.
     *
     * @returns Array of keys.
     */
    getKeys(): SpecificationKeysTag | undefined;
    /**
     * Method returns value of passed schema key.
     *
     * @param name Name to search.
     * @returns Value for passed key's name.
     */
    getValueOfSchemaKey(name: string): string | undefined;
    /**
     * Public method that returns technical name for an aggregation object.
     * Currently it is used to display in tooltip.
     *
     * @returns technical name.
     */
    getTechnicalName(): string | undefined;
    /**
     * Protected method returns display name of aggregation without applying i18n translation.
     *
     * @returns Display name of aggregation.
     */
    protected getRawDisplayName(): string;
    /**
     * Method formats text for display.
     * Trim is used to avoid whitespaces.
     *
     * @param text Text to format.
     * @returns Formatted text.
     */
    private formatTextForDisplay;
    /**
     * Method updates value of aggregatipn properties and child aggregations.
     *
     * @param data Data which should be used for value population.
     */
    private updateValues;
    /**
     * Public method which recursively updates aggregation's properties with values from passed data object.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Page annotations.
     * @param parser Model parser parameters.
     */
    updatePropertiesValues(data: PageData | undefined, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations?: PageAnnotations, parser?: ModelParserParams<ObjectAggregation>): void;
    /**
     * Method which called when properties and aggregation data was applied and updated.
     */
    protected onPropertiesUpdated(): void;
    /**
     * Refreshes internal data based on latest annotation node data.
     *
     * @param annotations Page annotations.
     */
    updateAnnotationData(annotations: PageAnnotations | undefined): void;
    /**
     * Method checks if annotation contains allowedSubnodeTypes
     * and sets disabled param for add action button.
     *
     * @param annotations Page annotations.
     * @param uiNode Annotation node.
     */
    private setAllowedParents;
    /**
     * Refreshes node locations based on the annotation node data.
     *
     * @param annotations All page annotation nodes.
     * @param currentUINode Current annotation node.
     */
    protected updateLocations(annotations: PageAnnotations | undefined, currentUINode?: UINode): void;
    /**
     * Method provides creation options based on its related annotation node.
     *
     * @param annotations Page annotations.
     * @returns Array of creation forms.
     */
    protected getNativeNodeCreationForms(annotations: PageAnnotations | undefined): CreationFormOptions[];
    /**
     * Method provides default creation options, when no matching annotation node exists.
     *
     * @param annotations Page annotations.
     * @returns Array of creation forms.
     */
    getDefaultNativeCreationForms(annotations: PageAnnotations): CreationFormOptions[];
    /**
     * Method recursively searches for parent with 'annotationNodeId' and returns 'annotationNodeId' as current context.
     *
     * @returns Annotation node id.
     */
    getParentAnnotationNodeId(): number[] | undefined;
    /**
     * Method get valid object of properties.
     * There can be case when aggregation can have several variants of property combination - we are returning currently valid, depending on entered values.
     *
     * @returns Object of properties.
     */
    getProperties(): PageProperties;
    /**
     * Method returns copy of ObjectAggregation object.
     *
     * @param type Type of aggregation.
     * @returns Copy of ObjectAggregation.
     */
    getCopy(type?: typeof ObjectAggregation): ObjectAggregation;
    /**
     * Recursive method to use for copying aggregations objects.
     *
     * @param aggregation Original aggregation for copy.
     * @param type Type of aggregation.
     */
    private createAggregations;
    /**
     * Method sorts aggregation by 'order' property.
     *
     * @param name1 Aggregation name.
     * @param name2 Aggregation name.
     * @returns Sort result.
     */
    private aggregationOrderSorter;
    /**
     * Method returns array of ordered aggregation keys/names.
     *
     * @param viewNodesOnly Return only aggregations for view.
     * @param sortBy Sorting type. Currently aggregations can be sorted by 'ViewNode' to move visible nodes to top.
     * @returns Array of aggregations keys/names.
     */
    getAggregationKeys(viewNodesOnly?: boolean, sortBy?: AggregationSortBy): Array<string>;
    /**
     * Aggregation key sorter by view node.
     * Sorter also sorts by aggregation key in scope of save view node group.
     *
     * @param key1 First aggregation key.
     * @param key2 Second aggregation key.
     * @returns Sorter result.
     */
    private getViewNodeSorter;
    /**
     * Method updates path recursively.
     *
     * @param aggregation Aggregation to update.
     * @param path Current path.
     */
    private updatePath;
    /**
     * Set method to store path of aggregation.
     *
     * @param path Path array.
     */
    protected setPath(path: Parser.PropertyPath): void;
    /**
     * Method returns maximal order by looping through all properties.
     *
     * @returns Maximal property order index.
     */
    getMaxOrder(): number;
    /**
     * Method enables union handling by adding setting union name and passing original name of aggregation.
     *
     * @param name Union name for aggregation.
     * @param originalName Original name of aggregation.
     */
    addUnionName(name: string, originalName: string): void;
    /**
     * Protected method which returns name with additional formatting if it is unnecessary.
     * Default logic does not apply any additional formatting, but it allows to overwrite such method and provide additional logic specific to each aggregation.
     *
     * @returns Name of aggregation.
     */
    protected getFormattedName(): string | undefined;
    /**
     * Method returns associated annotation UI Node for aggregation.
     *
     * @param annotations Annotations data.
     * @returns Associated annotation UI Node.
     */
    private getCurrentUINode;
    /**
     * Method handles readonly annotation node by disabling actions and DnD.
     *
     * @param readonlyTooltip Tooltip text for readonly mode.
     */
    protected applyReadonlyAnnotationNode(readonlyTooltip?: string): void;
    /**
     * Method removes passed action from visible actions.
     *
     * @param action Action to remove.
     */
    protected removeAction(action: AggregationActions): void;
    /**
     * Method returns allowed drop ranges for passed source aggregation.
     *
     * @param source Source aggregation.
     * @returns Allowed drop ranges for passed source aggregation.
     */
    getAllowedDropRange(source: ObjectAggregation): AllowedMoveRange[] | undefined;
    /**
     * Method returns whether aggregation node has macros metadata.
     *
     * @returns Whether aggregation node is macros node.
     */
    isMacrosNode(): boolean;
    /**
     * Method converts property to aggregation.
     *
     * @param key Property key/index in object.
     * @param path Aggregation path.
     */
    private convertAtomicPropertyToAggregation;
    /**
     * Method handles atomic aggregation by converting properties to aggregation.
     *
     * @param data Aggregation source data.
     * @param path Aggregation path.
     */
    private handleAtomicObject;
}
export {};
//# sourceMappingURL=ObjectAggregation.d.ts.map