"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFormBuildingBlockPrompts = getFormBuildingBlockPrompts;
const i18n_1 = require("@sap-ux/i18n");
const i18n_2 = require("../../../i18n");
const building_blocks_1 = require("./building-blocks");
const utils_1 = require("../utils");
const types_1 = require("../../types");
const MANIFEST_LIBRARIES_GROUP = (0, building_blocks_1.getManifestPromptsGroup)();
const groupIds = {
    commonFormBuildingBlockProperties: 'formBuildingBlockProperties'
};
const defaultAnswers = {
    id: 'Form',
    bindingContextType: 'absolute'
};
/**
 * Returns a list of prompts required to generate a form building block.
 *
 * @param context - prompt context including data about project
 * @returns Prompt with questions for form.
 */
async function getFormBuildingBlockPrompts(context) {
    const { project } = context;
    const t = (0, i18n_2.translate)(i18n_2.i18nNamespaces.buildingBlock, 'prompts.form.');
    const groups = [
        {
            id: groupIds.commonFormBuildingBlockProperties,
            title: t('formBuildingBlockPropertiesTitle'),
            description: t('formBuildingBlockPropertiesDescription', { returnObjects: true })
        },
        MANIFEST_LIBRARIES_GROUP
    ];
    const questionsArray = [
        (0, utils_1.getViewOrFragmentPathPrompt)(context, t('viewOrFragmentPath.validate'), {
            message: t('viewOrFragmentPath.message'),
            guiOptions: {
                groupId: groupIds.commonFormBuildingBlockProperties,
                mandatory: true,
                dependantPromptNames: ['aggregationPath']
            }
        }),
        (0, utils_1.getBuildingBlockIdPrompt)(context, t('id.validation'), {
            message: t('id.message'),
            default: defaultAnswers.id,
            guiOptions: {
                groupId: groupIds.commonFormBuildingBlockProperties,
                mandatory: true
            }
        }),
        (0, utils_1.getBindingContextTypePrompt)({
            message: t('bindingContextType'),
            default: defaultAnswers.bindingContextType,
            guiOptions: {
                groupId: groupIds.commonFormBuildingBlockProperties,
                mandatory: true,
                dependantPromptNames: ['buildingBlockData.metaPath.qualifier']
            }
        }),
        ...(project && (0, utils_1.isCapProject)(project)
            ? [
                await (0, utils_1.getCAPServicePrompt)(context, {
                    message: t('service'),
                    guiOptions: {
                        groupId: groupIds.commonFormBuildingBlockProperties,
                        mandatory: true,
                        dependantPromptNames: []
                    }
                })
            ]
            : []),
        (0, utils_1.getEntityPrompt)(context, {
            message: t('entity'),
            guiOptions: {
                groupId: groupIds.commonFormBuildingBlockProperties,
                mandatory: true,
                dependantPromptNames: ['buildingBlockData.metaPath.qualifier']
            }
        }),
        (0, utils_1.getAnnotationPathQualifierPrompt)(context, {
            message: t('qualifier'),
            guiOptions: {
                hint: t('valuesDependentOnEntityTypeInfo'),
                groupId: groupIds.commonFormBuildingBlockProperties,
                mandatory: true,
                placeholder: t('qualifierPlaceholder')
            }
        }, ["com.sap.vocabularies.UI.v1.FieldGroup" /* UIAnnotationTerms.FieldGroup */]),
        (0, utils_1.getAggregationPathPrompt)(context, {
            message: t('aggregation'),
            guiOptions: {
                groupId: groupIds.commonFormBuildingBlockProperties,
                mandatory: true
            }
        }),
        {
            type: 'input',
            name: 'buildingBlockData.title',
            message: t('title.message'),
            guiOptions: {
                groupId: groupIds.commonFormBuildingBlockProperties,
                mandatory: true,
                translationProperties: {
                    type: i18n_1.SapShortTextType.Heading,
                    annotation: t('title.translationAnnotation')
                }
            }
        }
    ];
    return {
        groups,
        questions: questionsArray,
        initialAnswers: {
            buildingBlockData: {
                buildingBlockType: types_1.BuildingBlockType.Form
            }
        }
    };
}
//# sourceMappingURL=form.js.map