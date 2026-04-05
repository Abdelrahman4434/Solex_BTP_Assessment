"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRelevantI18nBundle = exports.getI18nBundleName = exports.resolveI18nValue = exports.extractI18nKey = void 0;
const types_1 = require("../types");
const I18N_BINDING_PREFIX = 'i18n';
/**
 * Method extracts i18n binding and returns key of i18n entry.
 *
 * @param input - Binding value.
 * @param resolveAnnotationBinding - Check if method should resolve syntax annotation based i18n binding.
 * @param forceKeyExtraction - Optional parameter to force key extraction in case of {{key}} format.
 * @returns I18n entry key or undefined if input does not matches i18n binding pattern.
 */
const extractI18nKey = (input = '', resolveAnnotationBinding = false, forceKeyExtraction) => {
    if (/^{{[^\\{}:]+}}$/.exec(input) && (!resolveAnnotationBinding || forceKeyExtraction)) {
        return input.toString().substring(2, input.length - 2);
    }
    const prefixRegex = resolveAnnotationBinding
        ? `(${I18N_BINDING_PREFIX}|@${I18N_BINDING_PREFIX})`
        : `${I18N_BINDING_PREFIX}`;
    const mathIndex = resolveAnnotationBinding ? 2 : 1;
    const i18nMatch = new RegExp(`^{${prefixRegex}>([^\\{}:]+)}$`).exec(input);
    return i18nMatch ? i18nMatch[mathIndex] : undefined;
};
exports.extractI18nKey = extractI18nKey;
/**
 * Method to resolve passed i18n binding value into value from i18n bundle.
 *
 * @param value Binding value like `{i18n>key}`.
 * @param i18nBundle I18n bundle data.
 * @returns Resolved value from i18n bundle.
 */
const resolveI18nValue = (value, i18nBundle = {}) => {
    const key = (0, exports.extractI18nKey)(value, true, true);
    if (key) {
        const entries = i18nBundle[key];
        if (entries?.length > 0) {
            return entries[0].value?.value;
        }
    }
};
exports.resolveI18nValue = resolveI18nValue;
/**
 * Method returns name of i18n bundle depending on passed project type and entity.
 *
 * @param isCustom Is custom extension.
 * @param isViewNode Is visible node.
 * @param isAnnotation Node has mapping to annotation.
 * @param projectType Project type.
 * @returns I18n bundle name.
 */
const getI18nBundleName = (isCustom, isViewNode, isAnnotation, projectType = 'EDMXBackend') => {
    if (['CAPJava', 'CAPNodejs'].includes(projectType) && !isCustom && isViewNode) {
        // CAP project - for non custom view nodes like fields, sections, columns we need use translation from service bundle
        return types_1.TRANSLATION_BUNDLE_SERVICE;
    }
    if (isAnnotation) {
        return types_1.TRANSLATION_BUNDLE_ANNOTATION;
    }
    return types_1.TRANSLATION_BUNDLE_UI5;
};
exports.getI18nBundleName = getI18nBundleName;
const getRelevantI18nBundle = (aggregation, bundle, projectType) => {
    return bundle
        ? bundle[(0, exports.getI18nBundleName)(aggregation.custom, aggregation.isViewNode, !!aggregation.annotationNodeId, projectType)]
        : {};
};
exports.getRelevantI18nBundle = getRelevantI18nBundle;
//# sourceMappingURL=i18n.js.map