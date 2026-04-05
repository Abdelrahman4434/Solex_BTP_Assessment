import type { Editor } from 'mem-fs-editor';
import { type ActionMenu } from './types';
/**
 * Add a custom page to an existing UI5 application.
 *
 * @param {string} basePath - the base path
 * @param {ActionMenu} actionMenuConfig - the custom action configuration
 * @param {Editor} [fs] - the memfs editor instance
 * @returns {Promise<Editor>} the updated memfs editor instance
 */
export declare function generateActionMenu(basePath: string, actionMenuConfig: ActionMenu, fs?: Editor): Promise<Editor>;
//# sourceMappingURL=index.d.ts.map