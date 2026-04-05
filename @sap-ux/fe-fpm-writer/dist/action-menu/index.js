"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateActionMenu = generateActionMenu;
const mem_fs_1 = require("mem-fs");
const mem_fs_editor_1 = require("mem-fs-editor");
const ejs_1 = require("ejs");
const validate_1 = require("../common/validate");
const templates_1 = require("../templates");
const file_1 = require("../common/file");
const utils_1 = require("../common/utils");
const action_1 = require("../action");
const types_1 = require("./types");
/**
 * Add a custom page to an existing UI5 application.
 *
 * @param {string} basePath - the base path
 * @param {ActionMenu} actionMenuConfig - the custom action configuration
 * @param {Editor} [fs] - the memfs editor instance
 * @returns {Promise<Editor>} the updated memfs editor instance
 */
async function generateActionMenu(basePath, actionMenuConfig, fs) {
    (0, validate_1.validateVersion)(actionMenuConfig.minUI5Version);
    if (!fs) {
        fs = (0, mem_fs_editor_1.create)((0, mem_fs_1.create)());
    }
    await (0, validate_1.validateBasePath)(basePath, fs);
    const { path: manifestPath, content: manifest } = await (0, utils_1.getManifest)(basePath, fs);
    if (actionMenuConfig.target.menuId) {
        // add new action to existing menu
        const actionsContainer = getExistingMenuItemsContainer(manifest, actionMenuConfig.target);
        const actionsList = actionsContainer[actionMenuConfig.target.menuId].menu;
        actionsList.push(...actionMenuConfig.settings.actions);
    }
    else {
        // enhance manifest with action menu definition
        const actionsContainer = (0, action_1.enhanceManifestAndGetActionsElementReference)(manifest, actionMenuConfig.target);
        Object.assign(actionsContainer, JSON.parse((0, ejs_1.render)(fs.read((0, templates_1.getTemplatePath)(`action/manifest.action-menu.json`)), actionMenuConfig, {})));
        for (const { key, position } of actionMenuConfig.positionUpdates ?? []) {
            if (['__proto__', 'constructor', 'prototype'].includes(key)) {
                // Prevent prototype pollution via special property names
                continue;
            }
            const action = actionsContainer[key];
            if (!action) {
                continue;
            }
            action.position = position;
            if (!position) {
                delete action.position;
            }
        }
    }
    fs.writeJSON(manifestPath, manifest, undefined, (0, file_1.getJsonSpace)(fs, manifestPath, actionMenuConfig.tabInfo));
    return fs;
}
/**
 * Returns actions manifest entry for a given action menu target control.
 *
 * @param manifest - manifest content
 * @param target - target control
 * @returns - manifest node - container for a menu
 */
function getExistingMenuItemsContainer(manifest, target) {
    const page = manifest['sap.ui5'].routing.targets[target.page];
    if (target.control === types_1.TargetControl.header) {
        return page.options.settings.content[target.control].actions;
    }
    else if (target.control === types_1.TargetControl.body && target.customSectionKey) {
        return page.options.settings.content[target.control].sections[target.customSectionKey].actions;
    }
    else {
        // Custom actions for other elements are defined in: 'options/settings/controlConfiguration/<element>/actions'
        const controlPrefix = target.navProperty ? target.navProperty + '/' : '';
        const controlSuffix = target.qualifier ? '#' + target.qualifier : '';
        const controlId = `${controlPrefix}${target.control}${controlSuffix}`;
        return page.options.settings.controlConfiguration[controlId].actions;
    }
}
//# sourceMappingURL=index.js.map