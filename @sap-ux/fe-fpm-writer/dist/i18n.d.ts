import type { i18n as i18nNext, TOptions, TOptionsBase } from 'i18next';
export declare const i18nNamespaces: {
    readonly buildingBlock: "fe-fpm-writer-building-block";
};
export declare const i18n: i18nNext;
/**
 * Initialize i18next with the translations for this module.
 */
export declare function initI18n(): Promise<void>;
type $Dictionary<T = unknown> = {
    [key: string]: T;
};
/**
 * Wraps the i18next module's translate function to bind the provided namespace and a key prefix.
 *
 * @param {string} namespace - the translation namespace
 * @param {string} keyPrefix - the key prefix
 * @returns {Function} the translate function
 */
export declare function translate(namespace: string, keyPrefix?: string): (key: string, options?: string | TOptions<$Dictionary & TOptionsBase>) => string | string[];
export {};
//# sourceMappingURL=i18n.d.ts.map