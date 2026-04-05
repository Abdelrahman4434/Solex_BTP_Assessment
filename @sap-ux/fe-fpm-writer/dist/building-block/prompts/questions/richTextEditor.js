"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRichTextEditorBuildingBlockPrompts = getRichTextEditorBuildingBlockPrompts;
const i18n_1 = require("../../../i18n");
const utils_1 = require("../utils");
const types_1 = require("../../types");
const prompt_helpers_1 = require("../utils/prompt-helpers");
/**
 * Returns a list of prompts required to generate a rich text editor building block.
 *
 * @param context - prompt context including data about project
 * @returns Prompt with questions for rich text editor.
 */
async function getRichTextEditorBuildingBlockPrompts(context) {
    const t = (0, i18n_1.translate)(i18n_1.i18nNamespaces.buildingBlock, 'prompts.richTextEditor.');
    return {
        questions: [
            (0, utils_1.getBuildingBlockIdPrompt)(context, t('id.validation'), {
                message: t('id.message'),
                guiOptions: {
                    mandatory: true
                }
            }),
            (0, utils_1.getViewOrFragmentPathPrompt)(context, t('viewOrFragmentPath.validate'), {
                message: t('viewOrFragmentPath.message'),
                guiOptions: {
                    mandatory: true,
                    dependantPromptNames: ['aggregationPath']
                }
            }),
            (0, utils_1.getBindingContextTypePrompt)({
                name: 'buildingBlockData.metaPath.bindingContextType',
                message: t('bindingContextType'),
                default: types_1.bindingContextAbsolute,
                guiOptions: {
                    mandatory: true,
                    dependantPromptNames: ['buildingBlockData.metaPath.entitySet']
                },
                choices: (0, prompt_helpers_1.resolveBindingContextTypeChoices)(context)
            }),
            (0, utils_1.getEntityPrompt)(context, {
                name: 'buildingBlockData.metaPath.entitySet',
                default: context.options?.pageContextEntitySet,
                message: t('entitySet'),
                guiOptions: {
                    mandatory: true,
                    dependantPromptNames: ['buildingBlockData.targetProperty']
                }
            }),
            (0, utils_1.getTargetPropertiesPrompt)(context, {
                name: 'buildingBlockData.targetProperty',
                message: t('targetProperty'),
                guiOptions: {
                    mandatory: true
                }
            }),
            (0, utils_1.getAggregationPathPrompt)(context, {
                message: t('aggregation'),
                guiOptions: {
                    mandatory: true
                }
            })
        ],
        initialAnswers: {
            buildingBlockData: {
                buildingBlockType: types_1.BuildingBlockType.RichTextEditor
            }
        }
    };
}
//# sourceMappingURL=richTextEditor.js.map