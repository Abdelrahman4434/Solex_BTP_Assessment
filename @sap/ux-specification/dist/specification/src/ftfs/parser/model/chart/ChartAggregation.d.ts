import { ObjectAggregation } from '../ObjectAggregation';
import type { PageData, PageAnnotations } from '../types';
import type { PageConfig, PageType, Parser } from '@sap/ux-specification-types';
/**
 * Represents an aggregation for analytical chart objects.
 */
export declare class ChartAggregation extends ObjectAggregation {
    /**
     * Overwritten method for data update.
     * Is used to detect if we need hide aggregation depending on received data.
     * Method should be removed after action status fulfilled would consider full sync flow(18990).
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Page annotations.
     */
    updatePropertiesValues(data: PageData, page: PageConfig, pageType: PageType, path: Parser.PropertyPath, annotations?: PageAnnotations): void;
}
//# sourceMappingURL=ChartAggregation.d.ts.map