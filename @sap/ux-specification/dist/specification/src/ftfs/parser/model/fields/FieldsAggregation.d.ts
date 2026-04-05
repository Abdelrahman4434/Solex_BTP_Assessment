import { ObjectAggregation } from '../ObjectAggregation';
import { FieldAggregation } from './FieldAggregation';
import { AggregationCreationForm } from '../types';
import type { PageAnnotations } from '../types';
/**
 * Represents an aggregation for fields objects.
 */
export declare class FieldsAggregation extends ObjectAggregation {
    sortableList: boolean;
    childClass: typeof FieldAggregation;
    allowedAnnotationCreationForms: AggregationCreationForm[];
    sortableCollection: string | undefined;
    i18nKey: string;
    /**
     * Refreshes internal data based on annotation node data.
     * Overwritten to keep child nodes order the same as they defined in connected fields template.
     *
     * @param annotations Page annotations.
     */
    updateAnnotationData(annotations: PageAnnotations | undefined): void;
}
//# sourceMappingURL=FieldsAggregation.d.ts.map