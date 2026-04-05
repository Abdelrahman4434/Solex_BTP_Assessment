"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageBuildingBlockPrompts = getPageBuildingBlockPrompts;
const i18n_1 = require("../../../i18n");
const utils_1 = require("../utils");
const types_1 = require("../../types");
const i18n_2 = require("@sap-ux/i18n");
/**
 * Returns a list of prompts required to generate a page building block.
 *
 * @param context - prompt context including data about project
 * @returns Prompt with questions for page.
 */
async function getPageBuildingBlockPrompts(context) {
    const t = (0, i18n_1.translate)(i18n_1.i18nNamespaces.buildingBlock, 'prompts.page.');
    return {
        questions: [
            (0, utils_1.getViewOrFragmentPathPrompt)(context, t('viewOrFragmentPath.validate'), {
                message: t('viewOrFragmentPath.message'),
                guiOptions: {
                    mandatory: true,
                    dependantPromptNames: ['aggregationPath']
                }
            }),
            (0, utils_1.getAggregationPathPrompt)(context, {
                message: t('aggregation'),
                guiOptions: {
                    mandatory: true
                }
            }),
            (0, utils_1.getBuildingBlockIdPrompt)(context, t('id.validation'), {
                message: t('id.message'),
                default: 'Page',
                guiOptions: {
                    mandatory: true
                }
            }),
            {
                type: 'input',
                name: 'buildingBlockData.title',
                message: t('title.message'),
                guiOptions: {
                    mandatory: true,
                    translationProperties: {
                        type: i18n_2.SapShortTextType.Heading,
                        annotation: t('title.translationAnnotation')
                    }
                }
            },
            {
                type: 'input',
                name: 'buildingBlockData.description',
                message: t('description.message'),
                guiOptions: {
                    translationProperties: {
                        type: i18n_2.SapLongTextType.Description,
                        annotation: t('description.translationAnnotation')
                    }
                }
            }
        ],
        initialAnswers: {
            buildingBlockData: {
                buildingBlockType: types_1.BuildingBlockType.Page
            }
        }
    };
}
//# sourceMappingURL=page.js.map