"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COPY_TEMPLATE_OPTIONS = exports.CONFIG = void 0;
exports.getFragmentAndViewFiles = getFragmentAndViewFiles;
exports.createIdGenerator = createIdGenerator;
exports.detectTabSpacing = detectTabSpacing;
exports.getJsonSpace = getJsonSpace;
exports.extendJSON = extendJSON;
exports.copyTpl = copyTpl;
exports.getRelativeTemplateComponentPath = getRelativeTemplateComponentPath;
const node_path_1 = require("node:path");
const file_1 = require("@sap-ux/project-access/dist/file");
const utils_1 = require("./utils");
const CHAR_SPACE = ' ';
const CHAR_TAB = '\t';
exports.CONFIG = {
    ['page/custom/1.94/ext/View.xml']: {
        getData: (generateId, context) => {
            return {
                ids: {
                    page: generateId(context?.name ?? 'Page')
                }
            };
        }
    },
    ['page/custom/1.84/ext/View.xml']: {
        getData: (generateId, context) => {
            return {
                ids: {
                    page: generateId(context?.name ?? 'Page')
                }
            };
        }
    },
    ['common/FragmentWithForm.xml']: {
        getData: (generateId) => {
            return {
                ids: {
                    formElement: generateId('FormElement')
                }
            };
        }
    },
    ['common/FragmentWithVBox.xml']: {
        getData: (generateId) => {
            return {
                ids: {
                    vbox: generateId('VBox')
                }
            };
        }
    },
    ['view/ext/CustomViewWithTable.xml']: {
        getData: (generateId) => {
            return {
                ids: {
                    table: generateId('Table')
                }
            };
        }
    },
    ['filter/fragment.xml']: {
        getData: (generateId) => {
            const item1 = generateId('Item');
            const item2 = generateId('Item', [item1]);
            const item3 = generateId('Item', [item1, item2]);
            return {
                ids: {
                    comboBox: generateId('ComboBox'),
                    item1,
                    item2,
                    item3
                }
            };
        }
    },
    ['building-block/rich-text-editor-button-groups/View.xml']: {
        getData: (generateId, context) => {
            // Get buttonGroups from context
            const buttonGroups = context?.buttonGroups || context?.data?.buttonGroups || [];
            // Generate IDs for each button group and store in ids object
            const ids = {};
            const validatedIds = [];
            buttonGroups.forEach((group, index) => {
                const id = generateId('ButtonGroup', validatedIds);
                ids[index] = group.id ?? id;
                if (!group.id) {
                    validatedIds.push(id);
                }
            });
            return { ids };
        }
    },
    ['building-block/custom-column/View.xml']: {
        getData: (generateId) => {
            return {
                ids: {
                    column: generateId('TableColumn')
                }
            };
        }
    }
};
/**
 * Generates a unique element ID that is not already used in any view or fragment file.
 * Uses an incremental counter for predictable, readable IDs.
 *
 * @param fs - The file system object for reading files
 * @param baseId - The base name for the ID (e.g., 'filterBar', 'chart')
 * @param filteredFiles - The list of files to check for ID availability
 * @param validatedIds - A list of IDs that have already been validated in the current session to avoid duplicates
 * @returns A unique ID that is available across all view and fragment files
 */
function generateUniqueElementId(fs, baseId, filteredFiles, validatedIds = []) {
    const maxAttempts = 1000;
    if (filteredFiles.every((file) => (0, utils_1.isElementIdAvailable)(fs, file, baseId)) && !validatedIds.includes(baseId)) {
        return baseId;
    }
    for (let counter = 1; counter < maxAttempts; counter++) {
        const candidateId = `${baseId}${counter}`;
        if (filteredFiles.every((file) => (0, utils_1.isElementIdAvailable)(fs, file, candidateId)) &&
            !validatedIds.includes(candidateId)) {
            return candidateId;
        }
    }
    // If we couldn't find an available ID after maxAttempts
    throw new Error(`Failed to generate unique ID for base '${baseId}' after ${maxAttempts} attempts`);
}
/**
 * Retrieves all view and fragment files in the application.
 *
 * @param appPath - The root path of the application
 * @param fs - The file system object for reading files
 * @returns A list of view and fragment files
 */
async function getFragmentAndViewFiles(appPath, fs) {
    const files = await (0, file_1.findFilesByExtension)('.xml', appPath, ['.git', 'node_modules', 'dist', 'annotations', 'localService'], fs);
    const lookupFiles = ['.fragment.xml', '.view.xml'];
    return files.filter((fileName) => lookupFiles.some((lookupFile) => fileName.endsWith(lookupFile)));
}
/**
 * Creates an ID generator function for a given base path and editor.
 * The generator ensures unique IDs across all fragment and view files in the project.
 *
 * @param basePath - Base path of the project
 * @param fsEditor - mem-fs-editor instance
 * @returns A function that generates unique IDs based on a base ID string
 */
async function createIdGenerator(basePath, fsEditor) {
    let files = [];
    if (basePath) {
        files = await getFragmentAndViewFiles(basePath, fsEditor);
    }
    return (baseId, validatedIds = []) => {
        return generateUniqueElementId(fsEditor, baseId, files, validatedIds);
    };
}
// `noGlob` is supported in `mem-fs-editor` v9,
// but is missing from `@types/mem-fs-editor` (no v9 typings), so we extend the type here.
exports.COPY_TEMPLATE_OPTIONS = {
    noGlob: true
};
/**
 * Method returns tab info for passed line.
 *
 * @param line - line with tab spacing
 * @returns tab size information
 */
function getLineTabInfo(line) {
    let tabSize;
    const symbol = line.startsWith(CHAR_TAB) ? CHAR_TAB : CHAR_SPACE;
    // get count of tabs
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char !== symbol) {
            tabSize = {
                size: i,
                useTabSymbol: symbol === CHAR_TAB
            };
            break;
        }
    }
    return tabSize;
}
/**
 * Method calculates tab space info for passed file content.
 *
 * @param content - file content.
 * @returns tab size information.
 */
function detectTabSpacing(content) {
    let tabSize;
    const tabSymbols = new Set([CHAR_SPACE, CHAR_TAB]);
    const lines = content.split(/\r\n|\n/);
    const lineWithSpacing = lines.find((line) => {
        return tabSymbols.has(line[0]);
    });
    if (lineWithSpacing) {
        tabSize = getLineTabInfo(lineWithSpacing);
    }
    return tabSize;
}
/**
 * Method calculates tab spacing parameter for 'JSON.stringify' method.
 *
 * @param fs - the mem-fs editor instance.
 * @param filePath - path to file to read.
 * @param tabInfo - External tab configuration.
 * @returns tab size information.
 */
function getJsonSpace(fs, filePath, tabInfo) {
    if (!tabInfo) {
        // 'tabInfo'  was not passed - calculate 'tabInfo' by checking existing content of target file
        const content = fs.read(filePath);
        tabInfo = detectTabSpacing(content);
    }
    let space;
    if (tabInfo) {
        // 'tabInfo' exists - it was passed as custom configuration or calculated from target file
        if (tabInfo.useTabSymbol) {
            // Tab symbol should be used as tab
            space = CHAR_TAB.repeat(tabInfo.size || 1);
        }
        else {
            // Spaces should be used as tab
            space = tabInfo.size;
        }
    }
    return space;
}
/**
 * Method extends target JSON file with passed JSOn content.
 * Method uses 'fs.extendJSON', but applies additional calculation to reuse existing content tab sizing information.
 *
 * @param fs - the mem-fs editor instance.
 * @param params - options for JSON extend.
 */
function extendJSON(fs, params) {
    const { filepath, content, replacer } = params;
    const space = getJsonSpace(fs, filepath, params.tabInfo);
    // Write json
    fs.extendJSON(filepath, JSON.parse(content), replacer, space);
}
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
function copyTpl(fs, from, to, context, generateId) {
    const configKey = getRelativeTemplateComponentPath(from);
    const config = exports.CONFIG[configKey];
    if (generateId && config?.getData) {
        const additionalContext = config.getData(generateId, context);
        context = { ...context, ...additionalContext };
    }
    fs.copyTpl(from, to, context, undefined, exports.COPY_TEMPLATE_OPTIONS);
}
/**
 * Extracts the relative path from the templates directory.
 * Works cross-platform by normalizing path separators.
 *
 * @param absolutePath - Absolute path to a template file or directory
 * @returns Relative path from templates directory with forward slashes, or original path if 'templates' not found
 */
function getRelativeTemplateComponentPath(absolutePath) {
    const normalizedPath = (0, node_path_1.normalize)(absolutePath);
    const templatesMarker = `${node_path_1.sep}templates${node_path_1.sep}`;
    const templatesIndex = normalizedPath.indexOf(templatesMarker);
    if (templatesIndex === -1) {
        return absolutePath;
    }
    // Extract everything after '/templates/' or '\\templates\\'
    const relativePath = normalizedPath.substring(templatesIndex + templatesMarker.length);
    // Normalize to forward slashes for consistency
    return relativePath.split(node_path_1.sep).join('/');
}
//# sourceMappingURL=file.js.map