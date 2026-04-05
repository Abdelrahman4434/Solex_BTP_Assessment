"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertTextAtAbsolutePosition = insertTextAtAbsolutePosition;
exports.insertTextAtPosition = insertTextAtPosition;
exports.addExtensionTypes = addExtensionTypes;
exports.getManifestPath = getManifestPath;
exports.getManifest = getManifest;
exports.isElementIdAvailable = isElementIdAvailable;
const node_os_1 = __importDefault(require("node:os"));
const node_path_1 = require("node:path");
const semver_1 = require("semver");
const project_access_1 = require("@sap-ux/project-access");
const templates_1 = require("../templates");
const file_1 = require("./file");
const xmldom_1 = require("@xmldom/xmldom");
/**
 * Method inserts passed text into content by char index position.
 * In case if position is out of range, then whitespaces would be created.
 * Negative positions are not supported.
 *
 * @param {string} text - text to insert
 * @param {string} content - target content for update
 * @param {number} position - Char index position to insert in
 * @returns new content with inserted text
 */
function insertTextAtAbsolutePosition(text, content, position) {
    if (position < 0) {
        return content;
    }
    // Check if char position exist and create missing chars
    const prepareCharIndex = Math.max(position - 1, 0);
    while (prepareCharIndex > 0 && content[prepareCharIndex] === undefined) {
        content += ' ';
    }
    return `${content.slice(0, position)}${text}${content.slice(position)}`;
}
/**
 * Method inserts passed text into content by line and char position.
 * In case if position is out of range, then whitespaces would be created.
 * Negative positions are not supported.
 *
 * @param {string} text - text to insert
 * @param {string} content - target content for update
 * @param {FileContentPosition} position - Line and char position to insert in
 * @returns new content with inserted text
 */
function insertTextAtPosition(text, content, position) {
    if (position.line < 0 || position.character < 0) {
        return content;
    }
    const lines = content.split(/\r\n|\n/);
    let targetLine = lines[position.line];
    // Check if line position exist and create missing lines
    while (targetLine === undefined) {
        lines.push('');
        targetLine = lines[position.line];
    }
    // Update line with inserting passed text
    lines[position.line] = insertTextAtAbsolutePosition(text, lines[position.line], position.character);
    return lines.join(node_os_1.default.EOL);
}
/**
 * Adds type extensions for sap.fe types if an older version is used.
 * The types were fixed in 1.108 and downported to 1.102.
 *
 * @param basePath - the base path
 * @param minUI5Version - minimal required UI5 version
 * @param fs - the memfs editor instance
 */
function addExtensionTypes(basePath, minUI5Version, fs) {
    const version = (0, semver_1.minor)((0, semver_1.coerce)(minUI5Version) ?? '1.108.0');
    const path = (0, node_path_1.join)(basePath, '/webapp/ext/sap.fe.d.ts');
    if (version < 108 && version !== 102 && !fs.exists(path)) {
        (0, file_1.copyTpl)(fs, (0, templates_1.getTemplatePath)('common/sap.fe.d.ts'), path, { version });
    }
}
/**
 * Gets manifest path.
 *
 * @param {string} basePath the base path
 * @param {Editor} fs the memfs editor instance
 * @returns {Manifest | undefined} path to manifest file
 */
async function getManifestPath(basePath, fs) {
    return (0, node_path_1.join)(await (0, project_access_1.getWebappPath)(basePath, fs), 'manifest.json');
}
/**
 * Gets content and path of the manifest.
 *
 * @param {string} basePath the base path
 * @param {Editor} fs the memfs editor instance
 * @param {boolean} [validate] validate if 'manifest.json' file exists - throw error if file does not exist
 * @returns {Manifest | undefined} The content and path of the manifest
 */
async function getManifest(basePath, fs, validate = true) {
    const path = await getManifestPath(basePath, fs);
    if (validate && !fs.exists(path)) {
        throw new Error(`Invalid project folder. Cannot find required file ${path}`);
    }
    return {
        path,
        content: fs.readJSON(path)
    };
}
/**
 * Method validates if passed id is available.
 *
 * @param fs  - the file system object for reading files
 * @param viewOrFragmentPath - path to fragment or view file
 * @param id - id to check/validate
 * @returns true if passed id is available.
 */
function isElementIdAvailable(fs, viewOrFragmentPath, id) {
    const xmlContent = fs.read(viewOrFragmentPath).toString();
    const xmlDocument = new xmldom_1.DOMParser({ errorHandler: () => { } }).parseFromString(xmlContent);
    return xmlDocument.documentElement ? !xmlDocument.getElementById(id) : true;
}
//# sourceMappingURL=utils.js.map