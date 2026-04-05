"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBuildingBlock = generateBuildingBlock;
exports.getManifestContent = getManifestContent;
exports.getSerializedFileContent = getSerializedFileContent;
const mem_fs_1 = require("mem-fs");
const mem_fs_editor_1 = require("mem-fs-editor");
const ejs_1 = require("ejs");
const semver_1 = require("semver");
const node_path_1 = require("node:path");
const xmldom_1 = require("@xmldom/xmldom");
const xml_formatter_1 = __importDefault(require("xml-formatter"));
const xpath = __importStar(require("xpath"));
const project_access_1 = require("@sap-ux/project-access");
const types_1 = require("./types");
const validate_1 = require("../common/validate");
const templates_1 = require("../templates");
const types_2 = require("../prompts/types");
const file_1 = require("../common/file");
const utils_1 = require("../common/utils");
const xml_1 = require("./prompts/utils/xml");
const i18n_1 = require("../i18n");
const processor_1 = require("./processor");
const PLACEHOLDERS = {
    'id': 'REPLACE_WITH_BUILDING_BLOCK_ID',
    'entitySet': 'REPLACE_WITH_ENTITY',
    'qualifier': 'REPLACE_WITH_A_QUALIFIER'
};
/**
 * Generates a building block into the provided xml view file.
 *
 * @param {string} basePath - the base path
 * @param {BuildingBlockConfig} config - the building block configuration parameters
 * @param {Editor} [fs] - the memfs editor instance
 * @returns {Editor} the updated memfs editor instance
 */
async function generateBuildingBlock(basePath, config, fs) {
    const { viewOrFragmentPath, aggregationPath, buildingBlockData, allowAutoAddDependencyLib = true } = config;
    // Validate the base and view paths
    fs ??= (0, mem_fs_editor_1.create)((0, mem_fs_1.create)());
    await (0, validate_1.validateBasePath)(basePath, fs, []);
    const fnGenerateId = config.buildingBlockData.generateId ?? (await (0, file_1.createIdGenerator)(basePath, fs));
    if (!fs.exists((0, node_path_1.join)(basePath, viewOrFragmentPath))) {
        throw new Error(`Invalid view path ${viewOrFragmentPath}.`);
    }
    const { path: manifestPath, content: manifest } = await (0, utils_1.getManifest)(basePath, fs);
    // Read the view xml and template files and update contents of the view xml file
    const xmlDocument = getUI5XmlDocument(basePath, viewOrFragmentPath, fs);
    const { updatedAggregationPath, processedBuildingBlockData, hasAggregation, aggregationNamespace } = (0, processor_1.processBuildingBlock)({ ...buildingBlockData, generateId: fnGenerateId }, xmlDocument, manifestPath, manifest, aggregationPath, fs);
    const templateConfig = {
        hasAggregation,
        aggregationNamespace
    };
    const templateDocument = getTemplateDocument({ ...processedBuildingBlockData, generateId: fnGenerateId }, xmlDocument, fs, manifest, templateConfig);
    if (buildingBlockData.buildingBlockType === types_1.BuildingBlockType.RichTextEditor ||
        buildingBlockData.buildingBlockType === types_1.BuildingBlockType.RichTextEditorButtonGroups) {
        const minUI5Version = manifest ? (0, semver_1.coerce)((0, project_access_1.getMinimumUI5Version)(manifest)) : undefined;
        if (minUI5Version && (0, semver_1.lt)(minUI5Version, '1.117.0')) {
            const t = (0, i18n_1.translate)(i18n_1.i18nNamespaces.buildingBlock, 'richTextEditorBuildingBlock.');
            throw new Error(`${t('minUi5VersionRequirement', { minUI5Version: minUI5Version })}`);
        }
        (0, xml_1.getOrAddNamespace)(xmlDocument, 'sap.fe.macros.richtexteditor', 'richtexteditor');
    }
    fs = updateViewFile(basePath, viewOrFragmentPath, updatedAggregationPath, xmlDocument, templateDocument, fs, config.replace);
    if (allowAutoAddDependencyLib && manifest && !(0, validate_1.validateDependenciesLibs)(manifest, ['sap.fe.macros'])) {
        // "sap.fe.macros" is missing - enhance manifest.json for missing "sap.fe.macros"
        const manifestPath = await (0, utils_1.getManifestPath)(basePath, fs);
        const manifestContent = await getManifestContent(fs);
        const content = fs.read(manifestPath);
        const tabInfo = (0, file_1.detectTabSpacing)(content);
        (0, file_1.extendJSON)(fs, {
            filepath: manifestPath,
            content: manifestContent,
            tabInfo: tabInfo
        });
    }
    return fs;
}
/**
 * Returns the UI5 xml file document (view/fragment).
 *
 * @param {string} basePath - the base path
 * @param {string} viewPath - the path of the xml view relative to the base path
 * @param {Editor} fs - the memfs editor instance
 * @returns {Document} the view xml file document
 */
function getUI5XmlDocument(basePath, viewPath, fs) {
    let viewContent;
    try {
        viewContent = fs.read((0, node_path_1.join)(basePath, viewPath));
    }
    catch (error) {
        throw new Error(`Unable to read xml view file. Details: ${(0, validate_1.getErrorMessage)(error)}`);
    }
    const errorHandler = (level, message) => {
        throw new Error(`Unable to parse xml view file. Details: [${level}] - ${message}`);
    };
    // Parse the xml view content
    let viewDocument;
    try {
        viewDocument = new xmldom_1.DOMParser({ errorHandler }).parseFromString(viewContent);
    }
    catch (error) {
        throw new Error(`Unable to parse xml view file. Details: ${(0, validate_1.getErrorMessage)(error)}`);
    }
    return viewDocument;
}
/**
 * Method returns default values for metadata path.
 *
 * @param {boolean} applyContextPath - whether to apply contextPath.
 * @param {boolean} usePlaceholders - apply placeholder values if value for attribute/property is not provided
 * @returns {MetadataPath} Default values for metadata path.
 */
function getDefaultMetaPath(applyContextPath, usePlaceholders) {
    if (applyContextPath) {
        return {
            metaPath: usePlaceholders ? `/${PLACEHOLDERS.qualifier}` : '',
            contextPath: usePlaceholders ? PLACEHOLDERS.entitySet : ''
        };
    }
    return {
        metaPath: usePlaceholders ? `/${PLACEHOLDERS.entitySet}/${PLACEHOLDERS.qualifier}` : ''
    };
}
/**
 * Method converts object based metaPath to metadata path.
 *
 * @param {boolean} applyContextPath - whether to apply contextPath.
 * @param {BuildingBlockMetaPath} metaPath - object based metaPath.
 * @param {boolean} usePlaceholders - apply placeholder values if value for attribute/property is not provided
 * @param {boolean} targetProperty - Whether to construct metaPath using targetProperty.
 * @returns {MetadataPath} Resolved metadata path information.
 */
function getMetaPath(applyContextPath, metaPath, usePlaceholders, targetProperty) {
    if (!metaPath) {
        return getDefaultMetaPath(applyContextPath, usePlaceholders);
    }
    const { bindingContextType = types_1.bindingContextAbsolute, alwaysAbsolutePath = true } = metaPath;
    let { entitySet, qualifier } = metaPath;
    entitySet = entitySet || (usePlaceholders ? PLACEHOLDERS.entitySet : '');
    const qualifierOrPlaceholder = qualifier || (usePlaceholders ? PLACEHOLDERS.qualifier : '');
    if (applyContextPath) {
        const qualifierParts = qualifierOrPlaceholder.split('/');
        qualifier = qualifierParts.pop();
        return {
            metaPath: qualifier,
            contextPath: qualifierParts.length ? `/${entitySet}/${qualifierParts.join('/')}` : `/${entitySet}`
        };
    }
    if (targetProperty) {
        const isAbsolute = bindingContextType === types_1.bindingContextAbsolute;
        // Example usage:
        // Absolute: entitySet = "Travel", targetProperty = "Status" => "/Travel/Status"
        // Relative: entitySet = "_Agency", targetProperty = "AgencyType" => "_Agency/AgencyType"
        const prefix = isAbsolute ? '/' : '';
        return { metaPath: `${prefix}${entitySet}/${targetProperty}` };
    }
    return {
        metaPath: bindingContextType === types_1.bindingContextAbsolute || alwaysAbsolutePath
            ? `/${entitySet}/${qualifierOrPlaceholder}`
            : qualifierOrPlaceholder
    };
}
/**
 * Returns the content of the xml file document.
 *
 * @param {BuildingBlock} buildingBlockData - the building block data
 * @param {Document} viewDocument - the view xml file document
 * @param {Manifest} manifest - the manifest content
 * @param {Editor} fs - the memfs editor instance
 * @param {boolean} usePlaceholders - apply placeholder values if value for attribute/property is not provided
 * @param {Record<string, unknown>} templateConfig - additional template configuration
 * @returns {string} the template xml file content
 */
function getTemplateContent(buildingBlockData, viewDocument, manifest, fs, usePlaceholders, templateConfig) {
    const templateFolderName = buildingBlockData.buildingBlockType;
    const templateFilePath = (0, templates_1.getTemplatePath)(`/building-block/${templateFolderName}/View.xml`);
    if (typeof buildingBlockData.metaPath === 'object' || buildingBlockData.metaPath === undefined) {
        // Special handling for chart - while runtime does not support approach without contextPath
        // or for equal or below UI5 v1.96.0 contextPath is applied
        const minUI5Version = manifest ? (0, semver_1.coerce)((0, project_access_1.getMinimumUI5Version)(manifest)) : undefined;
        let targetProperty;
        if (buildingBlockData.buildingBlockType === types_1.BuildingBlockType.RichTextEditor) {
            // Get target property for RichTextEditor building block
            targetProperty = buildingBlockData.targetProperty;
        }
        const applyContextPath = buildingBlockData.buildingBlockType === types_1.BuildingBlockType.Chart ||
            !!(minUI5Version && (0, semver_1.lt)(minUI5Version, '1.97.0'));
        // Convert object based metapath to string
        const metadataPath = getMetaPath(applyContextPath, buildingBlockData.metaPath, usePlaceholders, targetProperty);
        buildingBlockData = { ...buildingBlockData, metaPath: metadataPath.metaPath };
        if (!buildingBlockData.contextPath && metadataPath.contextPath) {
            buildingBlockData.contextPath = metadataPath.contextPath;
        }
    }
    // Apply placeholders
    if (!buildingBlockData.id) {
        buildingBlockData.id = PLACEHOLDERS.id;
    }
    const configKey = (0, file_1.getRelativeTemplateComponentPath)(templateFilePath);
    const config = file_1.CONFIG[configKey];
    let context = {
        macrosNamespace: viewDocument ? (0, xml_1.getOrAddNamespace)(viewDocument, 'sap.fe.macros', 'macros') : 'macros',
        data: buildingBlockData,
        config: templateConfig
    };
    if (config?.getData) {
        const additionalContext = config.getData(buildingBlockData.generateId, buildingBlockData);
        context = { ...context, ...additionalContext };
    }
    return (0, ejs_1.render)(fs.read(templateFilePath), context, {});
}
/**
 * Method returns the manifest content for the required dependency library.
 *
 * @param {Editor} fs - the memfs editor instance
 * @param {string} library - the dependency library
 * @returns {Promise<string>} Manifest content for the required dependency library.
 */
async function getManifestContent(fs, library = 'sap.fe.macros') {
    // "sap.fe.macros" is missing - enhance manifest.json for missing "sap.fe.macros"
    const templatePath = (0, templates_1.getTemplatePath)('/building-block/common/manifest.json');
    return (0, ejs_1.render)(fs.read(templatePath), { libraries: { [library]: {} } });
}
/**
 * Returns the template xml file document.
 *
 * @param {BuildingBlock} buildingBlockData - the building block data
 * @param {Document} viewDocument - the view xml file document
 * @param {Editor} fs - the memfs editor instance
 * @param  {Manifest} manifest - the manifest content
 * @param {Record<string, unknown>} templateConfig - additional template configuration
 * @returns {Document} the template xml file document
 */
function getTemplateDocument(buildingBlockData, viewDocument, fs, manifest, templateConfig) {
    const templateContent = getTemplateContent(buildingBlockData, viewDocument, manifest, fs, undefined, templateConfig);
    const errorHandler = (level, message) => {
        throw new Error(`Unable to parse template file with building block data. Details: [${level}] - ${message}`);
    };
    // Parse the rendered template content
    let templateDocument;
    try {
        templateDocument = new xmldom_1.DOMParser({ errorHandler }).parseFromString(templateContent);
    }
    catch (error) {
        throw new Error(`Unable to parse template file with building block data. Details: ${(0, validate_1.getErrorMessage)(error)}`);
    }
    return templateDocument;
}
/**
 * Updates the view file by inserting the template as a child of the element specified in the aggregated xpath.
 *
 * @param {string} basePath - the base path
 * @param {string} viewPath - the path of the xml view relative to the base path
 * @param {string} aggregationPath - the aggregation xpath
 * @param {Document} viewDocument - the view xml document
 * @param {Document} templateDocument - the template xml document
 * @param {Editor} [fs] - the memfs editor instance
 * @param {boolean} [replace] - If true, replaces the target element with the template xml document;
 * if false, appends the source node.
 * @returns {Editor} the updated memfs editor instance
 */
function updateViewFile(basePath, viewPath, aggregationPath, viewDocument, templateDocument, fs, replace = false) {
    const xpathSelect = xpath.useNamespaces(viewDocument.firstChild._nsMap);
    // Find target aggregated element and append template as child
    const targetNodes = xpathSelect(aggregationPath, viewDocument);
    if (targetNodes && Array.isArray(targetNodes) && targetNodes.length > 0) {
        const targetNode = targetNodes[0];
        const sourceNode = viewDocument.importNode(templateDocument.documentElement, true);
        if (replace) {
            targetNode.parentNode?.replaceChild(sourceNode, targetNode);
        }
        else {
            targetNode.appendChild(sourceNode);
        }
        // Serialize and format new view xml document
        const newXmlContent = new xmldom_1.XMLSerializer().serializeToString(viewDocument);
        fs.write((0, node_path_1.join)(basePath, viewPath), (0, xml_formatter_1.default)(newXmlContent));
    }
    else {
        throw new Error(`Aggregation control not found ${aggregationPath}.`);
    }
    return fs;
}
/**
 * Gets the properties for the file if the relative path is defined.
 *
 * @param {string} basePath - The base path
 * @param {string} relativePath - The relative path to the file in the config
 * @returns {FilePathProps} An object with file properties
 */
function getFilePathProps(basePath, relativePath) {
    if (relativePath) {
        return {
            fileName: (0, node_path_1.parse)(relativePath).base,
            relativePath,
            fullPath: (0, node_path_1.join)(basePath, relativePath)
        };
    }
    return {};
}
/**
 * Gets the serialized content of the updated view file.
 *
 * @param {string} basePath - The base path
 * @param {BuildingBlockConfig} config - The building block configuration
 * @param {Editor} [fs] - The memfs editor instance
 * @returns {{ [questionName: string]: CodeSnippet }} An object with serialized code snippet content and file props
 */
async function getSerializedFileContent(basePath, config, fs) {
    const snippets = {};
    const { buildingBlockData, viewOrFragmentPath, allowAutoAddDependencyLib = true } = config;
    if (!buildingBlockData?.buildingBlockType) {
        return {};
    }
    // Validate the base and view paths
    fs = fs ?? (0, mem_fs_editor_1.create)((0, mem_fs_1.create)());
    // Read the view xml and template files and get content of the view xml file
    const xmlDocument = viewOrFragmentPath ? getUI5XmlDocument(basePath, viewOrFragmentPath, fs) : undefined;
    const { content: manifest, path: manifestPath } = await (0, utils_1.getManifest)(basePath, fs, false);
    const content = getTemplateContent(buildingBlockData, xmlDocument, manifest, fs, true);
    const filePathProps = getFilePathProps(basePath, viewOrFragmentPath);
    // Snippet for fragment xml
    snippets['viewOrFragmentPath'] = {
        content,
        language: types_2.CodeSnippetLanguage.XML,
        filePathProps
    };
    // Snippet for manifest.json
    if (allowAutoAddDependencyLib) {
        const manifestContent = await getManifestContent(fs);
        snippets['manifest'] = {
            content: manifestContent,
            language: types_2.CodeSnippetLanguage.JSON,
            filePathProps: {
                fileName: (0, node_path_1.parse)(manifestPath).base,
                relativePath: (0, node_path_1.relative)(basePath, manifestPath),
                fullPath: manifestPath
            }
        };
    }
    return snippets;
}
//# sourceMappingURL=index.js.map