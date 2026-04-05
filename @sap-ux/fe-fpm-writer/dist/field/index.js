"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCustomField = generateCustomField;
const mem_fs_1 = require("mem-fs");
const mem_fs_editor_1 = require("mem-fs-editor");
const node_path_1 = require("node:path");
const ejs_1 = require("ejs");
const validate_1 = require("../common/validate");
const defaults_1 = require("../common/defaults");
const event_handler_1 = require("../common/event-handler");
const file_1 = require("../common/file");
const templates_1 = require("../templates");
const utils_1 = require("../common/utils");
/**
 * Enhances the provided custom field configuration with default data.
 *
 * @param {Editor} fs - the mem-fs editor instance
 * @param {CustomField} data - a custom field configuration object
 * @param {string} manifestPath - path to the project's manifest.json
 * @param {Manifest} manifest - the application manifest
 * @param {(baseId: string) => string} generateId - Function to generate unique IDs for the building block elements.
 * @returns enhanced configuration
 */
function enhanceConfig(fs, data, manifestPath, manifest, generateId) {
    // clone input and set defaults
    const config = { ...data };
    (0, defaults_1.setCommonDefaults)(config, manifestPath, manifest);
    // Apply event handler
    if (config.eventHandler) {
        config.eventHandler = (0, event_handler_1.applyEventHandlerConfiguration)(fs, config, config.eventHandler, {
            controllerSuffix: false,
            typescript: config.typescript
        });
    }
    // generate field content
    if (config.control) {
        config.content = config.control;
    }
    else {
        Object.assign(config, (0, defaults_1.getDefaultFragmentContentData)(config.name, generateId, config.eventHandler));
    }
    return config;
}
/**
 * Add a custom field to an existing UI5 application.
 *
 * @param {string} basePath - the base path
 * @param {CustomField} customField - the custom field configuration
 * @param {Promise<Editor>} [fs] - the mem-fs editor instance
 * @returns {Promise<Editor>} the updated mem-fs editor instance
 */
async function generateCustomField(basePath, customField, fs) {
    (0, validate_1.validateVersion)(customField.minUI5Version);
    fs ??= (0, mem_fs_editor_1.create)((0, mem_fs_1.create)());
    await (0, validate_1.validateBasePath)(basePath, fs);
    const generateId = await (0, file_1.createIdGenerator)(basePath, fs);
    const { path: manifestPath, content: manifest } = await (0, utils_1.getManifest)(basePath, fs);
    // merge with defaults
    const completeField = enhanceConfig(fs, customField, manifestPath, manifest, generateId);
    // add fragment
    const viewPath = (0, node_path_1.join)(completeField.path, `${completeField.fragmentFile ?? completeField.name}.fragment.xml`);
    if (!fs.exists(viewPath)) {
        (0, file_1.copyTpl)(fs, (0, templates_1.getTemplatePath)('common/Fragment.xml'), viewPath, completeField, generateId);
    }
    // enhance manifest with field definition
    const templatePath = (0, templates_1.getTemplatePath)('/field/manifest.json');
    const filledTemplate = (0, ejs_1.render)(fs.read(templatePath), completeField, {});
    (0, file_1.extendJSON)(fs, {
        filepath: manifestPath,
        content: filledTemplate,
        tabInfo: completeField.tabInfo
    });
    return fs;
}
//# sourceMappingURL=index.js.map