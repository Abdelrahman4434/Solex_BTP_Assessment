import type { CopyOptions, Editor } from 'mem-fs-editor';
import type { TabInfo } from '../common/types';
interface ButtonGroup {
    id?: string;
}
export type IdGeneratorFunction = (baseId: string, validatedIds?: string[]) => string;
export interface TemplateContext {
    buttonGroups?: ButtonGroup[];
    name?: string;
    data?: {
        buttonGroups?: ButtonGroup[];
    };
}
export declare const CONFIG: {
    "page/custom/1.94/ext/View.xml": {
        getData: (generateId: IdGeneratorFunction, context?: TemplateContext) => {
            ids: Record<string, string>;
        };
    };
    "page/custom/1.84/ext/View.xml": {
        getData: (generateId: IdGeneratorFunction, context?: TemplateContext) => {
            ids: Record<string, string>;
        };
    };
    "common/FragmentWithForm.xml": {
        getData: (generateId: IdGeneratorFunction) => {
            ids: Record<string, string>;
        };
    };
    "common/FragmentWithVBox.xml": {
        getData: (generateId: IdGeneratorFunction) => {
            ids: Record<string, string>;
        };
    };
    "view/ext/CustomViewWithTable.xml": {
        getData: (generateId: IdGeneratorFunction) => {
            ids: Record<string, string>;
        };
    };
    "filter/fragment.xml": {
        getData: (generateId: IdGeneratorFunction) => {
            ids: Record<string, string>;
        };
    };
    "building-block/rich-text-editor-button-groups/View.xml": {
        getData: (generateId: IdGeneratorFunction, context?: Partial<TemplateContext>) => {
            ids: Record<string, string>;
        };
    };
    "building-block/custom-column/View.xml": {
        getData: (generateId: IdGeneratorFunction) => {
            ids: Record<string, string>;
        };
    };
};
/**
 * Retrieves all view and fragment files in the application.
 *
 * @param appPath - The root path of the application
 * @param fs - The file system object for reading files
 * @returns A list of view and fragment files
 */
export declare function getFragmentAndViewFiles(appPath: string, fs: Editor): Promise<string[]>;
/**
 * Creates an ID generator function for a given base path and editor.
 * The generator ensures unique IDs across all fragment and view files in the project.
 *
 * @param basePath - Base path of the project
 * @param fsEditor - mem-fs-editor instance
 * @returns A function that generates unique IDs based on a base ID string
 */
export declare function createIdGenerator(basePath: string | undefined, fsEditor: Editor): Promise<(baseId: string) => string>;
export declare const COPY_TEMPLATE_OPTIONS: CopyOptions & {
    noGlob: boolean;
};
type WriteJsonReplacer = ((key: string, value: any) => any) | Array<string | number>;
type WriteJsonSpace = number | string;
interface ExtendJsonParams {
    filepath: string;
    content: string;
    replacer?: WriteJsonReplacer;
    tabInfo?: TabInfo;
}
/**
 * Method calculates tab space info for passed file content.
 *
 * @param content - file content.
 * @returns tab size information.
 */
export declare function detectTabSpacing(content: string): TabInfo | undefined;
/**
 * Method calculates tab spacing parameter for 'JSON.stringify' method.
 *
 * @param fs - the mem-fs editor instance.
 * @param filePath - path to file to read.
 * @param tabInfo - External tab configuration.
 * @returns tab size information.
 */
export declare function getJsonSpace(fs: Editor, filePath: string, tabInfo?: TabInfo | undefined): WriteJsonSpace | undefined;
/**
 * Method extends target JSON file with passed JSOn content.
 * Method uses 'fs.extendJSON', but applies additional calculation to reuse existing content tab sizing information.
 *
 * @param fs - the mem-fs editor instance.
 * @param params - options for JSON extend.
 */
export declare function extendJSON(fs: Editor, params: ExtendJsonParams): void;
/**
 * Copies a template file or directory to a target location and applies template interpolation.
 * This method wraps `mem-fs-editor`'s `copyTpl` and passes predefined copy options
 * (e.g. `noGlob: true`) to prevent glob pattern expansion in source paths.
 *
 * @param fs - The mem-fs editor instance used to perform the file operations.
 * @param from - Source path of the template file or directory.
 * @param to - Destination path where the rendered files will be written.
 * @param context - Optional template context used for interpolation.
 * @param {(baseId: string) => string} generateId - Function to generate unique IDs for the building block elements.
 */
export declare function copyTpl(fs: Editor, from: string, to: string, context?: object, generateId?: (baseId: string) => string): void;
/**
 * Extracts the relative path from the templates directory.
 * Works cross-platform by normalizing path separators.
 *
 * @param absolutePath - Absolute path to a template file or directory
 * @returns Relative path from templates directory with forward slashes, or original path if 'templates' not found
 */
export declare function getRelativeTemplateComponentPath(absolutePath: string): string;
export {};
//# sourceMappingURL=file.d.ts.map