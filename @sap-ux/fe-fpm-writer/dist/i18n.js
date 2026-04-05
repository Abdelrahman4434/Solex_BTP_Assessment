"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18n = exports.i18nNamespaces = void 0;
exports.initI18n = initI18n;
exports.translate = translate;
const i18next_1 = __importDefault(require("i18next"));
const i18n_1 = __importDefault(require("./prompts/translations/i18n"));
const namespacePrefix = 'fe-fpm-writer';
exports.i18nNamespaces = {
    buildingBlock: `${namespacePrefix}-building-block`
};
exports.i18n = i18next_1.default.createInstance();
/**
 * Initialize i18next with the translations for this module.
 */
async function initI18n() {
    await exports.i18n.init({
        resources: {
            en: {
                [exports.i18nNamespaces.buildingBlock]: i18n_1.default
            }
        },
        lng: 'en',
        fallbackLng: 'en',
        defaultNS: exports.i18nNamespaces.buildingBlock,
        ns: [exports.i18nNamespaces.buildingBlock],
        showSupportNotice: false
    });
}
/**
 * Wraps the i18next module's translate function to bind the provided namespace and a key prefix.
 *
 * @param {string} namespace - the translation namespace
 * @param {string} keyPrefix - the key prefix
 * @returns {Function} the translate function
 */
function translate(namespace, keyPrefix) {
    return (key, options) => {
        const result = exports.i18n.t(`${namespace}:${keyPrefix ?? ''}${key}`, options);
        return result;
    };
}
//# sourceMappingURL=i18n.js.map