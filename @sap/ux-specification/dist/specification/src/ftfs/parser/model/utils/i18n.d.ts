import type { I18nBundle } from '@sap-ux/i18n';
import type { ProjectType } from '@sap-ux/project-access';
import type { TranslationBundles, TranslationBundleKeys } from '../types';
import type { ObjectAggregation } from '../ObjectAggregation';
/**
 * Method extracts i18n binding and returns key of i18n entry.
 *
 * @param input - Binding value.
 * @param resolveAnnotationBinding - Check if method should resolve syntax annotation based i18n binding.
 * @param forceKeyExtraction - Optional parameter to force key extraction in case of {{key}} format.
 * @returns I18n entry key or undefined if input does not matches i18n binding pattern.
 */
export declare const extractI18nKey: (input?: string, resolveAnnotationBinding?: boolean, forceKeyExtraction?: boolean) => string | undefined;
/**
 * Method to resolve passed i18n binding value into value from i18n bundle.
 *
 * @param value Binding value like `{i18n>key}`.
 * @param i18nBundle I18n bundle data.
 * @returns Resolved value from i18n bundle.
 */
export declare const resolveI18nValue: (value: string, i18nBundle?: I18nBundle) => string | undefined;
/**
 * Method returns name of i18n bundle depending on passed project type and entity.
 *
 * @param isCustom Is custom extension.
 * @param isViewNode Is visible node.
 * @param isAnnotation Node has mapping to annotation.
 * @param projectType Project type.
 * @returns I18n bundle name.
 */
export declare const getI18nBundleName: (isCustom?: boolean, isViewNode?: boolean, isAnnotation?: boolean, projectType?: ProjectType) => TranslationBundleKeys;
export declare const getRelevantI18nBundle: (aggregation: ObjectAggregation, bundle?: TranslationBundles, projectType?: ProjectType) => I18nBundle | undefined;
//# sourceMappingURL=i18n.d.ts.map