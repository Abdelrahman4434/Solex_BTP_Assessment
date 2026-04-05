"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooleanPrompt = getBooleanPrompt;
exports.getAnnotationPathQualifierPrompt = getAnnotationPathQualifierPrompt;
exports.getViewOrFragmentPathPrompt = getViewOrFragmentPathPrompt;
exports.getCAPServicePrompt = getCAPServicePrompt;
exports.getEntityPrompt = getEntityPrompt;
exports.getTargetPropertiesPrompt = getTargetPropertiesPrompt;
exports.getCAPServiceChoices = getCAPServiceChoices;
exports.getAggregationPathPrompt = getAggregationPathPrompt;
exports.transformChoices = transformChoices;
exports.getFilterBarIdPrompt = getFilterBarIdPrompt;
exports.getBindingContextTypePrompt = getBindingContextTypePrompt;
exports.getBuildingBlockIdPrompt = getBuildingBlockIdPrompt;
const node_path_1 = require("node:path");
const service_1 = require("./service");
const project_access_1 = require("@sap-ux/project-access");
const types_1 = require("../../types");
const xml_1 = require("./xml");
const i18n_1 = require("../../../i18n");
const prompt_helpers_1 = require("./prompt-helpers");
const file_1 = require("../../../common/file");
const utils_1 = require("../../../common/utils");
/* eslint-disable @typescript-eslint/no-floating-promises */
(0, i18n_1.initI18n)();
const t = (0, i18n_1.translate)(i18n_1.i18nNamespaces.buildingBlock, 'prompts.common.');
/**
 * Returns a Prompt to choose a boolean value.
 *
 * @param properties - object with additional properties of question
 * @returns a boolean prompt.
 */
function getBooleanPrompt(properties) {
    const { guiOptions } = properties;
    return {
        ...properties,
        type: 'list',
        choices: [
            { name: 'False', value: false },
            { name: 'True', value: true }
        ],
        guiOptions: {
            ...guiOptions,
            selectType: 'static'
        }
    };
}
/**
 * Returns the prompt for choosing the existing annotation term.
 *
 * @param context - prompt context including data about project
 * @param properties - object with additional properties of question
 * @param annotationTerm - the annotation term
 * @returns prompt for choosing the annotation term.
 */
function getAnnotationPathQualifierPrompt(context, properties = {}, annotationTerm = []) {
    const { project, appId } = context;
    const { guiOptions } = properties;
    return {
        ...properties,
        type: 'list',
        name: 'buildingBlockData.metaPath.qualifier',
        choices: project
            ? async (answers) => {
                const { entitySet, bindingContextType } = answers.buildingBlockData?.metaPath ?? {};
                if (!entitySet) {
                    return [];
                }
                const bindingContext = bindingContextType
                    ? {
                        type: bindingContextType,
                        isCollection: answers.buildingBlockData.buildingBlockType === types_1.BuildingBlockType.Table
                    }
                    : { type: 'absolute' };
                const choices = transformChoices(await (0, service_1.getAnnotationPathQualifiers)(project, appId, entitySet, annotationTerm, bindingContext, true));
                if (entitySet && !choices.length) {
                    throw new Error(`Couldn't find any existing annotations for term ${annotationTerm.join(',')}. Please add ${annotationTerm.join(',')} annotation/s`);
                }
                return choices;
            }
            : [],
        guiOptions: {
            ...guiOptions,
            selectType: 'dynamic'
        }
    };
}
/**
 * Returns the prompt for choosing a View or a Fragment file.
 *
 * @param context - prompt context including data about project
 * @param validationErrorMessage - the error message to show if validation fails
 * @param properties - object with additional properties of question
 * @returns prompt for choosing the fragment file.
 */
function getViewOrFragmentPathPrompt(context, validationErrorMessage, properties = {}) {
    const { fs, project, appPath } = context;
    const { guiOptions } = properties;
    return {
        ...properties,
        type: 'list',
        name: 'viewOrFragmentPath',
        choices: project
            ? async () => {
                const fragmentAndViewFiles = await (0, file_1.getFragmentAndViewFiles)(appPath, fs);
                return transformChoices(fragmentAndViewFiles.map((file) => (0, node_path_1.relative)(appPath, file)));
            }
            : [],
        validate: (value) => (!project || value ? true : validationErrorMessage),
        guiOptions: {
            ...guiOptions,
            selectType: 'dynamic',
            placeholder: guiOptions?.placeholder ?? t('viewOrFragmentPath.defaultPlaceholder')
        }
    };
}
/**
 * Returns the prompt for choosing CAP service.
 *
 * @param context - prompt context including data about project
 * @param properties - object with additional properties of question
 * @returns prompt for choosing CAP service.
 */
async function getCAPServicePrompt(context, properties = {}) {
    const { project, appId } = context;
    const { guiOptions } = properties;
    const services = project ? await getCAPServiceChoices(project, appId) : [];
    const defaultValue = services.length === 1 ? services[0].value : undefined;
    return {
        ...properties,
        type: 'list',
        name: 'service',
        choices: project ? getCAPServiceChoices.bind(null, project, appId) : [],
        default: defaultValue,
        guiOptions: {
            ...guiOptions,
            selectType: 'dynamic',
            placeholder: guiOptions?.placeholder ?? t('service.defaultPlaceholder')
        }
    };
}
/**
 * Returns a Prompt for choosing an entity.
 *
 * @param context - prompt context including data about project
 * @param properties - object with additional properties of question
 * @returns prompt for choosing entity.
 */
function getEntityPrompt(context, properties = {}) {
    const { project } = context;
    const { pageContextEntitySet } = context.options ?? {};
    const { guiOptions } = properties;
    return {
        ...properties,
        type: 'list',
        name: 'buildingBlockData.metaPath.entitySet',
        choices: project
            ? async (answers) => {
                const entitySets = await (0, prompt_helpers_1.loadEntitySets)(context);
                // List all entity sets when no page context is defined
                if (!pageContextEntitySet) {
                    return transformChoices(entitySets.map((entitySet) => entitySet.name));
                }
                const bindingContextType = answers?.buildingBlockData?.metaPath.bindingContextType ?? types_1.bindingContextAbsolute;
                const options = (0, prompt_helpers_1.getEntitySetOptions)(entitySets, pageContextEntitySet, bindingContextType);
                // If no options, fallback to all entity sets
                const resolvedOptions = options.length > 0 ? options : [];
                return transformChoices(resolvedOptions.map((opt) => opt.name));
            }
            : [],
        guiOptions: {
            ...guiOptions,
            selectType: 'dynamic',
            placeholder: guiOptions?.placeholder ?? t('entity.defaultPlaceholder')
        }
    };
}
/**
 * Returns a Prompt for choosing a property of an entity.
 *
 * @param context - prompt context including data about project
 * @param properties - object with additional properties of question
 * @returns prompt for choosing an entity property.
 */
function getTargetPropertiesPrompt(context, properties = {}) {
    const { project } = context;
    const pageContextEntitySet = context.options?.pageContextEntitySet ?? '';
    const { guiOptions } = properties;
    return {
        ...properties,
        type: 'list',
        name: 'buildingBlockData.targetProperty',
        choices: project
            ? async (answers) => {
                const entitySets = await (0, prompt_helpers_1.loadEntitySets)(context);
                const { bindingContextType, entitySet: selectedNavProp } = answers?.buildingBlockData?.metaPath ?? {};
                if (!selectedNavProp) {
                    // clear choices if no entity set is selected
                    return [];
                }
                const propertyChoices = (0, prompt_helpers_1.resolveEntitySetTargets)(entitySets, pageContextEntitySet, bindingContextType, selectedNavProp);
                const transformedChoices = transformChoices(propertyChoices.map((p) => p.name));
                return transformedChoices;
            }
            : [],
        guiOptions: {
            ...guiOptions,
            selectType: 'dynamic',
            placeholder: guiOptions?.placeholder ?? t('targetProperty.defaultPlaceholder')
        }
    };
}
/**
 * Method returns choices for cap service selection.
 *
 * @param project = project
 * @param appId - application id
 * @returns choices for cap service selection.
 */
async function getCAPServiceChoices(project, appId) {
    const services = project.apps[appId]?.services;
    const servicesMap = {};
    for (const serviceKey of Object.keys(services)) {
        const mappedServiceName = await (0, project_access_1.getCapServiceName)(project.root, project.apps[appId].services[serviceKey]?.uri ?? '');
        servicesMap[mappedServiceName] = serviceKey;
    }
    return transformChoices(servicesMap);
}
/**
 * Return a Prompt for choosing the aggregation path.
 *
 * @param context - prompt context including data about project
 * @param properties - object with additional properties of question
 * @returns prompt for choosing aggregation path of selected xml file.
 */
function getAggregationPathPrompt(context, properties = {}) {
    const { fs, project, appPath } = context;
    const { guiOptions } = properties;
    return {
        ...properties,
        type: 'list',
        name: 'aggregationPath',
        choices: project
            ? (answers) => {
                const { viewOrFragmentPath } = answers;
                if (viewOrFragmentPath) {
                    const { inputChoices, pageMacroDefinition } = (0, xml_1.getXPathStringsForXmlFile)((0, node_path_1.join)(appPath, viewOrFragmentPath), fs);
                    const key = Object.keys(inputChoices).find((k) => k.endsWith(`/${pageMacroDefinition}`));
                    const choices = transformChoices(inputChoices, false, key);
                    if (!choices.length) {
                        throw new Error('Failed while fetching the aggregation path.');
                    }
                    return choices;
                }
                return [];
            }
            : [],
        guiOptions: {
            ...guiOptions,
            selectType: 'dynamic',
            placeholder: guiOptions?.placeholder ?? t('aggregationPath.defaultPlaceholder')
        }
    };
}
/**
 * Method converts choices to "PromptListChoices" type.
 *
 * @param obj - object to be converted to choices
 * @param sort - apply alphabetical sort(default is "true")
 * @param defaultKey - default key to be checked in choices
 * @returns the list of choices.
 */
function transformChoices(obj, sort = true, defaultKey) {
    let choices = [];
    if (!Array.isArray(obj)) {
        choices = Object.entries(obj).map(([key, value]) => {
            // Add checked if value matches defaultKey example: `/mvc:View/macro:Page/`
            if (key === defaultKey) {
                return { name: key, value, checked: true };
            }
            return { name: key, value };
        });
        if (sort) {
            choices = choices.sort((a, b) => a.name.localeCompare(b.name));
        }
    }
    else {
        obj = [...new Set(obj)];
        return sort ? [...obj].sort((a, b) => a.localeCompare(b)) : obj;
    }
    return choices;
}
/**
 * Returns a Prompt for selecting existing filter bar ID or entering a new one.
 *
 * @param context - prompt context including data about project
 * @param properties - Object with additional properties of question
 * @returns an Input or List Prompt
 */
function getFilterBarIdPrompt(context, properties) {
    const { fs, project, appPath } = context;
    const { guiOptions } = properties;
    const prompt = {
        ...properties,
        type: 'input',
        name: 'buildingBlockData.filterBar',
        guiOptions: {
            ...guiOptions,
            placeholder: guiOptions?.placeholder ?? t('filterBar.defaultPlaceholder')
        }
    };
    if (properties.type === 'input') {
        return prompt;
    }
    return {
        ...prompt,
        type: 'list',
        choices: project
            ? async (answers) => {
                if (!answers.viewOrFragmentPath) {
                    return [];
                }
                return transformChoices(await (0, xml_1.getFilterBarIdsInFile)((0, node_path_1.join)(appPath, answers.viewOrFragmentPath), fs));
            }
            : [],
        guiOptions: {
            ...prompt.guiOptions,
            selectType: 'dynamic'
        }
    };
}
/**
 * Returns the Binding Context Type Prompt.
 *
 * @param properties - object with additional properties of question
 * @returns prompt for choosing binding context type.
 */
function getBindingContextTypePrompt(properties = {}) {
    const { guiOptions } = properties;
    return {
        ...properties,
        type: 'list',
        name: 'buildingBlockData.metaPath.bindingContextType',
        choices: properties.choices ?? [
            { name: t('bindingContextType.option.absolute'), value: 'absolute' },
            { name: t('bindingContextType.option.relative'), value: 'relative' }
        ],
        guiOptions: {
            ...guiOptions,
            selectType: typeof properties.choices === 'function' ? 'dynamic' : 'static'
        }
    };
}
/**
 * Returns a Prompt for entering a Building block ID.
 *
 * @param context - prompt context including data about project
 * @param validationErrorMessage - The error message to show if ID validation fails
 * @param properties - object with additional properties of question
 * @returns an InputPrompt object for getting the building block ID
 */
function getBuildingBlockIdPrompt(context, validationErrorMessage, properties = {}) {
    const { fs, project, appPath } = context;
    const { guiOptions } = properties;
    return {
        ...properties,
        type: 'input',
        name: 'buildingBlockData.id',
        validate: (value, answers) => {
            if (!project) {
                return true;
            }
            if (!value) {
                return validationErrorMessage;
            }
            else {
                return answers?.viewOrFragmentPath &&
                    !(0, utils_1.isElementIdAvailable)(fs, (0, node_path_1.join)(appPath, answers.viewOrFragmentPath), value)
                    ? t('id.existingIdValidation')
                    : true;
            }
        },
        guiOptions: {
            ...guiOptions,
            placeholder: guiOptions?.placeholder ?? t('id.defaultPlaceholder')
        }
    };
}
//# sourceMappingURL=questions.js.map