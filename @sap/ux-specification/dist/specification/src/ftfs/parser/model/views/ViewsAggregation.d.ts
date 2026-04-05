import { ObjectAggregation } from '../ObjectAggregation';
import type { PageData, PageAnnotations } from '../types';
import { AggregationCreationForm } from '../types';
import { ViewAggregation } from './ViewAggregation';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
/**
 * Represents an aggregation for views objects.
 */
export declare class ViewsAggregation extends ObjectAggregation {
    sortableList: boolean;
    childClass: typeof ViewAggregation;
    allowedAnnotationCreationForms: AggregationCreationForm[];
    sortableCollection: string | undefined;
    sortableConfigOnly: boolean;
    i18nKey: string;
    /**
     * Refreshes internal data based on latest annotation node data.
     *
     * @param annotations Page annotations.
     */
    updateAnnotationData(annotations: PageAnnotations | undefined): void;
    /**
     * Overwritten method for data update of list report views container node.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Annotations data.
     */
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations: PageAnnotations | undefined): void;
    /**
     * Determines the delete action configuration for a given view aggregation.
     *
     * @param viewAggregation - The view aggregation to evaluate.
     * @param annotations - The current page annotations context.
     * @returns The delete action configuration for the view.
     */
    private getViewDeleteAction;
    /**
     * Enables/Disables the chart form based on the annotations.
     *
     * @param forms Array of creation forms
     * @param annotations Page annotations
     */
    private toggleChartForm;
    /**
     * Method returns count of annotations views.
     *
     * @returns Count of annotations views.
     */
    private getAnnotationViewCount;
}
//# sourceMappingURL=ViewsAggregation.d.ts.map