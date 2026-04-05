"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttribute = getAttribute;
exports.getNodeByName = getNodeByName;
exports.addDisplayInfoForBuildingBlock = addDisplayInfoForBuildingBlock;
exports.getViewNodeDescriptionAndIcon = getViewNodeDescriptionAndIcon;
const customBuildingBlockElements = ['Column', 'Action', 'FilterField', 'ButtonGroup'];
/**
 * Method to get value of xml attribute by attribute name.
 *
 * @param {XMLElement} node XML node
 * @param {string} name Attribute name
 * @returns {string | undefined} Value of xml attribute
 */
function getAttribute(node, name) {
    return node.attributes.find((attribute) => attribute.key === name)?.value;
}
/**
 * Method to get node by node name.
 *
 * @param {XMLElement} node XML node with children
 * @param {string} name Name of children node to search
 * @returns {XMLElement | undefined} Found children XML node
 */
function getNodeByName(node, name) {
    return node.subElements?.find((child) => child.name === name);
}
const NODE_DISPLAY_PRIORITY_ATTRIBUTES = {
    ButtonGroup: ['name'],
    Column: ['header']
};
/**
 * Returns the first matching attribute value from descriptionProperties, or undefined.
 *
 * @param {XMLElement} node - The XML element to search for display attributes.
 * @returns {{ key: string; value: string } | undefined} The matching attribute object, or undefined if none found.
 */
function getDisplayAttribute(node) {
    let descriptionProperties = ['id', 'header', 'key', 'title', 'text', 'label', 'name'];
    const nodeName = node.name;
    if (nodeName in NODE_DISPLAY_PRIORITY_ATTRIBUTES) {
        const priorities = NODE_DISPLAY_PRIORITY_ATTRIBUTES[nodeName];
        descriptionProperties = [...new Set([...priorities, ...descriptionProperties])];
    }
    const attributes = node.attributes || [];
    for (const prop of descriptionProperties) {
        const attr = attributes.find((attribute) => attribute.key === prop);
        if (attr) {
            return attr;
        }
    }
    return undefined;
}
/**
 * Extracts display info for UI rendering.
 * Returns "(#value)" for 'id' attributes, "(value)" for others, or undefined if not found.
 *
 * @param node XML element to search.
 * @returns Formatted display string or undefined.
 * @example
 * // { key: 'id', value: 'My_ID_Table' } => "(#My_ID_Table)"
 * // { key: 'title', value: 'Sales in Europe' } => "(Sales in Europe)"
 */
function extractDisplayInfo(node) {
    const attributeFound = getDisplayAttribute(node);
    if (attributeFound) {
        return attributeFound.key === 'id' ? `(#${attributeFound.value})` : `(${attributeFound.value})`;
    }
    return undefined;
}
/**
 * Adds displayInfo to metadata if the node is a higher-level building block.
 * Skips custom XML elements like Column, Action, FilterField.
 *
 * @param {XMLElement} node Parsed XML element.
 * @param {string} name Node name.
 * @param {MacrosSchemaMetadata} metadata Metadata object to update.
 */
function addDisplayInfoForBuildingBlock(node, name, metadata) {
    if (!customBuildingBlockElements.includes(name)) {
        const value = extractDisplayInfo(node);
        metadata.macroDisplayInfo = { name, value };
    }
}
/**
 * Returns a description and optional icon for a view node.
 * - For higher-level building blocks, description is "<name> #value" for 'id', or "<name> value" for others.
 * - For custom building blocks, uses the attribute value directly, or the node name if not found.
 *
 * @param {XMLElement} node Parsed XML element.
 * @param {string} name Node name.
 * @returns {{ description: string; icon?: string }} Object containing the description and optional icon.
 */
function getViewNodeDescriptionAndIcon(node, name) {
    const controlIconMap = {
        Table: 'Table',
        FilterBar: 'Filter',
        Chart: 'Chart',
        Page: 'Page'
    };
    let description;
    if (!customBuildingBlockElements.includes(name)) {
        const attr = getDisplayAttribute(node);
        if (attr) {
            const prefix = attr.key === 'id' ? '#' : '';
            description = `${name} ${prefix}${attr.value}`;
        }
        else {
            description = name;
        }
    }
    else {
        const attr = getDisplayAttribute(node);
        description = attr ? attr.value : name;
    }
    const icon = controlIconMap[name];
    return icon ? { description, icon } : { description };
}
//# sourceMappingURL=utils.js.map