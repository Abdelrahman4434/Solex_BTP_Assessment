"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeaderSectionsAggregation = void 0;
const i18next_1 = __importDefault(require("i18next"));
const SectionsObjectAggregation_1 = require("./SectionsObjectAggregation");
const types_1 = require("../types");
/**
 * Represents an aggregation for header sections objects.
 */
class HeaderSectionsAggregation extends SectionsObjectAggregation_1.SectionsObjectAggregation {
    /**
     * Creates an instance of `HeaderSectionsAggregation`.
     *
     * @param data Optional aggregation data object used to initialize properties.
     * @param schema Optional JSON schema fragment associated with this aggregation.
     */
    constructor(data, schema) {
        super(data, schema);
        this.allowedAnnotationCreationForms = [
            types_1.AggregationCreationForm.NativeSection,
            types_1.AggregationCreationForm.DataPointSection,
            types_1.AggregationCreationForm.ProgressSection,
            types_1.AggregationCreationForm.RatingSection,
            types_1.AggregationCreationForm.ChartSection
        ];
        const additionalProperties = schema?.additionalProperties;
        if (typeof additionalProperties === 'object' && additionalProperties.$ref) {
            this.schemaCreationForms = [
                {
                    name: types_1.AggregationCreationForm.CustomHeaderSection,
                    kind: types_1.SCHEMA_CREATION_FORM,
                    title: 'PAGE_EDITOR_OUTLINE_ADD_CUSTOM_SECTIONS_TITLE',
                    disabled: false
                }
            ];
        }
    }
    /**
     * Overwritten method for data update of object page header sections
     * Method receives current values for sections - loops custom sections array and appends existing/standard aggregations with custom section aggregations.
     *
     * @param data Data which should be used for value population.
     * @param page Page config data.
     * @param pageType Page type.
     * @param path Aggregation path.
     * @param annotations Page annotations.
     */
    updatePropertiesValues(data, page, pageType, path, annotations) {
        super.updatePropertiesValues(data, page, pageType, path, annotations);
        this.formSchema = this.additionalProperties?.aggregations?.['sections'];
        const sections = data || {};
        for (const id in sections) {
            const section = this.aggregations[id];
            if (section?.schema && !section.schema.annotationPath) {
                const templateEdit = section.properties['templateEdit']?.value;
                const template = section.properties['fragmentName']?.value;
                let goToCodeAction;
                if (typeof template === 'string' && typeof templateEdit === 'string') {
                    goToCodeAction = {
                        type: types_1.AggregationActions.OpenSource,
                        subActions: [
                            {
                                id: template,
                                text: i18next_1.default.t('CUSTOM_HEADER_SECTION_TEMPLATE')
                            },
                            {
                                id: templateEdit,
                                text: i18next_1.default.t('CUSTOM_HEADER_SECTION_TEMPLATE_EDIT')
                            }
                        ]
                    };
                }
                section.markAsCustomSection(undefined, undefined, goToCodeAction);
            }
        }
    }
}
exports.HeaderSectionsAggregation = HeaderSectionsAggregation;
//# sourceMappingURL=HeaderSectionsAggregation.js.map