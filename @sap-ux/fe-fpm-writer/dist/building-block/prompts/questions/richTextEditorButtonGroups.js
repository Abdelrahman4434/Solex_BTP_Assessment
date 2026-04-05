"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRichTextEditorButtonGroupsBuildingBlockPrompts = getRichTextEditorButtonGroupsBuildingBlockPrompts;
const i18n_1 = require("../../../i18n");
const types_1 = require("../../types");
const utils_1 = require("../utils");
const prompt_helpers_1 = require("../utils/prompt-helpers");
const t = (0, i18n_1.translate)(i18n_1.i18nNamespaces.buildingBlock, 'prompts.richTextEditorButtonGroups.');
/**
 * Returns a list of prompts required to generate a rich text editor building block.
 *
 * @param context
 * @returns Prompt with questions for rich text editor.
 */
async function getRichTextEditorButtonGroupsBuildingBlockPrompts(context) {
    return {
        questions: [
            (0, utils_1.getViewOrFragmentPathPrompt)(context, t('viewOrFragmentPath.validate'), {
                message: t('viewOrFragmentPath.message'),
                guiOptions: {
                    mandatory: true,
                    dependantPromptNames: ['aggregationPath', 'buildingBlockData.buttonGroups']
                }
            }),
            (0, utils_1.getAggregationPathPrompt)(context, {
                message: t('aggregation'),
                guiOptions: {
                    mandatory: true,
                    dependantPromptNames: ['buildingBlockData.buttonGroups']
                }
            }),
            {
                type: 'checkbox',
                name: 'buildingBlockData.buttonGroups',
                message: t('message'),
                choices: (answers) => (0, prompt_helpers_1.getButtonGroupsChoices)(context, answers),
                guiOptions: {
                    hint: t('replaceDefaultButtonGroupsHint'),
                    selectType: 'dynamic'
                }
            }
        ],
        initialAnswers: {
            buildingBlockData: {
                buildingBlockType: types_1.BuildingBlockType.RichTextEditorButtonGroups
            }
        }
    };
}
//# sourceMappingURL=richTextEditorButtonGroups.js.map