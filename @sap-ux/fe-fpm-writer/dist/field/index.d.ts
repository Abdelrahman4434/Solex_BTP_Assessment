import type { Editor } from 'mem-fs-editor';
import type { CustomField } from './types';
/**
 * Add a custom field to an existing UI5 application.
 *
 * @param {string} basePath - the base path
 * @param {CustomField} customField - the custom field configuration
 * @param {Promise<Editor>} [fs] - the mem-fs editor instance
 * @returns {Promise<Editor>} the updated mem-fs editor instance
 */
export declare function generateCustomField(basePath: string, customField: CustomField, fs?: Editor): Promise<Editor>;
//# sourceMappingURL=index.d.ts.map