import { ObjectAggregation } from './ObjectAggregation';
import { AggregationCreationForm } from './types';
import type { CreationFormOptions, PageAnnotations } from './types';
/**
 * Represents an aggregation for root level object in page/application schema.
 */
export declare class RootAggregation extends ObjectAggregation {
    allowedAnnotationCreationForms: AggregationCreationForm[];
    name: string;
    /**
     * Method provides creation options based on its related annotation node.
     * Overwritten, return array which was calculated on annotation data refresh.
     *
     * @returns Array of creation forms.
     */
    getDefaultNativeCreationForms(): CreationFormOptions[];
    /**
     * Refreshes internal data based on latest annotation node data.
     *
     * @param annotations Page annotations.
     */
    updateAnnotationData(annotations: PageAnnotations | undefined): void;
}
//# sourceMappingURL=RootAggregation.d.ts.map