import type { PageEditAggregationData } from '../ObjectAggregation';
import { ObjectAggregation } from '../ObjectAggregation';
import type { v2 } from '@sap/ux-specification-types';
import type { JSONSchema4 } from 'json-schema';
import type { SupportedAggregationAction, SupportedAggregationActions } from '../types';
/**
 * Represents an aggregation for section objects.
 */
export declare class SectionAggregation extends ObjectAggregation {
    actions: SupportedAggregationActions;
    private title?;
    id?: string;
    position?: string;
    data?: v2.ObjectPageCustomSectionBase;
    useDescriptionAsId?: boolean;
    isViewNode: boolean;
    sortableCollection: string | undefined;
    /**
     * Creates an instance of `SectionAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data?: PageEditAggregationData, schema?: JSONSchema4);
    /**
     * Setter for title.
     *
     * @param title Title.
     */
    setTitle(title: string): void;
    /**
     * Setter for id.
     *
     * @param id Title.
     */
    setId(id: string): void;
    /**
     * Method returns display name of aggregation without applying i18n translation.
     * Overwritten for section handling.
     *
     * @returns Display name of aggregation.
     */
    protected getRawDisplayName(): string;
    /**
     * Public method to read/determine section id.
     *
     * @param fallback Resolve id with V4 fallback solution by reading label/description.
     * @returns Section id.
     */
    getSectionId(fallback?: boolean): string | undefined;
    /**
     * Public method to mark section as replaced with other section.
     *
     * @param replacedWith Section replaced with.
     */
    markAsReplaced(replacedWith: string): void;
    /**
     * Public method to mark section as custom section.
     *
     * @param data Configuration of section(segment of page config).
     * @param i18nKey I18n custom key.
     * @param goCodeAction Go to code action.
     */
    markAsCustomSection(data?: v2.ObjectPageCustomSectionBase, i18nKey?: string, goCodeAction?: SupportedAggregationAction): void;
    /**
     * Method parses object path key and returns field name / technical id.
     *
     * @returns Section id.
     */
    getTechnicalName(): string | undefined;
    /**
     * Protected method which returns name with additional formatting by removing 'SAP_ANNOTATION_NAMESPACE' from full name/id.
     *
     * @returns Name of aggregation.
     */
    protected getFormattedName(): string | undefined;
}
//# sourceMappingURL=SectionAggregation.d.ts.map