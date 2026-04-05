"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubSectionsAggregation = void 0;
const types_1 = require("../types");
const SectionsObjectAggregation_1 = require("./SectionsObjectAggregation");
/**
 * Represents an aggregation for sub-sections objects.
 */
class SubSectionsAggregation extends SectionsObjectAggregation_1.SectionsObjectAggregation {
    /**
     * Creates an instance of `SubSectionsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        const additionalProperties = schema?.additionalProperties;
        if (typeof additionalProperties === 'object' && additionalProperties.$ref) {
            this.schemaCreationForms = [
                {
                    name: types_1.AggregationCreationForm.CustomSubSection,
                    kind: types_1.SCHEMA_CREATION_FORM,
                    title: 'PAGE_EDITOR_OUTLINE_ADD_CUSTOM_SECTIONS_TITLE',
                    disabled: false
                }
            ];
        }
    }
    /**
     * Overwritten method for data update of object page sections
     * Method receives current values for sections - loops custom sections array and appends existing/standard aggregations with custom section aggregations.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Page annotations.
     * @param parser Model parser parameters.
     */
    updatePropertiesValues(data, page, pageType, path, annotations, parser) {
        super.updatePropertiesValues(data, page, pageType, path, annotations, parser);
        this.formSchema = this.additionalProperties?.aggregations?.['subsections'];
    }
    /**
     * Public method checks if annotation sections are merged by 'sap.fe' in runtime.
     * There is two reordering approaches:
     * 1. When annotations sections are merged into one. There no any collection section in such case.
     * 2. When sections are separated. There is at least one collection section in such case.
     *
     * @returns Annotation sections are merged by 'sap.fe' in runtime.
     */
    isSectionsMerged() {
        let mergedAnnotationNodes = 0;
        for (const key in this.aggregations) {
            const aggregation = this.aggregations[key];
            if ('subsections' in aggregation.aggregations) {
                // Collection facet - sections are not merged in runtime by 'sap.fe'
                return false;
            }
            else if (!aggregation.custom) {
                mergedAnnotationNodes++;
            }
        }
        // If there is at least one annotation node - sections are merged
        return mergedAnnotationNodes > 0;
    }
}
exports.SubSectionsAggregation = SubSectionsAggregation;
//# sourceMappingURL=SubSectionsAggregation.js.map