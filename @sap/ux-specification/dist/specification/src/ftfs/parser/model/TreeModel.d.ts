import type { JSONSchema4 } from 'json-schema';
import { PageType } from '@sap/ux-specification-types';
import type { Parser, PageConfig } from '@sap/ux-specification-types';
import { ObjectAggregation } from './ObjectAggregation';
import { AggregationValidator } from './AggregationValidator';
import type { PageData, PageAnnotations } from './types';
import { AggregationType } from './types';
/**
 * Page/application schema parsing model.
 * `TreeModel` is responsible for:
 * - Holding metadata about a page (type, schema, annotations, etc.).
 * - Storing both current (`data`) and original (`originalData`) page definitions.
 * - Managing the root aggregation tree (`root`) for further parsing and validation.
 * - Supporting schema traversal, validation, and exclusion rules.
 */
export declare class TreeModel implements Parser.TreeModel {
    name: string;
    pageType?: PageType;
    root: ObjectAggregation;
    data: PageConfig & {
        $filePath?: string;
    };
    originalData: {
        page: PageConfig;
        schema: string;
        annotations: PageAnnotations;
    };
    readonly definitions: {
        [key: string]: JSONSchema4;
    };
    private readonly excludeProperties;
    schema: JSONSchema4;
    validator: AggregationValidator;
    pendingNodes: ObjectAggregation[];
    private logger?;
    /**
     * Creates an instance of TreeModel.
     *
     * @param name Page name.
     * @param page Page configuration object(generated from specification).
     * @param schema Page configuration schema(generated from specification).
     * @param annotations Page annotations.
     * @param pageType Page type.
     */
    constructor(name: string, page: PageConfig, schema: string, annotations: PageAnnotations, pageType?: PageType);
    /**
     * Initialize model data - parse schema and current page object values.
     *
     * @param annotations Page annotations.
     */
    private init;
    /**
     * Updates or creates an property in ObjectAggregation based on a JSON Schema node.
     *
     * @param name - The property name being updated.
     * @param aggregation - The aggregation object that holds property definitions.
     * @param currentNode - The JSON Schema node describing the property.
     */
    private updatePropertyFromSchema;
    /**
     * Method returns context of passed macros node ID used in getMatchingNode.
     *
     * @param currentMacrosNodeId Current macros node id.
     * @param annotationNodes All annotation nodes.
     * @returns Matched node context.
     */
    private getContextForMacrosNode;
    private readonly schemaParsers;
    private readonly schemaReferenceParsers;
    /**
     * Method creates properties variants by handling array "anyOf" schema property.
     *
     * @param anyOf Array value of "anyOf" schema property.
     * @param params Schema parse params.
     */
    private createAnyOfPropertiesVariations;
    /**
     * Method uses recursion to parse schema and populate model with aggregations and properties for tree structure.
     *
     * @param aggregation Current aggregation.
     * @param currentNode Current schema node.
     * @param currentAnnotationNode Current annotation node.
     * @param name Name of aggregation.
     * @param path Array containing path to current aggregation.
     * @param context Object containing Parser context.
     */
    private parseSchema;
    /**
     * Handle and copy some simple properties from schema definition - we need copy them as they can be defined in multiple places inside of schema object like:
     * 1. Outside of reference. Example - "name": { "$ref": "....", "description": "..." }
     * 2. Inside of reference.
     *
     * @param aggregation Current aggregation.
     * @param currentNode Current schema node.
     * @param name Name of aggregation.
     */
    private copySchemaProperties;
    /**
     * Method checs is json schema node should be used for property.
     *
     * @param schema Schema node to check.
     * @returns Schema node should be used for property.
     */
    private isProperty;
    /**
     * Method checs is json schema node should be used for aggregation.
     *
     * @param schema Schema node to check.
     * @returns Schema node should be used for aggregation.
     */
    private isAggregation;
    /**
     * Handles dynamic `additionalProperties` (or `additionalItems`) for an aggregation.
     * If `data` contains keys that are not part of the aggregation's defined
     * properties or child aggregations, this method tries to resolve them
     * against the schema's `additionalProperties` definition and creates
     * corresponding child aggregations dynamically.
     *
     * @param aggregation - Current aggregation node being processed.
     * @param data - Page data object containing potential additional properties.
     */
    private handleAdditionalProperties;
    /**
     * Method uses recursion to populate aggregations/properties of aggregation by looping through 'additionalProperties' from schema.
     *
     * @param aggregation ObjectAggregation which would be populated.
     * @param data Page data - object contains latest page values.
     */
    readAdvancedPropertiesData(aggregation: ObjectAggregation, data: PageData): void;
    /**
     * Method uses recursion to populate 'aggregation' with values from page object.
     *
     * @param aggregation ObjectAggregation which would be populated.
     * @param data Page data - object contains latest page values.
     */
    readPropertiesData(aggregation: ObjectAggregation, data: PageData): void;
    /**
     * Method prepares simple aggregation object.
     *
     * @param path Path for aggregation.
     * @param schema Schema segment for new aggregation.
     * @param parentAggregation Parent aggregation.
     * @param type Aggregation type.
     * @returns Predefined aggregation object.
     */
    prepareAggregation(path?: Parser.PropertyPath, schema?: JSONSchema4, parentAggregation?: ObjectAggregation, type?: AggregationType): ObjectAggregation;
    /**
     * Method to check if free text entry should be enabled for property.
     *
     * @param schema Schema node to check.
     * @returns Free text entry allowed.
     */
    private isFreeText;
    /**
     * Generic method receives array of properties and copies received properties from 'currentNode' into target 'obj'.
     *
     * @param targetObj Target object for store.
     * @param props Properties name to copy from 'currentNode' into 'targetObj'.
     * @param currentNode JSON Schema node.
     */
    private storeInnerProperties;
    /**
     * Method returns schema item definition for array schema resolution.
     *
     * @param currentNode Current schema node.
     * @returns Array's schema definition or undefined if it does not exist.
     */
    private getSchemaArrayItem;
    /**
     * Method updates 'formSchema' property for array aggregation.
     *
     * @param aggregation Aggregation to handle.
     */
    private updateArrayFormSchema;
    /**
     * Method updates aggregation 'formSchema' property with schema object which will represent creation form.
     *
     * @param aggregation Aggregation to handle.
     * @param name Aggregation name in 'additionalProperties'.
     */
    private updateFormSchema;
    /**
     * Method goes with recursion and marks all visible nodes for outline.
     *
     * @param aggregation Aggregation object.
     * @returns Returns visbility of aggregation.
     */
    private updateViewNodes;
    /**
     * Method validates property from JSON schema.
     * That method helps to avoid issues, when we are receiving incorrect schema.
     *
     * @param name Schema property name.
     * @param value Value of schema property.
     * @returns Is schema property valid.
     */
    private isCorrectSchemaProperty;
    /**
     * Method to sort schema properties.
     * Spec provides custom property 'propertyIndex', which should be used for sorting.
     *
     * @param properties Object with properties.
     * @param name1 First property name.
     * @param name2 Second property name.
     * @returns Sort result.
     */
    private propertySorter;
    /**
     * Method handles post initialization.
     * Currently it is used for FPM custom pages to add additional root 'macros' node.
     *
     * @param annotations Page annotations.
     */
    private afterInit;
    /**
     * Method checks if passed schema is atomic type.
     * Atomic means that schema expects simple value as "string", "number" or "boolean".
     *
     * @param schema Schema to check.
     * @returns True if passed schema should be considered as atomic.
     */
    private isSchemaAtomic;
}
//# sourceMappingURL=TreeModel.d.ts.map