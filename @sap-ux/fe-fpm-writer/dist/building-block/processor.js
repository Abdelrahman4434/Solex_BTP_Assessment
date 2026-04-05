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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILDING_BLOCK_CONFIG = exports.BUTTON_GROUP_CONFIGS = void 0;
exports.processBuildingBlock = processBuildingBlock;
const node_path_1 = require("node:path");
const xpath = __importStar(require("xpath"));
const types_1 = require("./types");
const templates_1 = require("../templates");
const event_handler_1 = require("../common/event-handler");
const defaults_1 = require("../common/defaults");
const xml_1 = require("./prompts/utils/xml");
const file_1 = require("../common/file");
/**
 * Button group configurations used for validation and providing available button groups.
 */
exports.BUTTON_GROUP_CONFIGS = [
    { name: 'font-style', buttons: 'bold,italic,underline,strikethrough' },
    { name: 'clipboard', buttons: 'cut,copy,paste' },
    { name: 'structure', buttons: 'bullist,numlist,outdent,indent' },
    { name: 'font', buttons: 'fontfamily,fontsize,forecolor,backcolor' },
    { name: 'undo', buttons: 'undo,redo' },
    { name: 'insert', buttons: 'image,emoticons' },
    { name: 'link', buttons: 'link,unlink' },
    { name: 'text-align', buttons: 'alignleft,aligncenter,alignright,alignjustify' },
    { name: 'table', buttons: 'table' },
    { name: 'styleselect', buttons: 'styleselect' }
];
/**
 * Configuration map for building block types.
 */
exports.BUILDING_BLOCK_CONFIG = {
    [types_1.BuildingBlockType.CustomColumn]: {
        aggregationConfig: { aggregationName: 'columns', elementName: 'Column' },
        templateFile: 'common/Fragment.xml',
        namespace: { uri: 'sap.fe.macros.table', prefix: 'macrosTable' },
        processor: processCustomColumn
    },
    [types_1.BuildingBlockType.CustomFilterField]: {
        aggregationConfig: { aggregationName: 'filterFields', elementName: 'FilterField' },
        templateFile: 'filter/fragment.xml',
        namespace: { uri: 'sap.fe.macros.filterBar', prefix: 'macros' },
        processor: processCustomFilterField
    },
    [types_1.BuildingBlockType.RichTextEditorButtonGroups]: {
        aggregationConfig: { aggregationName: 'buttonGroups', elementName: 'ButtonGroup' },
        namespace: { uri: 'sap.fe.macros', prefix: 'macros' },
        processor: processRichTextEditorButtonGroups
    },
    [types_1.BuildingBlockType.Action]: {
        aggregationConfig: { aggregationName: 'actions', elementName: 'Action' },
        namespace: { uri: 'sap.fe.macros.table', prefix: 'macrosTable' },
        processor: processAction
    }
};
/**
 * Retrieves the configuration for a building block type.
 *
 * @param buildingBlockType - The building block type
 * @returns The building block configuration (aggregation, namespace, processor)
 * @throws {Error} If configuration not found for the specified type
 */
function getBuildingBlockConfig(buildingBlockType) {
    const config = exports.BUILDING_BLOCK_CONFIG[buildingBlockType];
    if (!config) {
        throw new Error(`No configuration found for building block type: ${buildingBlockType}`);
    }
    return config;
}
/**
 * Checks if the building block data matches a specific type.
 *
 * @param {BuildingBlock} data - The building block data to check
 * @param {BuildingBlockType} type - The building block type to check against
 * @returns {boolean} True if the data matches the specified type
 */
function isBuildingBlockType(data, type) {
    return data.buildingBlockType === type;
}
/**
 * Processes custom column building block.
 *
 * @param {BuildingBlock} buildingBlockData - The building block data
 * @param {ProcessingContext} context - Processing context
 */
function processCustomColumn(buildingBlockData, context) {
    const { fs, viewPath } = context;
    if (!isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.CustomColumn)) {
        throw new Error('Expected CustomColumn building block data');
    }
    const config = getBuildingBlockConfig(types_1.BuildingBlockType.CustomColumn);
    const columnConfig = buildingBlockData.embededFragment;
    let processedEventHandler;
    // Apply event handler
    if (columnConfig.eventHandler) {
        processedEventHandler = (0, event_handler_1.applyEventHandlerConfiguration)(fs, columnConfig, columnConfig.eventHandler, {
            controllerSuffix: false,
            typescript: columnConfig.typescript
        });
        columnConfig.eventHandler = processedEventHandler;
    }
    columnConfig.content = (0, defaults_1.getDefaultFragmentContent)('Sample Text', buildingBlockData.generateId, processedEventHandler);
    if (viewPath && !fs.exists(viewPath)) {
        fs.copyTpl((0, templates_1.getTemplatePath)(config.templateFile), viewPath, columnConfig);
    }
}
/**
 * Processes custom filter field building block.
 *
 * @param {BuildingBlock} buildingBlockData - The building block data
 * @param {ProcessingContext} context - Processing context
 */
function processCustomFilterField(buildingBlockData, context) {
    const { fs, viewPath, embeddedFragment } = context;
    if (!isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.CustomFilterField)) {
        throw new Error('Expected CustomFilterField building block data');
    }
    if (!embeddedFragment) {
        throw new Error('EmbeddedFragment is required for CustomFilterField');
    }
    const config = getBuildingBlockConfig(types_1.BuildingBlockType.CustomFilterField);
    let filterConfig = {
        label: buildingBlockData.label,
        property: buildingBlockData.property,
        required: buildingBlockData.required ?? false,
        position: buildingBlockData.position,
        eventHandler: buildingBlockData.embededFragment?.eventHandler,
        ns: embeddedFragment.ns,
        name: embeddedFragment.name,
        path: embeddedFragment.path
    };
    // Apply event handler
    if (filterConfig.eventHandler) {
        filterConfig.eventHandler = (0, event_handler_1.applyEventHandlerConfiguration)(fs, filterConfig, filterConfig.eventHandler, {
            controllerSuffix: false,
            typescript: buildingBlockData.embededFragment?.typescript,
            templatePath: 'filter/Controller'
        });
    }
    const configKey = config.templateFile;
    const additionalDataConfig = file_1.CONFIG[configKey];
    if (additionalDataConfig?.getData) {
        const additionalContext = additionalDataConfig.getData(buildingBlockData.generateId);
        filterConfig = { ...filterConfig, ...additionalContext };
    }
    if (viewPath && !fs.exists(viewPath)) {
        fs.copyTpl((0, templates_1.getTemplatePath)(config.templateFile), viewPath, filterConfig);
    }
}
/**
 * Extracts a ButtonGroupConfig from an XML element.
 *
 * @param element - The XML element representing a button group.
 * @returns The extracted ButtonGroupConfig, or undefined if required attributes are missing.
 */
function extractButtonGroupConfig(element) {
    const name = element.getAttribute('name');
    // extract attributes
    const buttons = element.getAttribute('buttons');
    if (!name || !buttons) {
        return;
    }
    const buttonGroupConfig = {
        name,
        buttons
    };
    if (buttons) {
        buttonGroupConfig.buttons = buttons;
    }
    const visible = element.getAttribute('visible');
    if (visible) {
        buttonGroupConfig.visible = visible === 'true';
    }
    const priority = element.getAttribute('priority');
    if (priority) {
        buttonGroupConfig.priority = Number.parseInt(priority, 10);
    }
    const customToolbarPriority = element.getAttribute('customToolbarPriority');
    if (customToolbarPriority) {
        buttonGroupConfig.customToolbarPriority = Number.parseInt(customToolbarPriority, 10);
    }
    const row = element.getAttribute('row');
    if (row) {
        buttonGroupConfig.row = Number.parseInt(row, 10);
    }
    const id = element.getAttribute('id');
    if (id) {
        buttonGroupConfig.id = id;
    }
    return buttonGroupConfig;
}
/**
 * Calculates the next available customToolbarPriority for new button groups.
 * Automatically assigns customToolbarPriority to new button groups in the order they are added,
 * by calculating the highest existing customToolbarPriority and incrementing.
 *
 * @param existingButtonGroupsMap - Map of existing button group configs.
 * @returns The next available customToolbarPriority (highest existing + 1, or 1 if none exist).
 */
function getNextCustomToolbarPriority(existingButtonGroupsMap) {
    const existingPriorities = Array.from(existingButtonGroupsMap.values())
        .map((bg) => bg.customToolbarPriority)
        .filter((p) => typeof p === 'number');
    return existingPriorities.length > 0 ? Math.max(...existingPriorities) + 1 : 1;
}
/**
 * Merges new button group selection with existing button groups.
 *
 * @param existingButtonGroupsMap - Map of existing button group configs.
 * @param rteButtonGroups - RichTextEditorButtonGroups containing new button group selection.
 * @returns Array of merged ButtonGroupConfig objects.
 */
function mergeButtonGroups(existingButtonGroupsMap, rteButtonGroups) {
    // Set nextPriority to the next available customToolbarPriority
    let nextPriority = getNextCustomToolbarPriority(existingButtonGroupsMap);
    // Merge new selection with existing selections
    return rteButtonGroups.buttonGroups?.map((selectedButtonGroup) => {
        const defaultConfig = exports.BUTTON_GROUP_CONFIGS.find((config) => config.name === selectedButtonGroup.name);
        if (!defaultConfig) {
            throw new Error(`Unknown button group: ${selectedButtonGroup.name}`);
        }
        const existingConfig = existingButtonGroupsMap.get(selectedButtonGroup.name);
        // Check if user provided any new attributes (other than just 'name')
        const hasNewAttributes = Object.keys(selectedButtonGroup).some((key) => key !== 'name' && selectedButtonGroup[key] !== undefined);
        let customToolbarPriority = selectedButtonGroup.customToolbarPriority;
        if (customToolbarPriority === undefined && !existingConfig) {
            // Assign next available priority to new button group
            customToolbarPriority = nextPriority++;
        }
        else if (existingConfig?.customToolbarPriority !== undefined) {
            customToolbarPriority = existingConfig.customToolbarPriority;
        }
        if (existingConfig && !hasNewAttributes) {
            // Preserve existing attributes if no new attributes provided
            return { ...existingConfig, customToolbarPriority };
        }
        // Use new attributes or defaults (for both existing with new attrs and new button groups)
        return {
            name: selectedButtonGroup.name,
            buttons: selectedButtonGroup.buttons ?? defaultConfig.buttons,
            visible: selectedButtonGroup.visible,
            priority: selectedButtonGroup.priority,
            customToolbarPriority,
            row: selectedButtonGroup.row,
            id: selectedButtonGroup.id
        };
    });
}
/**
 * Processes rich text editor button groups building block.
 *
 * @param {BuildingBlock} buildingBlockData - The building block data
 * @param {ProcessingContext} context - Processing context
 */
function processRichTextEditorButtonGroups(buildingBlockData, context) {
    const { xmlDocument, updatedAggregationPath, hasAggregation } = context;
    if (!isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.RichTextEditorButtonGroups) &&
        !isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.RichTextEditor)) {
        throw new Error('Expected RichTextEditorButtonGroups or RichTextEditor building block data');
    }
    const existingButtonGroupsMap = new Map();
    if (hasAggregation && xmlDocument && updatedAggregationPath) {
        const xpathSelect = xpath.useNamespaces(xmlDocument.firstChild._nsMap);
        // Example: [<Element: richtexteditor:buttonGroups>] containing all ButtonGroup children
        const buttonGroupsElements = xpathSelect(updatedAggregationPath, xmlDocument);
        if (buttonGroupsElements.length > 0) {
            const buttonGroupsWrapper = buttonGroupsElements[0];
            const config = getBuildingBlockConfig(types_1.BuildingBlockType.RichTextEditorButtonGroups);
            // Read all existing <ButtonGroup> child elements and store their attributes
            const existingButtonGroupElements = Array.from(buttonGroupsWrapper.childNodes).filter((node) => node.nodeType === 1 && node.localName === config.aggregationConfig.elementName);
            // Build map of existing button groups with their custom attributes
            existingButtonGroupElements.forEach((element) => {
                const config = extractButtonGroupConfig(element);
                if (config) {
                    existingButtonGroupsMap.set(config.name, config);
                }
            });
            // Remove existing <buttonGroups> wrapper - will be recreated with merged data
            const buttonGroupsElement = buttonGroupsElements[0];
            // @xmldom/xmldom doesn't support Element.remove(), must use removeChild()
            buttonGroupsElement.parentNode?.removeChild(buttonGroupsElement); // NOSONAR
        }
    }
    buildingBlockData.buttonGroups = mergeButtonGroups(existingButtonGroupsMap, buildingBlockData);
}
/**
 * Updates aggregation path based on XML document structure.
 *
 * @param {Document} xmlDocument - The XML document to analyze
 * @param {string} aggregationPath - The current aggregation path
 * @param {{ aggregationName: string; elementName: string }} config - Configuration specifying aggregation and element names
 * @param config.aggregationName - Aggregation name to check in the XML
 * @param config.elementName - Element name to check in the XML
 * @param namespace - Optional namespace configuration
 * @returns {object} Object containing the updated aggregation path
 */
function updateAggregationPath(xmlDocument, aggregationPath, config, namespace) {
    const xpathSelect = xpath.useNamespaces(xmlDocument.firstChild._nsMap);
    // First, get the target element from the aggregationPath
    const targetElement = xpathSelect(aggregationPath, xmlDocument);
    if (!targetElement || !Array.isArray(targetElement) || targetElement.length === 0) {
        return { updatedAggregationPath: aggregationPath, hasElement: false };
    }
    const targetNode = targetElement[0];
    // Check if the explicit aggregation exists within the specific target element
    const hasAggregation = xpathSelect(`./*[local-name()='${config.aggregationName}']`, targetNode);
    if (hasAggregation && Array.isArray(hasAggregation) && hasAggregation.length > 0) {
        return {
            updatedAggregationPath: aggregationPath + `/${(0, xml_1.getOrAddNamespace)(xmlDocument, namespace?.uri)}:${config.aggregationName}`,
            hasElement: true
        };
    }
    else {
        // Check if the default aggregation element exists within the specific target element
        const useDefaultAggregation = xpathSelect(`./*[local-name()='${config.elementName}']`, targetNode);
        if (useDefaultAggregation && Array.isArray(useDefaultAggregation) && useDefaultAggregation.length > 0) {
            return { updatedAggregationPath: aggregationPath, hasElement: true };
        }
    }
    return { updatedAggregationPath: aggregationPath, hasElement: false };
}
/**
 * Processes custom action building blocks.
 *
 * @param buildingBlockData - The building block data
 * @param context - Processing context
 */
function processAction(buildingBlockData, context) {
    const { fs } = context;
    if (!isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.Action)) {
        throw new Error('Expected Action building block data');
    }
    const actionConfig = buildingBlockData.embeddedAction;
    if (typeof actionConfig.eventHandler === 'object') {
        const processedEventHandler = (0, event_handler_1.applyEventHandlerConfiguration)(fs, actionConfig, actionConfig.eventHandler, {
            typescript: actionConfig.typescript
        });
        const fnName = actionConfig.eventHandler ? actionConfig.eventHandler.fnName : processedEventHandler;
        // Check if file name includes .controller
        if (actionConfig.eventHandler.fileName?.includes('.controller')) {
            // Controller method: use fnName as is, no core:require needed
            actionConfig.eventHandler = {
                fnName: `.${fnName}`
            };
        }
        else {
            // Custom handler file: use handler alias with core:require
            let handlerPath;
            if (actionConfig.eventHandler.fileName) {
                const path = context.embeddedAction?.ns?.split('.').join('/');
                handlerPath = node_path_1.posix.join(path ?? '', actionConfig.eventHandler.fileName);
            }
            actionConfig.eventHandler = {
                fnName: `handler.${fnName}`,
                fileName: handlerPath
            };
        }
    }
}
/**
 * Processes building block configuration.
 *
 * @param {BuildingBlock} buildingBlockData - The building block data
 * @param {Document} xmlDocument - The XML document
 * @param {string} manifestPath - The manifest file path
 * @param {Manifest} manifest - The manifest object
 * @param {string} aggregationPath - The aggregation path
 * @param {Editor} fs - The memfs editor instance
 * @returns {object} Object containing updated aggregation path and processed building block data
 */
function processBuildingBlock(buildingBlockData, xmlDocument, manifestPath, manifest, aggregationPath, fs) {
    let updatedAggregationPath = aggregationPath;
    let hasAggregation = false;
    let aggregationNamespace = 'macrosTable';
    let embeddedFragment;
    let viewPath;
    // Get configuration for the building block type
    const config = exports.BUILDING_BLOCK_CONFIG[buildingBlockData.buildingBlockType];
    if (!config) {
        // Return defaults if no configuration is found
        return {
            updatedAggregationPath,
            processedBuildingBlockData: buildingBlockData,
            hasAggregation,
            aggregationNamespace
        };
    }
    if (isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.RichTextEditorButtonGroups) ||
        isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.RichTextEditor)) {
        const result = updateAggregationPath(xmlDocument, aggregationPath, {
            aggregationName: config.aggregationConfig.aggregationName,
            elementName: config.aggregationConfig.elementName
        }, {
            uri: config.namespace.uri,
            prefix: config.namespace.prefix
        });
        const context = {
            fs,
            xmlDocument,
            updatedAggregationPath: result.updatedAggregationPath,
            hasAggregation: result.hasElement
        };
        config.processor(buildingBlockData, context);
        aggregationNamespace = (0, xml_1.getOrAddNamespace)(xmlDocument, config.namespace.uri, config.namespace.prefix);
    }
    // Process embedded fragment for types that support it
    if ((isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.CustomColumn) ||
        isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.CustomFilterField)) &&
        buildingBlockData.embededFragment) {
        embeddedFragment = (0, defaults_1.setCommonDefaults)(buildingBlockData.embededFragment, manifestPath, manifest);
        viewPath = (0, node_path_1.join)(embeddedFragment.path, `${embeddedFragment.fragmentFile ?? embeddedFragment.name}.fragment.xml`);
        // Use the processor function from the configuration
        const context = {
            fs,
            viewPath,
            embeddedFragment
        };
        config.processor(buildingBlockData, context);
        const result = updateAggregationPath(xmlDocument, aggregationPath, {
            aggregationName: config.aggregationConfig.aggregationName,
            elementName: config.aggregationConfig.elementName
        });
        updatedAggregationPath = result.updatedAggregationPath;
        hasAggregation = result.hasElement;
        aggregationNamespace = (0, xml_1.getOrAddNamespace)(xmlDocument, config.namespace.uri, config.namespace.prefix);
    }
    if (isBuildingBlockType(buildingBlockData, types_1.BuildingBlockType.Action) && buildingBlockData.embeddedAction) {
        const result = updateAggregationPath(xmlDocument, aggregationPath, {
            aggregationName: config.aggregationConfig.aggregationName,
            elementName: config.aggregationConfig.elementName
        });
        const context = {
            fs,
            xmlDocument,
            updatedAggregationPath: result.updatedAggregationPath,
            hasAggregation: result.hasElement,
            embeddedAction: (0, defaults_1.setCommonDefaults)(buildingBlockData.embeddedAction, manifestPath, manifest)
        };
        config.processor(buildingBlockData, context);
        updatedAggregationPath = result.updatedAggregationPath;
        hasAggregation = result.hasElement;
        (0, xml_1.getOrAddNamespace)(xmlDocument, config.namespace.uri, config.namespace.prefix);
    }
    return {
        updatedAggregationPath,
        processedBuildingBlockData: buildingBlockData,
        hasAggregation,
        aggregationNamespace
    };
}
//# sourceMappingURL=processor.js.map