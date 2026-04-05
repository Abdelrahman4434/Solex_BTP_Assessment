"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectedContextsParameter = exports.contextParameter = exports.defaultParameter = void 0;
exports.applyEventHandlerConfiguration = applyEventHandlerConfiguration;
const node_path_1 = require("node:path");
const templates_1 = require("../templates");
const utils_1 = require("../common/utils");
const file_1 = require("./file");
/**
 * Default values for the input parameters of newly created event handlers.
 */
exports.defaultParameter = {
    name: 'event',
    jsName: 'oEvent',
    description: 'the event object provided by the event provider.',
    importType: 'UI5Event',
    importSource: 'sap/ui/base/Event'
};
/**
 * Values for the input parameters of newly created event handlers that are added as manifest actions.
 */
exports.contextParameter = {
    name: 'context',
    jsName: 'oContext',
    description: 'the context of the page on which the event was fired. `undefined` for list report page.',
    importType: 'Context',
    paramType: 'Context | undefined',
    importSource: 'sap/ui/model/odata/v4/Context'
};
exports.selectedContextsParameter = {
    name: 'selectedContexts',
    jsName: 'aSelectedContexts',
    description: 'the selected contexts of the table rows.',
    importType: 'Context',
    paramType: 'Context[]',
    importSource: 'sap/ui/model/odata/v4/Context'
};
/**
 * Method returns file name to use in namespace.
 *
 * @param fileName - event handler file name
 * @param controllerPrefix - controller prefix '.extension'
 * @returns {string} file name part for namespace
 */
function getFileName(fileName, controllerPrefix) {
    let resolvedName;
    // For name part in namespace we use passed file name or if it's controller extension, then remove 'controller' part from path
    // 'Handler.controller' should be resolved as 'Handler' in namespace
    if (controllerPrefix && fileName.endsWith('.controller')) {
        resolvedName = fileName.replace('.controller', '');
    }
    else {
        resolvedName = fileName;
    }
    return resolvedName;
}
/**
 * Method creates or updates handler js file and update 'settings.eventHandler' entry with namespace path entry to method.
 *
 * @param fs - the memfs editor instance
 * @param config - configuration
 * @param eventHandler - eventHandler for creation
 * @param eventHandlerOptions - eventHandler options
 * @param parameters - parameters and its configurations for the event handler
 * @returns {string} full namespace path to method
 */
function applyEventHandlerConfiguration(fs, config, eventHandler, eventHandlerOptions, parameters = [exports.defaultParameter]) {
    const { controllerSuffix, typescript, templatePath = 'common/EventHandler' } = eventHandlerOptions;
    let { eventHandlerFnName = 'onPress' } = eventHandlerOptions;
    if (typeof eventHandler === 'string') {
        // Existing event handler is passed - no need for file creation/update
        return eventHandler;
    }
    let insertScript;
    let controllerPrefix = '';
    // By default - use config name for created file name
    let fileName = config.name;
    // Name part used in namespace
    let resolvedName = fileName;
    if (typeof eventHandler === 'object') {
        controllerPrefix = eventHandler.controllerPrefix;
        if (eventHandler.fnName) {
            eventHandlerFnName = eventHandler.fnName;
        }
        insertScript = eventHandler.insertScript;
        if (eventHandler.fileName) {
            // Use passed file name
            fileName = eventHandler.fileName;
            resolvedName = getFileName(fileName, controllerPrefix);
        }
    }
    const ext = typescript ? 'ts' : 'js';
    const controllerPath = (0, node_path_1.join)(config.path || '', `${fileName}${controllerSuffix ? '.controller' : ''}.${ext}`);
    if (!fs.exists(controllerPath)) {
        (0, file_1.copyTpl)(fs, (0, templates_1.getTemplatePath)(`${templatePath}.${ext}`), controllerPath, {
            eventHandlerFnName,
            parameters,
            ...config
        });
    }
    else if (insertScript) {
        // Read current file content
        let content = fs.read(controllerPath);
        // Append content with additional script fragment
        if (typeof insertScript.position === 'object') {
            content = (0, utils_1.insertTextAtPosition)(insertScript.fragment, content, insertScript.position);
        }
        else {
            content = (0, utils_1.insertTextAtAbsolutePosition)(insertScript.fragment, content, insertScript.position);
        }
        fs.write(controllerPath, content);
    }
    // Return full namespace path to method
    const fullNamespace = `${config.ns}.${resolvedName}.${eventHandlerFnName}`;
    return controllerPrefix ? `${controllerPrefix}.${fullNamespace}` : `${fullNamespace}`;
}
//# sourceMappingURL=event-handler.js.map