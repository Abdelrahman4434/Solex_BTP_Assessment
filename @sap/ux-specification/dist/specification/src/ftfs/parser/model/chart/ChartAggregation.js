"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartAggregation = void 0;
const ObjectAggregation_1 = require("../ObjectAggregation");
/**
 * Represents an aggregation for analytical chart objects.
 */
class ChartAggregation extends ObjectAggregation_1.ObjectAggregation {
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
    updatePropertiesValues(data, page, pageType, path, annotations) {
        super.updatePropertiesValues(data, page, pageType, path, annotations);
        // Can be removed after webview action status "fulfilled" would considers full sync flow(18990).
        const hasAnnotationPathProperty = !!this.schema?.properties?.['annotationPath'];
        if (hasAnnotationPathProperty && !data?.annotationPath) {
            this.hidden = true;
        }
    }
}
exports.ChartAggregation = ChartAggregation;
//# sourceMappingURL=ChartAggregation.js.map