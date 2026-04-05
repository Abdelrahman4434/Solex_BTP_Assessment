import type { TranslationBundles, PropertyMessage } from '../types';
import type { JSONSchema4 } from 'json-schema';
import type { ObjectAggregation } from '../ObjectAggregation';
import type { ProjectType } from '@sap-ux/project-access';
import type { Parser } from '@sap/ux-specification-types';
export interface AppTranslationBundleData {
    bundles: TranslationBundles;
    projectType?: ProjectType;
}
/**
 * Method returns application specific i18n bundle data.
 *
 * @returns i18n bundle data.
 */
export declare const getAppI18nBundle: () => AppTranslationBundleData;
export declare const getTechnicalIdFromPath: (path: Parser.PropertyPath, firstOnly?: boolean) => string | undefined;
/**
 * Method disables deletion of last annotation node if there is any custom nodes.
 * There can be cases when custom nodes referenced to last annotation node and by deleting last annotation node, we can not provide correct order.
 *
 * @param aggregation Container aggregation.
 * @param text I18n key for disabled deletion explanation.
 */
export declare const ensureLastNodeIsUndeletable: (aggregation: ObjectAggregation, text: string) => void;
/**
 * Function validates extension using validation parameter by setting warning message to aggregation.
 *
 * @param aggregation aggregation for which to set warning message.
 * @param isValid validation result.
 * @param description description to show in case extension is invalid.
 * @param property name of the property
 */
export declare const validateExtension: (aggregation: ObjectAggregation, isValid: boolean, description: string, property?: string) => void;
/**
 * Function validates macros extension key by checking aggregation value of it.
 *
 * @param aggregation aggregation for which to set warning message.
 * @param value value of custom extension aggregation.
 */
export declare const validateMacrosExtension: (aggregation: ObjectAggregation, value?: unknown) => void;
/**
 * Method which formats and returns display/description text for anchor selection option.
 * Method resolves i18n translation for text if translation exists.
 *
 * @param i18nKey I18n entry for option.
 * @param aggregation Object aggregation.
 * @param text Anchor label without i18n resolution.
 * @param id Anchor ID.
 * @returns Formatted text for related anchor option.
 */
export declare const formatAnchorDescriptionText: (i18nKey: string, aggregation: ObjectAggregation, text: string, id?: string) => string;
/**
 * Method which receives 'oneOf' entries from schema and converts to dropdown option entries.
 *
 * @param i18nKey I18n entry for option.
 * @param aggregation Object aggregation.
 * @param oneOf One of entries from schema.
 * @returns Options for dropdown.
 */
export declare const oneOfToDropdownOptions: (i18nKey: string, aggregation: ObjectAggregation, oneOf?: JSONSchema4[]) => {
    key: string;
    text: string;
}[];
/**
 * Method returns updated schema for anchor property.
 * Method hides enum entry which is associated with passed aggregation to avoid anchoring extension to itself.
 *
 * @param aggregation Aggregation object.
 * @param originalSchema Schema of anchor property.
 * @returns Modified schema.
 */
export declare const updateAnchorSchema: (aggregation: ObjectAggregation, originalSchema: JSONSchema4) => JSONSchema4;
/**
 * Method adds validation message to property or node instance.
 *
 * @param instance Property or node instance.
 * @param instance.messages Messages of instance.
 * @param messages Array of validation messages.
 */
export declare function addValidationMessages(instance: {
    messages?: PropertyMessage[];
}, messages: PropertyMessage[]): void;
/**
 * Converts a string into "Start Case" format.
 *
 * - Splits words on underscores (`_`), hyphens (`-`), and spaces.
 * - Detects camelCase boundaries (`fooBar` → `Foo Bar`).
 * - Capitalizes the first character of each word.
 * - Preserves acronyms (`FCL`, `WORLD`) when they appear in uppercase.
 *
 * @param text - The input string to convert.
 * @returns The formatted string in start case.
 */
export declare function startCase(text: string): string;
//# sourceMappingURL=utils.d.ts.map