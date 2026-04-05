"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhanceData = enhanceData;
exports.getTemplateRoot = getTemplateRoot;
exports.generate = generate;
const node_path_1 = require("node:path");
const mem_fs_1 = require("mem-fs");
const mem_fs_editor_1 = require("mem-fs-editor");
const ejs_1 = require("ejs");
const types_1 = require("./types");
const common_1 = require("./common");
const defaults_1 = require("../common/defaults");
const validate_1 = require("../common/validate");
const templates_1 = require("../templates");
const semver_1 = require("semver");
const utils_1 = require("../common/utils");
const file_1 = require("../common/file");
const building_block_1 = require("../building-block");
const types_2 = require("../building-block/types");
const utils_2 = require("../building-block/prompts/utils");
const i18n_1 = require("../i18n");
/**
 * Enhances the provided custom page configuration with default data.
 *
 * @param data - a custom page configuration object
 * @param manifestPath - path to the application manifest
 * @param fs - mem-fs reference to be used for file access
 * @returns enhanced configuration
 */
function enhanceData(data, manifestPath, fs) {
    const manifest = fs.readJSON(manifestPath);
    // Check if folder was explicitly provided before setCommonDefaults modifies the data object
    const folderWasProvided = !!data.folder;
    // set common defaults
    const config = (0, defaults_1.setCommonDefaults)(data, manifestPath, manifest);
    // Override folder to use ext/view for custom pages (consistency with Page Map)
    // Only override if no custom folder was explicitly provided
    if (!folderWasProvided) {
        config.folder = 'ext/view';
        config.ns = `${manifest['sap.app'].id}.ext.view`;
        config.path = (0, node_path_1.join)((0, node_path_1.dirname)(manifestPath), 'ext/view');
    }
    // currently the custom page template is always the same
    config.template = 'sap.fe.core.fpm';
    config.settings = (0, common_1.initializeTargetSettings)(data);
    // set library dependencies
    config.libraries = (0, common_1.getLibraryDependencies)(types_1.PageType.CustomPage);
    // set FCL configuration
    const fclConfig = (0, common_1.getFclConfig)(manifest, config.navigation);
    config.fcl = fclConfig.fcl;
    config.controlAggregation = fclConfig.controlAggregation;
    if (config.view === undefined) {
        config.view = {
            title: config.name
        };
    }
    return config;
}
/**
 * Validate the UI5 version and if valid return the root folder for the templates to be used.
 *
 * @param ui5Version - optional minimum required UI5 version
 * @returns root folder  containg the templates if the version is supported otherwise throws an error
 */
function getTemplateRoot(ui5Version) {
    const minVersion = (0, semver_1.coerce)(ui5Version);
    if (!minVersion || (0, semver_1.gte)(minVersion, '1.94.0')) {
        return (0, templates_1.getTemplatePath)('/page/custom/1.94');
    }
    else {
        return (0, templates_1.getTemplatePath)('/page/custom/1.84');
    }
}
/**
 * Handles the creation of a page building block for a custom page.
 *
 * @param {string} basePath - The base path of the UI5 application.
 * @param {{ pageBuildingBlockTitle: string; minUI5Version?: string }} data - Object containing the building block title and optional minimum UI5 version.
 * @param data.pageBuildingBlockTitle
 * @param data.minUI5Version
 * @param {string} viewPath - The path to the view XML file.
 * @param {Editor} fs - The memfs editor instance.
 * @param {(baseId: string) => Promise<string>} generateId - Function to generate unique IDs for the building block elements.
 * @param {Logger} [log] - Logger instance.
 * @returns {Promise<void>} Resolves when the building block is handled or skipped due to version constraints.
 */
async function handlePageBuildingBlock(basePath, data, viewPath, fs, generateId, log) {
    const minVersion = (0, semver_1.coerce)(data.minUI5Version);
    const t = (0, i18n_1.translate)(i18n_1.i18nNamespaces.buildingBlock, 'pageBuildingBlock.');
    if (minVersion && (0, semver_1.lt)(minVersion.version, '1.136.0')) {
        log?.warn(t('minUi5VersionRequirement', { minUI5Version: data.minUI5Version }));
        return;
    }
    const pageId = generateId('Page');
    await (0, building_block_1.generateBuildingBlock)(basePath, {
        viewOrFragmentPath: (0, node_path_1.relative)(basePath, viewPath),
        aggregationPath: (0, utils_2.augmentXpathWithLocalNames)(`/mvc:View/Page`),
        replace: true,
        buildingBlockData: {
            id: pageId,
            buildingBlockType: types_2.BuildingBlockType.Page,
            generateId,
            title: data.pageBuildingBlockTitle
        }
    }, fs);
}
/**
 * Add a custom page to an existing UI5 application.
 *
 * @param {string} basePath - the base path
 * @param {CustomPage} data - the custom page configuration
 * @param {Editor} [fs] - the memfs editor instance
 * @param {Logger} [log] - Logger instance
 * @returns {Promise<Editor>} the updated memfs editor instance
 */
async function generate(basePath, data, fs, log) {
    fs ??= (0, mem_fs_editor_1.create)((0, mem_fs_1.create)());
    (0, validate_1.validateVersion)(data.minUI5Version);
    await (0, common_1.validatePageConfig)(basePath, data, fs, []);
    const manifestPath = await (0, utils_1.getManifestPath)(basePath, fs);
    const fnGenerateId = await (0, file_1.createIdGenerator)(basePath, fs);
    const config = enhanceData(data, manifestPath, fs);
    // merge content into existing files
    const root = getTemplateRoot(data.minUI5Version);
    // enhance manifest.json
    (0, file_1.extendJSON)(fs, {
        filepath: manifestPath,
        content: (0, ejs_1.render)(fs.read((0, node_path_1.join)(root, `manifest.json`)), config, {}),
        replacer: (0, common_1.getManifestJsonExtensionHelper)(config),
        tabInfo: data.tabInfo
    });
    // add extension content
    const viewPath = (0, node_path_1.join)(config.path, `${config.name}.view.xml`);
    if (!fs.exists(viewPath)) {
        (0, file_1.copyTpl)(fs, (0, node_path_1.join)(root, 'ext/View.xml'), viewPath, config, fnGenerateId);
        // i18n.properties
        const manifest = fs.readJSON(manifestPath);
        const defaultI18nPath = 'i18n/i18n.properties';
        const customI18nPath = manifest?.['sap.ui5']?.models?.i18n?.uri;
        const i18nPath = (0, node_path_1.join)(basePath, 'webapp', customI18nPath ?? defaultI18nPath);
        const i18TemplatePath = (0, node_path_1.join)(root, 'i18n', 'i18n.properties');
        if (fs.exists(i18nPath)) {
            fs.append(i18nPath, (0, ejs_1.render)(fs.read(i18TemplatePath), config, {}));
        }
        else {
            (0, file_1.copyTpl)(fs, i18TemplatePath, i18nPath, config);
        }
    }
    if (data.pageBuildingBlockTitle) {
        await handlePageBuildingBlock(basePath, { pageBuildingBlockTitle: data.pageBuildingBlockTitle, minUI5Version: data.minUI5Version }, viewPath, fs, fnGenerateId, log);
    }
    const ext = data.typescript ? 'ts' : 'js';
    const controllerPath = (0, node_path_1.join)(config.path, `${config.name}.controller.${ext}`);
    if (!fs.exists(controllerPath)) {
        (0, file_1.copyTpl)(fs, (0, node_path_1.join)(root, `ext/Controller.${ext}`), controllerPath, config);
    }
    if (data.typescript) {
        (0, utils_1.addExtensionTypes)(basePath, data.minUI5Version, fs);
    }
    return fs;
}
//# sourceMappingURL=custom.js.map