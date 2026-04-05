import type { JSONSchema4 } from 'json-schema';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
import { ObjectAggregation } from '../ObjectAggregation';
import type { PageEditAggregationData } from '../ObjectAggregation';
import { AggregationCreationForm } from '../types';
import type { PageData, CreationFormOptions, PageAnnotations, AllowedMoveRange } from '../types';
import { ActionAggregation } from './ActionAggregation';
export declare enum ActionType {
    Annotation = "Annotation",
    Copy = "Copy",
    Criticality = "Criticality",
    Custom = "Custom",
    Standard = "Standard",
    StandardWithoutAnnotation = "StandardWithoutAnnotation"
}
export interface ActionsContainers {
    top: AllowedMoveRange;
    bottom: AllowedMoveRange;
}
/**
 * Represents an aggregation for actions container object.
 */
export declare class ActionsAggregation extends ObjectAggregation {
    sortableList: boolean;
    childClass: typeof ActionAggregation;
    allowedAnnotationCreationForms: AggregationCreationForm[];
    sortableCollection: string | undefined;
    i18nKey: string;
    /**
     * Creates an instance of `ActionsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Method adds aggregation object.
     * Overwritten to mark standard action.
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
     * Overwritten method for data update of object page actions
     * Method receives current values for actions and detects custom actions.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Annotations data.
     */
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations: PageAnnotations): void;
    /**
     * Method provides creation options based on its related annotation node.
     *
     * @param annotations Page annotations.
     * @returns Array of creation forms.
     */
    protected getNativeNodeCreationForms(annotations: PageAnnotations | undefined): CreationFormOptions[];
}
//# sourceMappingURL=ActionsAggregation.d.ts.map